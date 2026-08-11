 function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
import { get, post, put, del, request } from "./client";







import { boundaryFileToGeojson } from "@/utils/boundaryToGeojson";
import { mockProjects } from "./mockData";

/** POST /api/create-project/ — multipart: stakeholder, project_name, ..., xer_file, boundary_file */
const CREATE = "create-project/";
/** GET /api/list-project/ — returns GeoJSON FeatureCollection; we normalize to Project[] for the UI */
const LIST = "list-project/";
const UPDATE = "update-project/";
const DELETE_PATH = "delete-project/";
const TOP_PROJECTS = "top-projects/";

// project.js
function normalizeProjectFeature(f) {
  const props = f.properties ?? f;
  const geom = f.geometry ?? props.geom;
  const project = {
    id: f.id ?? props.id,
    ...props,
    ...(geom !== undefined && { geom }),
  };

  if (Array.isArray(project.activities)) {
    project.activities = project.activities.map((a) => {
      const percent_complete = a?.percent_complete ?? a?.progress ?? 0;
      const finish_date = a?.finish_date ?? a?.end_date ?? null;
      return { ...a, percent_complete, finish_date };
    });
  }
  return project;
}

export async function listProjects() {
  try {
    const data = await get(LIST);
    if (!data) return [];

    // Your actual backend shape: { status, message, data: [...] }
    if (typeof data === "object" && Array.isArray(data.data)) {
      return data.data.map((f) => normalizeProjectFeature(f));
    }

    // GeoJSON FeatureCollection
    if (typeof data === "object" && Array.isArray(data.features)) {
      return data.features.map((f) => normalizeProjectFeature(f));
    }

    // Plain array
    if (Array.isArray(data)) {
      return data.map((f) => normalizeProjectFeature(f));
    }

    // DRF pagination
    if (typeof data === "object" && "results" in data) {
      const results = Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.results?.features)
        ? data.results.features
        : [];
      return results.map((f) => normalizeProjectFeature(f));
    }

    console.warn("listProjects: unrecognized response shape", data);
    return [];
  } catch (err) {
    console.error("listProjects failed:", err);
    return [];
  }
}
/** GET /api/top-projects/ — returns list of top projects with progress % */
export async function listTopProjects() {
  const data = await get(TOP_PROJECTS);
  return Array.isArray(data) ? data : [];
}

export async function getProjectById(id) {
  const data = await get(LIST, { id: String(id) });
  if (data == null) return null;
  let raw = data;
  // Some endpoints nest again: { data: GeoJSON Feature }
  if (
    typeof raw === "object" &&
    raw !== null &&
    "data" in raw &&
    typeof (raw ).data === "object" &&
    (raw ).data !== null &&
    "properties" in ((raw ).data )
  ) {
    raw = (raw ).data;
  }
  if (typeof raw === "object" && raw !== null && "properties" in raw) {
    return normalizeProjectFeature(raw );
  }
  return raw ;
}

function appendFormValue(form, key, value) {
  if (value === undefined || value === null) return;
  if (value instanceof File) {
    form.append(key, value);
    return;
  }
  form.append(key, String(value));
}

/** Django `DateField` expects `YYYY-MM-DD` or null; never send `""` (400 validation). */
function normalizeDateFieldForApi(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const head = s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(head)) return head;
  return null;
}

function sanitizeProjectDates(payload) {
  const out = { ...payload } ;
  for (const key of ["project_starting_date", "pifra_utilization_date"] ) {
    if (key in out) {
      (out )[key] = normalizeDateFieldForApi(out[key]);
    }
  }
  return out;
}

export async function createProject(payload) {
  const hasFiles = payload.xer_file != null || payload.boundary_file != null;

  if (hasFiles) {
    const form = new FormData();
    // stakeholder is ManyToMany; send repeated keys if array
    if (Array.isArray(payload.stakeholder)) {
      for (const sid of payload.stakeholder) appendFormValue(form, "stakeholder", sid);
    } else {
      appendFormValue(form, "stakeholder", payload.stakeholder);
    }

    appendFormValue(form, "project_name", _nullishCoalesce(payload.project_name, () => ( "")));
    appendFormValue(form, "project_description", _nullishCoalesce(payload.project_description, () => ( "")));
    appendFormValue(
      form,
      "project_starting_date",
      _nullishCoalesce(normalizeDateFieldForApi(payload.project_starting_date), () => ( undefined)),
    );
    appendFormValue(form, "project_reference_no", _nullishCoalesce(payload.project_reference_no, () => ( "")));

    // Category: backend expects project_category + (optional) project_category_other
    appendFormValue(form, "project_category", _nullishCoalesce(payload.project_category, () => ( "")));
    appendFormValue(form, "project_category_other", _nullishCoalesce(payload.project_category_other, () => ( "")));

    // Location fields used by frontend (geom not needed)
    appendFormValue(form, "latitude", _nullishCoalesce(payload.latitude, () => ( "")));
    appendFormValue(form, "longitude", _nullishCoalesce(payload.longitude, () => ( "")));

    appendFormValue(form, "zone", _nullishCoalesce(payload.zone, () => ( "")));
    appendFormValue(form, "district", payload.district);
    appendFormValue(form, "tehsil", payload.tehsil);

    appendFormValue(form, "total_budget", _nullishCoalesce(payload.total_budget, () => ( "")));
    appendFormValue(form, "total_consume", _nullishCoalesce(payload.total_consume, () => ( "")));
    appendFormValue(form, "remaining_budget", _nullishCoalesce(payload.remaining_budget, () => ( "")));

    if (payload.xer_file) {
      form.append("xer_file", payload.xer_file);
      form.append("xer_file_name", payload.xer_file.name);
    }

    let boundaryFile = _nullishCoalesce(payload.boundary_file, () => ( null));
    if (boundaryFile) {
      boundaryFile = await boundaryFileToGeojson(boundaryFile);
      form.append("boundary_file", boundaryFile);
    }

    return request(CREATE, { method: "POST", formData: form });
  }

  return post(
    CREATE,
    sanitizeProjectDates({
      stakeholder: payload.stakeholder,
      project_name: _nullishCoalesce(payload.project_name, () => ( null)),
      project_description: _nullishCoalesce(payload.project_description, () => ( null)),
      project_starting_date: _nullishCoalesce(payload.project_starting_date, () => ( null)),
      project_reference_no: _nullishCoalesce(payload.project_reference_no, () => ( null)),
      project_category: _nullishCoalesce(payload.project_category, () => ( null)),
      project_category_other: _nullishCoalesce(payload.project_category_other, () => ( null)),
      latitude: _nullishCoalesce(payload.latitude, () => ( null)),
      longitude: _nullishCoalesce(payload.longitude, () => ( null)),
      zone: _nullishCoalesce(payload.zone, () => ( null)),
      district: payload.district,
      tehsil: payload.tehsil,
      total_budget: _nullishCoalesce(payload.total_budget, () => ( null)),
      total_consume: _nullishCoalesce(payload.total_consume, () => ( null)),
      remaining_budget: _nullishCoalesce(payload.remaining_budget, () => ( null)),
    } ),
  );
}

export async function updateProject(id, payload) {
  const hasFiles = (payload ).xer_file != null || (payload ).boundary_file != null;
  if (hasFiles) {
    const p = payload ;
    const form = new FormData();

    // Core fields (append only if present to keep partial update semantics)
    if (Array.isArray(p.stakeholder)) {
      for (const sid of p.stakeholder) appendFormValue(form, "stakeholder", sid);
    } else {
      appendFormValue(form, "stakeholder", p.stakeholder);
    }
    appendFormValue(form, "project_name", p.project_name);
    appendFormValue(form, "project_category", p.project_category);
    appendFormValue(form, "project_category_other", p.project_category_other);
    appendFormValue(form, "project_description", p.project_description);
    appendFormValue(form, "project_starting_date", _nullishCoalesce(normalizeDateFieldForApi(p.project_starting_date), () => ( undefined)));
    appendFormValue(form, "project_reference_no", p.project_reference_no);
    appendFormValue(form, "latitude", p.latitude);
    appendFormValue(form, "longitude", p.longitude);
    appendFormValue(form, "zone", p.zone);
    appendFormValue(form, "district", p.district);
    appendFormValue(form, "tehsil", p.tehsil);

    appendFormValue(form, "total_budget", p.total_budget);
    appendFormValue(form, "total_consume", p.total_consume);
    appendFormValue(form, "remaining_budget", p.remaining_budget);

    if (p.xer_file) {
      form.append("xer_file", p.xer_file);
      form.append("xer_file_name", p.xer_file.name);
    }

    let boundaryFile = _nullishCoalesce(p.boundary_file, () => ( null));
    if (boundaryFile) {
      boundaryFile = await boundaryFileToGeojson(boundaryFile);
      form.append("boundary_file", boundaryFile);
    }

    return request(`${UPDATE}${id}/`, { method: "PUT", formData: form });
  }

  return put(`${UPDATE}${id}/`, sanitizeProjectDates({ ...payload } ) );
}

export async function deleteProject(id) {
  await del(`${DELETE_PATH}${id}/`);
}
export async function getProjectDeleteInfo(id) {
  return get(`${DELETE_PATH}${id}/`);
}