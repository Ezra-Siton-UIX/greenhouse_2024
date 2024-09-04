import { api_jobs } from "./api_paths.js";
import { getItems } from "../utility/getItems.js";

/* use only for get_parent_departmentName_byId */
import { api_departments_as_tree } from "../api_get/api_paths.js";

export let {jobs, meta}  = await getItems(api_jobs);
