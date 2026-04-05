const API = "http://localhost:3000";

function addExpense(){

const title = document.getElementById("title").value;
const amount = document.getElementById("amount").value;
const category = document.getElementById("category").value;
const date = document.getElementById("date").value;

fetch(API + "/addExpense",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({title,amount,category,date})
})
.then(res=>res.text())
.then(data=>{
alert(data);
loadExpenses();
});

}



function openSidebar(){

document.getElementById("sidebar").style.width="250px";

}

function openMonthly(){
window.location.href="monthly.html";
}

function openYearly(){
window.location.href="yearly.html";
}

function closeSidebar(){

document.getElementById("sidebar").style.width="0";

}

function deleteRow(button){

let row = button.parentNode.parentNode;

row.remove();

}

function deleteExpense(id){

let confirmDelete = confirm("Are you sure you want to delete this expense?");

if(!confirmDelete){
  return; // stop if user clicks Cancel
}

fetch(API + "/deleteExpense/" + id, {
method: "DELETE"
})
.then(res => res.text())
.then(data => {
// remove this if you don’t want success alert
// alert(data);

loadExpenses(); // refresh table
});

}

/*
function editExpense(id, title, amount, category, date){

let newTitle = prompt("Enter Title:", title);
if(newTitle === null) return;

let newAmount = prompt("Enter Amount:", amount);
if(newAmount === null) return;

let newCategory = prompt("Enter Category:", category);
if(newCategory === null) return;

// Fix date format
let formattedDate = date.split("T")[0];
let newDate = prompt("Enter Date (YYYY-MM-DD):", formattedDate);
if(newDate === null) return;

// TRIM VALUES
newTitle = newTitle.trim();
newCategory = newCategory.trim();
newDate = newDate.trim();

// CONVERT AMOUNT TO NUMBER
newAmount = Number(newAmount);

// VALIDATION
if(!newTitle || isNaN(newAmount) || !newCategory || !newDate){
  alert("All fields required and amount must be valid!");
  return;
}

// DEBUG (IMPORTANT - check values)
console.log({id, newTitle, newAmount, newCategory, newDate});

// API CALL
fetch(API + "/updateExpense/" + id, {
method: "PUT",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
title: newTitle,
amount: newAmount,
category: newCategory,
date: newDate
})
})
.then(res => res.text())
.then(data => {
alert(data);
loadExpenses();
})
.catch(err=>{
console.log("Error:", err);
});

}
*/

function loadExpenses(){

fetch(API+"/expenses")
.then(res=>res.json())
.then(data=>{

let rows="";

let total = 0;
let todayTotal = 0;
let monthTotal = 0;
let titleMap = {};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

data.forEach(e=>{

// TABLE
rows += `
<tr>
<td>${e.title}</td>
<td>${e.amount}</td>
<td>${e.category}</td>
<td>${new Date(e.date).toLocaleDateString()}</td>
<td>


<i class="fa fa-trash" onclick="deleteExpense(${e.id})" style="cursor:pointer;color:red;"></i>
</td>
</tr>
`;

// TOTAL
total += Number(e.amount);

// TODAY (FIXED)
let expenseDate = new Date(e.date);
let todayDate = new Date();

if(
  expenseDate.getDate() === todayDate.getDate() &&
  expenseDate.getMonth() === todayDate.getMonth() &&
  expenseDate.getFullYear() === todayDate.getFullYear()
){
  todayTotal += Number(e.amount);
}

// MONTH
let d = new Date(e.date);
if(d.getMonth() === currentMonth && d.getFullYear() === currentYear){
  monthTotal += Number(e.amount);
}

// TITLE COUNT
if(titleMap[e.title]){
  titleMap[e.title] += Number(e.amount);
}else{
  titleMap[e.title] = Number(e.amount);
}

});

// FIND TOP CATEGORY
let topTitle = "-";
let max = 0;

for(let t in titleMap){
  if(titleMap[t] > max){
    max = titleMap[t];
    topTitle = t;
  }
}

// UPDATE DASHBOARD
document.getElementById("totalExpense").innerText = "₹"+total;
document.getElementById("todayExpense").innerText = "₹"+todayTotal;
document.getElementById("monthExpense").innerText = "₹"+monthTotal;
document.getElementById("topCategory").innerText = topTitle;

// UPDATE TABLE
document.getElementById("expenseList").innerHTML=rows;

});

}

loadExpenses();



/*<i class="fa fa-edit" onclick='editExpense(${e.id}, ${JSON.stringify(e.title)}, ${e.amount}, ${JSON.stringify(e.category)}, ${JSON.stringify(e.date)})' style="cursor:pointer;color:blue;margin-right:10px;"></i>
*/
