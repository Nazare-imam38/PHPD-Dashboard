const _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
import { Layout } from "@/components/layout/Layout";
import { CityMap } from "@/components/dashboard/CityMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  listProjects,
  listGISProjects,
  listProvinces,
  listDivisions,
  listDistricts,
  listTehsils,
  getProjectById,
  getProjectGanttData,
  getGISProjectStatuses,
} from "@/api";
import { FolderKanban, Loader2, AlertTriangle, CalendarCheck, Filter } from "lucide-react";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { ProjectGanttTree } from "@/components/dashboard/ProjectGanttTree";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef } from "react";



/**
 * Fallback map-centering helper (the old `@/data/areaMapCenters` module was removed).
 * We default to Punjab; when a narrower area is selected, we gently zoom in.
 */
function getMapCenterForArea(
  _divisionName,
  districtName,
  tehsilName,
) {
  // Punjab-ish center (Leaflet order: [lat, lng])
  const base = { center: [31.0, 73.5], zoom: 7 };
  if (tehsilName) return { ...base, zoom: 10 };
  if (districtName) return { ...base, zoom: 9 };
  return base;
}

/** Card config: id, label, icon, and Tailwind classes for bg + left border (situation-based colors) */
const PROJECT_STAT_CARDS = [
  { id: "total", label: "Total No of Projects", icon: FolderKanban, bgClass: "bg-primary", borderClass: "border-l-primary", iconOpacity: "opacity-90" },
  { id: "in_progress", label: "Projects in Progress", icon: Loader2, bgClass: "bg-emerald-700", borderClass: "border-l-emerald-500", iconOpacity: "opacity-80" },
  { id: "in_delay", label: "Projects in Delay", icon: AlertTriangle, bgClass: "bg-rose-600", borderClass: "border-l-rose-400", iconOpacity: "opacity-90" },
  { id: "pending", label: "Pending Projects", icon: CalendarCheck, bgClass: "bg-amber-600", borderClass: "border-l-amber-400", iconOpacity: "opacity-80" },
] ;

 

/** Normalize project geom for Leaflet: accept geometry or Feature/FeatureCollection */
function normalizeProjectGeom(geom) {
  if (geom == null) return null;
  const g = geom ;
  if (g.type === "FeatureCollection" && Array.isArray(g.features)) return geom ;
  if (g.type === "Feature" && g.geometry) return geom ;
  if (g.type === "Polygon" || g.type === "MultiPolygon" || g.type === "Point" || g.type === "LineString")
    return { type: "Feature", geometry: g, properties: {} } ;
  return null;
}



function geometryBboxCenter(geometry) {
  // Returns [lat, lng] (Leaflet order)
  const coords = _optionalChain([geometry, 'optionalAccess', _4 => _4.coordinates]);
  if (!coords) return null;
  let minLng = Number.POSITIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;

  const walk = (v) => {
    if (!v) return;
    // coordinate pair [lng, lat]
    if (Array.isArray(v) && v.length === 2 && typeof v[0] === "number" && typeof v[1] === "number") {
      const lng = v[0];
      const lat = v[1];
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
      }
      return;
    }
    if (Array.isArray(v)) {
      for (const x of v) walk(x);
    }
  };
  walk(coords);

  if (!Number.isFinite(minLng) || !Number.isFinite(minLat) || !Number.isFinite(maxLng) || !Number.isFinite(maxLat)) {
    return null;
  }
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;
  return [centerLat, centerLng];
}

/** Build a GeoJSON FeatureCollection from all projects that have geom (for map layer by division/district/tehsil) */
function buildProjectsFeatureCollection(
  projects,
  statusByProjectId,
) {
  const features = [];
  for (const p of projects) {
    let normalized = normalizeProjectGeom(p.geom);

    // Fallback to lat/lng if geom is missing
    if (!normalized && p.latitude && p.longitude) {
      const lat = Number(p.latitude);
      const lng = Number(p.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        normalized = {
          type: "Feature",
          geometry: { type: "Point", coordinates: [lng, lat] },
          properties: {},
        };
      }
    }

    if (!normalized) continue;
    const n = normalized;
    const baseProps = {
      id: p.id,
      project_name: _nullishCoalesce(p.project_name, () => ( `Project #${p.id}`)),
      status: _nullishCoalesce(_optionalChain([statusByProjectId, 'optionalAccess', _5 => _5.get, 'call', _6 => _6(p.id)]), () => ( "pending")),
    };
    let markerAdded = false;
    if (n.type === "FeatureCollection" && Array.isArray(n.features)) {
      for (const f of n.features) {
        if (!f.geometry) continue;
        const center = geometryBboxCenter(f.geometry);
        features.push({
          type: "Feature",
          geometry: f.geometry,
          properties: {
            ...(f.properties || {}),
            ...baseProps,
            __center: _nullishCoalesce(center, () => ( undefined)),
            __marker: !markerAdded,
          },
        });
        markerAdded = true;
      }
    } else if (n.type === "Feature" && n.geometry) {
      const center = geometryBboxCenter(n.geometry);
      features.push({
        type: "Feature",
        geometry: n.geometry,
        properties: { ...(n.properties || {}), ...baseProps, __center: _nullishCoalesce(center, () => ( undefined)), __marker: true },
      });
    }
  }
  if (features.length === 0) return null;
  return { type: "FeatureCollection", features };
}

const EMPTY_ACTIVE_LAYERS = new Set();

const LOOKUP_QUERY_OPTIONS = {
  staleTime: 30 * 60 * 1000,
  gcTime: 60 * 60 * 1000,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

const PROJECT_QUERY_OPTIONS = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

const HEAVY_QUERY_OPTIONS = {
  staleTime: 15 * 60 * 1000,
  gcTime: 60 * 60 * 1000,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  retry: false,
};

const SELECTED_GANTT_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

export default function GISLayers() {
  const [selectedCity, setSelectedCity] = useState("lahore");
  const [showLegend, setShowLegend] = useState(true);
  const [mapRef, setMapRef] = useState(null);
  const ganttSectionRef = useRef(null);
  const [selectedZoneId, setSelectedZoneId] = useState("all");
  const [selectedCircleId, setSelectedCircleId] = useState("all");
  const [selectedDistrictId, setSelectedDistrictId] = useState("all");
  const [selectedTehsilId, setSelectedTehsilId] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  const hasActiveFilters =
    selectedZoneId !== "all" ||
    selectedCircleId !== "all" ||
    selectedDistrictId !== "all" ||
    selectedTehsilId !== "all" ||
    selectedProjectId !== "all";

  const handleZoneChange = (value) => {
    setSelectedZoneId(value);
    setSelectedCircleId("all");
    setSelectedDistrictId("all");
    setSelectedTehsilId("all");
    setSelectedProjectId("all");
  };

  const handleCircleChange = (value) => {
    setSelectedCircleId(value);
    setSelectedDistrictId("all");
    setSelectedTehsilId("all");
    setSelectedProjectId("all");
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrictId(value);
    setSelectedTehsilId("all");
    setSelectedProjectId("all");
  };

  const handleTehsilChange = (value) => {
    setSelectedTehsilId(value);
    setSelectedProjectId("all");
  };

  const zoneNumeric = selectedZoneId !== "all" ? Number(selectedZoneId) : null;
  const circleNumeric =
    selectedCircleId !== "all" ? Number(selectedCircleId) : null;
  const districtNumeric =
    selectedDistrictId !== "all" ? Number(selectedDistrictId) : null;
  const selectedProjectNumericId =
    selectedProjectId !== "all" ? Number(selectedProjectId) : null;

  const { data: zones = [], isLoading: zonesLoading } = useQuery({
    queryKey: ["zones"],
    queryFn: () => listProvinces(),
    ...LOOKUP_QUERY_OPTIONS,
  });

  const { data: circles = [], isFetching: circlesLoading } = useQuery({
    queryKey: ["circles", zoneNumeric],
    queryFn: () => listDivisions(zoneNumeric),
    enabled: zoneNumeric != null && Number.isFinite(zoneNumeric),
    ...LOOKUP_QUERY_OPTIONS,
  });

  const { data: districts = [], isFetching: districtsLoading } = useQuery({
    queryKey: ["districts", circleNumeric],
    queryFn: () => listDistricts(circleNumeric),
    enabled: circleNumeric != null && Number.isFinite(circleNumeric),
    ...LOOKUP_QUERY_OPTIONS,
  });

  const { data: tehsils = [], isFetching: tehsilsLoading } = useQuery({
    queryKey: ["tehsils", districtNumeric],
    queryFn: () => listTehsils(districtNumeric),
    enabled: districtNumeric != null && Number.isFinite(districtNumeric),
    ...LOOKUP_QUERY_OPTIONS,
  });

  const tehsilNumeric =
    selectedTehsilId !== "all" ? Number(selectedTehsilId) : null;

  const { data: projects = [], isFetching: projectsLoading } = useQuery({
    queryKey: [
      "projects",
      zoneNumeric,
      circleNumeric,
      districtNumeric,
      tehsilNumeric,
    ],
    queryFn: () => {

      
     return listGISProjects({
        zone: zoneNumeric,
      circle: circleNumeric,
      district: districtNumeric,
      tehsil:
        tehsilNumeric != null && Number.isFinite(tehsilNumeric)
          ? tehsilNumeric
          : undefined,
    });
  },
  ...PROJECT_QUERY_OPTIONS,
});

  // Load only the lightweight GIS status summary. This replaces the full
  // nested /api/project-gantt-all/ payload on the GIS page.
  const { data: gisProjectStatuses = [] } = useQuery({
    queryKey: ["gis-project-status"],
    queryFn: getGISProjectStatuses,
    enabled: projects.length > 0 && !projectsLoading,
    ...HEAVY_QUERY_OPTIONS,
  });

  // The selected project is reused from the already-fetched GIS project list.
  // This removes the duplicate /api/list-project/?id=... request.

  // When a project is selected, fetch nested gantt tasks for that project id.
  const { data: selectedProjectGanttTasks = [], isFetching: ganttLoading } =
    useQuery({
      queryKey: ["project-gantt", selectedProjectNumericId],
      queryFn: async () => {
        if (selectedProjectNumericId == null) return [];
        const tasks = await getProjectGanttData(selectedProjectNumericId);
        return Array.isArray(tasks) ? tasks : [];
      },
      enabled:
        selectedProjectNumericId != null &&
        Number.isFinite(selectedProjectNumericId),
      ...SELECTED_GANTT_QUERY_OPTIONS,
    });

  const filteredProjects = useMemo(() => {
    let list = projects;
    if (zoneNumeric != null && Number.isFinite(zoneNumeric)) {
      list = list.filter((p) => (_nullishCoalesce(p.zone, () => ( p.province))) === zoneNumeric);
    }
    if (circleNumeric != null && Number.isFinite(circleNumeric)) {
      list = list.filter((p) => (_nullishCoalesce(p.circle, () => ( p.division))) === circleNumeric);
    }
    if (districtNumeric != null && Number.isFinite(districtNumeric)) {
      list = list.filter((p) => p.district === districtNumeric);
    }
    if (tehsilNumeric != null && Number.isFinite(tehsilNumeric)) {
      list = list.filter((p) => p.tehsil === tehsilNumeric);
    }
    return list;
  }, [projects, zoneNumeric, circleNumeric, districtNumeric, tehsilNumeric]);

  const projectStatusById = useMemo(() => {
    const statusByProjectId = new Map();

    for (const item of gisProjectStatuses) {
      const idNum = Number(item?.project_id ?? item?.id);
      if (!Number.isFinite(idNum)) continue;

      const status = String(item?.status || "pending");
      statusByProjectId.set(
        idNum,
        status === "in_delay" || status === "in_progress" ? status : "pending",
      );
    }

    const map = new Map();
    for (const project of filteredProjects) {
      map.set(project.id, statusByProjectId.get(project.id) ?? "pending");
    }
    return map;
  }, [filteredProjects, gisProjectStatuses]);

  /**
   * Project status counts (no hardcoding) — SINGLE approach:
   * - pending: no activity started (percent_complete == 0 and/or no start_date)
   * - in_delay: lightweight status API reports at least one delay log
   * - in_progress: at least one activity has progress > 0 and no delay
   *
   * NOTE: `listProjects()` normalizes activities so `percent_complete` + `finish_date`
   * are always present (even if backend sends `progress`/`end_date`).
   */
  const projectCounts = useMemo(() => {
    let pending = 0;
    let in_progress = 0;
    let in_delay = 0;

    for (const p of filteredProjects) {
      const status = _nullishCoalesce(projectStatusById.get(p.id), () => ( "pending"));
      if (status === "in_delay") in_delay += 1;
      else if (status === "in_progress") in_progress += 1;
      else pending += 1;
    }

    return {
      total: filteredProjects.length,
      pending,
      in_progress,
      in_delay,
    } ;
  }, [filteredProjects, projectStatusById]);

  const mapView = useMemo(
    () =>
      getMapCenterForArea(
        selectedCircleId === "all"
          ? ""
          : _nullishCoalesce(
              _optionalChain([
                circles,
                "access",
                (_9) => _9.find,
                "call",
                (_10) => _10((c) => String(c.id) === selectedCircleId),
                "optionalAccess",
                (_11) => _11.circle_name,
              ]),
              () => (""),
            ),
        selectedDistrictId === "all"
          ? undefined
          : _optionalChain([districts, 'access', _12 => _12.find, 'call', _13 => _13((d) => String(d.id) === selectedDistrictId)
, 'optionalAccess', _14 => _14.district_name]),
        selectedTehsilId === "all"
          ? undefined
          : _optionalChain([tehsils, 'access', _15 => _15.find, 'call', _16 => _16((t) => String(t.id) === selectedTehsilId), 'optionalAccess', _17 => _17.tehsil_name])
      ),
    [selectedCircleId, selectedDistrictId, selectedTehsilId, circles, districts, tehsils]
  );

  const selectedProject = useMemo(
    () =>
      selectedProjectId && selectedProjectId !== "all"
        ? _nullishCoalesce(filteredProjects.find((p) => String(p.id) === selectedProjectId), () => ( null))
        : null,
    [filteredProjects, selectedProjectId]
  );

  // Reuse the selected project from the cached GIS project list.
  const activeSelectedProject = selectedProject;

  // When selecting a project, automatically set Zone/Circle/District/Tehsil filters
  // to match that project's saved location. This keeps the filter bar in sync.
  useEffect(() => {
    if (!activeSelectedProject) return;
    if (selectedProjectId === "all") return;

    const zoneId = _nullishCoalesce(activeSelectedProject.zone, () => ( activeSelectedProject.province));
    const circleId = _nullishCoalesce(activeSelectedProject.circle, () => ( activeSelectedProject.division));
    const districtId = activeSelectedProject.district;
    const tehsilId = activeSelectedProject.tehsil;

    // Set in parent → child order. Use direct setters (not handlers) to avoid
    // resetting the selected project to "all".
    if (zoneId != null && String(zoneId) !== selectedZoneId) setSelectedZoneId(String(zoneId));
    if (circleId != null && String(circleId) !== selectedCircleId) setSelectedCircleId(String(circleId));
    if (districtId != null && String(districtId) !== selectedDistrictId) setSelectedDistrictId(String(districtId));
    if (tehsilId != null && String(tehsilId) !== selectedTehsilId) setSelectedTehsilId(String(tehsilId));
  }, [
    activeSelectedProject,
    selectedProjectId,
    selectedZoneId,
    selectedCircleId,
    selectedDistrictId,
    selectedTehsilId,
  ]);

  /** Combined GeoJSON of all filtered projects (by division/district/tehsil) — same list API as project-management; shows geojson/shapefile boundaries on map */
  const allFilteredProjectsGeo = useMemo(
    () => buildProjectsFeatureCollection(filteredProjects, projectStatusById),
    [filteredProjects, projectStatusById]
  );

  // GeoJSON for the selected project only (used to zoom/focus map).
  const selectedProjectGeo = useMemo(() => {
    if (!activeSelectedProject || !activeSelectedProject.geom) return null;
    return buildProjectsFeatureCollection([activeSelectedProject], projectStatusById);
  }, [activeSelectedProject, projectStatusById]);

  const handleLegendClose = useCallback(() => {
    setShowLegend(false);
  }, []);

  const handleProjectSelect = useCallback((projectId) => {
    setSelectedProjectId(String(projectId));
    // Scroll after React renders the selected project Gantt section.
    setTimeout(() => {
      _optionalChain([ganttSectionRef, 'access', _18 => _18.current, 'optionalAccess', _19 => _19.scrollIntoView, 'call', _20 => _20({ behavior: "smooth", block: "start" })]);
    }, 50);
  }, []);

  return (
    React.createElement(Layout, { title: "Advanced GIS Intelligence"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}
      , React.createElement('div', { className: "flex flex-col gap-4 sm:gap-6 w-full min-w-0"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}
        /* Filters — card panel with clear hierarchy */
        , React.createElement(Card, { className: "border border-border/60 bg-card shadow-sm overflow-hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}
          , React.createElement(CardContent, { className: "p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}
            , React.createElement('div', { className: "flex flex-wrap items-end gap-3 w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}}

              /* Filters label */
              , React.createElement('div', { className: "flex items-center gap-2 shrink-0 pb-[1px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}
                , React.createElement('div', { className: "flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}
                  , React.createElement(Filter, { className: "h-3.5 w-3.5 shrink-0", 'aria-hidden': true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}} )
                )
                , React.createElement('span', { className: "text-sm font-semibold text-foreground leading-none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}, "Filters")
              )

              /* Divider */
              , React.createElement('div', { className: "hidden sm:block w-px h-8 bg-border/60 self-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}} )

              /* Zone */
              , React.createElement('div', { className: "flex flex-col gap-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
                , React.createElement('label', { className: "text-xs font-medium text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}, "Zone")
                , React.createElement(Select, { value: selectedZoneId, onValueChange: handleZoneChange, __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}
                  , React.createElement(SelectTrigger, { className: "w-[130px] h-9 border-border/60 bg-background rounded-lg shadow-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}
                    , React.createElement(SelectValue, { placeholder: zonesLoading ? "Loading…" : "All", __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}} )
                  )
                  , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}
                    , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}, "All")
                    , zones.map((z) => (
                      React.createElement(SelectItem, { key: z.id, value: String(z.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}
                        , _nullishCoalesce(z.zone_name, () => ( z.province_name))
                      )
                    ))
                  )
                )
              )

              /* Circle */
              , React.createElement('div', { className: "flex flex-col gap-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 422}}
                , React.createElement('label', { className: "text-xs font-medium text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}, "Circle")
                , React.createElement(Select, {
                  value: selectedCircleId,
                  onValueChange: handleCircleChange,
                  disabled: selectedZoneId === "all" || circlesLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
                  , React.createElement(SelectTrigger, {
                    className: cn(
                      "w-[140px] h-9 border-border/60 bg-background rounded-lg shadow-sm",
                      (selectedZoneId === "all" || circlesLoading) && "opacity-50 cursor-not-allowed",
                    ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}
                    , React.createElement(SelectValue, { placeholder: circlesLoading ? "Loading…" : "All", __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}} )
                  )
                  , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}
                    , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}, "All")
                    , selectedZoneId !== "all" &&
                      circles.map((c) => (
                        React.createElement(SelectItem, { key: c.id, value: String(c.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 442}}
                          , _nullishCoalesce(c.circle_name, () => ( c.division_name))
                        )
                      ))
                  )
                )
              )

              /* District */
              , React.createElement('div', { className: "flex flex-col gap-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 422}}
                , React.createElement('label', { className: "text-xs font-medium text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}, "District")
                , React.createElement(Select, {
                  value: selectedDistrictId,
                  onValueChange: handleDistrictChange,
                  disabled: selectedCircleId === "all" || districtsLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
                  , React.createElement(SelectTrigger, {
                    className: cn(
                      "w-[140px] h-9 border-border/60 bg-background rounded-lg shadow-sm",
                      (selectedCircleId === "all" || districtsLoading) && "opacity-50 cursor-not-allowed",
                    ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}
                    , React.createElement(SelectValue, { placeholder: districtsLoading ? "Loading…" : "All", __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}} )
                  )
                  , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}
                    , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}, "All")
                    , selectedCircleId !== "all" &&
                      districts.map((dist) => (
                        React.createElement(SelectItem, { key: dist.id, value: String(dist.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 442}}
                          , dist.district_name
                        )
                      ))
                  )
                )
              )

              /* Tehsil */
              , React.createElement('div', { className: "flex flex-col gap-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 450}}
                , React.createElement('label', { className: "text-xs font-medium text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}, "Tehsil")
                , React.createElement(Select, {
                  value: selectedTehsilId,
                  onValueChange: handleTehsilChange,
                  disabled:
                    selectedZoneId === "all" ||
                    selectedCircleId === "all" ||
                    selectedDistrictId === "all" ||
                    tehsilsLoading
                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}
                  , React.createElement(SelectTrigger, {
                    className: cn(
                      "w-[140px] h-9 border-border/60 bg-background rounded-lg shadow-sm",
                      (selectedZoneId === "all" || selectedCircleId === "all" || selectedDistrictId === "all" || tehsilsLoading) && "opacity-50 cursor-not-allowed",
                    ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 461}}
                    , React.createElement(SelectValue, { placeholder: tehsilsLoading ? "Loading…" : "All", __self: this, __source: {fileName: _jsxFileName, lineNumber: 469}} )
                  )
                  , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 471}}
                    , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}, "All")
                    , selectedZoneId !== "all" &&
                      selectedCircleId !== "all" &&
                      selectedDistrictId !== "all" &&
                      tehsils.map((teh) => (
                        React.createElement(SelectItem, { key: teh.id, value: String(teh.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 476}}
                          , teh.tehsil_name
                        )
                      ))
                  )
                )
              )

              /* Project */
              , React.createElement('div', { className: "flex flex-col gap-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 484}}
                , React.createElement('label', { className: "text-xs font-medium text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 485}}, "Project")
                , React.createElement(Select, { value: selectedProjectId, onValueChange: setSelectedProjectId, __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}}
                  , React.createElement(SelectTrigger, { className: "w-[160px] h-9 border-border/60 bg-background rounded-lg shadow-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}}
                    , React.createElement(SelectValue, { placeholder: "All", __self: this, __source: {fileName: _jsxFileName, lineNumber: 488}} )
                  )
                  , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}
                    , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 491}}, "All (" , filteredProjects.length, ")")
                    , filteredProjects.map((p) => (
                      React.createElement(SelectItem, { key: p.id, value: String(p.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 493}}
                        , p.project_name || `#${p.id}`
                      )
                    ))
                  )
                )
              )

              /* Clear filters — only when active */
              , hasActiveFilters && (
                React.createElement('div', { className: "flex flex-col gap-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}
                  , React.createElement('span', { className: "text-xs font-medium text-muted-foreground opacity-0 select-none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 501}}, "\u00a0")
                  , React.createElement(Button, {
                    variant: "destructive",
                    onClick: () => {
                      setSelectedZoneId("all");
                      setSelectedCircleId("all");
                      setSelectedDistrictId("all");
                      setSelectedTehsilId("all");
                      setSelectedProjectId("all");
                    },
                    className: "h-9 px-4 text-xs font-semibold bg-red-600 hover:bg-red-700 border-0 rounded-lg shadow-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}}
                  , "Clear filters"
                  )
                )
              )
            )
          )
        )


        /* Project stats cards — refined layout, accent bar, icon badge */
        , React.createElement('div', { className: "grid grid-cols-2 lg:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 526}}
          , PROJECT_STAT_CARDS.map((stat) => (
            React.createElement(Card, {
              key: stat.id,
              className: `overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-xl border-l-4 ${stat.bgClass} ${stat.borderClass}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 528}}

              , React.createElement(CardContent, { className: "p-5 flex flex-col gap-3 relative"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 532}}
                , React.createElement('div', { className: "flex items-start justify-between gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 533}}
                  , React.createElement('p', { className: "text-xs font-semibold uppercase tracking-wider text-white/90"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 534}}
                    , stat.label
                  )
                  , React.createElement('div', { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 ${stat.iconOpacity} backdrop-blur-sm`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}}
                    , React.createElement(stat.icon, { className: "h-5 w-5 text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 538}} )
                  )
                )
                , React.createElement('p', { className: "text-3xl font-bold font-heading tabular-nums text-white drop-shadow-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 541}}
                  , projectCounts[stat.id]
                )
              )
            )
          ))
        )

        , React.createElement('div', { className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 549}}

          , React.createElement('div', { className: "w-full min-h-[480px] h-[65vh] max-h-[720px] rounded-xl overflow-hidden"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 551}}
            , React.createElement(CityMap, {
              city: selectedCity,
              activeLayers: EMPTY_ACTIVE_LAYERS,
              searchQuery: "",
              onMapReady: setMapRef,
              showLegend: showLegend,
              onLegendClose: handleLegendClose,
              showStats: false,
              showSurveillanceLayers: false,
              legendProjects: filteredProjects,
              onProjectSelect: handleProjectSelect,
              filterCenter: 
                !selectedProjectGeo &&
                !allFilteredProjectsGeo &&
                selectedZoneId !== "all"
                  ? mapView.center
                  : undefined
              ,
              filterZoom: 
                !selectedProjectGeo &&
                !allFilteredProjectsGeo &&
                selectedZoneId !== "all"
                  ? mapView.zoom
                  : undefined
              ,
              geoData: _nullishCoalesce((_nullishCoalesce(selectedProjectGeo, () => ( allFilteredProjectsGeo))), () => ( undefined)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 552}}
            )
          )

          /* Selected Project Details (Gantt / WBS) */
          , selectedProjectId !== "all" && (
            React.createElement('div', { ref: ganttSectionRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 589}}
              , React.createElement(Card, { className: "mt-4 border-border/60 shadow-sm overflow-hidden"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 590}}
              , React.createElement(CardHeader, { className: "pb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 591}}
                , React.createElement(CardTitle, { className: "text-base sm:text-lg font-heading font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 592}}
                  , (_optionalChain([activeSelectedProject, 'optionalAccess', _21 => _21.project_name]) || `Project ${selectedProjectId}`) +
                    " — Project Gantt"
                )
              )
              , React.createElement(CardContent, { className: "pt-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 597}}
                , ganttLoading ? (
                  React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 599}}
                    , React.createElement(Skeleton, { className: "h-5 w-72 max-w-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 600}} )
                    , React.createElement(Skeleton, { className: "h-64 w-full" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 601}} )
                  )
                ) : selectedProjectGanttTasks.length === 0 ? (
                  React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 604}}, "No Gantt timeline data found for this project yet."

                  )
                ) : (
                  React.createElement(ProjectGanttTree, {
                    tasks: selectedProjectGanttTasks ,
                    projectName: _nullishCoalesce(_optionalChain([activeSelectedProject, 'optionalAccess', _22 => _22.project_name]), () => ( undefined)),
                    projectId: _nullishCoalesce(selectedProjectNumericId, () => ( undefined)),
                    readOnly: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 608}}
                  )
                )
              )
              )
            )
          )
        )
      )
    )
  );
}


