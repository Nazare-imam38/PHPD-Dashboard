from __future__ import annotations

from collections import defaultdict
from decimal import Decimal, InvalidOperation

from django.core.cache import cache
from django.db.models import Prefetch
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Circle, Project, ProjectActivity, Tehsil, Zone
from api.serializers import ProjectDashboardSerializer


CACHE_TIMEOUT_SECONDS = 60  # tune as needed; invalidated on project/activity changes (see bottom note)


def _number(value) -> float:
    if value in (None, ""):
        return 0.0
    try:
        return max(0.0, float(Decimal(str(value).replace(",", "").strip())))
    except (InvalidOperation, TypeError, ValueError):
        return 0.0


def _percent(value) -> float:
    value = _number(value)
    if 0 < value <= 1:
        value *= 100
    return round(max(0.0, min(100.0, value)), 2)


def _activity_weight(activity: ProjectActivity) -> float:
    return max(_number(activity.duration), 1.0)


def _calculate_project_physical_progress(activities: list[ProjectActivity]) -> float:
    """Return one canonical physical-progress value for a project."""
    if not activities:
        return 0.0

    by_parent: dict[int | None, list[ProjectActivity]] = defaultdict(list)
    for activity in activities:
        by_parent[activity.parent_id].append(activity)

    cache_local: dict[int, tuple[float, float]] = {}

    def node_value(activity: ProjectActivity) -> tuple[float, float]:
        if activity.id in cache_local:
            return cache_local[activity.id]

        children = by_parent.get(activity.id, [])
        if children:
            weighted_total = 0.0
            total_weight = 0.0
            for child in children:
                child_progress, child_weight = node_value(child)
                weighted_total += child_progress * child_weight
                total_weight += child_weight
            progress = weighted_total / total_weight if total_weight else _percent(activity.progress)
            weight = max(total_weight, _activity_weight(activity))
        else:
            progress = _percent(activity.progress)
            weight = _activity_weight(activity)

        cache_local[activity.id] = (progress, weight)
        return cache_local[activity.id]

    roots = by_parent.get(None, []) or activities
    weighted_total = 0.0
    total_weight = 0.0
    for root in roots:
        progress, weight = node_value(root)
        weighted_total += progress * weight
        total_weight += weight

    return round(weighted_total / total_weight, 2) if total_weight else 0.0


def _project_metrics(project: Project) -> dict:
    activities = list(project.activities.all())
    physical = _calculate_project_physical_progress(activities)

    total_budget = _number(project.total_budget)
    total_consume = _number(project.total_consume)
    financial = round(min(100.0, (total_consume / total_budget) * 100), 2) if total_budget else 0.0

    has_delay = any(bool(activity.delay_logs.all()) for activity in activities)
    if has_delay:
        status = "in_delay"
    elif physical >= 100:
        status = "completed"
    elif physical > 0:
        status = "in_progress"
    else:
        status = "pending"

    circle = None
    if project.tehsil_id and project.tehsil and project.tehsil.circle_id:
        circle = project.tehsil.circle
    elif project.district_id and project.district and project.district.circle_id:
        circle = project.district.circle

    return {
        "id": project.id,
        "project_name": project.project_name or f"Project #{project.id}",
        "project_reference_no": project.project_reference_no,
        "project_category": project.project_category,
        "zone": project.zone_id,
        "zone_name": project.zone.zone_name if project.zone_id else None,
        "circle": circle.id if circle else None,
        "circle_name": circle.circle_name if circle else None,
        "district": project.district_id,
        "district_name": project.district.district_name if project.district_id else None,
        "tehsil": project.tehsil_id,
        "tehsil_name": project.tehsil.tehsil_name if project.tehsil_id else None,
        "latitude": project.latitude,
        "longitude": project.longitude,
        "total_budget": round(total_budget, 2),
        "total_consume": round(total_consume, 2),
        "remaining_budget": round(max(total_budget - total_consume, 0.0), 2),
        "physical_progress": physical,
        "financial_progress": financial,
        # Retained for ranking only. UI completion cards/charts use physical_progress.
        "overall_progress": round((physical + financial) / 2, 2),
        "status": status,
        "has_delay": has_delay,
    }


def _project_scope_summary(project_rows: list[dict]) -> dict:
    """Project-scope aggregation used for a selected Zone/Circle/Tehsil."""
    count = len(project_rows)
    physical = round(sum(row["physical_progress"] for row in project_rows) / count, 2) if count else 0.0
    total_budget = sum(row["total_budget"] for row in project_rows)
    total_consume = sum(row["total_consume"] for row in project_rows)
    financial = round(min(100.0, (total_consume / total_budget) * 100), 2) if total_budget else 0.0
    return _summary_payload(project_rows, physical, financial, total_budget, total_consume)


def _summary_payload(project_rows, physical, financial, total_budget, total_consume):
    return {
        "total_projects": len(project_rows),
        "physical_progress": round(physical, 2),
        "financial_progress": round(financial, 2),
        "overall_progress": round((physical + financial) / 2, 2),
        "completed_projects": sum(row["status"] == "completed" for row in project_rows),
        "in_progress_projects": sum(row["status"] == "in_progress" for row in project_rows),
        "delayed_projects": sum(row["status"] == "in_delay" for row in project_rows),
        "pending_projects": sum(row["status"] == "pending" for row in project_rows),
        "total_budget": round(total_budget, 2),
        "total_consume": round(total_consume, 2),
        "remaining_budget": round(max(total_budget - total_consume, 0.0), 2),
    }


def _all_hierarchy_rows(page: str, project_rows: list[dict]) -> list[dict]:
    if page == "zones":
        objects = Zone.objects.all().order_by("zone_name")
        key, name_attr = "zone", "zone_name"
    elif page == "circles":
        objects = Circle.objects.select_related("zone").all().order_by("circle_name")
        key, name_attr = "circle", "circle_name"
    elif page == "tehsils":
        objects = Tehsil.objects.select_related("zone", "circle", "district").all().order_by("tehsil_name")
        key, name_attr = "tehsil", "tehsil_name"
    else:
        return [
            {
                "id": row["id"],
                "name": row["project_name"],
                "project_count": 1,
                "physical_progress": row["physical_progress"],
                "financial_progress": row["financial_progress"],
                "overall_progress": row["overall_progress"],
            }
            for row in project_rows
        ]

    # Group once (O(n)) instead of filtering project_rows per object (O(n*m)).
    grouped: dict[int, list[dict]] = defaultdict(list)
    for row in project_rows:
        val = row.get(key)
        if val is not None:
            grouped[val].append(row)

    rows = []
    for obj in objects:
        scoped = grouped.get(obj.id, [])
        summary = _project_scope_summary(scoped)
        rows.append({
            "id": obj.id,
            "name": getattr(obj, name_attr),
            "project_count": summary["total_projects"],
            "physical_progress": summary["physical_progress"],
            "financial_progress": summary["financial_progress"],
            "overall_progress": summary["overall_progress"],
        })
    return rows


def _page_summary(page: str, hierarchy_rows: list[dict], project_rows: list[dict]) -> dict:
    """Make each root tab reflect the entities shown on that tab.

    All Zones = average of zone metrics, All Circles = average of circle metrics,
    All Tehsils = average of tehsil metrics, All Projects = average of projects.
    The cards and both donuts consume these exact same values.
    """
    active = [row for row in hierarchy_rows if row.get("project_count", 0) > 0]
    if not active:
        return _project_scope_summary([])

    physical = sum(row["physical_progress"] for row in active) / len(active)
    financial = sum(row["financial_progress"] for row in active) / len(active)
    total_budget = sum(row["total_budget"] for row in project_rows)
    total_consume = sum(row["total_consume"] for row in project_rows)
    return _summary_payload(project_rows, physical, financial, total_budget, total_consume)


def _top_projects(project_rows: list[dict], limit: int = 6) -> list[dict]:
    unique = {row["id"]: row for row in project_rows}
    return sorted(
        unique.values(),
        key=lambda row: (-row["overall_progress"], -row["physical_progress"], row["project_name"].lower()),
    )[:limit]


def _top_hierarchy(rows: list[dict], limit: int = 5) -> list[dict]:
    # Completion chart is physical progress, exactly matching hierarchy cards.
    return sorted(
        rows,
        key=lambda row: (-row["physical_progress"], row["name"].lower()),
    )[:limit]


def _legacy_hierarchy_payloads(page: str, project_rows: list[dict]):
    """Build divisions/districts/tehsils payloads.

    Only computes the hierarchy levels the requested page actually needs —
    each level is an O(objects + projects) grouped pass (see _all_hierarchy_rows),
    but there's no reason to pay for circle/tehsil aggregation on a page that
    doesn't use it (e.g. the "zones" page only needs zone-level rollups).
    """
    zone_metrics = {r["id"]: r for r in _all_hierarchy_rows("zones", project_rows)}
    circle_metrics = (
        {r["id"]: r for r in _all_hierarchy_rows("circles", project_rows)}
        if page in ("circles", "tehsils", "projects") else {}
    )
    tehsil_metrics = (
        {r["id"]: r for r in _all_hierarchy_rows("tehsils", project_rows)}
        if page in ("tehsils", "projects") else {}
    )

    divisions = []
    for zone in Zone.objects.all().order_by("zone_name"):
        metric = zone_metrics.get(zone.id, {})
        divisions.append({
            "id": zone.id,
            "division_name": zone.zone_name,
            "zone_name": zone.zone_name,
            "zone": zone.id,
            **metric,
        })

    districts = []
    if circle_metrics or page in ("circles", "tehsils", "projects"):
        for circle in Circle.objects.select_related("zone").all().order_by("circle_name"):
            metric = circle_metrics.get(circle.id, {})
            districts.append({
                "id": circle.id,
                "district_name": circle.circle_name,
                "circle_name": circle.circle_name,
                "division": circle.zone_id,
                "circle": circle.id,
                "zone": circle.zone_id,
                "zone_name": circle.zone.zone_name,
                **metric,
            })

    tehsils = []
    if tehsil_metrics or page in ("tehsils", "projects"):
        for tehsil in Tehsil.objects.select_related("zone", "circle", "district").all().order_by("tehsil_name"):
            metric = tehsil_metrics.get(tehsil.id, {})
            tehsils.append({
                "id": tehsil.id,
                "tehsil_name": tehsil.tehsil_name,
                "district": tehsil.circle_id,  # backward-compatible dashboard alias
                "district_name": tehsil.circle.circle_name if tehsil.circle_id else None,
                "actual_district": tehsil.district_id,
                "actual_district_name": tehsil.district.district_name if tehsil.district_id else None,
                "circle": tehsil.circle_id,
                "circle_name": tehsil.circle.circle_name if tehsil.circle_id else None,
                "division": tehsil.zone_id,
                "zone": tehsil.zone_id,
                "zone_name": tehsil.zone.zone_name if tehsil.zone_id else None,
                **metric,
            })

    return divisions, districts, tehsils


class DashboardPageDataView(APIView):
    permission_classes = [IsAuthenticated]
    VALID_PAGES = {"zones", "circles", "tehsils", "projects"}

    def get(self, request, page):
        if page not in self.VALID_PAGES:
            return Response({"detail": "Invalid dashboard page."}, status=404)

        cache_key = f"dashboard_page_data_{page}"
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)

        activity_queryset = (
            ProjectActivity.objects
            .prefetch_related("delay_logs")
            .order_by("id")
        )
        projects = list(
            Project.objects
            .select_related("zone", "district", "district__circle", "tehsil", "tehsil__circle")
            .prefetch_related("stakeholder", Prefetch("activities", queryset=activity_queryset))
            .order_by("id")
        )

        project_rows = [_project_metrics(project) for project in projects]
        hierarchy_rows = _all_hierarchy_rows(page, project_rows)
        summary = _page_summary(page, hierarchy_rows, project_rows)
        best_projects = _top_projects(project_rows, 6)
        top_hierarchy = _top_hierarchy(hierarchy_rows, 5)
        divisions, districts, tehsils = _legacy_hierarchy_payloads(page, project_rows)

        serialized_projects = ProjectDashboardSerializer(projects, many=True, context={"request": request}).data
        metrics_by_id = {row["id"]: row for row in project_rows}
        projects_payload = []
        for project_data in serialized_projects:
            row = dict(project_data)
            metrics = metrics_by_id.get(row["id"], {})
            row.update({
                "physical_progress": metrics.get("physical_progress", 0),
                "financial_progress": metrics.get("financial_progress", 0),
                "overall_progress": metrics.get("overall_progress", 0),
                "status": metrics.get("status", "pending"),
                "has_delay": metrics.get("has_delay", False),
            })
            projects_payload.append(row)

        response_data = {
            "page": page,
            "summary": summary,
            "financial_chart": {
                "planned": 100.0,
                "actual": summary["financial_progress"],
                "variance": round(max(0.0, 100.0 - summary["financial_progress"]), 2),
            },
            "physical_chart": {
                "planned": 100.0,
                "actual": summary["physical_progress"],
                "variance": round(max(0.0, 100.0 - summary["physical_progress"]), 2),
            },
            "best_performing_projects": best_projects,
            "top_hierarchy": top_hierarchy,
            "map_projects": project_rows,
            "divisions": divisions,
            "districts": districts,
            "tehsils": tehsils,
            "projects": projects_payload,
            "project_gantt_all": [],
        }

        cache.set(cache_key, response_data, timeout=CACHE_TIMEOUT_SECONDS)
        return Response(response_data)