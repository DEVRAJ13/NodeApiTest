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

app.get('/employees', (req, res) => {
  mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
    if (!err) {
      console.log(rows);
      res.send(rows);
    }
    else {
      console.log(err);
    }
  });
});

app.get('/employees/:id', (req, res) => {
  mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
    if (!err) {
      console.log(rows);
      res.send(rows);
    }
    else {
      console.log(err);
    }
  });
});

app.post('/users/signin', (req, res) => {
  console.log("req::::", req.body);
  var today = new Date();
  var users = {
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "email": req.body.email,
    "password": bcrypt.hashSync(req.body.password, 10),
    "created": today,
    "modified": today
  }

  mysqlConnection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
    if (error) {
      console.log("error ocurred", error);
      res.send({
        "code": 400,
        "failed": "error ocurred"
      })
    } else {
      console.log('The solution is: ', results);
      res.send({
        "code": 200,
        "success": "user registered sucessfully"
      });
    }
  });
});



app.post('/users/login', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  let hash = bcrypt.hashSync(password, 10);
  mysqlConnection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      res.send({
        "code": 400,
        "failed": "error ocurred"
      })
    } else {
      // console.log('The solution is: ', results);
      if (results.length > 0) {
        if (results[0].password == hash) {
          res.send({
            "code": 200,
            "success": "login sucessfull"
          });
        }
        else {
          res.send({
            "code": 204,
            "success": "Email and password does not match"
          });
        }
      }
      else {
        res.send({
          "code": 204,
          "success": "Email does not exits"
        });
      }
    }
  });
});

