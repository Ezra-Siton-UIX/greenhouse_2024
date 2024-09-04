import { api_departments_as_list } from "./api_paths.js";
import { getItems } from "../utility/getItems.js";


/* https://boards-api.greenhouse.io/v1/boards/lightricks/departments?render_as=list */

/* used under: createGreenhouseJobsPlugin.js */
export let departments_as_list = await getItems(api_departments_as_list);

