import { setting } from "./global_setting.js";
/* PRE STEP: 
        List Js "valueNames" support only class selectors:
        To avoid the risk that someone will rename the class names under WB editor 
        1. Add data attribute under webflow to item X
        2. By code add class to this item.
  */

export function format_value_of_url_param_and_dropdown_value_and_job_values(string){
  return string;
}

/* NOT IN USE ON WEBFLOW project (set as paste code under project setting) */
export function _gh_src__add_gh_src_param_to_each_website_link(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  /* url param value */
  const gh_src_url_param_value = urlParams.get("gh_src");

  /* case 1 the gh_src already sets on another page */
  if(gh_src_url_param_value == null){
    /* do nothing */
    console.log("no gh_src url param");
  }else{
    console.log("with param gh_src => set sessionStorage");
    sessionStorage.setItem('gh_src', gh_src_url_param_value);
  }

  /* Set param to Links */
  const main_website_url = "www.lightricks.com";
  let $links_to_main_website = $(`a[href*="${main_website_url}"]`);
  /* localStorage value */
  const gh_src_localStorage_value = sessionStorage.getItem("gh_src");

  $links_to_main_website.each(function(i){
    let current_url = $(this).attr("href");
    $(this).attr("href",current_url + `?gh_src=${gh_src_localStorage_value}`);

  });
}

/*addClassToAttributeSelector(webflow attribute added under the designer, class added to this item by code) */
export function addClassToAttributeSelector(attributeSelector, className){
  const items = document.querySelectorAll(`[${attributeSelector}]`);
  if(items.length == 0 && window.location.pathname == setting.baseURL && window.location.pathname !== "/position"){
    console.error(`[${attributeSelector}] selector not found in your HTML markup. Add [${attributeSelector}] attribute to your desire element`);
  }
  items.forEach((item) => {
    item.classList.add(`${className}`);
  });
}


export function check_if_department_exsist({departments}, paste_to){
  var found = departments.find(function(department) {
    return department.name == paste_to;
  });

  if(found == undefined){
    found = false;
  }else{
    found = true;
  }
  return found;
}


export function get_parent_departmentName_byId(departments, parent_id){
  var found = departments.find(function(parent_element) {
    return parent_element.id == parent_id;
  });

  // console.log("result", found);
  if(found != undefined){
    /* for Data is the parent of BI */
    return found.name;
  }else{
    /* for example Operations is no parent (no childs) */
    return "no_childs";
  }

}

export function get_parent_departmentID_byName(departments, parent_name){
  var found = departments.find(function(parent_element) {
    //console.log("parent_element", parent_element);
    return parent_element.name == parent_name;
  });

  // console.log("result", found);
  if(found != undefined){
    /* for Data is the parent of BI */
    return found.id;
  }else{
    /* for example Operations is no parent (no childs) */
    return "no_childs";
  }

}
