from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import *
from django.contrib.gis.geos import GEOSGeometry, Polygon, MultiPolygon
import json
from django.contrib.auth import get_user_model
from .utils import parse_xer
from datetime import datetime
# --------------------------------------------------------
# MyUser Serializer
# --------------------------------------------------------
class MyUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = MyUser
        fields = [
            "id",
            "email",    
            "full_name",     
            "first_name",
            "last_name",
            "full_name",
            # "company_name",
            "role",             # Added role
            "stakeholder",      # Assign stakeholder if needed
            "is_active",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def create(self, validated_data):
        
        password = validated_data.pop("password", None)
        user = MyUser(**validated_data)

        # Set password properly
        if password:
            user.set_password(password)

        # Super admin automatically sets is_staff=True for admin or themselves
        if validated_data.get("role") in ["admin", "super_admin"]:
            user.is_staff = True

        user.save()
        return user


class MyUserLoginDashboardSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    class Meta:
        model = MyUser
        fields = [
            "id",
            "email",
            "password",
            "full_name",
            "stakeholder_type",
            "stakeholder_id", 
            "is_active",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }
    def get_stakeholder_type(self, obj):
        # If user has a stakeholder, return its type, else default to 'Client'
        return obj.stakeholder.stakeholder_type if obj.stakeholder else "Client"

    def get_stakeholder_id(self, obj):
        # If user has a stakeholder, return its id, else None
        return obj.stakeholder.id if obj.stakeholder else None

User = get_user_model()

class UserPermissionSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    user_full_name = serializers.ReadOnlyField(source='user.get_full_name')
    created_by_email = serializers.ReadOnlyField(source='created_by.email')
    updated_by_email = serializers.ReadOnlyField(source='updated_by.email')

    class Meta:
        model = UserPermission
        fields = [
            'id',
            'user',
            'user_email',
            'user_full_name',
            'sidebar_label',
            'sub_label',
            'can_view',
            'can_create',
            'can_update',
            'can_delete',
            'created_by',
            'created_by_email',
            'updated_by',
            'updated_by_email',
        ]
        extra_kwargs = {
            'sub_label': {'required': False, 'allow_null': True, 'allow_blank': True},
        }

class UserWithPermissionsSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    permissions = UserPermissionSerializer(source="userpermission_set", many=True, read_only=True)

    class Meta:
        model = MyUser
        fields = [
            "id",
            "email",
            "full_name",
            "role",
            "is_active",
            "permissions",
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
# --------------------------------------------------------
# Zone Administrative Divisions
# --------------------------------------------------------
class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ["id", "zone_name"]

# --------------------------------------------------------
# Circle Administrative Circles
# --------------------------------------------------------
class CircleSerializer(serializers.ModelSerializer):
    zone_name = serializers.SerializerMethodField()
    class Meta:
        model = Circle
        fields = ["id", "circle_name", "zone", "zone_name"]

    def get_zone_name(self, obj):
        return obj.zone.zone_name

# --------------------------------------------------------
# District Administrative Divisions
# --------------------------------------------------------
class DistrictSerializer(serializers.ModelSerializer):
    zone_name = serializers.SerializerMethodField()
    circle_name = serializers.SerializerMethodField()
    class Meta:
        model = District
        fields = ["id", "district_name", "zone", "zone_name", "circle", "circle_name"]

    def get_zone_name(self, obj):
        return obj.zone.zone_name

    def get_circle_name(self, obj):
        return obj.circle.circle_name

# --------------------------------------------------------
# Tehsil Administrative Divisions
# --------------------------------------------------------
class TehsilSerializer(serializers.ModelSerializer):
    zone_name = serializers.SerializerMethodField()
    circle_name = serializers.SerializerMethodField()
    district_name = serializers.SerializerMethodField()
    class Meta:
        model = Tehsil
        fields = ["id", "tehsil_name", "district", "zone", "circle", "zone_name", "circle_name", "district_name"]
    
    def get_zone_name(self, obj):
        return obj.zone.zone_name

    def get_circle_name(self, obj):
        return obj.circle.circle_name

    def get_district_name(self, obj):
        return obj.district.district_name

# --------------------------------------------------------
# Stakeholder
# --------------------------------------------------------
class StakeholderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stakeholder
        fields = ['id', 'stakeholder_type', 'stakeholder_title', 'status']

class ProjectActivitySerializer(serializers.ModelSerializer):
    project_name = serializers.SerializerMethodField()
    duration_display = serializers.SerializerMethodField()
    class Meta:
        model = ProjectActivity
        fields = ["id", "project", "project_name", "activity_id", "activity_name", "start_date", "end_date", "progress", "actual_start", "actual_end", "progress_date", "progress_status", "duration", "duration_display"]
    
    def get_project_name(self, obj):
        return obj.project.project_name
    
    # def get_duration_display(self, obj):
    #     # Use total_duration property to include child durations if needed
    #     duration = getattr(obj, "total_duration", obj.duration) or 0
    #     return f"{int(duration)} day" if duration == 1 else f"{int(duration)} days"
    def get_duration_display(self, obj):
        duration = obj.duration or 0
        return f"{int(duration)} day" if duration == 1 else f"{int(duration)} days"

class ProgressImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressImage
        fields = "__all__"

class ProjectDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectDocument
        fields = [
            "id",
            "project",
            "activity",
            "title",
            "file",
            "file_url",
            "uploaded_at",
        ]

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
# --------------------------------------------------------
# Project
# --------------------------------------------------------

class ProjectSerializer(serializers.ModelSerializer):
    zone_name = serializers.SerializerMethodField()
    circle = serializers.SerializerMethodField()
    circle_name = serializers.SerializerMethodField()
    district_name = serializers.SerializerMethodField()
    tehsil_name = serializers.SerializerMethodField()
    stakeholder_details = serializers.SerializerMethodField()
    stakeholder = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Stakeholder.objects.all(),
        required=False
    )
    activities = ProjectActivitySerializer(many=True, read_only=True)
    project_starting_date = serializers.DateField(
        input_formats=["%Y-%m-%d", "%Y-%m-%d %H:%M"]
    )
    xer_file = serializers.FileField(write_only=True, required=False)
    xer_file_name = serializers.CharField(read_only=True)  


    class Meta:
        model = Project
        fields = [
            'id', 'stakeholder', 'stakeholder_details',
            'project_name', 'project_description',
            'project_starting_date', 'project_reference_no', 'project_category', 'project_category_other',
            'zone', 'zone_name', 'circle', 'circle_name',
            'district', 'district_name',
            'tehsil', 'tehsil_name', 'latitude', 'longitude',
            'total_budget', 'total_consume', 'remaining_budget',
            'xer_file', "xer_file_name",
            'created_at', 'updated_at', 
            "activities"
        ]

    # ---------- Readable Names ----------
    def get_zone_name(self, obj):
        return obj.zone.zone_name if obj.zone else None

    def get_circle(self, obj):
        # Infer circle from tehsil or district
        if obj.tehsil and obj.tehsil.circle:
            return obj.tehsil.circle.id
        if obj.district and obj.district.circle:
            return obj.district.circle.id
        return None

    def get_circle_name(self, obj):
        # Infer circle name from tehsil or district
        if obj.tehsil and obj.tehsil.circle:
            return obj.tehsil.circle.circle_name
        if obj.district and obj.district.circle:
            return obj.district.circle.circle_name
        return None
    
    def get_district_name(self, obj):
        return obj.district.district_name if obj.district else None

    def get_tehsil_name(self, obj):
        return obj.tehsil.tehsil_name if obj.tehsil else None

    # ---------- Stakeholder Details ----------
    def get_stakeholder_details(self, obj):
        return [
            {
                "stakeholder_type": s.stakeholder_type,
                "stakeholder_title": s.stakeholder_title
            }
            for s in obj.stakeholder.all()
        ]

    # ---------- Create ----------
    def create(self, validated_data):
        stakeholders = validated_data.pop('stakeholder', [])
        xer_file = validated_data.pop('xer_file', None)

        project = Project.objects.create(**validated_data)
        project.stakeholder.set(stakeholders)

        if xer_file:
            # Parse the uploaded XER in-memory and create activities without
            # persisting the file to local storage.
            project.xer_file_name = xer_file.name
            try:
                self._save_activities(project, xer_file)
            except Exception:
                pass

        project.save()

        return project

    # ---------- Update ----------
    def update(self, instance, validated_data):
        stakeholders = validated_data.pop('stakeholder', None)
        xer_file = validated_data.pop('xer_file', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if stakeholders is not None:
            instance.stakeholder.set(stakeholders)

        if xer_file:
            instance.xer_file_name = xer_file.name
            # Rebuild activities from the uploaded XER without saving the file.
            instance.activities.all().delete()
            try:
                self._save_activities(instance, xer_file)
            except Exception:
                pass

        instance.save()
        return instance

    # ------------------------
    # Generate file path without saving
    # ------------------------
    def _generate_xer_path(self, project, filename):
        from django.utils.text import slugify
        from datetime import datetime
        import uuid
        import os

        ext = filename.split('.')[-1].lower()
        filename = f"{uuid.uuid4()}.{ext}"

        project_name = f"{project.id}-{slugify(project.project_name)}" if project.project_name else "no-project"
        date_folder = datetime.now().strftime("%Y-%m-%d")
        subfolder = "xer"

        path = os.path.join("projects", project_name, date_folder, subfolder, filename)
        return path.replace("\\", "/")  # Ensure forward slashes for frontend

    # ---------- Private: Parse XER and save tasks ----------
    def _save_activities(self, project, xer_file):
        def _parse_xer_date(value):
            if not value:
                return None
            if isinstance(value, datetime):
                return value.date()
            if isinstance(value, str):
                date_string = value.strip().split(" ")[0]
                try:
                    return datetime.strptime(date_string, "%Y-%m-%d").date()
                except ValueError:
                    return None
            return None

        xer_file.seek(0)
        data = parse_xer(xer_file)

        wbs = data["wbs"]
        tasks = data["tasks"]
        dependencies = data["dependencies"]

        wbs_objects = {}
        task_map = {}

        # 1. WBS
        for wbs_id, w in wbs.items():
            parent = wbs_objects.get(w["parent"])
            obj = ProjectActivity.objects.create(
                project=project,
                activity_id=wbs_id,
                activity_name=w["name"],
                parent=parent,
                task_type="wbs"
            )
            wbs_objects[wbs_id] = obj

        # 2. TASKS
        for task in tasks:
            parent = wbs_objects.get(task["wbs_id"])
            start = _parse_xer_date(task.get("start_date"))
            end = _parse_xer_date(task.get("end_date"))
            task_type = "milestone" if start and end and start == end else "task"

            obj = ProjectActivity.objects.create(
                project=project,
                activity_id=task.get("activity_id"),
                activity_name=task.get("activity_name"),
                parent=parent,
                start_date=start,
                end_date=end,
                progress=task.get("progress") or 0,
                duration=task.get("duration") or 0,
                task_type=task_type
            )
            task_map[task.get("activity_id")] = obj

        # 3. DEPENDENCIES
        for dep in dependencies:
            task_obj = task_map.get(dep.get("task_id"))
            pred_obj = task_map.get(dep.get("pred_task_id"))
            if task_obj and pred_obj:
                TaskDependency.objects.create(
                    project=project,
                    task=task_obj,
                    predecessor=pred_obj,
                    type=dep.get("type")
                )

class TopProjectSerializer(serializers.ModelSerializer):
    zone_name = serializers.CharField(source='zone.zone_name', read_only=True)
    progress = serializers.FloatField(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "project_name",
            "zone_name",
            "progress"
        ]

class ProjectUpdateLogSerializer(serializers.ModelSerializer):
    project_name = serializers.ReadOnlyField(source='project.project_name')
    updated_by_email = serializers.ReadOnlyField(source='updated_by.email')

    class Meta:
        model = ProjectUpdateLog
        fields = [
            'id',
            'project',
            'project_name',
            'updated_by',
            'updated_by_email',
            'changes',
            'created_at',
        ]
        
class TaskSerializer(serializers.ModelSerializer):
    parent_id = serializers.PrimaryKeyRelatedField(
        source='parent',
        read_only=True
    )

    class Meta:
        model = ProjectActivity
        fields = [
            "id", "activity_id", "activity_name", "parent_id",
            # planned
            "start_date",
            "end_date",

            # actual
            "actual_start",
            "actual_end",

            "progress",
            "duration",
            "task_type"
        ]

class ActivityDelayLogSerializer(serializers.ModelSerializer):
    action_by_info = serializers.SerializerMethodField()

    class Meta:
        model = ActivityDelayLog
        fields = "__all__"
        read_only_fields = ["originator", "created_by"]

    def get_action_by_info(self, obj):
        if obj.action_by:
            return {
                "stakeholder_type": obj.action_by.stakeholder_type,
                "stakeholder_title": obj.action_by.stakeholder_title
            }
        return None
# --------------------------------------------------------
# Pictorial Archive
# --------------------------------------------------------
# class PictorialArchiveSerializer(serializers.ModelSerializer):
#     project_name = serializers.SerializerMethodField()
#     class Meta:
#         model = PictorialArchive
#         fields = ['id', 'project', 'project_name', 'image', 'image_date', 'description', 'created_at', 'updated_at' ]

#     def get_project_name(self, obj):
#         return obj.project.project_name


class GISProjectSerializer(serializers.ModelSerializer):
    zone_name = serializers.CharField(source="zone.zone_name", read_only=True)
    district_name = serializers.CharField(source="district.district_name", read_only=True)
    tehsil_name = serializers.CharField(source="tehsil.tehsil_name", read_only=True)
    circle = serializers.SerializerMethodField()
    circle_name = serializers.SerializerMethodField()
    geom = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "project_name",
            "project_reference_no",
            "project_category",
            "zone",
            "zone_name",
            "circle",
            "circle_name",
            "district",
            "district_name",
            "tehsil",
            "tehsil_name",
            "latitude",
            "longitude",
            "geom",
        ]

class GISProjectStatusSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "project_name",
            "status",
        ]

    def get_status(self, obj):
        activities = obj.activities.all()

        if not activities.exists():
            return "pending"

        # Any delayed activity?
        if activities.filter(activitydelaylog__isnull=False).exists():
            return "in_delay"

        # Any started activity?
        if activities.filter(progress__gt=0).exists():
            return "in_progress"

        return "pending"

class ProjectDashboardSerializer(serializers.ModelSerializer):
    """Lightweight project serializer for dashboard/list views.
    Deliberately excludes nested `activities` — the dashboard only needs
    the pre-computed progress/status fields the view attaches separately.
    Including activities here caused an N+1 query storm at scale
    (ProjectActivitySerializer.get_project_name re-fetches project per activity)
    plus a multi-MB response payload.
    """
    zone_name = serializers.SerializerMethodField()
    circle = serializers.SerializerMethodField()
    circle_name = serializers.SerializerMethodField()
    district_name = serializers.SerializerMethodField()
    tehsil_name = serializers.SerializerMethodField()
    stakeholder_details = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'stakeholder_details',
            'project_name', 'project_description',
            'project_starting_date', 'project_reference_no', 'project_category', 'project_category_other',
            'zone', 'zone_name', 'circle', 'circle_name',
            'district', 'district_name',
            'tehsil', 'tehsil_name', 'latitude', 'longitude',
            'total_budget', 'total_consume', 'remaining_budget',
            'created_at', 'updated_at',
        ]

    def get_zone_name(self, obj):
        return obj.zone.zone_name if obj.zone else None

    def get_circle(self, obj):
        if obj.tehsil and obj.tehsil.circle:
            return obj.tehsil.circle.id
        if obj.district and obj.district.circle:
            return obj.district.circle.id
        return None

    def get_circle_name(self, obj):
        if obj.tehsil and obj.tehsil.circle:
            return obj.tehsil.circle.circle_name
        if obj.district and obj.district.circle:
            return obj.district.circle.circle_name
        return None

    def get_district_name(self, obj):
        return obj.district.district_name if obj.district else None

    def get_tehsil_name(self, obj):
        return obj.tehsil.tehsil_name if obj.tehsil else None

    def get_stakeholder_details(self, obj):
        return [
            {
                "stakeholder_type": s.stakeholder_type,
                "stakeholder_title": s.stakeholder_title
            }
            for s in obj.stakeholder.all()
        ]