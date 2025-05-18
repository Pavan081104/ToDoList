const express=require('express');
const app= express();
const mysql= require('mysql2');
const cors=require('cors');
app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'Pavan@0408',
    database:'todo'
})

db.connect((err)=>{
    if(err){
        console.log("error connecting with database");
        return
    }
    console.log("connected with database");
})

app.get('/',(req,res) => {
    console.log('Default Route');
    db.query('select * from todoItems',(err,results)=>{
        if(err){
            console.log("error occured");
            return
        }
        console.log('Data : ',results);
        res.send(results);
    })
})

app.post('/add-item',(req,res) => {
    console.log(req.body);
    
    db.query(`insert into todoItems(itemDescription) values('${req.body.text}')`,(err,results)=>{
        if(err){
            console.log("error occured",err);
            return
        }
        console.log("created succesfully");
    })
    res.send('added succesfully')   
})

app.delete('/delete-item', (req, res) => {
    const { ID } = req.body;
  
    if (typeof ID === 'undefined') {
      return res.status(400).send('ID is required');
    }
  
    db.query('DELETE FROM todoItems WHERE ID = ?', [ID], (err, results) => {
      if (err) {
        console.log("Error occurred", err);
        return res.status(500).send("Database error");
      }
      console.log("Deleted successfully");
      res.send('Deleted successfully');
    });
  });
  

app.put('/update-item', (req, res) => {
    const { ID, itemDescription } = req.body;

    // Validation
    if (typeof ID === 'undefined' || typeof itemDescription === 'undefined') {
        return res.status(400).json({ error: 'Both ID and itemDescription are required' });
    }

    db.query(
        'UPDATE todoItems SET itemDescription = ? WHERE ID = ?',
        [itemDescription, ID],
        (err, results) => {
            if (err) {
                console.log("Error occurred", err);
                return res.status(500).send("Database error");
            }
            console.log("Updated successfully");
            res.send('Success');
        }
    );
});


app.listen(3000,()=>{
    console.log('server running on port 3000')
})