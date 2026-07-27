import { get } from "./client";

const GIS_PROJECT_STATUS_PATH = "gis-project-status/";

/**
 * GET /api/gis-project-status/
 *
 * Lightweight status-only dataset for the GIS dashboard. This intentionally
 * replaces the much larger project-gantt-all response on /gis.
 */
// gis.js
// gis.js
export async function getGISProjectStatuses() {
  try {
    const data = await get(GIS_PROJECT_STATUS_PATH);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.statuses)) return data.statuses;
    if (Array.isArray(data?.results)) return data.results;

    console.warn("getGISProjectStatuses: unrecognized response shape", data);
    return [];
  } catch (err) {
    console.error("getGISProjectStatuses failed:", err);
    return [];
  }
}
