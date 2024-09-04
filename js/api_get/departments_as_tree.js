import { api_departments_as_tree } from "./api_paths.js";
import { getItems } from "../utility/getItems.js";

/* https://boards-api.greenhouse.io/v1/boards/lightricks/departments?render_as=tree */
export let departments_as_tree = await getItems(api_departments_as_tree);

