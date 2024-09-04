import { setting } from "./global_setting.js";
import { jobs, meta } from "../api_get/jobs.js";
import { departments_as_tree } from "../api_get/departments_as_tree.js";
//import { departments_as_list } from "/js/api_get/departments_as_list.js";
import { offices } from "../api_get/offices.js";
import {get_career_Site_department_value_from_job} from "../website_override_feild/website_override_helper_functions.js"


/* The mission of this function */

/* 1. convert the Complex API data to this structure (For pagelists section) 
    1. haifa 12 
    2. jerusalem 56
    {{name}} {{total jobs} {{order}}}
    */
/* 2 . Reorder mannualy the data
    1. jerusalem 56 (order 1)
    2. haifa 12 (order 2)
     */
/* departments => same idea */
/*
    1. R & D : 26
    1. Marketing : 16
    */

//let departments_list = departments_as_list.departments;


/* ############################################### Render ############################################## */
export async function reformat_api_data(departments_tree, offices, show_empty_items = true) {
  let departments_values;
  let departments_values_sort;

  let group_jobs_by_office_object_2 = _.groupBy(jobs, "offices[0].name"); /* group jobs by office */


  let group_jobs_by_office_object = _.groupBy(jobs, function (job) {
    let value_to_return;
    if(job.offices.length > 1){
      //console.log("Two offices", job.location.name)
      value_to_return = job.location.name;
    }else{
      value_to_return = job.offices[0].name;

    }

    return value_to_return;

  });



  let office_values =  data_under_office(offices, group_jobs_by_office_object);/* list of objects { name, count, order } */
  let custom_departments_reformat = data_under_CUSTOM_department_Feild();
  //console.log("departments_values", departments_values)


  //render_items(office_values,departments_values);
  // Use of _.sortBy() method
  let office_values_sort = _.sortBy(office_values, 
                                    [function(o) { return o.list_js_order; }]);


  /*- ♻︎♻︎♻︎♻︎♻︎♻︎ OPTION 1 Render From API departments_tree ♻︎♻︎♻︎♻︎♻︎♻︎*/
  departments_values = data_under_department(departments_tree, show_empty_items);/* list of objects { name, count, order } */
  departments_values_sort = _.sortBy(departments_values,[function(o) { return o.list_js_order; }]);

  /*- ♻︎♻︎♻︎♻︎♻︎♻︎ OPTION 2 Render From API custom category feild ♻︎♻︎♻︎♻︎♻︎♻︎*/

  const value_example = [
    {
      "name": "All Teams",
      "value": "all",
      "selected": true
    },
    {
      "list_js_name": "R&D",
      "list_js_count": 7,
      "list_js_order": 1,
      "list_js_href": "careers.html?query=&office=all&department=R_D",
      "list_js_id": 4029082002,
      "name": "R&D",
      "value": "R_D",
      "selected": ""
    },
  ];



  let data = {
    offices_reformat: office_values_sort, 
    departments_reformat: departments_values_sort,
    custom_departments_reformat: custom_departments_reformat
  };

  return data;

};


/* 😀😀😀😀😀😀😀NEW 2024😀😀😀😀😀😀😀😀 */
function data_under_CUSTOM_department_Feild(){
  let custom_departments_object = [];
  /* data */
  let custom_departments_group = _.groupBy(jobs, function (job) {
    return get_career_Site_department_value_from_job(job.metadata);
  });
  /* loop */
  Object.entries(custom_departments_group).forEach(([key, value]) => {
    let custom_category_name = key == null ? String(null) : key;
    let custom_category_name_href = custom_category_name.replace('&', '%26');


    const this_department = value[0];
    let href = `${setting.baseURL}?query=&office=all&department=${custom_category_name_href}`;




    var obj = {
      list_js_name: custom_category_name,
      list_js_count: value.length,
      //list_js_order: order,
      list_js_href: href,
      list_js_id: this_department.id,
      // dropdown values
      name: custom_category_name,
      value: custom_category_name,
      selected: ""
    };/* end object */

    custom_departments_object.push(obj);

  });

  custom_departments_object = _.sortBy(custom_departments_object, 
                                    [function(o) { return o.list_js_name; }]);

  return custom_departments_object;

}





/* get data_object from custom Category feild */
function data_under_department(departments, show_empty_items){
  var departments_object = [];
  departments.forEach(item => {

    let total_jobs_under_parent_department = 0; 
    /* 
                                      For example for Data:
                                      count how much jobs under: 
                                      Data 
                                      Data > BI
                                      Data > Data Engineering 
                                      Data > Data Science 
                                      */
    //total_jobs_under_parent_department += item.jobs.length; /* parent count */
    if(item.children.length > 0){ /* childs count */
      item.children.forEach(department_children => {
        total_jobs_under_parent_department += department_children.jobs.length;
        //console.log(item.name, "department_children.jobs.length", department_children.jobs.length, total_jobs_under_parent_department);
      });
    }

    total_jobs_under_parent_department += item.jobs.length;
    //console.log(item.name, "item.jobs.length", item.jobs.length, total_jobs_under_parent_department);


    /*## HELPER - set the order mannualy (No way to make this with some auto logic) */
    let manually_order = setDepartmentOrder__Mannualy(item.name);

    if(total_jobs_under_parent_department > 0){

      let item_value = item.name.replace('&', '_');
      let mode_showEmpty = true;
      let toShowEmpty = total_jobs_under_parent_department == 0 || mode_showEmpty ? true : false;
      let href = `${setting.baseURL}?query=&office=all&department=${item_value}`;


      var obj = {
        list_js_name: item.name,
        list_js_count: total_jobs_under_parent_department,
        list_js_order: manually_order,
        list_js_href: href,
        list_js_id: item.id,
        // dropdown values
        name: item.name,
        value: item_value,
        selected: ""
      };

      if(toShowEmpty){
        departments_object.push(obj);
      }
    }
  }); /* end forEach */

  function setDepartmentOrder__Mannualy(dep_name){
    var order; /* number */
    switch (dep_name) {
      case 'R&D':
        order = 1;
        break;
      case 'Creative & Design':
        order = 2;
        break;
      case 'Data':
        order = 3;
        break;
      case 'Marketing':
        order = 4;
        break;
      case 'Product Management':
        order = 5;
        break;
      case 'Business & Partnerships':
        order = 6;
        break;
      case 'IT & Security':
        order = 7;
        break;
      case 'Customer Experience':
        order = 8;
        break;
      case 'Operations':
        order = 9;
        break;
      case 'People (HR)':
      case 'People(HR)':
      case 'People':
        order = 10;
        break;
      case 'Finance ':
        order = 11;
        break;
      case 'Legal':
      case 'Finance & Legal':
        order = 12;
        break;
      default:
        order = 9999;/*no match put the item in the end of the list */
    }
    return order;
  }
  return departments_object;


}

function data_under_office(offices, group_jobs_by_office_object){
  var objects_office = [];



  for (var i = 0; i < offices.length; i++) {
    var office_name = offices[i].name;

    var order = setOfficeOrder__Mannualy(office_name);
    var name = group_jobs_by_office_object[office_name];

    if(name !== undefined){
      var number_of_jobs_under_this_office = group_jobs_by_office_object[office_name].length;

      //console.log(number_of_jobs_under_this_office);

      /* Mode (Show empty list -or- not) */
      let mode_showEmpty = false;
      let toShowEmpty = number_of_jobs_under_this_office > 0 || mode_showEmpty ? true : false;
      let href = `${setting.baseURL}?query=&office=${office_name}&department=all`
      var obj = {
        list_js_name: office_name,
        list_js_count: number_of_jobs_under_this_office,
        list_js_order: order,
        list_js_href: href,
        list_js_id: offices[i].id,
        // dropdown values
        name: office_name,
        value: `${office_name}`,
        selected: ""
      };
      if(toShowEmpty){
        objects_office.push(obj);
      }/* inner IF */

    }
  }// end for






  function setOfficeOrder__Mannualy(office_name){
    var order; /* number */
    switch (office_name) {
      case 'Jerusalem':
        order = 1;
        break;
      case 'Haifa':
        order = 2;
        break;
      case 'London':
        order = 3;
        break;
      case 'Shenzhen':
        order = 4;
        break;
      case 'USA':
      case 'US':
        order = 5;
        break;
      default:
        order = 9999;/*no match put the item in the end of the list */
    }
    return order;
  }

  return objects_office;
}








