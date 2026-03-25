import { STUDENT_NAMES, DAYS, MONTHS, LECTURER_COURSES } from '../data/constants.js';

export const fmt  = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
export const today = () => fmt(new Date());

export const fmtDisplay = key => {
  const d = new Date(key+"T00:00:00");
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()}`;
};

export const generateStudents = (code, n=14) =>
  STUDENT_NAMES.slice(0,n).map((name,i)=>({
    id:`${code}-${i+1}`, matric:`ABU/2021/${String(2000+i*7).padStart(4,"0")}`, name, level:"200L"
  }));

export function seedAttendance() {
  const data={};
  ["2026-03-03","2026-03-05","2026-03-10","2026-03-12","2026-03-17"].forEach(dateKey=>{
    LECTURER_COURSES.forEach(c=>{
      if(!data[c.code]) data[c.code]={};
      data[c.code][dateKey]={ label:"Lecture", locked:true };
      generateStudents(c.code).forEach(s=>{ data[c.code][dateKey][s.id]=Math.random()>0.2?"present":"absent"; });
    });
  });
  return data;
}
