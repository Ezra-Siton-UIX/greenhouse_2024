import { api_offices } from "./api_paths.js";
import { getItems } from "../utility/getItems.js";

/* https://boards-api.greenhouse.io/v1/boards/lightricks/offices */


export let { offices } = await getItems(api_offices);