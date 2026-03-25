export const COURSES = [
  { code:"STAT 201", name:"Discrete Probability Distributions", tutor:"Musa'ab Silas",       students:109, assignments:0, quizzes:4  },
  { code:"COSC 203", name:"Discrete Structures",                tutor:"Khadija Hassan",       students:110, assignments:0, quizzes:15 },
  { code:"COSC 205", name:"Digital Logic Design",               tutor:"Ahmad Jafar",          students:112, assignments:0, quizzes:7  },
  { code:"COSC 211", name:"Object-Oriented Programming I",      tutor:"Ahmad Shamsudeen",     students:120, assignments:0, quizzes:4  },
  { code:"MATH 201", name:"Mathematical Methods I",             tutor:"Dr Musa Salember",     students:169, assignments:0, quizzes:7  },
  { code:"MATH 207", name:"Linear Algebra I",                   tutor:"Muhammad Abubakar",    students:153, assignments:5, quizzes:17 },
  { code:"MATH 209", name:"Numerical Analysis I",               tutor:"Abubakar Abdulkarim",  students:154, assignments:0, quizzes:0  },
  { code:"GENS 101", name:"Nationalism",                        tutor:"Muhammad A. Ishiyaku", students:120, assignments:0, quizzes:0  },
  { code:"GENS 103", name:"English and Communication Skills",   tutor:"Rukayya Funmilayo",    students:98,  assignments:2, quizzes:3  },
];

export const LECTURER_COURSES = COURSES.slice(0,4);

export const STUDENT_NAMES = [
  "Abdullahi Ibrahim","Fatima Yusuf","Usman Bello","Zainab Musa","Aliyu Garba",
  "Hafsat Suleiman","Muhammad Adamu","Aisha Tukur","Ibrahim Danladi","Maryam Kabir",
  "Chukwuemeka Obi","Ngozi Eze","Babatunde Adewale","Amaka Okonkwo","Emeka Nwosu",
  "Rukayya Shehu","Sani Haruna","Bilkisu Lawal","Ahmed Mustapha","Hauwa Ismail",
];

export const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
export const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

export const C = { 
  blue:"#2c7be5", 
  green:"#27ae60", 
  red:"#e74c3c", 
  orange:"#f39c12",
  purple:"#8e44ad", 
  dark:"#1a1a2e", 
  teal:"#16a085", 
  sidebar:"#f8f9fc" 
};
