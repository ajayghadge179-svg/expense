const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());




// Add Expense
app.post("/addExpense", (req,res)=>{
    const {title,amount,category,date} = req.body;

    const sql = "INSERT INTO expenses(title,amount,category,date) VALUES (?,?,?,?)";

    db.query(sql,[title,amount,category,date],(err,result)=>{
        if(err) throw err;
        res.send("Expense Added");
    });
});


// Get Expenses
app.get("/expenses",(req,res)=>{
    db.query("SELECT * FROM expenses",(err,result)=>{
        if(err) throw err;
        res.json(result);
    });
});


/*
app.put("/updateExpense/:id", (req, res) => {

const id = req.params.id;
const { title, amount, category, date } = req.body;

const sql = "UPDATE expenses SET title=?, amount=?, category=?, date=? WHERE id=?";

db.query(sql, [title, amount, category, date, id], (err, result) => {
  if(err){
    console.log(err);
    res.send("Error updating expense");
  }else{
    res.send("Expense Updated Successfully");
  }
});

});
*/

app.delete("/deleteExpense/:id",(req,res)=>{

const id = req.params.id;

db.query("DELETE FROM expenses WHERE id=?",[id],(err,result)=>{
if(err){
console.log(err);
res.send("Error deleting");
}else{
res.send("Deleted successfully");
}
});

});

app.listen(3000,"0.0.0.0",()=>{
    console.log("Server running on port 3000");
});