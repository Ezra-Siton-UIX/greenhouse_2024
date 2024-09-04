import { addClassToAttributeSelector } from "../utility/utility_functions.js";
import { setting } from "../utility/global_setting.js";
import { get_parent_departmentName_byId } from "../utility/utility_functions.js";
import { list_meta_data } from "../render/list_meta_data.js";
import { departments_as_tree } from "../api_get/departments_as_tree.js";
import {get_career_Site_department_value_from_job} from "../website_override_feild/website_override_helper_functions.js"

/* THE NAME must match under part 1, part 2 ,part 3 */
let { departments } = departments_as_tree;

let interface_job = [
  "data_list_js",
  "list_js_title",
  "list_js_parent_department",
  "list_js_child_department",
  "list_js_custom_department",
  "list_js_office",
  "list_js_href",
  "list_js_id",
  "data-id"
]

/* PART 1 */

/* 1.1 list */
/*addClassToAttributeSelector(webflow attribute added under the designer, class added to this item by code) */
addClassToAttributeSelector("data_list_js", "data_list_js");// 👉️ 
/* 1.2. id */
addClassToAttributeSelector("list_js_id", "list_js_id");// 👉️ 
addClassToAttributeSelector("data-id", "data-id");// 👉️ 
/* 1.3. data */
addClassToAttributeSelector("list_js_title", "list_js_title");// 👉️ 
addClassToAttributeSelector("list_js_office", "list_js_office");// 👉️ 
addClassToAttributeSelector("list_js_custom_department", "list_js_custom_department");// 👉️ /* 😀 */
addClassToAttributeSelector("list_js_parent_department", "list_js_parent_department");// 👉️ 
addClassToAttributeSelector("list_js_child_department", "list_js_child_department");// 👉️ 
/* 1.4. href */
addClassToAttributeSelector("list_js_href", "list_js_href");// 👉️ 


/* PART 2 */
let data_job = document.querySelector('[data-job-item]');

var job_list_options = {
  listClass: "data_list_js",
  item: data_job,
  valueNames: [ 
    "list_js_title", /* class names*/
    "list_js_office",
    "list_js_custom_department", /* 😀 */
    "list_js_parent_department",
    "list_js_child_department",
    { name: 'list_js_href', attr: 'href' },
    { name: 'list_js_id', attr: 'id' },
    { data: ['id'] },
  ],
};

export async function render_list(jobs, query, office, department){
  //remember the object is inside item.item (Fuse wrap the data with extra item) //
  //alert("render_list " + query)

  let jobsList;
  var $jobs_list_section = document.querySelector(`[data_list_js]`);
  if($jobs_list_section)$jobs_list_section.style.display = 'block'; 

  let $no_result = $("[data-no-results]");
  let $result_true = $("[data-result-found]");
  /* meta */
  $result_true.addClass('animate__animated animate__fadeIn animate__faster');
  $no_result.removeClass('animate__animated animate__fadeIn animate__faster');
  $no_result.css("display", "none") ;

  list_meta_data(jobs.length, query, office, department);

  if($jobs_list_section !== null && jobs.length > 0){

    if($("[data_search_results]")){ $("[data_search_results]").css("display", "block") };
    if($result_true)$result_true.css("display", "block") ;

    /* new List(id/element *required, options - default: undefined, values - default: undefined); */
    /* Id the element in which the list area should be initialized. OR the actual element itself.*/
    jobsList = new List($jobs_list_section, job_list_options);
    jobsList.clear();

    jobs.forEach((item, index) => {
      createJob(item, index, jobsList);
    });/* end forEach */
  }
  else{
    /* No result found */
    if($jobs_list_section){ 
      $jobs_list_section.style.display = 'none'; 
    };
    if($result_true){  
      $result_true.css("display", "none") ;
      $result_true.removeClass('animate__animated animate__fadeIn animate__faster');
    }    
    if($no_result){
      $no_result.css("display", "block") ;
      $no_result.addClass('animate__animated animate__fadeIn animate__faster');
    }
  }
}

function createJob({item}, index, jobsList){
  //console.log("create job");
  const parent_id = item.departments[0].parent_id;
  let parent_department = get_parent_departmentName_byId(departments, item.departments[0].parent_id);

  // propery names and class names should match (class="title" for title property) 

  /* PART 3 */

  /* values */
  let list_js_title = item.title;

  /* OFFICE value (If more than one office - use location value **) */
  let list_js_office;

  const num_of_offices_under_this_job = item.offices.length;


  if(num_of_offices_under_this_job == 1){
    list_js_office = item.offices[0].name;

  }else if(num_of_offices_under_this_job > 1){/* more than one office => use location */
    //console.log(num_of_offices_under_this_job);
    list_js_office = item.location.name;
  }else{
    list_js_office = "No office";
  }

  let list_js_custom_department = String(get_career_Site_department_value_from_job(item.metadata));/*😀*/

  let list_js_child_department = parent_id !== null ? item.departments[0].name : "";

  let list_js_parent_department = parent_id !== null ? parent_department : item.departments[0].name;



  let list_js_id = item.id;

  let list_js_href = `/${setting.jobPositionUrl}?gh_jid=${item.id}&${formatString(list_js_title)}_&office=${formatString(list_js_office)}&team=${formatString(list_js_parent_department == "" ? list_js_child_department :  list_js_parent_department)}&gh_src=${sessionStorage.getItem("gh_src") ? sessionStorage.getItem("gh_src") : ""}`;
  let id = item.id.toString();


  /* add */
  jobsList.add({
    list_js_title,
    list_js_office,
    list_js_custom_department,
    list_js_parent_department,
    list_js_child_department,
    list_js_href,
    list_js_id,
    id
  });

  /* display job (fade in) */ 
  let jobNode = document.getElementById(id);
  if(jobNode !== null){
    jobNode.style.pointerEvents = "initial";
    jobNode.classList.add('animate__animated','animate__fadeIn', 'animate__faster');
  }

  /* hide divider if no sub category */
  if(parent_id == null){ 
    //console.log(index);
    $("[list_js_child_department_divider]").eq(index).css("display", "none");
  }else{
    $("[list_js_child_department_divider]").eq(index).css("display", "inline-block");
  }

  /* Remove parent_department node if empty (Data{parent}: BI{child}) VS (Product Management{no parent}) */
  if(parent_department == "no_childs"){
    //console.log("no_childs", list_js_child_department, list_js_parent_department);
    $(`#${item.id} [list_js_parent_divider]`).hide()
  }else{
    $(`#${item.id} [list_js_parent_divider]`).show()
  }
}

function formatString(string){
  //console.log("string", string);
  return string.toLowerCase()
}

