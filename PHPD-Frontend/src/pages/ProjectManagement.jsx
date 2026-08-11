import React from "react";
const _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderKanban, Plus, Upload, FileText, X, ChevronRight, ChevronLeft, CheckCircle2, Calendar, Eye, Pencil, ChevronDown, Building2, Wallet, Landmark, HandCoins, Percent, CalendarDays, MapPin, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  listProjects,
  getProjectById,
  listStakeholders,
  listDistricts,
  listTehsils,
  listProvinces,
  listDivisions,
  createProject,
  updateProject,
  deleteProject,
  listProjectActivities,
  getProjectDeleteInfo,
} from "@/api";

import { mediaUrl } from "@/api/config";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

/** Format stakeholder for display using API stakeholder_details (names) instead of IDs */
function formatProjectStakeholder(project) {
  const details = project.stakeholder_details;
  if (details && details.length > 0) {
    return details
      .map((d) =>
        d.stakeholder_title && d.stakeholder_type
          ? `${d.stakeholder_title} (${d.stakeholder_type})`
          : d.stakeholder_title || d.stakeholder_type || ""
      )
      .filter(Boolean)
      .join(", ") || fallbackStakeholderLabel(project);
  }
  return fallbackStakeholderLabel(project);
}
function fallbackStakeholderLabel(project) {
  const ids = Array.isArray(project.stakeholder) ? project.stakeholder : [project.stakeholder];
  if (ids.length > 0) return `Stakeholder #${ids.join(", #")}`;
  return "â€”";
}
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";










function getProjectAccent(projectId) {
  const accents = [
    {
      borderClass: "border-l-emerald-700",
      iconBgClass: "bg-emerald-50 dark:bg-emerald-950/35",
      iconClass: "text-emerald-800 dark:text-emerald-300",
    },
    {
      borderClass: "border-l-emerald-500",
      iconBgClass: "bg-emerald-50 dark:bg-emerald-950/35",
      iconClass: "text-emerald-700 dark:text-emerald-300",
    },
    {
      borderClass: "border-l-violet-500",
      iconBgClass: "bg-violet-50 dark:bg-violet-950/35",
      iconClass: "text-violet-700 dark:text-violet-300",
    },
    {
      borderClass: "border-l-amber-500",
      iconBgClass: "bg-amber-50 dark:bg-amber-950/35",
      iconClass: "text-amber-800 dark:text-amber-300",
    },
  ];
  const idx = Math.abs(projectId) % accents.length;
  return accents[idx];
}

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// ProjectAreaMap removed (boundary/map upload removed)

const XER_FILE_INPUT_ID = "xer-file-input-wizard";

/** Step 2: Primavera XER â€” opens the device file picker (same backend multipart field `xer_file`). */
function WizardXerUploadSection({
  editingProject,
  xerFile,
  onXerInputChange,
  onClearXer,
}




) {
  const openPicker = () => _optionalChain([document, 'access', _ => _.getElementById, 'call', _2 => _2(XER_FILE_INPUT_ID), 'optionalAccess', _3 => _3.click, 'call', _4 => _4()]);

  const existingXerHref =
  _optionalChain([editingProject, 'optionalAccess', _5 => _5.xer_file]) &&
  (editingProject.xer_file.startsWith("http")
    ? editingProject.xer_file
    : mediaUrl(editingProject.xer_file.startsWith("/") ? editingProject.xer_file : `/${editingProject.xer_file}`));

const existingXerDisplayName =
  _optionalChain([editingProject, 'optionalAccess', _6 => _6.xer_file_name]) ||
  _optionalChain([editingProject, 'optionalAccess', _7 => _7.xer_file]);

  const activityCount = editingProject?.activities?.length || 0;
  const hasImportedSchedule = activityCount > 0;

  return (
    React.createElement('div', { className: "space-y-3 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
        , React.createElement(Label, { htmlFor: XER_FILE_INPUT_ID, className: "text-base", __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}, "Primavera schedule (XER)"
            , editingProject ? "" : " *"
        )
        , React.createElement('p', { className: "text-xs text-muted-foreground mt-1 leading-relaxed"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}, "Export from Primavera P6, then use "
                , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 201}}, "Choose file" ), " or tap the area below. On phone or tablet this opens your Files / Downloads app so you can pick the "
                          , React.createElement('code', { className: "text-[11px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}, ".xer"), " from any folder. The server stores the file and builds the activity list for the Gantt chart."

        )
      )

      , editingProject && hasImportedSchedule && !xerFile && (
  React.createElement('div', { className: "rounded-lg border bg-muted/50 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3" }
    , React.createElement(FileText, { className: "h-8 w-8 text-muted-foreground shrink-0" })
    , React.createElement('div', { className: "flex-1 min-w-0 space-y-1" }
      , React.createElement('p', { className: "text-sm font-medium truncate" }, "Schedule imported")
      , React.createElement('p', { className: "text-xs text-muted-foreground" }, `${activityCount} activities loaded from a previously uploaded XER file`)
    )
  )
)

      , React.createElement('div', { className: "flex flex-col gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
        , React.createElement('div', {
          className: `relative rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-2 text-center px-4 py-8 sm:py-10 min-h-[10.5rem] touch-manipulation ${
            xerFile
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 active:bg-muted/40 cursor-pointer"
          }`,
          onClick: openPicker,
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          },
          role: "button",
          tabIndex: 0,
          'aria-label': "Select XER schedule file"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}

          , xerFile ? (
            React.createElement('div', { className: "flex flex-col sm:flex-row items-center gap-3 w-full max-w-full"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}
              , React.createElement(FileText, { className: "h-10 w-10 text-primary shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}} )
              , React.createElement('div', { className: "flex-1 min-w-0 text-left w-full"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
                , React.createElement('p', { className: "font-medium text-sm sm:text-base break-all"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}, xerFile.name)
                , React.createElement('p', { className: "text-xs text-muted-foreground mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}
                  , (xerFile.size / 1024).toFixed(2), " KB Â· ready to upload"
                )
              )
              , React.createElement(Button, {
                type: "button",
                variant: "ghost",
                size: "icon",
                className: "shrink-0 h-11 w-11"  ,
                onClick: (e) => {
                  e.stopPropagation();
                  onClearXer();
                },
                'aria-label': "Remove XER file"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}

                , React.createElement(X, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}} )
              )
            )
          ) : (
            React.createElement(React.Fragment, null
              , React.createElement(Upload, { className: "h-10 w-10 text-muted-foreground shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}} )
              , React.createElement('p', { className: "text-sm sm:text-base font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}, "Tap to choose from this device"     )
              , React.createElement('p', { className: "text-xs text-muted-foreground max-w-md"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}, ".xer only â€” same file is sent to the server on Create for schedule import."

              )
            )
          )
        )

        , React.createElement(Button, { type: "button", variant: "secondary", className: "w-full sm:w-auto min-h-11 px-6"   , onClick: openPicker, __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
          , React.createElement(FolderKanban, { className: "h-4 w-4 mr-2 shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}} ), "Choose fileâ€¦"

        )

        , React.createElement(Input, {
          id: XER_FILE_INPUT_ID,
          type: "file",
          accept: ".xer,.XER,application/octet-stream",
          onChange: onXerInputChange,
          className: "sr-only", __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
        )
      )
    )
  );
}

export default function ProjectManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProjectForView, setSelectedProjectForView] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { project, info } | null
  const [deleteInfoLoading, setDeleteInfoLoading] = useState(false);
  const [selectedProjectActivities, setSelectedProjectActivities] = useState([]);
  const [selectedProjectActivitiesLoading, setSelectedProjectActivitiesLoading] =
    useState(false);
  const [projectsPage, setProjectsPage] = useState(1);
  const [locationSearch, setLocationSearch] = useState("");

  const PROJECTS_PER_PAGE = 6;
  const { data: projectsData = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  // Sidebar deep-link support.
  // NOTE: wouter commonly tracks pathname only; query params may not trigger location updates.
  // We support BOTH:
  // - /project-management/create  (preferred)
  // - /project-management/view
  // - /project-management?mode=create (fallback)
  const deepLinkMode = useMemo(() => {
    try {
      const rawPath = String(location || "");
      // Prefer explicit path suffixes (works reliably with wouter)
      if (rawPath.startsWith("/project-management/create")) return "create";
      if (rawPath.startsWith("/project-management/view")) return "view";

      // Fallback: read from the actual browser URL search params
      const mode = (new URL(window.location.href).searchParams.get("mode") || "").toLowerCase();
      return mode === "create" || mode === "view" ? (mode ) : "";
    } catch (e2) {
      return "";
    }
  }, [location]);

  const prevDeepLinkModeRef = useRef("");
  useEffect(() => {
    const prev = prevDeepLinkModeRef.current;
    prevDeepLinkModeRef.current = deepLinkMode;

    if (deepLinkMode === "create") {
      // /project-management/create is rendered as a full page (no dialog needed).
      return;
    }
    if (deepLinkMode === "view") {
      // Only auto-close when we *navigate* from create -> view.
      if (prev === "create" && showAddProjectDialog) setShowAddProjectDialog(false);
    }
  }, [deepLinkMode, showAddProjectDialog, editingProject]);
  const { data: stakeholdersList = [] } = useQuery({
    queryKey: ["stakeholders"],
    queryFn: listStakeholders,
  });
  const { data: zonesList = [] } = useQuery({
    queryKey: ["zones"],
    queryFn: listProvinces,
  });

  const [selectedZoneId, setSelectedZoneId] = useState("");
  const zoneIdNum = selectedZoneId ? Number(selectedZoneId) : undefined;
  const { data: circlesList = [] } = useQuery({
    queryKey: ["circles", zoneIdNum],
    queryFn: () => listDivisions(zoneIdNum),
    enabled: !!zoneIdNum,
  });

  const [selectedCircleId, setSelectedCircleId] = useState("");
  const circleIdNum = selectedCircleId ? Number(selectedCircleId) : undefined;
  const { data: districtsList = [] } = useQuery({
    queryKey: ["districts", circleIdNum],
    queryFn: () => listDistricts(circleIdNum),
    enabled: !!circleIdNum,
  });

  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const districtIdNum = selectedDistrictId ? Number(selectedDistrictId) : undefined;
  const { data: tehsilsList = [] } = useQuery({
    queryKey: ["tehsils", districtIdNum],
    queryFn: () => listTehsils(districtIdNum),
    enabled: !!districtIdNum,
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: async (created) => {
      // Backend can populate ProjectActivity rows by parsing the uploaded XER.
      // Some setups do this lazily on the first "list activities" call, so we trigger it here.
      try {
        if (created?.id != null) await listProjectActivities(created.id);
      } catch {
        // Best-effort: project creation succeeded even if parsing failed.
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Success", description: "Project created successfully." });
      resetForm();
      setEditingProject(null);
      setShowAddProjectDialog(false);
    },
    onError: (e) => {
      toast({ title: "Error", description: e.message || "Failed to create project", variant: "destructive" });
    },
  });
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Success", description: "Project updated successfully." });
      resetForm();
      setEditingProject(null);
      setShowAddProjectDialog(false);
    },
    onError: (e) => {
      toast({ title: "Error", description: e.message || "Failed to update project", variant: "destructive" });
    },
  });
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Project Deleted", description: "Project has been deleted successfully." });
    },
    onError: (e) => {
      toast({ title: "Error", description: e.message || "Failed to delete project", variant: "destructive" });
    },
  });

  // Form state
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startingDate, setStartingDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [category, setCategory] = useState("");
  const [categoryOther, setCategoryOther] = useState("");
  const [latitudeCoordinates, setLatitudeCoordinates] = useState("");
  const [longitudeCoordinates, setLongitudeCoordinates] = useState("");
  const [stakeholderIds, setStakeholderIds] = useState([]);
  const [selectedTehsilId, setSelectedTehsilId] = useState("");
  const [zoneComboboxOpen, setZoneComboboxOpen] = useState(false);
  const [circleComboboxOpen, setCircleComboboxOpen] = useState(false);
  const [districtComboboxOpen, setDistrictComboboxOpen] = useState(false);
  const [tehsilComboboxOpen, setTehsilComboboxOpen] = useState(false);
  const [totalBudgetAllocated, setTotalBudgetAllocated] = useState("");
  const [budgetUtilized, setBudgetUtilized] = useState("");
  const [xerFile, setXerFile] = useState(null);
  // NOTE: Boundary/map uploads removed from frontend.
  /** When true, geography useEffects should not clear children (we're loading from project) */
  const skipGeographyClearRef = useRef(false);

  const remainingBudget = useMemo(() => {
    const tRaw = String(totalBudgetAllocated || "").trim();
    if (!tRaw) return "";
    const t = Number(tRaw);
    if (!Number.isFinite(t)) return "";
    const uRaw = String(budgetUtilized || "").trim();
    const u = uRaw ? Number(uRaw) : 0;
    if (!Number.isFinite(u)) return "";
    return String(Math.max(0, t - u));
  }, [totalBudgetAllocated, budgetUtilized]);



  useEffect(() => {
    if (skipGeographyClearRef.current) return;
    setSelectedCircleId("");
    setSelectedDistrictId("");
    setSelectedTehsilId("");
  }, [selectedZoneId]);

  useEffect(() => {
    if (skipGeographyClearRef.current) return;
    setSelectedDistrictId("");
    setSelectedTehsilId("");
  }, [selectedCircleId]);

  useEffect(() => {
    if (skipGeographyClearRef.current) return;
    setSelectedTehsilId("");
  }, [selectedDistrictId]);

  // When editing a project, keep cascading clear disabled until all prefilled IDs are applied.
  useEffect(() => {
    if (!skipGeographyClearRef.current) return;
    if (!editingProject) return;
    const allSet =
      selectedZoneId === String(editingProject.zone) &&
      selectedCircleId === String(editingProject.circle) &&
      selectedDistrictId === String(editingProject.district) &&
      selectedTehsilId === String(editingProject.tehsil);
    if (allSet) skipGeographyClearRef.current = false;
  }, [
    editingProject,
    selectedDistrictId,
    selectedTehsilId,
  ]);

  // Handle XER file upload
  const handleXERFileChange = (e) => {
    const file = _optionalChain([e, 'access', _6 => _6.target, 'access', _7 => _7.files, 'optionalAccess', _8 => _8[0]]);
    if (file) {
      if (!file.name.toLowerCase().endsWith(".xer")) {
        toast({
          title: "Invalid File",
          description: "Please select a valid .xer file",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
      setXerFile(file);
    }
    e.target.value = "";
  };

  // handleAreaFileChange removed

  // Reset form
  const resetForm = () => {
    setProjectName("");
    setCategory("");
    setCategoryOther("");
    setProjectDescription("");
    setStartingDate("");
    setReferenceNumber("");
    setLatitudeCoordinates("");
    setLongitudeCoordinates("");
    setSelectedZoneId("");
    setSelectedCircleId("");
    setStakeholderIds([]);
    setSelectedDistrictId("");
    setSelectedTehsilId("");
    setTotalBudgetAllocated("");
    setBudgetUtilized("");
    setXerFile(null);
    setCurrentStep(1);
  };

  // Open dialog for editing a project â€” prefetch division/district/tehsil so dropdowns show selected values
  const openEditDialog = async (project) => {
    // Always refetch the full project payload for prefill (includes financials + geom).
    // If fetch fails (auth/network), still open the wizard using the card payload.
    let p = project;
    try {
      const full = await getProjectById(project.id);
      if (full) p = full ;
    } catch (e3) {
      // best-effort; continue with provided card project
    }
    skipGeographyClearRef.current = true;
    await Promise.all([
      queryClient.prefetchQuery({ queryKey: ["zones"], queryFn: listProvinces }),
      queryClient.prefetchQuery({ queryKey: ["circles", p.zone], queryFn: () => listDivisions(p.zone) }),
      queryClient.prefetchQuery({ queryKey: ["districts", p.circle], queryFn: () => listDistricts(p.circle) }),
      queryClient.prefetchQuery({ queryKey: ["tehsils", p.district], queryFn: () => listTehsils(p.district) }),
    ]);
    setEditingProject(p);
    setProjectName(_nullishCoalesce(p.project_name, () => ( "")));
    setCategory(_nullishCoalesce(p.project_category, () => ( "")));
    setCategoryOther(_nullishCoalesce(p.project_category_other, () => ( "")));
    setProjectDescription(_nullishCoalesce(p.project_description, () => ( "")));
    setStartingDate(p.project_starting_date ? p.project_starting_date.slice(0, 10) : "");
    setReferenceNumber(_nullishCoalesce(p.project_reference_no, () => ( "")));
    setLatitudeCoordinates(
      String(
        _nullishCoalesce(p.latitude, () => (
          _nullishCoalesce(p.latitude_coordinates, () => ( ""))
        ))
      )
    );
    setLongitudeCoordinates(
      String(
        _nullishCoalesce(p.longitude, () => (
          _nullishCoalesce(p.longitude_coordinates, () => ( ""))
        ))
      )
    );
    setSelectedZoneId(String(p.zone));
    setSelectedCircleId(p.circle != null ? String(p.circle) : "");
    // selectedCircleId removed as it's not in the Project model
    setStakeholderIds(
      Array.isArray(p.stakeholder)
        ? p.stakeholder.map(String)
        : p.stakeholder != null
          ? [String(p.stakeholder)]
          : []
    );
    setSelectedDistrictId(String(p.district));
    setSelectedTehsilId(String(p.tehsil));
    setTotalBudgetAllocated(
      _nullishCoalesce(p.total_budget, () => (
        _nullishCoalesce(p.total_budget_allocated, () => ( ""))
      ))
    );
    setBudgetUtilized(
      _nullishCoalesce(p.total_consume, () => (
        _nullishCoalesce(p.budget_utilized, () => ( ""))
      ))
    );

    setXerFile(null);
    setCurrentStep(1);
    setShowAddProjectDialog(true);
  };

  // Validate step 1
  const validateStep1 = () => {
    // Frontend validation intentionally disabled (temporary).
    return true;
  };

  // Validate step 2 (schedule + boundary â€” backend consumes both on create)
  const validateStep2 = () => {
    if (editingProject) return true;
    if (!xerFile) {
      toast({
        title: "XER file required",
        description: "Upload a Primavera P6 .xer file so the schedule can be stored and activities imported.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep === 2) setCurrentStep(1);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      handleNext();
      return;
    }
    if (currentStep === 2) {
      if (!validateStep2()) return;

      const totalBudget = totalBudgetAllocated.trim() ? Number(totalBudgetAllocated) : 0;
      const utilized = budgetUtilized.trim() ? Number(budgetUtilized) : 0;
      const variance = totalBudget - utilized;
      const remaining = Math.max(0, totalBudget - utilized);

      if (editingProject) {
        updateProjectMutation.mutate({
          id: editingProject.id,
          payload: {
            stakeholder: stakeholderIds.map(Number),
            project_name: projectName.trim() || null,
            project_category: category === "Other" ? "Other" : (category.trim() || null),
            project_category_other: category === "Other" ? categoryOther.trim() : null,
            project_description: projectDescription.trim() || null,
            project_starting_date: startingDate || null,
            project_reference_no: referenceNumber.trim() || null,
            latitude: latitudeCoordinates.trim() || null,
            longitude: longitudeCoordinates.trim() || null,
            zone: selectedZoneId ? Number(selectedZoneId) : null,
            circle: selectedCircleId ? Number(selectedCircleId) : null,
            district: selectedDistrictId ? Number(selectedDistrictId) : null,
            tehsil: selectedTehsilId ? Number(selectedTehsilId) : null,
            total_budget: totalBudgetAllocated.trim() || null,
            total_consume: budgetUtilized.trim() || null,
            remaining_budget: String(remaining),
          },
        });
      } else {
        createProjectMutation.mutate({
          stakeholder: stakeholderIds.map(Number),
          project_name: projectName.trim() || null,
          project_category: category === "Other" ? "Other" : (category.trim() || null),
          project_category_other: category === "Other" ? categoryOther.trim() : null,
          project_description: projectDescription.trim() || null,
          project_starting_date: startingDate || null,
          project_reference_no: referenceNumber.trim() || null,
          latitude: latitudeCoordinates.trim() || null,
          longitude: longitudeCoordinates.trim() || null,
          zone: selectedZoneId ? Number(selectedZoneId) : null,
          district: selectedDistrictId ? Number(selectedDistrictId) : null,
          tehsil: selectedTehsilId ? Number(selectedTehsilId) : null,
          total_budget: totalBudgetAllocated.trim() || null,
          total_consume: budgetUtilized.trim() || null,
          remaining_budget: String(remaining),
          xer_file: _nullishCoalesce(xerFile, () => ( undefined)),
        });
      }
    }
  };

const handleDeleteProject = async (id) => {
  const project = projectsData.find((p) => p.id === id);
  setDeleteInfoLoading(true);
  let info = null;
  try {
    info = await getProjectDeleteInfo(id);
  } catch {
    // best-effort; dialog still opens, just without the breakdown
  }
  setDeleteInfoLoading(false);
  setDeleteTarget({ project, info });
};

const confirmDeleteProject = () => {
  if (!deleteTarget) return;
  const id = deleteTarget.project.id;
  deleteProjectMutation.mutate(id);
  setSelectedProjectForView((prev) => (prev?.id === id ? null : prev));
  setDeleteTarget(null);
};
  const filteredProjects = useMemo(() => {
    const query = locationSearch.trim().toLowerCase();

    const filtered = projectsData.filter((project) => {
      const zoneText = (_nullishCoalesce(project.zone_name, () => ( String(_nullishCoalesce(project.zone, () => ( "")))))).toLowerCase();
      const circleText = (_nullishCoalesce(project.circle_name, () => ( String(_nullishCoalesce(project.circle, () => ( "")))))).toLowerCase();
      const districtText = (_nullishCoalesce(project.district_name, () => ( String(_nullishCoalesce(project.district, () => ( "")))))).toLowerCase();
      const tehsilText = (_nullishCoalesce(project.tehsil_name, () => ( String(_nullishCoalesce(project.tehsil, () => ( "")))))).toLowerCase();

      if (!query) return true;
      return (
        zoneText.includes(query) ||
        circleText.includes(query) ||
        districtText.includes(query) ||
        tehsilText.includes(query)
      );
    });
    
    const asTime = (value) => {
      if (typeof value !== "string") return Number.NaN;
      const t = new Date(value).getTime();
      return Number.isFinite(t) ? t : Number.NaN;
    };

    // Show most recently created projects first.
    // If created_at is missing/invalid, fall back to id (higher id = newer).
    return filtered.slice().sort((a, b) => {
      const ta = asTime((a ).created_at);
      const tb = asTime((b ).created_at);
      if (Number.isFinite(ta) && Number.isFinite(tb)) return tb - ta;
      if (Number.isFinite(tb)) return 1;
      if (Number.isFinite(ta)) return -1;
      return (_nullishCoalesce(b.id, () => ( 0))) - (_nullishCoalesce(a.id, () => ( 0)));
    });
  }, [projectsData, locationSearch]);

  // When a project is opened in "View" panel, load its activities list.
  // Backend may parse XER lazily inside list-project-activity, so this doubles as a trigger.
  useEffect(() => {
    let cancelled = false;
    async function run() {
      const pid = selectedProjectForView?.id;
      if (!pid) {
        setSelectedProjectActivities([]);
        return;
      }
      setSelectedProjectActivitiesLoading(true);
      try {
        const acts = await listProjectActivities(pid);
        if (!cancelled) setSelectedProjectActivities(Array.isArray(acts) ? acts : []);
      } catch {
        if (!cancelled) setSelectedProjectActivities([]);
      } finally {
        if (!cancelled) setSelectedProjectActivitiesLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedProjectForView]);

  const totalProjectsPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (projectsPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(start, start + PROJECTS_PER_PAGE);
  }, [filteredProjects, projectsPage, PROJECTS_PER_PAGE]);

  useEffect(() => {
    if (projectsPage > totalProjectsPages && totalProjectsPages > 0) {
      setProjectsPage(totalProjectsPages);
    }
  }, [projectsPage, totalProjectsPages]);

  useEffect(() => {
    setProjectsPage(1);
  }, [locationSearch]);

  const isCreatePath =
    typeof window !== "undefined" &&
    _optionalChain([window, 'access', _16 => _16.location, 'optionalAccess', _17 => _17.pathname]) === "/project-management/create";
  const isViewPath =
    typeof window !== "undefined" &&
    _optionalChain([window, 'access', _18 => _18.location, 'optionalAccess', _19 => _19.pathname]) === "/project-management/view";
  const dialogOpen = showAddProjectDialog;

  // Full-page create flow: keep all existing API/mutation/state logic intact,
  // but render the exact same wizard as a normal page (not a dialog/overlay).
  if (isCreatePath) {
    return (
      React.createElement(Layout, { title: "Create New Project"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1058}}
        , React.createElement('div', { className: "flex flex-col min-h-[calc(100vh-8rem)] w-full min-w-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1059}}
          , React.createElement('div', { className: "max-w-5xl mx-auto w-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1060}}
            , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1061}}
              , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1062}}
                , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1063}}, editingProject ? "Update Project" : "Add New Project")
                , React.createElement(CardDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1064}}
                  , editingProject
                    ? "Edit the project details below. Leave file fields unchanged unless you want to replace them."
                    : "Fill in the project details and upload required files"
                )
              )
              , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1070}}
                /* Reuse the same wizard (step indicator + all 3 steps + footer) */
                /* Step Indicator */
                , React.createElement('div', { className: "flex flex-col items-center justify-center mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1073}}
                  , React.createElement('div', { className: "flex items-center gap-3 w-fit"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1074}}
                    /* Step 1 */
                    , React.createElement('div', { className: "flex flex-col items-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1076}}
                      , React.createElement('div', { className: `flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                        currentStep >= 1 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground bg-background"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1077}}
                        , currentStep > 1 ? (
                          React.createElement(CheckCircle2, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1081}} )
                        ) : (
                          React.createElement('span', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1083}}, "1")
                        )
                      )
                      , React.createElement('p', { className: `text-xs font-medium mt-2 ${currentStep === 1 ? "text-primary" : "text-muted-foreground"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1086}}, "Project Details"

                      )
                    )

                    , React.createElement('div', { className: "relative w-24 h-1 bg-muted rounded-full overflow-hidden mt-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1091}}
                      , currentStep >= 2 && (
                        React.createElement(React.Fragment, null
                          , React.createElement('div', { className: "absolute inset-0 bg-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1094}} )
                          , React.createElement('div', {
                            className: "absolute inset-0" ,
                            style: {
                              background: "linear-gradient(90deg, transparent 30%, #ef4444 50%, transparent 70%)",
                              backgroundSize: "200% 100%",
                              animation: "shimmer 1.5s linear infinite",
                            }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1095}}
                          )
                        )
                      )
                    )

                    /* Step 2 */
                    , React.createElement('div', { className: "flex flex-col items-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1108}}
                      , React.createElement('div', { className: `flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                        currentStep >= 2 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground bg-background"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1109}}
                        , currentStep > 2 ? React.createElement(CheckCircle2, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1112}} ) : React.createElement('span', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1112}}, "2")
                      )
                      , React.createElement('p', { className: `text-xs font-medium mt-2 text-center max-w-[5.5rem] leading-tight ${currentStep === 2 ? "text-primary" : "text-muted-foreground"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1114}}, "XER"

                      )
                    )

                    /* Step 3 removed */
                  )
                )

                , React.createElement('style', {
                  dangerouslySetInnerHTML: {
                    __html: `
                      @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                      }
                    `,
                  }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1153}}
                )

                /* Full wizard form (same handlers/mutations as modal) */
                , React.createElement('div', { className: "rounded-xl border-2 border-green-600 p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1165}}
                  , React.createElement('form', { onSubmit: handleSubmit, className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1165}}
                  /* Step 1: Project Details */
                  , currentStep === 1 && (
                    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1168}}
                      , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1169}}
                        , React.createElement(Label, { htmlFor: "projectName", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1170}}, "Project Name *"  )
                        , React.createElement(Input, {
                          id: "projectName",
                          placeholder: "Enter project name"  ,
                          value: projectName,
                          onChange: (e) => setProjectName(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1171}}
                        )
                      )
                      , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1177}}
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1178}}
                          , React.createElement(Label, { htmlFor: "category", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1179}}, "Category" )
                          , React.createElement(Select, { value: category || "", onValueChange: setCategory, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1180}}
                            , React.createElement(SelectTrigger, { id: "category", className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1181}}
                              , React.createElement(SelectValue, { placeholder: "Select category", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1182}} )
                            )
                            , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1184}}
                              , React.createElement(SelectItem, { value: "Basic Health Unit", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1185}}, "Basic Health Unit" )
                              , React.createElement(SelectItem, { value: "Dispensary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1186}}, "Dispensary" )
                              , React.createElement(SelectItem, { value: "Dispilated", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1187}}, "Dispilated" )
                              , React.createElement(SelectItem, { value: "Other", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1188}}, "Other" )
                            )
                          )
                        )
                        , category === "Other" && (
                          React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1191}}
                            , React.createElement(Label, { htmlFor: "categoryOther", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1192}}, "Please specify category"  )
                            , React.createElement(Input, {
                              id: "categoryOther",
                              placeholder: "Enter category name"  ,
                              value: categoryOther,
                              onChange: (e) => setCategoryOther(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1193}}
                            )
                          )
                        )
                      )
                      , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1178}}
                        , React.createElement(Label, { htmlFor: "projectDescription", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1179}}, "Project Description *"  )
                        , React.createElement(Textarea, {
                          id: "projectDescription",
                          placeholder: "Enter project description..."  ,
                          value: projectDescription,
                          onChange: (e) => setProjectDescription(e.target.value),
                          rows: 4, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1180}}
                        )
                      )
                      , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1188}}
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1189}}
                          , React.createElement(Label, { htmlFor: "startingDate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1190}}, "Project Starting Date *"   )
                          , React.createElement(Input, {
                            id: "startingDate",
                            type: "date",
                            value: startingDate,
                            onChange: (e) => setStartingDate(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1191}}
                          )
                        )
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1198}}
                          , React.createElement(Label, { htmlFor: "referenceNumber", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1199}}, "Project Reference No *"   )
                          , React.createElement(Input, {
                            id: "referenceNumber",
                            placeholder: "Enter reference number"  ,
                            value: referenceNumber,
                            onChange: (e) => setReferenceNumber(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1200}}
                          )
                        )
                      )
                      , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1207}}
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1208}}
                          , React.createElement(Label, { htmlFor: "totalBudgetAllocated", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1209}}, "Total Budget" )
                          , React.createElement(Input, {
                            id: "totalBudgetAllocated",
                            type: "number",
                            min: 0,
                            step: "any",
                            placeholder: "e.g. 1000000",
                            value: totalBudgetAllocated,
                            onChange: (e) => setTotalBudgetAllocated(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1210}}
                          )
                        )
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1217}}
                          , React.createElement(Label, { htmlFor: "budgetUtilized", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1218}}, "Total Consume" )
                          , React.createElement(Input, {
                            id: "budgetUtilized",
                            type: "number",
                            min: 0,
                            step: "any",
                            placeholder: "e.g. 250000",
                            value: budgetUtilized,
                            onChange: (e) => setBudgetUtilized(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1219}}
                          )
                        )
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1226}}
                          , React.createElement(Label, { htmlFor: "remainingBudget", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1227}}, "Remaining Budget" )
                          , React.createElement(Input, {
                            id: "remainingBudget",
                            type: "number",
                            value: remainingBudget,
                            disabled: true,
                            readOnly: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1228}}
                          )
                        )
                      )
                      , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1208}}
                        , React.createElement(Label, { htmlFor: "stakeholderIds", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1209}}, "Stakeholder(s) *" )
                        , React.createElement(Popover, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1210}}
                          , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1211}}
                            , React.createElement(Button, {
                              id: "stakeholderIds",
                              variant: "outline",
                              className: "w-full justify-between" ,
                              type: "button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1212}}

                              , stakeholderIds.length > 0
                                ? `${stakeholderIds.length} stakeholder(s) selected`
                                : "Select stakeholders"
                              , React.createElement(ChevronDown, { className: "h-4 w-4 opacity-50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1221}} )
                            )
                          )
                          , React.createElement(PopoverContent, { className: "p-0 w-[var(--radix-popover-trigger-width)]" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1224}}
                            , React.createElement(Command, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1225}}
                              , React.createElement(CommandInput, { placeholder: "Search stakeholders..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1226}} )
                              , React.createElement(CommandList, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1227}}
                                , React.createElement(CommandEmpty, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1228}}, "No stakeholders found."  )
                                , React.createElement(CommandGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1229}}
                                  , stakeholdersList.map((s) => {
                                    const id = String(s.id);
                                    const selected = stakeholderIds.includes(id);
                                    return (
                                      React.createElement(CommandItem, {
                                        key: id,
                                        onSelect: () => {
                                          setStakeholderIds((prev) =>
                                            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                                          );
                                        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1234}}

                                        , React.createElement(Checkbox, { checked: selected, className: "mr-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1242}} )
                                        , s.stakeholder_title, " (" , s.stakeholder_type, ")"
                                      )
                                    );
                                  })
                                )
                              )
                            )
                          )
                        )
                      )

                      , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1252}}
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1253}}
                          , React.createElement(Label, { htmlFor: "zone", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1254}}, "Zone *" )
                          , React.createElement(Popover, { open: zoneComboboxOpen, onOpenChange: setZoneComboboxOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1255}}
                            , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1256}}
                              , React.createElement(Button, {
                                id: "zone",
                                variant: "outline",
                                role: "combobox",
                                'aria-expanded': zoneComboboxOpen,
                                className: "w-full justify-between font-normal h-9 px-3 text-sm"     ,
                                type: "button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1257}}

                                , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1266}}
                                  , selectedZoneId
                                    ? (_nullishCoalesce(_optionalChain([zonesList, 'access', _Z => _Z.find, 'call', _Z2 => _Z2((z) => String(z.id) === selectedZoneId), 'optionalAccess', _Z3 => _Z3.zone_name]), () => (
                                      "Select zone")))
                                    : "Select zone"
                                )
                                , React.createElement(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1274}} )
                              )
                            )
                            , React.createElement(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1277}}
                              , React.createElement(Command, {
                                filter: (value, search) => {
                                  const q = (search || "").toLowerCase();
                                  if (!q) return 1;
                                  return (value || "").toLowerCase().includes(q) ? 1 : 0;
                                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1278}}

                                , React.createElement(CommandInput, { placeholder: "Type to search zoneâ€¦"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1285}} )
                                , React.createElement(CommandList, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1286}}
                                  , React.createElement(CommandEmpty, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1287}}, "No zone found."  )
                                  , React.createElement(CommandGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1288}}
                                    , zonesList.map((z) => (
                                      React.createElement(CommandItem, {
                                        key: z.id,
                                        value: z.zone_name,
                                        onSelect: () => {
                                          skipGeographyClearRef.current = false;
                                          setSelectedZoneId(String(z.id));
                                          setZoneComboboxOpen(false);
                                        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1290}}

                                        , z.zone_name
                                      )
                                    ))
                                  )
                                )
                              )
                            )
                          )
                        )
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1308}}
                          , React.createElement(Label, { htmlFor: "circle", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1309}}, "Circle *" )
                          , React.createElement(Popover, { open: circleComboboxOpen, onOpenChange: setCircleComboboxOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1310}}
                            , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1311}}
                              , React.createElement(Button, {
                                id: "circle",
                                variant: "outline",
                                role: "combobox",
                                'aria-expanded': circleComboboxOpen,
                                disabled: !selectedZoneId,
                                className: "w-full justify-between font-normal h-9 px-3 text-sm"     ,
                                type: "button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1312}}

                                , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1321}}
                                  , selectedCircleId
                                    ? (_nullishCoalesce(_optionalChain([circlesList, 'access', _C => _C.find, 'call', _C2 => _C2((c) => String(c.id) === selectedCircleId), 'optionalAccess', _C3 => _C3.circle_name]), () => (
                                      "Select circle")))
                                    : selectedZoneId
                                      ? "Select circle"
                                      : "Select zone first"
                                )
                                , React.createElement(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1329}} )
                              )
                            )
                            , React.createElement(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1332}}
                              , React.createElement(Command, {
                                filter: (value, search) => {
                                  const q = (search || "").toLowerCase();
                                  if (!q) return 1;
                                  return (value || "").toLowerCase().includes(q) ? 1 : 0;
                                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1333}}

                                , React.createElement(CommandInput, { placeholder: "Type to search circleâ€¦"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1340}} )
                                , React.createElement(CommandList, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1341}}
                                  , React.createElement(CommandEmpty, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1342}}, "No circle found."  )
                                  , React.createElement(CommandGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1343}}
                                    , circlesList.map((c) => (
                                      React.createElement(CommandItem, {
                                        key: c.id,
                                        value: c.circle_name,
                                        onSelect: () => {
                                          skipGeographyClearRef.current = false;
                                          setSelectedCircleId(String(c.id));
                                          setCircleComboboxOpen(false);
                                        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1345}}

                                        , c.circle_name
                                      )
                                    ))
                                  )
                                )
                              )
                            )
                          )
                        )
                      )

                      /* District / Tehsil (Area Management) */
                      , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1255}}

                        /* District â€” searchable */
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1368}}
                          , React.createElement(Label, { htmlFor: "district", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1369}}, "District *" )
                          , React.createElement(Popover, { open: districtComboboxOpen, onOpenChange: setDistrictComboboxOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1370}}
                            , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1371}}
                              , React.createElement(Button, {
                                id: "district",
                                variant: "outline",
                                role: "combobox",
                                'aria-expanded': districtComboboxOpen,
                                className: "w-full justify-between font-normal h-9 px-3 text-sm"     ,
                                type: "button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1372}}

                                , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1381}}
                                  , selectedDistrictId
                                    ? (_nullishCoalesce(_optionalChain([districtsList, 'access', _26 => _26.find, 'call', _27 => _27((d) => String(d.id) === selectedDistrictId), 'optionalAccess', _28 => _28.district_name]), () => (
                                      "Select district")))
                                    : "Select district"
                                )
                                , React.createElement(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1389}} )
                              )
                            )
                            , React.createElement(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1392}}
                              , React.createElement(Command, {
                                filter: (value, search) => {
                                  const q = (search || "").toLowerCase();
                                  if (!q) return 1;
                                  return (value || "").toLowerCase().includes(q) ? 1 : 0;
                                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1393}}

                                , React.createElement(CommandInput, { placeholder: "Type to search districtâ€¦"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1400}} )
                                , React.createElement(CommandList, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1401}}
                                  , React.createElement(CommandEmpty, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1402}}, "No district found."  )
                                  , React.createElement(CommandGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1403}}
                                    , districtsList.map((d) => (
                                      React.createElement(CommandItem, {
                                        key: d.id,
                                        value: d.district_name,
                                        onSelect: () => {
                                          skipGeographyClearRef.current = false;
                                          setSelectedDistrictId(String(d.id));
                                          setDistrictComboboxOpen(false);
                                        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1405}}

                                        , d.district_name
                                      )
                                    ))
                                  )
                                )
                              )
                            )
                          )
                        )

                        /* Tehsil â€” searchable */
                        , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1425}}
                          , React.createElement(Label, { htmlFor: "tehsil", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1426}}, "Tehsil *" )
                          , React.createElement(Popover, { open: tehsilComboboxOpen, onOpenChange: setTehsilComboboxOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1427}}
                            , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1428}}
                              , React.createElement(Button, {
                                id: "tehsil",
                                variant: "outline",
                                role: "combobox",
                                'aria-expanded': tehsilComboboxOpen,
                                disabled: !selectedDistrictId,
                                className: "w-full justify-between font-normal h-9 px-3 text-sm"     ,
                                type: "button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1429}}

                                , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1438}}
                                  , selectedTehsilId
                                    ? (_nullishCoalesce(_optionalChain([tehsilsList, 'access', _29 => _29.find, 'call', _30 => _30((t) => String(t.id) === selectedTehsilId), 'optionalAccess', _31 => _31.tehsil_name]), () => (
                                      "Select tehsil")))
                                    : selectedDistrictId
                                      ? "Select tehsil"
                                      : "Select district first"
                                )
                                , React.createElement(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1446}} )
                              )
                            )
                            , React.createElement(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1449}}
                              , React.createElement(Command, {
                                filter: (value, search) => {
                                  const q = (search || "").toLowerCase();
                                  if (!q) return 1;
                                  return (value || "").toLowerCase().includes(q) ? 1 : 0;
                                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1450}}

                                , React.createElement(CommandInput, { placeholder: "Type to search tehsilâ€¦"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1457}} )
                                , React.createElement(CommandList, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1458}}
                                  , React.createElement(CommandEmpty, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1459}}, "No tehsil found."  )
                                  , React.createElement(CommandGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1460}}
                                    , tehsilsList.map((t) => (
                                      React.createElement(CommandItem, {
                                        key: t.id,
                                        value: t.tehsil_name,
                                        onSelect: () => {
                                          skipGeographyClearRef.current = false;
                                          setSelectedTehsilId(String(t.id));
                                          setTehsilComboboxOpen(false);
                                        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1462}}

                                        , t.tehsil_name
                                      )
                                    ))
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )

                , currentStep === 1 && (
                  React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1481}}
                    , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1482}}
                      , React.createElement(Label, { htmlFor: "latitudeCoordinates", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1483}}, "Latitude Coordinates" )
                      , React.createElement(Input, {
                        id: "latitudeCoordinates",
                        type: "number",
                        step: "any",
                        placeholder: "e.g. 31.5204",
                        value: latitudeCoordinates,
                        onChange: (e) => setLatitudeCoordinates(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1484}}
                      )
                    )
                    , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1493}}
                      , React.createElement(Label, { htmlFor: "longitudeCoordinates", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1494}}, "Longitude Coordinates" )
                      , React.createElement(Input, {
                        id: "longitudeCoordinates",
                        type: "number",
                        step: "any",
                        placeholder: "e.g. 74.3587",
                        value: longitudeCoordinates,
                        onChange: (e) => setLongitudeCoordinates(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1495}}
                      )
                    )
                  )
                )

                  /* Step 2: Schedule (XER) */
                  , currentStep === 2 && (
                    React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1486}}
                      , React.createElement(WizardXerUploadSection, {
                        editingProject: editingProject,
                        xerFile: xerFile,
                        onXerInputChange: handleXERFileChange,
                        onClearXer: () => setXerFile(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1520}}
                      )
                    )
                  )

                  /* Step 3 removed */

                  , React.createElement(DialogFooter, { className: "flex flex-col gap-2 sm:flex-row sm:gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1741}}
                    , React.createElement(Button, {
                      type: "button",
                      variant: "outline",
                      onClick: () => {
                        setEditingProject(null);
                        resetForm();
                        setLocation("/project-management/view");
                      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1742}}
, "Cancel"

                    )
                    , currentStep === 1 && (
                      React.createElement(Button, { type: "button", onClick: handleNext, className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1754}}, "Next"

                        , React.createElement(ChevronRight, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1756}} )
                      )
                    )
                    , currentStep === 2 && (
                      React.createElement(React.Fragment, null
                        , React.createElement(Button, { type: "button", variant: "outline", onClick: handlePrevious, className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1761}}
                          , React.createElement(ChevronLeft, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1762}} ), "Previous"

                        )
                        , React.createElement(Button, { type: "submit", disabled: updateProjectMutation.isPending, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1765}}
                          , editingProject ? "Update Project" : "Create Project"
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

  return (
    React.createElement(Layout, { title: "Project Management" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1793}}
      , React.createElement('div', { className: "flex flex-col min-h-[calc(100vh-8rem)] w-full min-w-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1794}}
        , !isCreatePath && (
        React.createElement(React.Fragment, null
        /* Header with search and Add Project button */
        , React.createElement('div', { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 mb-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1798}}
          , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1799}}
            , React.createElement('h1', { className: "text-xl sm:text-3xl font-bold tracking-tight leading-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1800}}, "Added Projects"

            )
            , React.createElement('p', { className: "text-muted-foreground mt-1 text-sm sm:text-base"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1803}}
              , !projectsLoading && projectsData.length > 0
                ? filteredProjects.length !== projectsData.length
                  ? `${filteredProjects.length} of ${projectsData.length} projects`
                  : `${projectsData.length} project${projectsData.length !== 1 ? "s" : ""}`
                : "Manage and view project details below"
            )
          )
          , React.createElement('div', { className: "flex flex-row items-center gap-2 w-full sm:w-auto"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1811}}
            , !projectsLoading && projectsData.length > 0 && (
              React.createElement('div', { className: "flex-1 min-w-0 sm:w-[280px] sm:flex-none md:w-[320px]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1813}}
                , React.createElement(Input, {
                  value: locationSearch,
                  onChange: (e) => setLocationSearch(e.target.value),
                  placeholder: "Search division, district, or tehsil"    ,
                  className: "h-9", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1814}}
                )
              )
            )
            , !isViewPath && (
              React.createElement(Button, {
                onClick: () => {
                  setEditingProject(null);
                  resetForm();
                  setShowAddProjectDialog(true);
                },
                className: "gap-2 shrink-0 px-3 sm:px-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1823}}

                , React.createElement(Plus, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1831}} )
                , React.createElement('span', { className: "hidden sm:inline" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1832}}, "Add New Project"  )
                , React.createElement('span', { className: "sm:hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1833}}, "Add")
              )
            )
          )
        )

        /* Projects Grid */
        , projectsLoading ? (
          React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1841}}
            , React.createElement(CardContent, { className: "flex flex-col items-center justify-center py-16"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1842}}
              , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1843}}, "Loading projectsâ€¦" )
            )
          )
        ) : filteredProjects.length === 0 ? (
          React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1847}}
            , React.createElement(CardContent, { className: "flex flex-col items-center justify-center py-16"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1848}}
              , React.createElement(FolderKanban, { className: "h-16 w-16 text-muted-foreground mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1849}} )
              , React.createElement('h3', { className: "text-lg font-semibold mb-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1850}}, "No matching projects"  )
              , React.createElement('p', { className: "text-sm text-muted-foreground mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1851}}, "Try changing division, district, or tehsil search text"       )
            )
          )
        ) : (
          React.createElement('div', { className: "flex-1 flex flex-col min-h-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1855}}
          , React.createElement('div', { className: "grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1856}}
            , paginatedProjects.map((project) => {
              const isSelected = _optionalChain([selectedProjectForView, 'optionalAccess', _40 => _40.id]) === project.id;
              const accent = getProjectAccent(project.id);
              return (
                React.createElement(Card, {
                  key: project.id,
                  className: `rounded-xl border border-border/80 bg-gradient-to-b from-card to-muted/15 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden border-l-4 ${accent.borderClass} ${
                    isSelected
                      ? "ring-2 ring-primary shadow-md"
                      : "hover:border-primary/30"
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1861}}

                  , React.createElement(CardHeader, { className: "pb-3 pt-4 px-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1869}}
                    , React.createElement('div', { className: "flex items-start justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1870}}
                      , React.createElement('div', { className: "flex items-start gap-3 min-w-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1871}}
                        , React.createElement('div', { className: `mt-0.5 h-9 w-9 rounded-lg flex items-center justify-center ${accent.iconBgClass}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1872}}
                          , React.createElement(FolderKanban, { className: `h-5 w-5 ${accent.iconClass}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1873}} )
                        )
                        , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1875}}
                          , React.createElement(CardTitle, { className: "text-base font-semibold leading-tight truncate"   , title: project.project_name || "Unnamed", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1876}}
                            , project.project_name || "Unnamed"
                          )
                          , React.createElement(CardDescription, { className: "text-xs mt-1 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1879}}, "Updated "
                             , project.updated_at ? new Date(project.updated_at).toLocaleDateString() : "â€”"
                          )
                        )
                      )
                      , React.createElement(Badge, { className: "shrink-0 text-[11px] font-medium px-2 py-0 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 border-0"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1884}}, "Active"

                      )
                    )
                  )
                  , React.createElement(CardContent, { className: "px-5 pb-5 pt-0 space-y-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1889}}
                    /* Compact summary: keep the cards clean; full details live in the View panel */
                    , React.createElement('div', { className: "flex flex-wrap gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1891}}
                      , project.project_reference_no && (
                        React.createElement(Badge, {
                          variant: "outline",
                          className: "text-[11px] font-medium bg-background/60 border-border/70 text-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1893}}

                          , React.createElement(FileText, { className: "h-3 w-3 mr-1 text-muted-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1897}} )
                          , React.createElement('span', { className: "truncate max-w-[160px]" , title: project.project_reference_no, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1898}}
                            , project.project_reference_no
                          )
                        )
                      )
                      , React.createElement(Badge, {
                        variant: "outline",
                        className: "text-[11px] font-medium bg-background/60 border-border/70 text-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1903}}

                        , React.createElement(MapPin, { className: "h-3 w-3 mr-1 text-muted-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1907}} )
                        , React.createElement('span', { className: "max-w-[220px] truncate" , title: _nullishCoalesce(project.tehsil_name, () => ( String(project.tehsil))), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1908}}
                          , _nullishCoalesce(project.tehsil_name, () => ( String(project.tehsil)))
                        )
                      )
                      , project.project_starting_date && (
                        React.createElement(Badge, {
                          variant: "outline",
                          className: "text-[11px] font-medium bg-background/60 border-border/70 text-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1913}}

                          , React.createElement(Calendar, { className: "h-3 w-3 mr-1 text-muted-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1917}} )
                          , new Date(project.project_starting_date).toLocaleDateString()
                        )
                      )
                    )

                    , React.createElement('div', { className: "flex items-center gap-2 pt-3 border-t border-border/60"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1923}}
                      , React.createElement(Button, {
                        variant: "default",
                        size: "sm",
                        onClick: () => openEditDialog(project),
                        disabled: updateProjectMutation.isPending,
                        className: "flex-1 gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 border-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1924}}

                        , React.createElement(Pencil, { className: "h-3.5 w-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1931}} ), "Update"

                      )
                      , React.createElement(Button, {
                        variant: "outline",
                        size: "sm",
                        onClick: () => setSelectedProjectForView(isSelected ? null : project),
                        className: `flex-1 gap-1.5 h-8 border-border bg-background hover:bg-muted/50 ${isSelected ? "ring-1 ring-primary/50 bg-muted/30" : ""}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1934}}

                        , React.createElement(Eye, { className: "h-3.5 w-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1940}} ), "View"

                      )
                      , React.createElement(Button, {
                        variant: "outline",
                        size: "sm",
                        onClick: () => handleDeleteProject(project.id),
                        disabled: deleteProjectMutation.isPending,
                        className: "flex-1 gap-1.5 h-8 border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors", __self: this }
                        , React.createElement(Trash2, { className: "h-3.5 w-3.5", __self: this }), "Delete"
                      )
                    )
                    
                  )
                )
              );
            })
          )
          )
        )

        /* Pagination at bottom of page */
        , !projectsLoading && projectsData.length > 0 && totalProjectsPages > 1 && (
          React.createElement('div', { className: "flex items-center justify-center gap-4 py-6 mt-auto border-t border-border/80 shrink-0"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1954}}
            , React.createElement(Button, {
              variant: "outline",
              size: "sm",
              onClick: () => setProjectsPage((p) => Math.max(1, p - 1)),
              disabled: projectsPage <= 1,
              className: "gap-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1955}}

              , React.createElement(ChevronLeft, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1962}} ), "Previous"

            )
            , React.createElement('span', { className: "text-sm text-muted-foreground min-w-[100px] text-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1965}}, "Page "
               , projectsPage, " of "  , totalProjectsPages
            )
            , React.createElement(Button, {
              variant: "default",
              size: "sm",
              onClick: () => setProjectsPage((p) => Math.min(totalProjectsPages, p + 1)),
              disabled: projectsPage >= totalProjectsPages,
              className: "gap-1.5 bg-primary text-primary-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1968}}
, "Next"

              , React.createElement(ChevronRight, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1976}} )
            )
          )
        )

                /* ── PROJECT DETAIL MODAL ──────────────────────────────────────── */
        , selectedProjectForView && (() => {
          const p = selectedProjectForView;
          const hasCoords = (() => {
            const lat = Number(p.latitude); const lng = Number(p.longitude);
            return Number.isFinite(lat) && Number.isFinite(lng);
          })();
          const lat = Number(p.latitude); const lng = Number(p.longitude);

          const formatNum = (v) => {
            if (v === "" || v == null) return "—";
            const n = typeof v === "number" ? v : Number(String(v));
            return Number.isFinite(n)
              ? new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n)
              : String(v);
          };

          const hasAny = (...vals) =>
            vals.some((v) => v !== null && v !== undefined && String(v).trim() !== "");

          const showCoreBudget = hasAny(p.total_budget, p.total_consume, p.remaining_budget);
          const showAllocation  = hasAny(p.allocation_capital_cost, p.allocation_revenue_cost, p.allocation_total_cost);
          const showPd          = hasAny(p.pd_release_capital_cost, p.pd_release_cost, p.pd_release_total_cost);
          const showSpending    = hasAny(p.spending_release_capital_cost, p.spending_release_revenue_cost, p.spending_release_total_cost);
          const showPifra       = hasAny(p.pifra_utilization_capital_cost, p.pifra_utilization_revenue_cost, p.pifra_utilization_total_cost, p.pifra_utilization_date);
          const showPct         = hasAny(p.percentage_utilization_capital, p.percentage_utilization_revenue, p.percentage_utilization_total);
          const hasFinancials   = showCoreBudget || showAllocation || showPd || showSpending || showPifra || showPct;

          const accentStyles = {
            emerald: {
              bg: "bg-emerald-50/80 dark:bg-emerald-950/20",
              text: "text-emerald-700 dark:text-emerald-300",
              border: "border-emerald-100/70 dark:border-emerald-900/30",
              iconBg: "bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200"
            },
            violet: {
              bg: "bg-violet-50/80 dark:bg-violet-950/20",
              text: "text-violet-700 dark:text-violet-300",
              border: "border-violet-100/70 dark:border-violet-900/30",
              iconBg: "bg-violet-100/60 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200"
            },
            amber: {
              bg: "bg-amber-50/80 dark:bg-amber-950/20",
              text: "text-amber-700 dark:text-amber-300",
              border: "border-amber-100/70 dark:border-amber-900/30",
              iconBg: "bg-amber-100/60 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200"
            },
            sky: {
              bg: "bg-sky-50/80 dark:bg-sky-950/20",
              text: "text-sky-700 dark:text-sky-300",
              border: "border-sky-100/70 dark:border-sky-900/30",
              iconBg: "bg-sky-100/60 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200"
            },
            rose: {
              bg: "bg-rose-50/80 dark:bg-rose-950/20",
              text: "text-rose-700 dark:text-rose-300",
              border: "border-rose-100/70 dark:border-rose-900/30",
              iconBg: "bg-rose-100/60 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200"
            }
          };

          const InfoChip = ({ icon: Icon, label, value, accent = "emerald" }) => {
            const styles = accentStyles[accent] || accentStyles.emerald;
            return (
              React.createElement('div', { className: `flex items-start gap-3 rounded-xl border ${styles.border} ${styles.bg} p-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
                , React.createElement('div', { className: `h-9 w-9 rounded-lg ${styles.iconBg} flex items-center justify-center shrink-0 shadow-sm`}
                  , React.createElement(Icon, { className: "h-4.5 w-4.5"})
                )
                , React.createElement('div', { className: "min-w-0 flex-1"}
                  , React.createElement('p', { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5"}, label)
                  , React.createElement('p', { className: "text-[13px] sm:text-[14px] font-semibold text-slate-800 dark:text-slate-100 leading-snug break-words"}, value || "—")
                )
              )
            );
          };

          const BudgetBar = ({ label, value, total, colorClass }) => {
            const pct = total > 0 ? Math.min(100, (Number(value) / total) * 100) : 0;
            let barGradient = "bg-gradient-to-r from-slate-400 to-slate-500";
            if (colorClass.includes("emerald")) {
              barGradient = "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 shadow-[0_0_12px_rgba(16,185,129,0.3)]";
            } else if (colorClass.includes("violet") || colorClass.includes("purple") || colorClass.includes("indigo")) {
              barGradient = "bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.3)]";
            } else if (colorClass.includes("slate") || colorClass.includes("gray")) {
              barGradient = "bg-gradient-to-r from-slate-400 to-slate-500";
            }
            
            return (
              React.createElement('div', { className: "space-y-1.5"}
                , React.createElement('div', { className: "flex items-center justify-between gap-2"}
                  , React.createElement('span', { className: "text-xs font-semibold text-slate-600"}, label)
                  , React.createElement('span', { className: "text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums"}, `PKR ${formatNum(value)} M`)
                )
                , React.createElement('div', { className: "h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner"}
                  , React.createElement('div', { className: `h-full rounded-full ${barGradient} transition-all duration-500 ease-out`, style: { width: `${pct}%` }})
                )
              )
            );
          };

          const FinSection = ({ title, icon: Icon, accent, children }) => {
            const styles = accentStyles[accent] || accentStyles.emerald;
            return (
              React.createElement('div', { className: "rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"}
                , React.createElement('div', { className: `flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 ${styles.bg}`}
                  , React.createElement('div', { className: `h-7.5 w-7.5 rounded-lg ${styles.iconBg} flex items-center justify-center shadow-sm`}
                    , React.createElement(Icon, { className: "h-4 w-4"})
                  )
                  , React.createElement('p', { className: "text-sm font-bold text-slate-800 dark:text-slate-100"}, title)
                )
                , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800"}, children)
              )
            );
          };

          const FinStat = ({ label, value }) => (
            React.createElement('div', { className: "flex flex-col items-center justify-center py-4 px-2 text-center"}
              , React.createElement('p', { className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 leading-tight"}, label)
              , React.createElement('p', { className: "text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 tabular-nums"}, formatNum(value))
            )
          );

          return React.createElement(Dialog, { open: true, onOpenChange: (open) => { if (!open) setSelectedProjectForView(null); }}
            , React.createElement(DialogContent, {
              className: "w-[95vw] sm:w-[90vw] max-w-3xl h-[85vh] max-h-[750px] overflow-hidden p-0 rounded-2xl border-none shadow-2xl flex flex-col bg-slate-50 [&>button]:hidden",
              'aria-describedby': undefined
            }

              /* ── MODAL HEADER ──────────────────────── */
              , React.createElement(DialogHeader, { className: "sr-only"}
                , React.createElement(DialogTitle, {}, p.project_name || "Project Details")
              )
              , React.createElement('div', { className: "relative bg-gradient-to-br from-[#054332] via-[#022c22] to-[#011c15] px-5 sm:px-7 py-5 shrink-0 shadow-md"}
                , React.createElement('button', {
                  onClick: () => setSelectedProjectForView(null),
                  className: "absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:rotate-90 transition-all duration-200",
                  'aria-label': "Close"
                }
                  , React.createElement(X, { className: "h-4 w-4"})
                )
                , React.createElement('div', { className: "flex items-start gap-4"}
                  , React.createElement('div', { className: "h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 shadow-inner"}
                    , React.createElement(FolderKanban, { className: "h-6 w-6 text-white"})
                  )
                  , React.createElement('div', { className: "min-w-0 flex-1 pt-0.5"}
                    , React.createElement('h2', { className: "text-lg sm:text-xl font-bold text-white leading-tight truncate"}, p.project_name || "Unnamed Project")
                    , React.createElement('div', { className: "flex flex-wrap items-center gap-1.5 mt-2"}
                      , p.project_category && React.createElement('span', { className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-semibold border border-white/10 shadow-sm"}, p.project_category)
                      , p.project_reference_no && React.createElement('span', { className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-semibold border border-emerald-500/20 shadow-sm"}, "Ref: ", p.project_reference_no)
                      , React.createElement('span', { className: "inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[11px] font-medium border border-white/5"}
                        , React.createElement(MapPin, { className: "h-3 w-3 mr-1 text-emerald-300"}), p.tehsil_name || p.district_name || "—"
                      )
                    )
                  )
                )
              )

              /* ── TABS ────────────────────────────────── */
              , React.createElement('div', { className: "px-5 sm:px-7 pt-4 pb-4 bg-slate-50/60 dark:bg-slate-950/20 flex-1 overflow-hidden flex flex-col"}
                , React.createElement(Tabs, { defaultValue: "overview", className: "flex-1 overflow-hidden flex flex-col"}
                  , React.createElement(TabsList, { className: "h-11 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm p-1 gap-1 shrink-0"}
                    , React.createElement(TabsTrigger, { value: "overview", className: "flex-1 rounded-lg text-[13px] font-semibold data-[state=active]:bg-[#054332] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all py-2"}, "Project Info")
                    , React.createElement(TabsTrigger, { value: "financial", className: "flex-1 rounded-lg text-[13px] font-semibold data-[state=active]:bg-[#054332] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all py-2"}, "Financial Details")
                  )

                  /* ── PROJECT INFO TAB ─────────────── */
                  , React.createElement(TabsContent, { value: "overview", className: "mt-4 space-y-4 flex-1 overflow-y-auto pr-1 pb-4 scrollbar-thin"}

                    /* Description */
                    , p.project_description && (
                      React.createElement('div', { className: "rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-2"}
                        , React.createElement('div', { className: "flex items-center gap-2 text-slate-400"}
                          , React.createElement(FileText, { className: "h-4 w-4"})
                          , React.createElement('span', { className: "text-[10px] font-bold uppercase tracking-wider"}, "Project Description")
                        )
                        , React.createElement('p', { className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-6"}, p.project_description)
                      )
                    )

                    /* Info chips grid */
                    , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5"}
                      , React.createElement(InfoChip, { icon: Building2, label: "Stakeholder", value: formatProjectStakeholder(p), accent: "emerald"})
                      , React.createElement(InfoChip, { icon: Calendar,  label: "Start Date",
                        value: p.project_starting_date ? new Date(p.project_starting_date).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric"}) : "—",
                        accent: "violet"
                      })
                      , React.createElement(InfoChip, { icon: FileText,  label: "Reference No", value: p.project_reference_no, accent: "emerald"})
                      , React.createElement(InfoChip, { icon: MapPin,    label: "Tehsil / Location",
                        value: [p.tehsil_name, p.district_name, p.division_name].filter(Boolean).join(", ") || String(p.tehsil || "—"),
                        accent: "amber"
                      })
                      , p.project_category && React.createElement(InfoChip, { icon: ChevronDown, label: "Category", value: p.project_category + (p.project_category_other ? ` — ${p.project_category_other}` : ""), accent: "sky"})
                    )

                    /* Budget summary (if present) */
                    , showCoreBudget && (() => {
                      const total    = Number(p.total_budget)    || 0;
                      const consumed = Number(p.total_consume)   || 0;
                      const remain   = Number(p.remaining_budget) || Math.max(0, total - consumed);
                      const pct      = total > 0 ? Math.round((consumed / total) * 100) : 0;
                      return (
                        React.createElement('div', { className: "rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-4"}
                          , React.createElement('div', { className: "flex items-center justify-between"}
                            , React.createElement('div', { className: "flex items-center gap-2"}
                              , React.createElement('div', { className: "h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-sm"}
                                , React.createElement(Wallet, { className: "h-4.5 w-4.5"})
                              )
                              , React.createElement('p', { className: "text-sm font-bold text-slate-800 dark:text-slate-100"}, "Budget Overview")
                            )
                            , React.createElement('span', { className: `text-xs font-bold px-2.5 py-1 rounded-full ${pct >= 90 ? "bg-red-50 text-red-700" : pct >= 60 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
                              , pct, "% utilized"
                            )
                          )
                          , React.createElement('div', { className: "space-y-3"}
                            , React.createElement(BudgetBar, { label: "Total Budget",    value: total,    total: total, colorClass: "slate"})
                            , React.createElement(BudgetBar, { label: "Total Consumed",  value: consumed, total: total, colorClass: "emerald"})
                            , React.createElement(BudgetBar, { label: "Remaining",       value: remain,   total: total, colorClass: "violet"})
                          )
                        )
                      );
                    })()

                    /* XER file */
                    , p.xer_file && (
                      React.createElement('a', {
                        href: p.xer_file.startsWith("http") ? p.xer_file : `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}${p.xer_file.startsWith("/") ? "" : "/"}${p.xer_file}`,
                        target: "_blank", rel: "noopener noreferrer",
                        className: "flex items-center gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm hover:border-[#054332]/40 transition-all group"
                      }
                        , React.createElement('div', { className: "h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors shadow-sm"}
                          , React.createElement(FileText, { className: "h-5 w-5"})
                        )
                        , React.createElement('div', { className: "min-w-0 flex-1"}
                          , React.createElement('p', { className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400"}, "Primavera Schedule (XER)")
                          , React.createElement('p', { className: "text-sm font-semibold text-[#054332] dark:text-emerald-400 truncate"}, p.xer_file.split("/").pop() || p.xer_file)
                        )
                        , React.createElement(ChevronRight, { className: "h-4 w-4 text-slate-400 group-hover:text-[#054332] dark:group-hover:text-emerald-400 transition-colors shrink-0"})
                      )
                    )

                    /* Map */
                    , hasCoords && (
                      React.createElement('div', { className: "rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"}
                        , React.createElement('div', { className: "flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20"}
                          , React.createElement('div', { className: "h-7.5 w-7.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-sm"}
                            , React.createElement(MapPin, { className: "h-3.5 w-3.5"})
                          )
                          , React.createElement('div', {}
                            , React.createElement('p', { className: "text-sm font-bold text-slate-700 dark:text-slate-200"}, "Project Location")
                            , React.createElement('p', { className: "text-xs text-slate-400 dark:text-slate-500 tabular-nums"}, `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
                          )
                        )
                        , React.createElement('div', { className: "h-[220px] sm:h-[260px] w-full"}
                          , React.createElement(MapContainer, { center: [lat, lng], zoom: 13, scrollWheelZoom: false, style: { height: "100%", width: "100%" }}
                            , React.createElement(TileLayer, { attribution: '© OpenStreetMap contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"})
                            , React.createElement(Marker, { position: [lat, lng]}
                              , React.createElement(Popup, {}, p.project_name || "Project")
                            )
                          )
                        )
                      )
                    )

                    /* Activities */
                    , React.createElement('div', { className: "rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"}
                      , React.createElement('div', { className: "flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20"}
                        , React.createElement('div', { className: "flex items-center gap-3"}
                          , React.createElement('div', { className: "h-7.5 w-7.5 rounded-lg bg-[#054332]/10 text-[#054332] dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center shadow-sm"}
                            , React.createElement(FolderKanban, { className: "h-3.5 w-3.5"})
                          )
                          , React.createElement('div', {}
                            , React.createElement('p', { className: "text-sm font-bold text-slate-700 dark:text-slate-200"}, "Activities")
                            , React.createElement('p', { className: "text-xs text-slate-400 dark:text-slate-500"}, "Imported from Primavera XER")
                          )
                        )
                        , !selectedProjectActivitiesLoading && selectedProjectActivities.length > 0 && (
                          React.createElement('span', { className: "text-xs font-bold text-[#054332] dark:text-emerald-300 bg-[#054332]/8 dark:bg-emerald-950/55 px-2.5 py-1 rounded-full border border-[#054332]/15 dark:border-emerald-500/25"}
                            , selectedProjectActivities.length, " tasks"
                          )
                        )
                      )
                      , React.createElement('div', { className: "divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto scrollbar-thin"}
                        , selectedProjectActivitiesLoading ? (
                          React.createElement('div', { className: "flex items-center justify-center py-10 gap-3 text-slate-400"}
                            , React.createElement('div', { className: "h-4 w-4 rounded-full border-2 border-slate-300 border-t-[#054332] animate-spin"})
                            , React.createElement('span', { className: "text-sm"}, "Loading activities…")
                          )
                        ) : selectedProjectActivities.length === 0 ? (
                          React.createElement('div', { className: "flex flex-col items-center justify-center py-12 text-slate-400"}
                            , React.createElement(FolderKanban, { className: "h-8 w-8 mb-2 opacity-30"})
                            , React.createElement('p', { className: "text-sm font-medium"}, "No activities found")
                            , React.createElement('p', { className: "text-xs mt-1"}, "Upload an XER file to import tasks")
                          )
                        ) : (
                          selectedProjectActivities.map((a, idx) => {
                            const prog = typeof a.progress === "number" ? Math.round(a.progress) : null;
                            const progColor = prog === null ? "" : prog >= 100 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : prog >= 50 ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-slate-300";
                            return (
                              React.createElement('div', { key: a.id || a.activity_id || idx, className: "flex items-center gap-3 sm:gap-4 px-4 py-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"}
                                , React.createElement('div', { className: "h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 text-[11px] font-bold tabular-nums"}, idx + 1)
                                , React.createElement('div', { className: "flex-1 min-w-0"}
                                  , React.createElement('p', { className: "text-sm font-semibold text-slate-800 dark:text-slate-200 truncate"}, a.activity_name || a.label || "—")
                                  , prog !== null && (
                                    React.createElement('div', { className: "mt-2 flex items-center gap-2"}
                                      , React.createElement('div', { className: "flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"}
                                        , React.createElement('div', { className: `h-full rounded-full ${progColor}`, style: { width: `${prog}%` }})
                                      )
                                      , React.createElement('span', { className: "text-[10px] font-bold tabular-nums text-slate-500 dark:text-slate-400 shrink-0"}, prog, "%")
                                    )
                                  )
                                )
                              )
                            );
                          })
                        )
                      )
                    )
                  )

                  /* ── FINANCIAL DETAILS TAB ─────────── */
                  , React.createElement(TabsContent, { value: "financial", className: "mt-4 space-y-4 flex-1 overflow-y-auto pr-1 pb-4 scrollbar-thin"}
                    , !hasFinancials ? (
                      React.createElement('div', { className: "flex flex-col items-center justify-center py-16 text-slate-400"}
                        , React.createElement(Wallet, { className: "h-10 w-10 mb-3 opacity-25"})
                        , React.createElement('p', { className: "text-sm font-semibold"}, "No financial details")
                        , React.createElement('p', { className: "text-xs mt-1"}, "Budget figures have not been entered for this project.")
                      )
                    ) : (
                      React.createElement('div', { className: "space-y-4"}
                        , showCoreBudget && (
                          React.createElement(FinSection, { title: "Project Budget (PKR M)", icon: Wallet, accent: "emerald"}
                            , React.createElement(FinStat, { label: "Total Budget",   value: _nullishCoalesce(p.total_budget, () => ( "—"))})
                            , React.createElement(FinStat, { label: "Total Consumed", value: _nullishCoalesce(p.total_consume, () => ( "—"))})
                            , React.createElement(FinStat, { label: "Remaining",      value: _nullishCoalesce(p.remaining_budget, () => ( "—"))})
                          )
                        )
                        , showAllocation && (
                          React.createElement(FinSection, { title: "Allocation (PKR M)", icon: Landmark, accent: "sky"}
                            , React.createElement(FinStat, { label: "Capital",  value: p.allocation_capital_cost})
                            , React.createElement(FinStat, { label: "Revenue",  value: p.allocation_revenue_cost})
                            , React.createElement(FinStat, { label: "Total",    value: p.allocation_total_cost})
                          )
                        )
                        , showPd && (
                          React.createElement(FinSection, { title: "P&D Release (PKR M)", icon: HandCoins, accent: "amber"}
                            , React.createElement(FinStat, { label: "Capital", value: p.pd_release_capital_cost})
                            , React.createElement(FinStat, { label: "Revenue", value: p.pd_release_cost})
                            , React.createElement(FinStat, { label: "Total",   value: p.pd_release_total_cost})
                          )
                        )
                        , showSpending && (
                          React.createElement(FinSection, { title: "Spending Release (PKR M)", icon: Wallet, accent: "emerald"}
                            , React.createElement(FinStat, { label: "Capital", value: p.spending_release_capital_cost})
                            , React.createElement(FinStat, { label: "Revenue", value: p.spending_release_revenue_cost})
                            , React.createElement(FinStat, { label: "Total",   value: p.spending_release_total_cost})
                          )
                        )
                        , showPifra && (
                          React.createElement('div', { className: "rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"}
                            , React.createElement('div', { className: "flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-violet-50/60 dark:bg-violet-950/20"}
                              , React.createElement('div', { className: "h-7.5 w-7.5 rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200 flex items-center justify-center shadow-sm"}
                                , React.createElement(Wallet, { className: "h-3.5 w-3.5"})
                              )
                              , React.createElement('p', { className: "text-sm font-bold text-slate-800 dark:text-slate-100"}, "PIFRA Utilization (PKR M)")
                            )
                            , React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800"}
                              , React.createElement(FinStat, { label: "Capital", value: p.pifra_utilization_capital_cost})
                              , React.createElement(FinStat, { label: "Revenue", value: p.pifra_utilization_revenue_cost})
                              , React.createElement(FinStat, { label: "Total",   value: p.pifra_utilization_total_cost})
                              , React.createElement('div', { className: "flex flex-col items-center justify-center py-4 px-2 text-center"}
                                , React.createElement('p', { className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 leading-tight flex items-center gap-1"}
                                  , React.createElement(CalendarDays, { className: "h-3 w-3"}), "Date"
                                )
                                , React.createElement('p', { className: "text-sm font-bold text-slate-800 dark:text-slate-200"}, p.pifra_utilization_date ? String(p.pifra_utilization_date).slice(0, 10) : "—")
                              )
                            )
                          )
                        )
                        , showPct && (
                          React.createElement(FinSection, { title: "% Utilization vs Spending", icon: Percent, accent: "rose"}
                            , React.createElement(FinStat, { label: "Capital %", value: p.percentage_utilization_capital})
                            , React.createElement(FinStat, { label: "Revenue %", value: p.percentage_utilization_revenue})
                            , React.createElement(FinStat, { label: "Total %",   value: p.percentage_utilization_total})
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          );
        })()
        , deleteTarget && (
          React.createElement(Dialog, { open: true, onOpenChange: (open) => { if (!open) setDeleteTarget(null); } }
            , React.createElement(DialogContent, { className: "max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-3xl" }
              , React.createElement('div', { className: "p-6 pt-8 pb-6 bg-white dark:bg-slate-950 flex flex-col items-center relative" }
                , React.createElement('div', { className: "h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mb-5 ring-8 ring-red-50 dark:ring-red-950/50 shadow-sm" }
                  , React.createElement(Trash2, { className: "h-8 w-8" })
                )
                , React.createElement(DialogHeader, { className: "text-center space-y-2 w-full" }
                  , React.createElement(DialogTitle, { className: "text-2xl font-bold text-center text-slate-800 dark:text-slate-100" }, `Delete "${deleteTarget.project?.project_name || "this project"}"?`)
                  , React.createElement(DialogDescription, { className: "text-center text-slate-500 dark:text-slate-400 text-[15px] max-w-[280px] mx-auto leading-relaxed" }, "This action cannot be undone. All data will be permanently removed.")
                )
              )
              , React.createElement('div', { className: "px-6 pb-6 pt-2 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-5" }
                , deleteInfoLoading && React.createElement('div', { className: "flex justify-center py-6" }
                  , React.createElement('div', { className: "h-6 w-6 rounded-full border-2 border-slate-300 border-t-red-600 animate-spin" })
                )
                , deleteTarget.info && (
                  React.createElement('div', { className: "bg-white dark:bg-slate-950 rounded-2xl border border-red-100 dark:border-red-900/30 p-4 sm:p-5 shadow-sm" }
                    , React.createElement('p', { className: "text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2" }
                       , React.createElement(AlertTriangle, { className: "h-4.5 w-4.5 text-amber-500" })
                       , "This project includes:"
                    )
                    , React.createElement('ul', { className: "space-y-2.5" }
                      , deleteTarget.info.activities_count > 0 && React.createElement('li', { className: "flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400" }
                        , React.createElement('div', { className: "h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" })
                        , React.createElement('span', null, React.createElement('strong', { className: "text-slate-800 dark:text-slate-200" }, deleteTarget.info.activities_count), ` project activit${deleteTarget.info.activities_count === 1 ? "y" : "ies"}`)
                      )
                      , deleteTarget.info.images_count > 0 && React.createElement('li', { className: "flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400" }
                        , React.createElement('div', { className: "h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" })
                        , React.createElement('span', null, React.createElement('strong', { className: "text-slate-800 dark:text-slate-200" }, deleteTarget.info.images_count), ` progress image${deleteTarget.info.images_count === 1 ? "" : "s"}`)
                      )
                      , deleteTarget.info.documents_count > 0 && React.createElement('li', { className: "flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400" }
                        , React.createElement('div', { className: "h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" })
                        , React.createElement('span', null, React.createElement('strong', { className: "text-slate-800 dark:text-slate-200" }, deleteTarget.info.documents_count), ` document${deleteTarget.info.documents_count === 1 ? "" : "s"}`)
                      )
                      , deleteTarget.info.has_xer_file && React.createElement('li', { className: "flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400" }
                        , React.createElement('div', { className: "h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" })
                        , React.createElement('span', null, "The uploaded XER schedule")
                      )
                    )
                    , deleteTarget.info.activities_with_attachments?.length > 0 && (
                      React.createElement('div', { className: "mt-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 p-3.5 space-y-2.5" }
                        , React.createElement('p', { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider" }, "Activities with attachments")
                        , React.createElement('div', { className: "max-h-[120px] overflow-y-auto pr-1 space-y-2 scrollbar-thin" }
                          , deleteTarget.info.activities_with_attachments.map((a) => (
                            React.createElement('div', { key: a.activity_id, className: "flex items-center justify-between text-[13px]" }
                              , React.createElement('span', { className: "truncate pr-2 font-medium text-slate-700 dark:text-slate-300" }, a.activity_name || `Activity #${a.activity_id}`)
                              , React.createElement('span', { className: "text-slate-500 dark:text-slate-400 shrink-0 text-xs bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-full" }
                                , [
                                    a.images_count ? `${a.images_count} img` : null,
                                    a.documents_count ? `${a.documents_count} doc` : null,
                                  ].filter(Boolean).join(", ")
                              )
                            )
                          ))
                        )
                      )
                    )
                  )
                )
                , React.createElement(DialogFooter, { className: "flex flex-col-reverse sm:flex-row gap-3 w-full sm:space-x-0" }
                  , React.createElement(Button, { type: "button", variant: "outline", className: "w-full sm:flex-1 h-11 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100", onClick: () => setDeleteTarget(null) }, "Cancel")
                  , React.createElement(Button, {
                      type: "button",
                      variant: "destructive",
                      className: "w-full sm:flex-1 h-11 rounded-xl bg-red-600 text-white hover:bg-red-700 font-semibold shadow-sm hover:shadow transition-all",
                      onClick: confirmDeleteProject,
                      disabled: deleteProjectMutation.isPending,
                    }, deleteProjectMutation.isPending ? "Deleting…" : "Delete Project")
                )
              )
            )
          )
        )

      /* Add Project Dialog (also used as full-page on /project-management/create) */
      , React.createElement(Dialog, {
        open: dialogOpen,
        onOpenChange: (open) => {
          setShowAddProjectDialog(open);
          if (!open) {
            resetForm();
            setEditingProject(null);
          }
        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2287}}

        , React.createElement(DialogContent, {
          className: 
            "w-[95vw] max-w-[min(136vw,48rem)] sm:max-w-5xl max-h-[min(92vh,900px)] overflow-y-auto p-4 sm:p-6"
          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2297}}

          , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2302}}
            , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2303}}, editingProject ? "Update Project" : "Add New Project")
            , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2304}}
              , editingProject
                ? "Edit the project details below. Leave file fields unchanged unless you want to replace them."
                : "Fill in the project details and upload required files"
            )
          )

          /* Step Indicator */
          , React.createElement('div', { className: "flex flex-col items-center justify-center mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2312}}
            , React.createElement('div', { className: "flex items-center gap-3 w-fit"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2313}}
              /* Step 1 */
              , React.createElement('div', { className: "flex flex-col items-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2315}}
                , React.createElement('div', { className: `flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  currentStep >= 1 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground bg-background"
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2316}}
                  , currentStep > 1 ? (
                    React.createElement(CheckCircle2, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2320}} )
                  ) : (
                    React.createElement('span', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2322}}, "1")
                  )
                )
                , React.createElement('p', { className: `text-xs font-medium mt-2 ${currentStep === 1 ? "text-primary" : "text-muted-foreground"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2325}}, "Project Details"

                )
              )

              /* Animated Progress Line */
              , React.createElement('div', { className: "relative w-24 h-1 bg-muted rounded-full overflow-hidden mt-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2331}}
                , currentStep >= 2 && (
                  React.createElement(React.Fragment, null
                    , React.createElement('div', { className: "absolute inset-0 bg-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2334}} )
                    , React.createElement('div', { 
                      className: "absolute inset-0" ,
                      style: {
                        background: 'linear-gradient(90deg, transparent 30%, #ef4444 50%, transparent 70%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s linear infinite',
                      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2335}}
                    )
                  )
                )
              )

              /* Step 2 */
              , React.createElement('div', { className: "flex flex-col items-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2348}}
                , React.createElement('div', { className: `flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  currentStep >= 2 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground bg-background"
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2349}}
                  , currentStep > 2 ? React.createElement(CheckCircle2, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2352}} ) : React.createElement('span', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2352}}, "2")
                )
                , React.createElement('p', { className: `text-xs font-medium mt-2 text-center max-w-[5.5rem] leading-tight ${currentStep === 2 ? "text-primary" : "text-muted-foreground"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2354}}, "XER + map"

                )
              )

              /* Step 3 removed */
            )
          )

          , React.createElement('style', { dangerouslySetInnerHTML: {__html: `
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
          `}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2399}} )

          , React.createElement('form', { onSubmit: handleSubmit, className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2410}}
            /* Step 1: Project Details */
            , currentStep === 1 && (
              React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2413}}
                /* Project Name */
                , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2415}}
                  , React.createElement(Label, { htmlFor: "projectName", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2416}}, "Project Name *"  )
                  , React.createElement(Input, {
                    id: "projectName",
                    placeholder: "Enter project name"  ,
                    value: projectName,
                    onChange: (e) => setProjectName(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2417}}
                  )
                )
                , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2424}}
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2425}}
                    , React.createElement(Label, { htmlFor: "category_modal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2426}}, "Category" )
                    , React.createElement(Select, { value: category || "", onValueChange: setCategory, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2427}}
                      , React.createElement(SelectTrigger, { id: "category_modal", className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2428}}
                        , React.createElement(SelectValue, { placeholder: "Select category", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2429}} )
                      )
                      , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2431}}
                        , React.createElement(SelectItem, { value: "Basic Health Unit", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2432}}, "Basic Health Unit" )
                        , React.createElement(SelectItem, { value: "Dispensary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2433}}, "Dispensary" )
                        , React.createElement(SelectItem, { value: "Dispilated", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2434}}, "Dispilated" )
                        , React.createElement(SelectItem, { value: "Other", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2435}}, "Other" )
                      )
                    )
                  )
                  , category === "Other" && (
                    React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2438}}
                      , React.createElement(Label, { htmlFor: "categoryOther_modal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2439}}, "Please specify category"  )
                      , React.createElement(Input, {
                        id: "categoryOther_modal",
                        placeholder: "Enter category name"  ,
                        value: categoryOther,
                        onChange: (e) => setCategoryOther(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2440}}
                      )
                    )
                  )
                )

                /* Project Description */
                , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2426}}
                  , React.createElement(Label, { htmlFor: "projectDescription", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2427}}, "Project Description *"  )
                  , React.createElement(Textarea, {
                    id: "projectDescription",
                    placeholder: "Enter project description..."  ,
                    value: projectDescription,
                    onChange: (e) => setProjectDescription(e.target.value),
                    rows: 4, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2428}}
                  )
                )

                /* Starting Date and Reference Number */
                , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2438}}
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2439}}
                    , React.createElement(Label, { htmlFor: "startingDate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2440}}, "Project Starting Date *"   )
                    , React.createElement(Input, {
                      id: "startingDate",
                      type: "date",
                      value: startingDate,
                      onChange: (e) => setStartingDate(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2441}}
                    )
                  )
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2448}}
                    , React.createElement(Label, { htmlFor: "referenceNumber", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2449}}, "Project Reference No *"   )
                    , React.createElement(Input, {
                      id: "referenceNumber",
                      placeholder: "Enter reference number"  ,
                      value: referenceNumber,
                      onChange: (e) => setReferenceNumber(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2450}}
                    )
                  )
                )

                , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2457}}
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2458}}
                    , React.createElement(Label, { htmlFor: "totalBudgetAllocated", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2459}}, "Total Budget" )
                    , React.createElement(Input, {
                      id: "totalBudgetAllocated",
                      type: "number",
                      min: 0,
                      step: "any",
                      placeholder: "e.g. 1000000",
                      value: totalBudgetAllocated,
                      onChange: (e) => setTotalBudgetAllocated(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2460}}
                    )
                  )
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2467}}
                    , React.createElement(Label, { htmlFor: "budgetUtilized", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2468}}, "Total Consume" )
                    , React.createElement(Input, {
                      id: "budgetUtilized",
                      type: "number",
                      min: 0,
                      step: "any",
                      placeholder: "e.g. 250000",
                      value: budgetUtilized,
                      onChange: (e) => setBudgetUtilized(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2469}}
                    )
                  )
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2476}}
                    , React.createElement(Label, { htmlFor: "remainingBudget", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2477}}, "Remaining Budget" )
                    , React.createElement(Input, {
                      id: "remainingBudget",
                      type: "number",
                      value: remainingBudget,
                      disabled: true,
                      readOnly: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2478}}
                    )
                  )
                )

                /* Stakeholder (multi-select) */
                , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2460}}
                  , React.createElement(Label, { htmlFor: "stakeholderIds", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2461}}, "Stakeholder(s) *" )
                  , React.createElement(Popover, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2462}}
                    , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2463}}
                      , React.createElement(Button, {
                        id: "stakeholderIds",
                        variant: "outline",
                        role: "combobox",
                        className: "w-full justify-between font-normal min-h-10 h-auto py-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2464}}

                        , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2470}}
                          , stakeholderIds.length === 0
                            ? "Select stakeholder(s)"
                            : stakeholderIds
                                .map((id) => stakeholdersList.find((s) => String(s.id) === id))
                                .filter(Boolean)
                                .map((s) => `${s.stakeholder_title} (${s.stakeholder_type})`)
                                .join(", ")
                        )
                        , React.createElement(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2479}} )
                      )
                    )
                    , React.createElement(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2482}}
                      , React.createElement('div', { className: "max-h-60 overflow-auto p-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2483}}
                        , stakeholdersList.map((s) => (
                          React.createElement('label', {
                            key: s.id,
                            className: "flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted cursor-pointer"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2485}}

                            , React.createElement(Checkbox, {
                              checked: stakeholderIds.includes(String(s.id)),
                              onCheckedChange: (checked) => {
                                setStakeholderIds((prev) =>
                                  checked
                                    ? [...prev, String(s.id)]
                                    : prev.filter((id) => id !== String(s.id))
                                );
                              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2489}}
                            )
                            , React.createElement('span', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2499}}
                              , s.stakeholder_title, " (" , s.stakeholder_type, ")"
                            )
                          )
                        ))
                      )
                    )
                  )
                )

                , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2506}}
                  /* Zone â€” searchable */
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2507}}
                    , React.createElement(Label, { htmlFor: "zone_modal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2508}}, "Zone *" )
                    , React.createElement(Popover, { open: zoneComboboxOpen, onOpenChange: setZoneComboboxOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2509}}
                      , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2510}}
                        , React.createElement(Button, {
                          id: "zone_modal",
                          variant: "outline",
                          role: "combobox",
                          'aria-expanded': zoneComboboxOpen,
                          className: "w-full justify-between font-normal h-9 px-3 text-sm"     ,
                          type: "button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2511}}

                          , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2520}}
                            , selectedZoneId
                              ? (_nullishCoalesce(_nullishCoalesce(_optionalChain([zonesList, 'access', _Z => _Z.find, 'call', _Z2 => _Z2((z) => String(z.id) === selectedZoneId), 'optionalAccess', _Z3 => _Z3.zone_name]), () => (
                                (editingProject && Number(selectedZoneId) === editingProject.zone ? editingProject.zone_name : null))), () => (
                                "Select zone")))
                              : "Select zone"
                          )
                          , React.createElement(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2528}} )
                        )
                      )
                      , React.createElement(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2531}}
                        , React.createElement(Command, {
                          filter: (value, search) => {
                            const q = (search || "").toLowerCase();
                            if (!q) return 1;
                            return (value || "").toLowerCase().includes(q) ? 1 : 0;
                          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2532}}

                          , React.createElement(CommandInput, { placeholder: "Type to search zoneâ€¦"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2539}} )
                          , React.createElement(CommandList, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2540}}
                            , React.createElement(CommandEmpty, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2541}}, "No zone found."  )
                            , React.createElement(CommandGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2542}}
                              , zonesList.map((z) => (
                                React.createElement(CommandItem, {
                                  key: z.id,
                                  value: z.zone_name,
                                  onSelect: () => {
                                    skipGeographyClearRef.current = false;
                                    setSelectedZoneId(String(z.id));
                                    setZoneComboboxOpen(false);
                                  }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2544}}

                                  , z.zone_name
                                )
                              ))
                            )
                          )
                        )
                      )
                    )
                  )
                  /* Circle â€” searchable */
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2562}}
                    , React.createElement(Label, { htmlFor: "circle_modal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2563}}, "Circle *" )
                    , React.createElement(Popover, { open: circleComboboxOpen, onOpenChange: setCircleComboboxOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2564}}
                      , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2565}}
                        , React.createElement(Button, {
                          id: "circle_modal",
                          variant: "outline",
                          role: "combobox",
                          'aria-expanded': circleComboboxOpen,
                          disabled: !selectedZoneId,
                          className: "w-full justify-between font-normal h-9 px-3 text-sm"     ,
                          type: "button", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2566}}

                          , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2575}}
                            , selectedCircleId
                              ? (_nullishCoalesce(_nullishCoalesce(_optionalChain([circlesList, 'access', _C => _C.find, 'call', _C2 => _C2((c) => String(c.id) === selectedCircleId), 'optionalAccess', _C3 => _C3.circle_name]), () => (
                                (editingProject && Number(selectedCircleId) === editingProject.circle ? editingProject.circle_name : null))), () => (
                                "Select circle")))
                              : selectedZoneId ? "Select circle" : "Select zone first"
                          )
                          , React.createElement(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2583}} )
                        )
                      )
                      , React.createElement(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2586}}
                        , React.createElement(Command, {
                          filter: (value, search) => {
                            const q = (search || "").toLowerCase();
                            if (!q) return 1;
                            return (value || "").toLowerCase().includes(q) ? 1 : 0;
                          }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2587}}

                          , React.createElement(CommandInput, { placeholder: "Type to search circleâ€¦"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2594}} )
                          , React.createElement(CommandList, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2595}}
                            , React.createElement(CommandEmpty, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2596}}, "No circle found."  )
                            , React.createElement(CommandGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2597}}
                              , circlesList.map((c) => (
                                React.createElement(CommandItem, {
                                  key: c.id,
                                  value: c.circle_name,
                                  onSelect: () => {
                                    skipGeographyClearRef.current = false;
                                    setSelectedCircleId(String(c.id));
                                    setCircleComboboxOpen(false);
                                  }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2599}}

                                  , c.circle_name
                                )
                              ))
                            )
                          )
                        )
                      )
                    )
                  )
                )

                /* Province/Division removed */

                /* District â€” searchable */
                , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2617}}
                  , React.createElement(Label, { htmlFor: "district", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2618}}, "District *" )
                  , React.createElement(Popover, { open: districtComboboxOpen, onOpenChange: setDistrictComboboxOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2619}}
                    , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2620}}
                      , React.createElement(Button, {
                        id: "district",
                        variant: "outline",
                        role: "combobox",
                        'aria-expanded': districtComboboxOpen,
                        className: "w-full justify-between font-normal h-9 px-3 text-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2621}}

                        , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2629}}
                          , selectedDistrictId
                            ? (_nullishCoalesce(_nullishCoalesce(_optionalChain([districtsList, 'access', _47 => _47.find, 'call', _48 => _48((d) => String(d.id) === selectedDistrictId), 'optionalAccess', _49 => _49.district_name]), () => (
                              (editingProject && Number(selectedDistrictId) === editingProject.district ? editingProject.district_name : null))), () => (
                              "Select district")))
                            : "Select district"
                        )
                        , React.createElement(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2636}} )
                      )
                    )
                    , React.createElement(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2639}}
                      , React.createElement(Command, {
                        filter: (value, search) => {
                          const q = (search || "").toLowerCase();
                          if (!q) return 1;
                          return (value || "").toLowerCase().includes(q) ? 1 : 0;
                        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2640}}

                        , React.createElement(CommandInput, { placeholder: "Type to search districtâ€¦"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2647}} )
                        , React.createElement(CommandList, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2648}}
                          , React.createElement(CommandEmpty, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2649}}, "No district found."  )
                          , React.createElement(CommandGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2650}}
                            , districtsList.map((d) => (
                              React.createElement(CommandItem, {
                                key: d.id,
                                value: d.district_name,
                                onSelect: () => {
                                  skipGeographyClearRef.current = false;
                                  setSelectedDistrictId(String(d.id));
                                  setDistrictComboboxOpen(false);
                                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2652}}

                                , d.district_name
                              )
                            ))
                          )
                        )
                      )
                    )
                  )
                )

                /* Tehsil â€” searchable */
                , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2672}}
                  , React.createElement(Label, { htmlFor: "tehsil", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2673}}, "Tehsil *" )
                  , React.createElement(Popover, { open: tehsilComboboxOpen, onOpenChange: setTehsilComboboxOpen, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2674}}
                    , React.createElement(PopoverTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2675}}
                      , React.createElement(Button, {
                        id: "tehsil",
                        variant: "outline",
                        role: "combobox",
                        'aria-expanded': tehsilComboboxOpen,
                        disabled: !selectedDistrictId,
                        className: "w-full justify-between font-normal h-9 px-3 text-sm"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2676}}

                        , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2684}}
                          , selectedTehsilId
                            ? (_nullishCoalesce(_nullishCoalesce(_optionalChain([tehsilsList, 'access', _50 => _50.find, 'call', _51 => _51((t) => String(t.id) === selectedTehsilId), 'optionalAccess', _52 => _52.tehsil_name]), () => (
                              (editingProject && Number(selectedTehsilId) === editingProject.tehsil ? editingProject.tehsil_name : null))), () => (
                              "Select tehsil")))
                            : selectedDistrictId ? "Select tehsil" : "Select district first"
                        )
                        , React.createElement(ChevronDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2691}} )
                      )
                    )
                    , React.createElement(PopoverContent, { className: "w-[var(--radix-popover-trigger-width)] p-0" , align: "start", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2694}}
                      , React.createElement(Command, {
                        filter: (value, search) => {
                          const q = (search || "").toLowerCase();
                          if (!q) return 1;
                          return (value || "").toLowerCase().includes(q) ? 1 : 0;
                        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2695}}

                        , React.createElement(CommandInput, { placeholder: "Type to search tehsilâ€¦"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2702}} )
                        , React.createElement(CommandList, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2703}}
                          , React.createElement(CommandEmpty, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2704}}, "No tehsil found."  )
                          , React.createElement(CommandGroup, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2705}}
                            , tehsilsList.map((t) => (
                              React.createElement(CommandItem, {
                                key: t.id,
                                value: t.tehsil_name,
                                onSelect: () => {
                                  skipGeographyClearRef.current = false;
                                  setSelectedTehsilId(String(t.id));
                                  setTehsilComboboxOpen(false);
                                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2707}}

                                , t.tehsil_name
                              )
                            ))
                          )
                        )
                      )
                    )
                  )
                )
              )
            )

            , currentStep === 1 && (
              React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2728}}
                , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2729}}
                  , React.createElement(Label, { htmlFor: "latitudeCoordinates_modal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2730}}, "Latitude Coordinates" )
                  , React.createElement(Input, {
                    id: "latitudeCoordinates_modal",
                    type: "number",
                    step: "any",
                    placeholder: "e.g. 31.5204",
                    value: latitudeCoordinates,
                    onChange: (e) => setLatitudeCoordinates(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2731}}
                  )
                )
                , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2740}}
                  , React.createElement(Label, { htmlFor: "longitudeCoordinates_modal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2741}}, "Longitude Coordinates" )
                  , React.createElement(Input, {
                    id: "longitudeCoordinates_modal",
                    type: "number",
                    step: "any",
                    placeholder: "e.g. 74.3587",
                    value: longitudeCoordinates,
                    onChange: (e) => setLongitudeCoordinates(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2742}}
                  )
                )
              )
            )

            /* Step 2: Schedule (XER) */
            , currentStep === 2 && (
              React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2730}}
                , React.createElement(WizardXerUploadSection, {
                  editingProject: editingProject,
                  xerFile: xerFile,
                  onXerInputChange: handleXERFileChange,
                  onClearXer: () => setXerFile(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2764}}
                )
              )
            )

            /* Step 3 removed */

            , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2985}}
              , React.createElement(Button, { 
                type: "button", 
                variant: "outline", 
                onClick: () => {
                  setShowAddProjectDialog(false);
                  resetForm();
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2986}}
, "Cancel"

              )
              , currentStep === 1 && (
                React.createElement(Button, { type: "button", onClick: handleNext, className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2997}}, "Next"

                  , React.createElement(ChevronRight, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2999}} )
                )
              )
              , currentStep === 2 && (
                React.createElement(React.Fragment, null
                  , React.createElement(Button, { 
                    type: "button", 
                    variant: "outline", 
                    onClick: handlePrevious,
                    className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3004}}

                    , React.createElement(ChevronLeft, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3010}} ), "Previous"

                  )
                  , React.createElement(Button, { type: "submit", disabled: updateProjectMutation.isPending, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3013}}
                    , editingProject ? "Update Project" : "Create Project"
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
