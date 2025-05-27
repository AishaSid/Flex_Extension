// FOR FLEX MARKS --- by fahad sheikh
const marksForm = document.getElementById("btn");
if (marksForm) { marksForm.addEventListener('click', handleMarksFormSubmit);}
else{console.log("there is error");}

//TO SHOW THE BUTTONS
const btn2 = document.getElementById("btn-2");
if (btn2) { btn2.addEventListener('click', predButton);}
else{ console.log("there is error >.<");}

//GRADES
document.getElementById('grade1').addEventListener('submit', absPredict);
document.getElementById('grade2').addEventListener('submit', gradePredict);

//TO SHOW THE GPA
const gpa = document.getElementById("gpa");
if (gpa) { gpa.addEventListener('click', manageGPA);}
else{ console.log("there is error >.<");}

//TO SHOW THE Grades
const grade = document.getElementById("grades");
if (grade) { grade.addEventListener('click', manageGrades);}
else{ console.log("there is error >.<");}

var g_form = null;


async function handleMarksFormSubmit(event) 
{
  event.preventDefault();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url;
  if (tab?.url) 
  {
    try 
    {
      url = new URL(tab.url);
      if (url.hostname !== "flexstudent.nu.edu.pk")
      {
        alert("Please open the FlexStudent website first.");
        return;
      }
    }
    catch 
    {
      console.log("there is error in catch");
      return;
    }
  }
  Options.classList.add('hidden');
  if(g_form !== null)
    {g_form.classList.add('hidden');}
  
  var fahad = document.getElementsByClassName("fahad")[0];
  fahad.innerText = "Credits to Fahad Sheikh xD";

  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: marksMainFunction });
}
async function marksMainFunction() 
{
  
  if (!window.location.href.includes("Student/StudentMarks"))
  {
    alert("Please Open Marks Page First");
    return;
  }
  const getTd = (className, id) => 
  {
    const td = document.createElement('td');
    td.classList.add("text-center");
    td.classList.add(className);
    td.id = id;
    return td;
  }
  const getTr = (id) => 
  {
    const tr = document.createElement('tr');
    tr.classList.add("totalColumn_" + id);
    tr.appendChild(getTd("totalColGrandTotal", "GrandtotalColMarks_" + id));
    tr.appendChild(getTd("totalColObtMarks", "GrandtotalObtMarks_" + id));
    tr.appendChild(getTd("totalColAverageMark", "GrandtotalClassAvg_" + id));
    tr.appendChild(getTd("totalColMinMarks", "GrandtotalClassMin_" + id));
    tr.appendChild(getTd("totalColMaxMarks", "GrandtotalClassMax_" + id));
    tr.appendChild(getTd("totalColStdDev", "GrandtotalClassStdDev_" + id));
    return tr;
  }
  async function set_marks(courseId, id) 
  {
    var temp = "totalColumn_" + id;
    var grandTotal = 0;
    var totalObtained = 0;
    var totalAverage = 0;
    var totalMinimum = 0;
    var totalMaximum = 0;

    const course = document.getElementById(courseId);
    if (!course)
      {
      return;
    }
    const totalRows = course.querySelectorAll(`.${temp}`);
    if (!totalRows) {
      return;
    }
    for (let i = 0; i < totalRows.length; i++) {
      const row = totalRows[i];
      const weightage = row.querySelector('.totalColweightage');
      if (weightage && weightage.textContent != "") {
        grandTotal += parseFloat(weightage.textContent);
      }
      const obtMarks = row.querySelector('.totalColObtMarks');
      if (obtMarks && obtMarks.textContent != "") {
        totalObtained += parseFloat(obtMarks.textContent);

      }
    }
    const calculationRows = course.querySelectorAll(`.calculationrow`);
    if (!calculationRows)
    {
      return;
    }
    for (let i = 0; i < calculationRows.length; i++) {
      const row = calculationRows[i];
      const averageMarks = row.querySelector('.AverageMarks');
      const totalMarks = row.querySelector('.GrandTotal');
      const minMarks = row.querySelector('.MinMarks');
      const maxMarks = row.querySelector('.MaxMarks');
      const weightage = row.querySelector('.weightage');
      if (averageMarks && averageMarks.textContent != "" && totalMarks && totalMarks.textContent != "" && weightage && weightage.textContent != "" && minMarks && minMarks.textContent != "" && maxMarks && maxMarks.textContent != "") {
        const avg = parseFloat(averageMarks.textContent) * parseFloat(weightage.textContent) / parseFloat(totalMarks.textContent);
        totalAverage += avg;

        const min = parseFloat(minMarks.textContent) * parseFloat(weightage.textContent) / parseFloat(totalMarks.textContent);
        totalMinimum += min;

        const max = parseFloat(maxMarks.textContent) * parseFloat(weightage.textContent) / parseFloat(totalMarks.textContent);
        totalMaximum += max;
      }
    }
    if ((!isNaN(grandTotal))) {
      document.getElementById(`GrandtotalColMarks_${id}`).textContent = grandTotal.toFixed(2);
    }
    if ((!isNaN(totalObtained))) {
      document.getElementById(`GrandtotalObtMarks_${id}`).textContent = totalObtained.toFixed(2);
    }
    if ((!isNaN(totalAverage))) {
      document.getElementById(`GrandtotalClassAvg_${id}`).textContent = totalAverage.toFixed(2);
    }
    if ((!isNaN(totalMinimum))) {
      document.getElementById(`GrandtotalClassMin_${id}`).textContent = totalMinimum.toFixed(2);
    }
    if ((!isNaN(totalMaximum))) {
      document.getElementById(`GrandtotalClassMax_${id}`).textContent = totalMaximum.toFixed(2);
    }
  }

  const courses = document.querySelectorAll(`div[class*='tab-pane']`); 

  for (let i = 0; i < courses.length; i++) 
  {
    const courseId = courses[i].id;
    const button = courses[i].querySelector(`button[onclick*="ftn_calculateMarks"]`);
    if (button) {
      const id = parseInt(button.getAttribute('onclick').substring(20, 24));
      const newTr = getTr(id);
      courses[i].querySelector(`div[id=${courses[i].id}-Grand_Total_Marks]`).querySelector('tbody').innerHTML = '';
      courses[i].querySelector(`div[id=${courses[i].id}-Grand_Total_Marks]`).querySelector('tbody').appendChild(newTr);
      set_marks(courseId, id);
    }
  }
}
function predButton()
{
  var fahad = document.getElementsByClassName("fahad")[0];
  fahad.innerText= "";

  var Options = document.getElementById('Options');

    if (Options.classList.contains('hidden')) 
    {
      Options.classList.remove('hidden');
    } else 
    {
      Options.classList.add('hidden');
    }
    var fahad = document.getElementsByClassName("fahad")[0];
    fahad.innerText = (`Credits to Aisha S 22i-1281`);
    if(g_form !== null)
    {g_form.classList.add('hidden');}
}

//GRADES
function manageGrades()
{

  let body = document.querySelector('body');
  body.style.backgroundColor = "#2C3845";
  body.style.color = "#D6DBE0"
  let btn = document.querySelectorAll('button');
  btn.forEach((btns)=>
     {btns.style.backgroundColor = "#E80457"
      btns.addEventListener('mouseover', () => btns.style.backgroundColor = "#D90368");
      btns.addEventListener('mouseout', () => btns.style.backgroundColor = "#E80457");
      btns.addEventListener('mousedown', () => 
        {
        btns.style.backgroundColor = "#C81045";
        btns.style.transform = "scale(0.95)";
        });
      btns.addEventListener('mouseup', () => 
        {
        btns.style.backgroundColor = "#E80457";
        btns.style.transform = "scale(1)";
        });
     });
   

  var form1;
  if(g_form === null)
  { 
    form1 = document.getElementById('Grade1');
    g_form = form1;
    form1.classList.remove('hidden'); 
    return;
  }
  else
  {
    g_form.classList.add('hidden');
    form1 = document.getElementById('Grade1');
  }
    g_form = form1;
    form1.classList.remove('hidden');   
}
//GPA
function manageGPA()
{
  let body = document.querySelector('body');
  body.style.backgroundColor = "#1f0450";
  body.style.color = "#e6d0fc"
  let btn = document.querySelectorAll('button');
  btn.forEach((btns)=>
     {btns.style.backgroundColor = "#4014a0"
      btns.style.color = "#f3ddf9";
      btns.addEventListener('mouseover', () => btns.style.backgroundColor = "#5227b1");
      btns.addEventListener('mouseout', () => btns.style.backgroundColor = "#4014a0");
      btns.addEventListener('mousedown', () => 
        {
        btns.style.backgroundColor = "#27076b";
        btns.style.transform = "scale(0.95)";
        });
      btns.addEventListener('mouseup', () => 
        {
        btns.style.backgroundColor = "#4014a0";
        btns.style.transform = "scale(1)";
        });
     });

     var form1;
     if(g_form === null)
     { 
       form1 = document.getElementById('Grade2');
       g_form = form1;
       form1.classList.remove('hidden'); 
       return;
     }
     else
     {
       g_form.classList.add('hidden');
       form1 = document.getElementById('Grade2');
     }
       g_form = form1;
       form1.classList.remove('hidden');  
}

//GRADE1 
function absPredict(event) 
{
  event.preventDefault();
  var abc = document.getElementsByClassName("result1")[0];

  let avg_abs = parseFloat(document.getElementById('avg_abs').value);   //from user
  let your_abs = parseFloat(document.getElementById('your_abs').value);  
  let total_abs = parseFloat(document.getElementById('total_abs').value); //from user
  let rem_abs = 100 - total_abs;
  let avg_grade = document.getElementById('avg_grade').value; // B
  let wish_grade = document.getElementById('wish_grade').value;
let av_perc = avg_abs / total_abs;
let ans = (rem_abs * av_perc);  


const gradeOrder = [ "F","D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+"];

let a = gradeOrder.indexOf(wish_grade);
let b = gradeOrder.indexOf(avg_grade);
let ans2 = (a - b) * 4;

if (isNaN(total_abs) || isNaN(avg_abs) || isNaN(your_abs) || (a === -1)|| (b === -1) || total_abs > 100 || avg_abs >= 100 || your_abs >= 100)
  {
    abc.innerText = "Please enter valid entries";
    return;
  }

if (rem_abs <= 1)
{
  let g = (your_abs - avg_abs) / 4;
  let min_grade = gradeOrder[b + Math.floor(g)];
  let max_grade = gradeOrder[b + Math.floor(g) + 1];
  
  if (min_grade === "A+" || (min_grade === undefined && g > 0 ))
    { 
      min_grade = "A+";
      max_grade = "A+";
    }
  if(max_grade === "F" ||  max_grade === undefined)
    {
    min_grade ="F";
    max_grade ="F";
    }

  let result1 =  (`Your Req grade maybe at: ${(ans2+avg_abs).toFixed(2)} (or -3 abs) -> ${wish_grade}\nAvg abs: ${(avg_abs).toFixed(2)} -> ${avg_grade}\nYour predicted Grade is min ${min_grade}`);
  if(min_grade !== max_grade)
   result1 += (` and max ${max_grade}`);

  abc.innerText = result1;
  return;
}
else if ( (rem_abs) <= (ans2+avg_abs - your_abs + ans +3) )
  {
    avg_abs += ans +3;
    if (ans2+avg_abs >= 100 || ans2+avg_abs <= 20)
    {
      abc.innerText = "Please enter valid entries.";
      return;
    }
  let result1 =  (`Total abs req: ${(ans2+avg_abs).toFixed(2)} -> ${wish_grade}\nPredicted avg abs: ${(avg_abs).toFixed(2)} -> ${avg_grade}\n${(ans2+avg_abs - your_abs).toFixed(2)} out of ${(rem_abs).toFixed(2)} Summer me milte hein xD`);
  abc.innerText = result1;
  return;
  }
else
{
  avg_abs += ans +3;

  if (ans2+avg_abs >= 100  || ans2+avg_abs <= 20)
    {
      abc.innerText = "Please enter valid entries.";
      return;
    }
  let result1 =  (`Total abs req: ${(ans2+avg_abs).toFixed(2)} -> ${wish_grade}\nPredicted avg abs: ${(avg_abs).toFixed(2)} -> ${avg_grade}\nYou Need a total of ${(ans2+avg_abs - your_abs).toFixed(2)} abs out of Remaining total abs: ${(rem_abs).toFixed(2)}\n ${typeof(rem_abs)} <= ${typeof(ans2+avg_abs +3 - your_abs)}`);
  abc.innerText = result1;
  return;
}
}

//GRADE2
function gradePredict(event) 
{
  event.preventDefault();
  var abc = document.getElementsByClassName("result2")[0];

let avg_abs = parseFloat(document.getElementById('avg_abs1').value); 
let your_abs = parseFloat(document.getElementById('your_abs1').value);  
let max_abs = parseFloat(document.getElementById('max_abs').value); 

const gradeOrder = [ "F","D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+"];

  if(isNaN(max_abs) || isNaN(avg_abs) || isNaN(your_abs) || your_abs > max_abs || avg_abs >= max_abs || max_abs >=100 || max_abs <= 0 || avg_abs <= 0 || your_abs <= 0)
  {
    abc.innerText = "Should Enter valid values";
    return;
  }
  
  let a = Math.floor((max_abs - avg_abs) / 4);
  let b = Math.floor((max_abs - your_abs) / 4);
  let index1 = gradeOrder.length-1-a
  let index2 = gradeOrder.length-1-b
  let g1 = gradeOrder[index1];
  let g2 = gradeOrder[index2];
  if(index1 <=0)
    g1 = "F";
  if(index2 <=0)
    g2 = "F";   

let res = `Let's say highest is ${max_abs} -> A+ and A is at ${max_abs-4}\nGrade of average is ${avg_abs} ->${g1} and your grade is ${your_abs} -> ${g2}`;

abc.innerText = res;
}

