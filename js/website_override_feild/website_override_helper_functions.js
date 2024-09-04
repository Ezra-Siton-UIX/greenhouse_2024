/* the id of the CRM custom feild */
export const Career_Site_CRM_Department_id = 97159457002; /* הערך במערכת ניהול זה לא משתנה */

/* get the value of job.metadata => "Career Site Department" custom feild (if empty the value is null) or "data", "Research" */
export function get_career_Site_department_value_from_job(job_array_metadata){
  const this_career_Site_department_name = job_array_metadata.find(ob=>(ob.id == Career_Site_CRM_Department_id)).value;
  //console.log("this_career_Site_department_value", this_career_Site_department_name);
  return this_career_Site_department_name;
}
