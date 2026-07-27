import React from "react";
const _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, LayerGroup, Polyline, useMap, GeoJSON } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Camera, AlertTriangle, Activity, Construction, Upload, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Keep default icon defined but do NOT set it as the global prototype default.
// Setting L.Marker.prototype.options.icon globally causes all GeoJSON Point
// features to render as the blue location pin. We use status-based divIcons instead.
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Invisible placeholder icon used for GeoJSON Point geometries so the boundary
// GeoJSON layer renders the polygon/line shape only — the dedicated status Marker
// component (rendered separately) handles the visible icon.
const INVISIBLE_ICON = L.divIcon({
  className: "",
  html: "",
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// Custom Icons
const getPoliceIcon = () => L.divIcon({
  className: 'police-station-icon',
  html: `<div class="p-1.5 bg-primary rounded-lg border-2 border-white shadow-xl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const getPatrolIcon = (color) => L.divIcon({
  className: 'patrol-unit-icon',
  html: `<div class="p-1 bg-${color} rounded-full border-2 border-white shadow-lg animate-pulse"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M15 18H9"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const getConstructionIcon = () => L.divIcon({
  className: 'construction-icon',
  html: `<div class="p-1.5 bg-orange-500 rounded-lg border-2 border-white shadow-xl animate-bounce"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="10" width="20" height="12" rx="2"/><path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const getIncidentIcon = (severity) => L.divIcon({
  className: 'incident-icon',
  html: `<div class="p-1.5 ${severity === 'High' ? 'bg-destructive animate-ping' : 'bg-orange-600'} rounded-full border-2 border-white shadow-xl"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});


const PROJECT_STATUS_STYLE = {
  in_progress: { color: "#0F4B3A", fillColor: "#0F4B3A" }, // in-progress
  in_delay: { color: "#e11d48", fillColor: "#e11d48" }, // rose-600
  pending: { color: "#d97706", fillColor: "#d97706" }, // amber-600
};
// Only 3 possible statuses — build these divIcons once (lazily, on first use)
// instead of per-marker, per-render.
let _statusIconCache = null;
function getStatusIconCached(status) {
  if (!_statusIconCache) {
    _statusIconCache = {
      in_progress: getProjectStatusIcon("in_progress"),
      in_delay: getProjectStatusIcon("in_delay"),
      pending: getProjectStatusIcon("pending"),
    };
  }
  return _statusIconCache[status] ?? _statusIconCache.pending;
}
function getStatusSvg(status) {
  // Inline SVGs so Leaflet divIcon has no external deps.
  // Styled with currentColor to inherit the marker's white text color.
  if (status === "in_delay") {
    // alert-triangle
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 9v4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M12 17h.01" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`;
  }
  if (status === "in_progress") {
    // play
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5v14l11-7L8 5Z" fill="currentColor"/>
    </svg>`;
  }
  // clock
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function getProjectStatusIcon(status) {
  
  const cfg = _nullishCoalesce(PROJECT_STATUS_STYLE[status], () => ( PROJECT_STATUS_STYLE.pending));
  const svg = getStatusSvg(status);
  const statusClass =
    status === "in_delay"
      ? "project-status-icon--delay"
      : status === "pending"
        ? "project-status-icon--pending"
        : "project-status-icon--progress";
  return L.divIcon({
    className: `project-status-icon ${statusClass}`,
    html: `<div class="project-status-icon__wrap ${statusClass}">
      <span class="project-status-icon__ring" aria-hidden="true"></span>
      <span class="project-status-icon__dot" style="
        width: 26px; height: 26px;
        border-radius: 9999px;
        background: ${cfg.color};
        border: 2px solid rgba(255,255,255,0.95);
        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        display: flex; align-items: center; justify-content: center;
        color: white; font-weight: 800; font-size: 13px; line-height: 1;
      ">${svg}</span>
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function getGreenDotProjectIcon() {
  return L.divIcon({
    className: "project-green-dot",
    html: `<span style="
      width: 12px; height: 12px;
      border-radius: 9999px;
      background: #22c55e;
      border: 2px solid rgba(255,255,255,0.95);
      box-shadow: 0 12px 30px rgba(0,0,0,0.25);
      display: block;
    "></span>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

const MOCK_DATA = {
  cameras: [
    // Lahore
    { id: 1, pos: [31.5204, 74.3587], status: "Online", type: "PTZ", alerts: 2, label: "Mall Road Sector 1" },
    { id: 2, pos: [31.5497, 74.3436], status: "Offline", type: "Fixed", alerts: 0, label: "Gulberg Main Blvd" },
    // Rawalpindi
    { id: 101, pos: [33.5651, 73.0169], status: "Online", type: "PTZ", alerts: 1, label: "Saddar Metro Station" },
    { id: 102, pos: [33.5900, 73.0300], status: "Online", type: "Fixed", alerts: 0, label: "Murree Road Intersection" },
    // Gujranwala
    { id: 201, pos: [32.1877, 74.1945], status: "Online", type: "PTZ", alerts: 3, label: "GT Road Central" },
    { id: 202, pos: [32.1600, 74.2100], status: "Offline", type: "Fixed", alerts: 0, label: "Sialkot Bypass" },
  ],
  incidents: [
    // Lahore
    { id: 1, pos: [31.5100, 74.3300], type: "Traffic Accident", severity: "High", time: "10:15 AM", status: "Responding" },
    // Rawalpindi
    { id: 101, pos: [33.5750, 73.0200], type: "Suspicious Activity", severity: "Medium", time: "11:20 AM", status: "Pending" },
    // Gujranwala
    { id: 201, pos: [32.1950, 74.2000], type: "Fire Alert", severity: "High", time: "09:45 AM", status: "Responding" },
  ],
  patrols: [
    // Lahore
    { id: 1, pos: [31.5300, 74.3400], label: "Dolphin Unit 102", status: "Active", type: "Motorcycle", color: "emerald-500" },
    // Rawalpindi
    { id: 101, pos: [33.5550, 73.0100], label: "PRU Unit 88", status: "Active", type: "Car", color: "emerald-500" },
    // Gujranwala
    { id: 201, pos: [32.1750, 74.1850], label: "Warden 42", status: "Active", type: "Motorcycle", color: "emerald-500" },
  ],
  stations: [
    { id: 1, pos: [31.5250, 74.3600], name: "Model Town PS", units: 12, radius: 2000 },
    { id: 101, pos: [33.5600, 73.0150], name: "Civil Lines Pindi", units: 18, radius: 2000 },
    { id: 201, pos: [32.1850, 74.1900], name: "City PS Gujranwala", units: 14, radius: 2000 },
  ],
  traffic: [
    { id: 1, path: [[31.520, 74.358], [31.540, 74.358], [31.560, 74.350]], level: "High", speed: "12 km/h" },
    { id: 2, path: [[31.500, 74.300], [31.520, 74.320], [31.540, 74.340]], level: "Low", speed: "45 km/h" },
  ],
  construction: [
    { id: 1, pos: [31.5350, 74.3550], label: "Flyover Project B", progress: "45%", image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=300&q=80" },
    { id: 2, pos: [31.4850, 74.3150], label: "Underpass Sector 4", progress: "70%", image: "https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&w=300&q=80" },
    { id: 3, pos: [31.5100, 74.3650], label: "Orange Line Exp", progress: "25%", image: "https://images.unsplash.com/photo-1590644365607-1c5a519a9a37?auto=format&fit=crop&w=300&q=80" },
  ]
};

const CITY_COORDINATES = {
  lahore: [31.5204, 74.3587],
  rawalpindi: [33.5651, 73.0169],
  gujranwala: [32.1877, 74.1945],
};

// Component to handle map center and zoom changes (e.g. from area filter)
function MapCenterHandler({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    const z = _nullishCoalesce(zoom, () => ( map.getZoom()));
    map.setView(center, z, { animate: true, duration: 0.5 });
  }, [center, zoom, map]);
  return null;
}

// Force Leaflet to recalculate size and redraw tiles after container is laid out (fixes partial tile loading)
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const resize = () => {
      map.invalidateSize();
      map.setView(map.getCenter(), map.getZoom());
    };
    const t1 = setTimeout(resize, 100);
    const t2 = setTimeout(resize, 400);
    const ro = new ResizeObserver(resize);
    if (container) ro.observe(container);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (container) ro.unobserve(container);
    };
  }, [map]);
  return null;
}

// Component to handle fitting map to GeoJSON bounds
function GeoJSONFitBounds({ data }) {
  const map = useMap();
  useEffect(() => {
    if (data) {
      try {
        const layer = L.geoJSON(data);
        const bounds = layer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 15,
            animate: true,
            duration: 1.5
          });
        }
      } catch (err) {
        console.error("Error fitting map to GeoJSON:", err);
      }
    }
  }, [data, map]);
  return null;
}

/** Minimal project shape for legend (project names from list-project API) */





export function CityMap({
  city = "lahore",
  activeLayers = new Set(["cameras", "incidents", "patrols", "construction", "traffic"]),
  searchQuery = "",
  onMapReady,
  geoData,
  showStats = true,
  showLegend = true,
  onLegendClose,
  filterCenter,
  filterZoom,
  showSurveillanceLayers = true,
  legendProjects,
  onProjectSelect,
  showGeoBoundary = true,
  projectMarkerVariant = "status",
}

















) {
  const [isMounted, setIsMounted] = useState(false);
  const [constructionSites, setConstructionSites] = useState(MOCK_DATA.construction);
  const cityCenter = CITY_COORDINATES[city.toLowerCase()] || CITY_COORDINATES.lahore;
  const center = _nullishCoalesce(filterCenter, () => ( cityCenter));
  const zoom = _nullishCoalesce(filterZoom, () => ( 12));
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const mapRef = useRef(null);
  const greenDotIconRef = useRef(null);
  if (!greenDotIconRef.current) greenDotIconRef.current = getGreenDotProjectIcon();

  const handleFileUpload = (e, id) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConstructionSites(prev => prev.map(site =>
          site.id === id ? { ...site, image: _optionalChain([event, 'access', _ => _.target, 'optionalAccess', _2 => _2.result])  } : site
        ));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Filter data based on search query AND active layers
  const filteredCameras = (activeLayers.has("cameras") ? MOCK_DATA.cameras : []).filter(cam =>
    !searchQuery || cam.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredIncidents = (activeLayers.has("incidents") ? MOCK_DATA.incidents : []).filter(inc =>
    !searchQuery || inc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPatrols = (activeLayers.has("patrols") ? MOCK_DATA.patrols : []).filter(unit =>
    !searchQuery || unit.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredConstruction = activeLayers.has("construction") ? constructionSites : [];
  const filteredTraffic = activeLayers.has("traffic") ? MOCK_DATA.traffic : [];
  const filteredStations = activeLayers.has("stations") ? MOCK_DATA.stations : [];
  const filteredHotspots = activeLayers.has("hotspots") ? MOCK_DATA.incidents : [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (mapRef.current && onMapReady) {
      onMapReady(mapRef.current);
    }
  }, [onMapReady]);

  if (!isMounted) {
    return React.createElement('div', { className: "h-[360px] sm:h-[520px] lg:h-[600px] w-full bg-muted animate-pulse rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}} );
  }

  return (
    React.createElement('div', { className: "min-h-[400px] h-full w-full rounded-xl overflow-hidden border shadow-2xl relative z-0 group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
      , React.createElement(MapContainer, {
        center: center,
        zoom: zoom,
        scrollWheelZoom: true,
        style: { height: "100%", width: "100%", minHeight: 400 },
        ref: mapRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}

        , React.createElement(MapCenterHandler, { center: center, zoom: zoom, __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}} )
        , React.createElement(MapResizeHandler, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 313}} )
        , geoData && React.createElement(GeoJSONFitBounds, { data: geoData, __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}} )
        , React.createElement(LayersControl, { position: "topright", __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}
          , React.createElement(LayersControl.BaseLayer, { name: "Operational Dark" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}
            , React.createElement(TileLayer, {
              url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
              attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors © <a href=\"https://carto.com/attributions\">CARTO</a>"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}
            )
          )
          , React.createElement(LayersControl.BaseLayer, { checked: true, name: "Street View" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}
            , React.createElement(TileLayer, {
              url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              attribution: "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}
            )
          )
          , React.createElement(LayersControl.BaseLayer, { name: "Satellite", __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
            , React.createElement(TileLayer, {
              url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              attribution: "© <a href=\"https://www.esri.com/\">Esri</a>"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}
            )
          )

          , showSurveillanceLayers && (
            React.createElement(React.Fragment, null
              , React.createElement(LayersControl.Overlay, { checked: true, name: "CCTV Coverage" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}
                , React.createElement(LayerGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}
                  , filteredCameras.map(cam => (
                    React.createElement(Circle, {
                      key: cam.id,
                      center: cam.pos ,
                      radius: cam.status === 'Online' ? 300 : 50,
                      pathOptions: {
                        color: cam.status === 'Online' ? '#2F8F6C' : '#ef4444',
                        fillOpacity: 0.2
                      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}

                      , React.createElement(Popup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}
                        , React.createElement('div', { className: "p-2 w-48 font-sans"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}
                          , React.createElement('div', { className: "flex items-center gap-2 border-b pb-2 mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}
                            , React.createElement(Camera, { className: "h-4 w-4 text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}} )
                            , React.createElement('span', { className: "font-bold text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}, cam.label)
                          )
                          , React.createElement('p', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}, "STATUS: " , React.createElement('span', { className: cam.status === 'Online' ? 'text-emerald-500' : 'text-destructive', __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}, cam.status))
                          , React.createElement('button', { className: "w-full mt-3 bg-primary text-white text-[10px] py-1.5 rounded uppercase font-bold tracking-widest hover:bg-primary/90"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}, "Request Feed" )
                        )
                      )
                    )
                  ))
                )
              )

              , React.createElement(LayersControl.Overlay, { checked: true, name: "Live Incidents" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}
                , React.createElement(LayerGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}
                  , filteredIncidents.map(inc => (
                    React.createElement(Marker, { key: inc.id, position: inc.pos , icon: getIncidentIcon(inc.severity), __self: this, __source: {fileName: _jsxFileName, lineNumber: 367}}
                      , React.createElement(Popup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}
                        , React.createElement('div', { className: "p-2 w-48 font-sans"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}
                          , React.createElement('div', { className: "flex items-center gap-2 border-b pb-2 mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}
                            , React.createElement(AlertTriangle, { className: "h-4 w-4 text-destructive"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 371}} )
                            , React.createElement('span', { className: "font-bold text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}, inc.type)
                          )
                          , React.createElement('div', { className: "space-y-1 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}
                            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}, React.createElement('span', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}, "Severity:"), " " , inc.severity)
                            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}, React.createElement('span', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}, "Time:"), " " , inc.time)
                            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}, React.createElement('span', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}, "Status:"), " " , inc.status)
                          )
                          , React.createElement(Button, { variant: "outline", className: "w-full mt-3 text-[10px] h-7 border-destructive/20 text-destructive hover:bg-destructive hover:text-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}, "Dispatch Quick Response"  )
                        )
                      )
                    )
                  ))
                )
              )

              , React.createElement(LayersControl.Overlay, { checked: true, name: "Patrol Units" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}
                , React.createElement(LayerGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 388}}
                  , filteredPatrols.map(unit => (
                    React.createElement(Marker, { key: unit.id, position: unit.pos , icon: getPatrolIcon(unit.color), __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}
                      , React.createElement(Popup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}
                        , React.createElement('div', { className: "p-2 text-xs font-sans"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}
                          , React.createElement('p', { className: "font-bold border-b pb-1 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 393}}, unit.label)
                          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}, "STATUS: " , unit.status)
                        )
                      )
                    )
                  ))
                )
              )

              , React.createElement(LayersControl.Overlay, { checked: true, name: "Construction Projects" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}
                , React.createElement(LayerGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}
                  , filteredConstruction.map(site => (
                    React.createElement(Marker, { key: site.id, position: site.pos , icon: getConstructionIcon(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
                      , React.createElement(Popup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}
                        , React.createElement('div', { className: "p-2 w-52 font-sans"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}
                          , React.createElement('div', { className: "flex items-center gap-2 border-b pb-2 mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}
                            , React.createElement(Construction, { className: "h-4 w-4 text-orange-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}} )
                            , React.createElement('span', { className: "font-bold text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}, site.label)
                          )
                          , React.createElement('div', { className: "aspect-video bg-muted rounded overflow-hidden mb-2 relative group"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}
                            , React.createElement('img', { src: site.image, alt: site.label, className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}} )
                            , React.createElement('label', { className: "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}
                              , React.createElement(Upload, { className: "h-6 w-6 text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}} )
                              , React.createElement('input', { type: "file", className: "hidden", accept: "image/*", onChange: (e) => handleFileUpload(e, site.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}} )
                            )
                          )
                          , React.createElement('div', { className: "flex justify-between items-center text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}
                            , React.createElement('span', { className: "text-muted-foreground font-medium uppercase tracking-tighter"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}, "Progress")
                            , React.createElement('span', { className: "font-bold text-orange-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}, site.progress)
                          )
                          , React.createElement('div', { className: "w-full bg-muted h-1 rounded-full mt-1 overflow-hidden"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}
                            , React.createElement('div', { className: "bg-orange-500 h-full" , style: { width: site.progress }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}} )
                          )
                        )
                      )
                    )
                  ))
                )
              )

              , React.createElement(LayersControl.Overlay, { name: "Police Stations" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}
                , React.createElement(LayerGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}
                  , filteredStations.map(station => (
                    React.createElement(LayerGroup, { key: station.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}
                      , React.createElement(Marker, { position: station.pos , icon: getPoliceIcon(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}
                        , React.createElement(Popup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}
                          , React.createElement('div', { className: "p-2 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}
                            , React.createElement('p', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}, station.name)
                            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 441}}, "ACTIVE UNITS: "  , station.units)
                          )
                        )
                      )
                      , React.createElement(Circle, { center: station.pos , radius: station.radius, pathOptions: { color: 'rgba(30, 58, 138, 0.2)', dashArray: '5, 10' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 445}} )
                    )
                  ))
                )
              )

              , React.createElement(LayersControl.Overlay, { checked: true, name: "Traffic Density" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}
                , React.createElement(LayerGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}
                  , filteredTraffic.map(route => (
                    React.createElement(Polyline, {
                      key: route.id,
                      positions: route.path ,
                      pathOptions: {
                        color: route.level === 'High' ? '#ef4444' : '#2E7D32',
                        weight: 6,
                        opacity: 0.8
                      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 454}}

                      , React.createElement(Popup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 463}}
                        , React.createElement('div', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 464}}
                          , React.createElement('p', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 465}}, "Congestion: " , route.level)
                          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}, "Avg Speed: "  , route.speed)
                        )
                      )
                    )
                  ))
                )
              )

              , React.createElement(LayersControl.Overlay, { name: "Incident Hotspots" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}}
                , React.createElement(LayerGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}
                  , filteredHotspots.map(inc => (
                    React.createElement(Circle, {
                      key: `hotspot-${inc.id}`,
                      center: inc.pos ,
                      radius: inc.severity === 'High' ? 500 : 300,
                      pathOptions: {
                        color: inc.severity === 'High' ? '#ef4444' : '#f97316',
                        fillColor: inc.severity === 'High' ? '#ef4444' : '#f97316',
                        fillOpacity: 0.3,
                        weight: 2
                      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 477}}

                      , React.createElement(Popup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 488}}
                        , React.createElement('div', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 489}}
                          , React.createElement('p', { className: "font-bold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}, inc.type)
                          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 491}}, "Hotspot Radius: "  , inc.severity === 'High' ? '500m' : '300m')
                        )
                      )
                    )
                  ))
                )
              )
            )
          )

          , (() => {
              // Part A: split points out of the boundary GeoJSON — points are
              // rendered separately as status markers below, so passing them
              // into <GeoJSON> too was rendering every project TWICE.
              const boundaryOnlyData = {
                type: "FeatureCollection",
                features: (_optionalChain([geoData, 'optionalAccess', _b => _b.features]) || []).filter(
                  (f) => _optionalChain([f, 'optionalAccess', _b2 => _b2.geometry, 'optionalAccess', _b3 => _b3.type]) !== "Point"
                ),
              };

              const markerFeatures = Array.isArray(_optionalChain([geoData, 'optionalAccess', _11 => _11.features]))
                ? geoData.features.filter(
                    (f) =>
                      _optionalChain([f, 'optionalAccess', _12 => _12.properties, 'optionalAccess', _13 => _13.__marker]) &&
                      Array.isArray(_optionalChain([f, 'optionalAccess', _14 => _14.properties, 'optionalAccess', _15 => _15.__center]))
                  )
                : [];

              return React.createElement(LayersControl.Overlay, { checked: true, name: showGeoBoundary ? "Proposed Area Boundary" : "Project Locations" }
                , React.createElement(React.Fragment, null

                  , showGeoBoundary && boundaryOnlyData.features.length > 0 && React.createElement(GeoJSON, {
                      data: boundaryOnlyData,
                      style: (feature) => {
                        const status = _nullishCoalesce(_optionalChain([feature, 'optionalAccess', _3 => _3.properties, 'optionalAccess', _4 => _4.status]), () => ("pending"));
                        const cfg = _nullishCoalesce(PROJECT_STATUS_STYLE[status], () => (PROJECT_STATUS_STYLE.pending));
                        return { color: cfg.color, fillColor: cfg.fillColor, fillOpacity: 0.12, weight: 3 };
                      },
                      onEachFeature: (feature, layer) => {
                        const name = _optionalChain([feature, 'access', _5 => _5.properties, 'optionalAccess', _6 => _6.project_name]);
                        const status = _nullishCoalesce(_optionalChain([feature, 'optionalAccess', _7 => _7.properties, 'optionalAccess', _8 => _8.status]), () => ("pending"));
                        const statusLabel = status === "in_progress" ? "In Progress" : status === "in_delay" ? "Delayed" : "Pending";
                        if (name != null && name !== '') layer.bindPopup(`<b>${String(name)}</b><br/>${statusLabel}`);
                        const rawId = _optionalChain([feature, 'optionalAccess', _9 => _9.properties, 'optionalAccess', _10 => _10.id]);
                        const idNum = typeof rawId === "number" ? rawId : Number(rawId);
                        if (onProjectSelect && Number.isFinite(idNum)) {
                          layer.on("click", () => { onProjectSelect(idNum); });
                        }
                      },
                    })

                  /* Part B: cluster the per-project status markers instead of
                     rendering 1000+ raw Leaflet markers synchronously on mount. */
                  , markerFeatures.length > 0 && React.createElement(MarkerClusterGroup, { chunkedLoading: true, maxClusterRadius: 60 }
                    , markerFeatures.map((f, idx) => {
                        const center = f.properties.__center;
                        const status = _nullishCoalesce(_optionalChain([f, 'optionalAccess', _16 => _16.properties, 'optionalAccess', _17 => _17.status]), () => ("pending"));
                        const name = _nullishCoalesce(_optionalChain([f, 'optionalAccess', _18 => _18.properties, 'optionalAccess', _19 => _19.project_name]), () => ("Project"));
                        const rawId = _optionalChain([f, 'optionalAccess', _20 => _20.properties, 'optionalAccess', _21 => _21.id]);
                        const idNum = typeof rawId === "number" ? rawId : Number(rawId);
                        return React.createElement(Marker, {
                            key: `proj-center-${_nullishCoalesce(_optionalChain([f, 'optionalAccess', _22 => _22.properties, 'optionalAccess', _23 => _23.id]), () => (idx))}`,
                            position: center,
                            icon: projectMarkerVariant === "green" ? greenDotIconRef.current : getStatusIconCached(status),
                            eventHandlers: onProjectSelect && Number.isFinite(idNum) ? { click: () => onProjectSelect(idNum) } : undefined,
                          }
                          , React.createElement(Popup, null
                            , React.createElement('div', { className: "p-2 text-xs font-sans" }
                              , React.createElement('p', { className: "font-bold" }, String(name))
                              , React.createElement('p', { className: "text-muted-foreground" }, "Status:", " ",
                                  status === "in_progress" ? "In Progress" : status === "in_delay" ? "Delayed" : "Pending"
                                )
                            )
                          )
                        );
                      })
                    )
                )
              );
            })()
        )
      )

      /* Real-time Status Floating Bar */
      , showStats && (
        React.createElement('div', { className: "absolute bottom-6 left-6 right-6 z-[400] flex justify-between pointer-events-none"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 581}}
          , React.createElement('div', { className: "bg-primary text-white px-4 py-2 rounded-lg shadow-2xl border border-white/10 backdrop-blur pointer-events-auto flex items-center gap-4"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 582}}
            , React.createElement('div', { className: "flex items-center gap-2 border-r pr-4 border-white/20"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 583}}
              , React.createElement(Activity, { className: "h-4 w-4 text-secondary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 584}} )
              , React.createElement('span', { className: "text-xs font-bold uppercase tracking-widest"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 585}}, "Map Engine Live"  )
            )
            , React.createElement('div', { className: "flex gap-4 text-[10px] font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 587}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 588}}, "CAMS: 4,500" )
              , React.createElement('span', { className: "text-secondary font-bold tracking-widest"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 589}}, "ALERTS: 12" )
              , React.createElement('span', { className: "text-emerald-400 font-bold tracking-widest"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 590}}, "PATROLS: 86" )
              , React.createElement('span', { className: "text-orange-400 font-bold tracking-widest"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 591}}, "CONST: 8" )
            )
          )
        )
      )

      /* Floating Legend: when legendProjects is passed, show only project list from list-project API (no surveillance stats) */
      , showLegend && (
        React.createElement('div', { className: `absolute top-4 left-4 z-[400] transition-all duration-300 ${legendProjects !== undefined ? "w-64 max-h-[50vh]" : "w-52"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 599}}
          , React.createElement('div', { className: "bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-primary/10 overflow-hidden"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 600}}
            , React.createElement('div', {
              className: "bg-primary px-3 py-1.5 flex items-center justify-between border-b border-white/10 cursor-pointer"        ,
              onClick: () => setIsLegendCollapsed(!isLegendCollapsed), __self: this, __source: {fileName: _jsxFileName, lineNumber: 601}}

              , React.createElement('div', { className: "flex items-center gap-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 605}}
                , React.createElement(Info, { className: "h-3 w-3 text-secondary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 606}} )
                , React.createElement('span', { className: "text-[9px] font-bold uppercase tracking-widest text-white"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 607}}
                  , legendProjects !== undefined ? "Projects" : "Map Legend"
                )
              )
              , React.createElement('button', {
                className: "text-white/70 hover:text-white transition-colors"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 611}}

                , isLegendCollapsed ? React.createElement(ChevronUp, { className: "h-3 w-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}} ) : React.createElement(ChevronDown, { className: "h-3 w-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}} )
              )
            )
            , !isLegendCollapsed && (
              React.createElement('div', { className: "p-2.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 618}}
                , legendProjects !== undefined ? (
                  React.createElement('div', { className: "space-y-1.5 overflow-y-auto max-h-[40vh] pr-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 620}}
                    , (legendProjects.length === 0) ? (
                      React.createElement('p', { className: "text-[10px] text-muted-foreground italic"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}, "No projects from list."   )
                    ) : (
                      legendProjects.map((p) => (
                        React.createElement('div', { key: p.id, className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 625}}
                          , React.createElement('div', { className: "w-2 h-2 rounded-full bg-primary border border-white shadow-sm shrink-0"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 626}} )
                          , React.createElement('span', { className: "text-[10px] font-medium text-primary/90 leading-tight truncate"    , title: _nullishCoalesce(p.project_name, () => ( `#${p.id}`)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 627}}
                            , p.project_name || `Project #${p.id}`
                          )
                        )
                      ))
                    )
                    , geoData && showGeoBoundary && (
                      React.createElement('div', { className: "flex items-center gap-2 pt-1.5 mt-1.5 border-t border-primary/10"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 634}}
                        , React.createElement('div', { className: "w-2 h-2 rounded border border-primary bg-primary/20 shrink-0"      , style: { borderStyle: "dashed" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 635}} )
                        , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 636}}, "Proposed Area Boundary"  )
                      )
                    )
                  )
                ) : (
                  React.createElement(React.Fragment, null
                    , React.createElement('div', { className: "grid grid-cols-2 gap-x-4 gap-y-2 mb-2 pb-2 border-b border-primary/5"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 642}}
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}}
                        , React.createElement('div', { className: "w-2 h-2 rounded-full bg-emerald-600 border border-white shadow-sm shrink-0"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 644}})
                        , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 645}}, "Online Cam" )
                      )
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 647}}
                        , React.createElement('div', { className: "w-2 h-2 rounded-full bg-red-500 border border-white shadow-sm shrink-0"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 648}})
                        , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 649}}, "Offline Cam" )
                      )
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}
                        , React.createElement('div', { className: "w-2 h-2 rounded-full bg-destructive border border-white animate-pulse shadow-sm shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 652}})
                        , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}, "High Risk" )
                      )
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 655}}
                        , React.createElement('div', { className: "w-2 h-2 rounded-full bg-orange-600 border border-white shadow-sm shrink-0"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 656}})
                        , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 657}}, "Med Risk" )
                      )
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 659}}
                        , React.createElement('div', { className: "w-2 h-2 rounded-full bg-emerald-500 border border-white animate-pulse shadow-sm shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 660}})
                        , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 661}}, "Patrol")
                      )
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 663}}
                        , React.createElement('div', { className: "w-2 h-2 rounded bg-orange-500 border border-white shadow-sm shrink-0"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 664}})
                        , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 665}}, "Const Site" )
                      )
                    )
                    , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 668}}
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 669}}
                        , React.createElement('div', { className: "w-2 h-2 rounded bg-primary border border-white shadow-sm shrink-0"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 670}})
                        , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 671}}, "Police Station" )
                      )
                      , React.createElement('div', { className: "flex items-center justify-between gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 673}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 674}}
                          , React.createElement('div', { className: "w-5 h-0.5 bg-red-500 rounded-full"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 675}})
                          , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 676}}, "High Traffic" )
                        )
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}
                          , React.createElement('div', { className: "w-5 h-0.5 bg-emerald-500 rounded-full"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 679}})
                          , React.createElement('span', { className: "text-[9px] font-bold text-primary/80 leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 680}}, "Low Traffic" )
                        )
                      )
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