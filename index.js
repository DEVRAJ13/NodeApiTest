const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');

var app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());


var mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'xornor@123',
  database: 'EmployeeDB'
});

mysqlConnection.connect((err) => {
  if (!err)
    console.log('DB connection succeded.');
  else
    console.log('DB connection failed \n Error :' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('Express server is running at port no : 30000'));


/*************************************************** */
/*******************USER SIGNUP******************** */
/************************************************** */
app.post('/user/signup', (request, response) => {
  console.log("Request", request.body);
  console.log("Response", response);
  var today = new Date();
  var users = {
    "first_name": request.body.first_name,
    "last_name": request.body.last_name,
    "email": request.body.email,
    "password": request.body.password,
    "created": today,
    "modified": today
  }
  mysqlConnection.query('SELECT * FROM users WHERE email = ?', request.body.email, (error, results) => {
    console.log("Results", results);
    if (results.length > 0) {
      response.send({
        "code": 404,
        "status": "Email already exist."
      });
    } else {
      mysqlConnection.query('INSERT INTO users SET ?', users, (error, results) => {
        if (error) {
          console.log("Error", error);
          response.send({
            "code": 400,
            "status": "error ocurred"
          });
        } else {
          console.log("Results", results);
          response.send({
            "code": 200,
            "success": "user registered sucessfully"
          });
        }
      });
    }
  });
});
/*************************************************** */
/***********USER SIGNUP END HERE******************** */
/************************************************** */



/*******************USER LOGIN******************** */
app.post('/user/login', (request, response) => {
  var query = "SELECT * FROM users where email='" + request.body.email + "' and password='" + request.body.password + "'";
  mysqlConnection.query(query, (error, results) => {
    console.log("LOGIN RESULT", results);
    if (results.length > 0) {
      response.send({
        "code": 200,
        "success": "login sucessfull"
      });
    } else {
      response.send({
        "code": 204,
        "success": "Email and password does not match"
      });
    }
  });
});
/***********USER LOGIN END HERE******************** */






// app.get('/employees', (req, res) => {
//   mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
//     if (!err) {
//       console.log(rows);
//       res.send(rows);
//     }
//     else {
//       console.log(err);
//     }
//   });
// });

// app.get('/employees/:id', (req, res) => {
//   mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
//     if (!err) {
//       console.log(rows);
//       res.send(rows);
//     }
//     else {
//       console.log(err);
//     }
//   });
// });








