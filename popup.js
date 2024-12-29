const marksForm = document.getElementById("grand-marks");
marksForm.addEventListener("submit", handleMarksFormSubmit);
// FOR FLEX MARKS --- by fahad sheikh
const marksForm = document.getElementById("btn");
if (marksForm) { marksForm.addEventListener('click', handleMarksFormSubmit);}
else{console.log("there is error");}

const feedbackForm = document.getElementById("feedback-form");
feedbackForm.addEventListener("submit", handleFeedbackFormSubmit);
//TO SHOW THE BUTTONS
const btn2 = document.getElementById("btn-2");
if (btn2) { btn2.addEventListener('click', predButton);}
else{ console.log("there is error >.<");}

const gpaCalculatorForm = document.getElementById("gpa-calculator");
gpaCalculatorForm.addEventListener("submit", handleCalculatorFormSubmit);
//GRADES
document.getElementById('grade1').addEventListener('submit', absPredict);
document.getElementById('grade2').addEventListener('submit', gradePredict);

const admitCardForm = document.getElementById("admit-card");
admitCardForm.addEventListener("submit", handleAdmitCardSubmit);
//TO SHOW THE GPA
const gpa = document.getElementById("gpa");
if (gpa) { gpa.addEventListener('click', manageGPA);}
else{ console.log("there is error >.<");}

async function handleMarksFormSubmit(event) {
  event.preventDefault();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url;
  if (tab?.url) {
    try {
      url = new URL(tab.url);
      if (url.hostname !== "flexstudent.nu.edu.pk") {
        alert("Please open the FlexStudent website first.");
        return;
      }
    } catch {}
  }
//TO SHOW THE Grades
const grade = document.getElementById("grades");
if (grade) { grade.addEventListener('click', manageGrades);}
else{ console.log("there is error >.<");}

  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: marksMainFunction });
}

async function handleCalculatorFormSubmit(event) {
  event.preventDefault();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url;
  if (tab?.url) {
    try {
      url = new URL(tab.url);
      if (url.hostname !== "flexstudent.nu.edu.pk") {
        alert("Please open the FlexStudent website first.");
        return;
      }
    } catch {}
  }

  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: calculatorMainFunction });
}

async function handleFeedbackFormSubmit(event) {
  event.preventDefault();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url;
  if (tab?.url) {
    try {
      url = new URL(tab.url);
      if (url.hostname !== "flexstudent.nu.edu.pk") {
        alert("Please open the FlexStudent website first.");
        return;
      }
    } catch {}
  }

  const input = document.querySelector('input[name="feedback-radio"]:checked');
  if (!input) {
    alert("Please select a feedback option first.");
    return;
  }
  Options.classList.add('hidden');
  if(g_form !== null)
    {g_form.classList.add('hidden');}
  
  var fahad = document.getElementsByClassName("fahad")[0];
  fahad.innerText = "Credits to Fahad Sheikh xD";

  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: feedbackMainFunction, args: [input.value] });
}

async function marksMainFunction() {
  if (!window.location.href.includes("Student/StudentMarks")) {
    alert("Please Open Marks Page First");
    return;
  }

  const getTd = (className, id) => {
    const td = document.createElement('td');
    td.classList.add("text-center");
    td.classList.add(className);
    td.id = id;
    return td;
  }

  const getTr = (id) => {
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

  const parseFloatOrZero = (value) => {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  const checkBestOff = (section, weightage) => {
    const calculationRows = section.querySelectorAll(`.calculationrow`);
    let weightsOfAssessments = 0;
    let count = 0;
    for (let row of calculationRows) {
      const weightageOfAssessment = parseFloatOrZero(row.querySelector('.weightage').textContent);
      weightsOfAssessments += weightageOfAssessment;

      if (weightage < weightsOfAssessments) {
        return count;
      }
      count++;
    }
    return count;
  }

  const reorderCalculationRows = (section, bestOff) => {
    const sectionArray = Array.from(section.querySelectorAll(`.calculationrow`));
    sectionArray.sort((a, b) => {
      const aObtained = parseFloatOrZero(a.querySelector('.ObtMarks').textContent);
      const bObtained = parseFloatOrZero(b.querySelector('.ObtMarks').textContent);
      return bObtained - aObtained;
    });
    return sectionArray.slice(0, bestOff);
  }

  async function set_marks(courseId, id) {
    const course = document.getElementById(courseId);
    const sections = course.querySelectorAll(`div[id^="${courseId}"]:not([id$="Grand_Total_Marks"])`);

    let globalWeightage = 0;
    let globalObtained = 0;
    let globalAverage = 0;
    let globalMinimum = 0;
    let globalMaximum = 0;
    
    for (let section of sections) {
      const totalRow = section.querySelector(`.totalColumn_${id}`);
      const localWeightage = parseFloat(totalRow.querySelector('.totalColweightage').textContent);
      const localObtained = parseFloat(totalRow.querySelector('.totalColObtMarks').textContent);

      globalWeightage += localWeightage;
      globalObtained += localObtained;

      // Check if there are any best off marks
      const bestOff = checkBestOff(section, localWeightage);
      const calculationRows = reorderCalculationRows(section, bestOff);

      for (let row of calculationRows) {
        const weightage = parseFloatOrZero(row.querySelector('.weightage').textContent);
        const obtained = parseFloatOrZero(row.querySelector('.ObtMarks').textContent);
        const total = parseFloatOrZero(row.querySelector('.GrandTotal').textContent);
        const average = parseFloatOrZero(row.querySelector('.AverageMarks').textContent);
        const minimum = parseFloatOrZero(row.querySelector('.MinMarks').textContent);
        const maximum = parseFloatOrZero(row.querySelector('.MaxMarks').textContent);

        globalAverage += average * (weightage / total);
        globalMinimum += minimum * (weightage / total);
        globalMaximum += maximum * (weightage / total);
      }
    }

    document.getElementById(`GrandtotalColMarks_${id}`).textContent = globalWeightage.toFixed(2);
    document.getElementById(`GrandtotalObtMarks_${id}`).textContent = globalObtained.toFixed(2);
    document.getElementById(`GrandtotalClassAvg_${id}`).textContent = globalAverage.toFixed(2);
    document.getElementById(`GrandtotalClassMin_${id}`).textContent = globalMinimum.toFixed(2);
    document.getElementById(`GrandtotalClassMax_${id}`).textContent = globalMaximum.toFixed(2);
  }

  const courses = document.querySelectorAll(`div[class*='tab-pane']`); // Get all courses

  for (let i = 0; i < courses.length; i++) {
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

async function feedbackMainFunction(input) {
  if (!window.location.href.includes("Student/FeedBackQuestions")) {
    alert("Please Open Feedback Page of a Specific Course First");
    return;
  }

  function selectSpecificRadio(element, input) {
    const radioButtonsSpan = element.getElementsByClassName('m-list-timeline__time');
    for (let i = 0; i < radioButtonsSpan.length; i++) {
        if (radioButtonsSpan[i].textContent.trim() === input) {
            const radioButton = radioButtonsSpan[i].querySelector('input[type="radio"]');
            radioButton.checked = true;
            break;
        }
    }
  }
  
  function selectSpecificFeedback(input) {
    const questions = document.getElementsByClassName('m-list-timeline__item');
    Array.from(questions).forEach(question => {
        selectSpecificRadio(question, input);
    });
  }
  
  function selectRandomFeedback() {
    const questions = document.getElementsByClassName('m-list-timeline__item');
    Array.from(questions).forEach(question => {
        const radioButtonsSpan = question.getElementsByClassName('m-list-timeline__time');
        const randomIndex = Math.floor(Math.random() * radioButtonsSpan.length);
        const radioButton = radioButtonsSpan[randomIndex].querySelector('input[type="radio"]');
        radioButton.checked = true;
    });
  }

  input === "Randomize" ? selectRandomFeedback() : selectSpecificFeedback(input);
} 
    var fahad = document.getElementsByClassName("fahad")[0];
    fahad.innerText = (`Credits to Aisha S 22i-1281`);
    if(g_form !== null)
    {g_form.classList.add('hidden');}
}

async function calculatorMainFunction() {
  if (!window.location.href.includes("Student/Transcript")) {
    alert("Please Open Transcript Page first");
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

  const getSelect = (currGrade) => {
    return `<select>
      <option value="-1">-</option>
      <option value="4" ${currGrade == 'A+' || currGrade == 'A' ? 'selected' : ''}>A/A+</option>
      <option value="3.67" ${currGrade == 'A-' ? 'selected' : ''}>A-</option>
      <option value="3.33" ${currGrade == 'B+' ? 'selected' : ''}>B+</option>
      <option value="3" ${currGrade == 'B' ? 'selected' : ''}>B</option>
      <option value="2.67" ${currGrade == 'B-' ? 'selected' : ''}>B-</option>
      <option value="2.33" ${currGrade == 'C+' ? 'selected' : ''}>C+</option>
      <option value="2" ${currGrade == 'C' ? 'selected' : ''}>C</option>
      <option value="1.67" ${currGrade == 'C-' ? 'selected' : ''}>C-</option>
      <option value="1.33" ${currGrade == 'D+' ? 'selected' : ''}>D+</option>
      <option value="1" ${currGrade == 'D' ? 'selected' : ''}>D</option>
      <option value="0" ${currGrade == 'F' ? 'selected' : ''}>F</option>
    </select>`;
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

  const getSUcredithours = () => {
    return Array.from(document.getElementsByTagName('td'))
        .filter((td) => td.innerText == 'S' || td.innerText == 'U')
        .reduce((total, curr) => total + parseInt(curr.previousElementSibling.innerText), 0);
  }
//GRADE1 
function absPredict(event) 
{
  event.preventDefault();
  var abc = document.getElementsByClassName("result1")[0];

  let semesters = document.getElementsByClassName("col-md-6");
  let lastSemester = semesters[semesters.length - 1];
  let spans = lastSemester.querySelectorAll("span");
  
  let cgpa = 0;
  let cgpaelem = spans[2];
  let sgpaelem = spans[3];
  let avg_abs = parseFloat(document.getElementById('avg_abs').value);   //from user
  let your_abs = parseFloat(document.getElementById('your_abs').value);  
  let total_abs = parseFloat(document.getElementById('total_abs').value); //from user
  let rem_abs = 100 - total_abs;
  let avg_grade = document.getElementById('avg_grade').value; // B
  let wish_grade = document.getElementById('wish_grade').value;
let av_perc = avg_abs / total_abs;
let ans = (rem_abs * av_perc);  

  let crEarned = 0;

  if(semesters.length > 1){
    let secondLastSemester = semesters[semesters.length - 2];
    crEarned = parseInt(secondLastSemester.querySelectorAll("span")[1].innerText.split(':')[1]);
    cgpa = parseFloat(secondLastSemester.querySelectorAll("span")[2].innerText.split(':')[1]);
  }
 
  let rows = lastSemester.querySelectorAll('tbody > tr');
const gradeOrder = [ "F","D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+"];

let a = gradeOrder.indexOf(wish_grade);
let b = gradeOrder.indexOf(avg_grade);
let ans2 = (a - b) * 4;

  for (let row of rows) {
    row.querySelectorAll('td.text-center')[1].innerHTML = getSelect(row.querySelectorAll('td.text-center')[1].innerText);
if (isNaN(total_abs) || isNaN(avg_abs) || isNaN(your_abs) || (a === -1)|| (b === -1) || total_abs > 100 || avg_abs >= 100 || your_abs >= 100)
  {
    abc.innerText = "Please enter valid entries";
    return;
  }

  const getCorrespondingCreditHours = (selectelem) => parseInt(selectelem.parentElement.previousElementSibling.innerText);

  const handleSelectChange = (e) => {
    let selects = document.getElementsByTagName('select');
    let totalCreditHours = 0;
    let totalGradePoints = 0;
    for (let select of selects) {
      if (select.value != -1) {
        totalCreditHours += getCorrespondingCreditHours(select);
        totalGradePoints += parseFloat(getCorrespondingCreditHours(select)) * parseFloat(select.value);
        select.parentElement.nextElementSibling.innerText = select.value;
        select.parentElement.nextElementSibling.style.fontWeight = 'bold';
      } else {
        select.parentElement.nextElementSibling.innerText = '-';
        select.parentElement.nextElementSibling.style.fontWeight = 'normal';
      }
    }
    if (totalCreditHours == 0) {
      cgpaelem.innerHTML = `CGPA: ${cgpa.toFixed(2)}`;
      sgpaelem.innerHTML = `SGPA: 0`;
      return;
  if(max_grade === "F" ||  max_grade === undefined)
    {
    min_grade ="F";
    max_grade ="F";
    }
    let calculatedSGPA = totalGradePoints / totalCreditHours;
    let actualCreditHoursEarned = crEarned - getSUcredithours();
    let calculatedCGPA = (cgpa * actualCreditHoursEarned + calculatedSGPA * totalCreditHours) / (actualCreditHoursEarned + totalCreditHours);

    cgpaelem.innerHTML = `CGPA: ${calculatedCGPA.toFixed(2)}`;
    sgpaelem.innerHTML = `SGPA: ${calculatedSGPA.toFixed(2)}`;

    // set cgpaelem and sgpaelem to bold
    cgpaelem.style.fontWeight = 'bold';
    sgpaelem.style.fontWeight = 'bold';
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

  // add event listener to all select elements
  Array.from(document.getElementsByTagName('select')).forEach((select) => {
    select.addEventListener('change', handleSelectChange)
  });

  handleSelectChange();
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

async function handleAdmitCardSubmit(event) {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url;
  if (tab?.url) {
    try {
      url = new URL(tab.url);
      if (url.hostname !== "flexstudent.nu.edu.pk") {
        alert("Please open the FlexStudent website first.");
        return;
      }
    } catch {}
  }
//GRADE2
function gradePredict(event) 
{
  event.preventDefault();
  var abc = document.getElementsByClassName("result2")[0];

  const input = document.getElementById("admit-card-radio");
  if (!input) {
    alert("Please select an option first.");
    return;
  }

  chrome.scripting.executeScript({ target: { tabId: tab.id }, function: admitCardMainFunction, args: [input.value] });
}
const gradeOrder = [ "F","D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+"];

async function admitCardMainFunction(inputValue) {
  if (!(inputValue === "Sessional-I" || inputValue === "Sessional-II" || inputValue === "Final")) {
    return;
  }
  const resp = await fetch(`https://flexstudent.nu.edu.pk/Student/AdmitCardByRollNo?cardtype=${inputValue}&type=pdf`, { 
    method: 'POST'
  });
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob); 

  let a = document.createElement('a');
  a.href = url;
  a.download = `Admit_Card_${inputValue}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
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

