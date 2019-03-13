const mysql = require('mysql');
const express = require('express');
const md5 = require('md5');
var cors = require('cors')
var app = express();
app.use(cors({credentials: true, origin: true}))

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


/************************************************** */
/*******************USER SIGNUP******************** */
app.post('/user/signup', (request, response) => {
  var today = new Date();
  var users = {
    "first_name": request.body.first_name,
    "last_name": request.body.last_name,
    "email": request.body.email,
    "profile_pic": request.body.profile_pic,
    "password": md5(request.body.password),
    "created": today,
    "modified": today
  }
  mysqlConnection.query('SELECT * FROM users WHERE email = ?', request.body.email, (error, results) => {
    if (results.length > 0) {
      response.send({
        "code": 404,
        "status": "Email already exist."
      });
    } else {
      mysqlConnection.query('INSERT INTO users SET ?', users, (error, results) => {
        if (error) {
          response.send({
            "code": 400,
            "error":error,
            "status": "error ocurred"
          });
        } else {
          response.send({
            "code": 200,
            "success": "user registered sucessfully"
          });
        }
      });
    }
  });
});
/***********USER SIGNUP END HERE******************** */
/************************************************** */



/************************************************** */
/*******************USER LOGIN******************** */
app.post('/user/login', (request, response) => {
  var query = "SELECT * FROM users where email='" + request.body.email + "' and password='" + md5(request.body.password) + "'";
  mysqlConnection.query(query, (error, results) => {
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
/************************************************** */




/************************************************** */
/*******************GET USERS******************** */
app.get('/get/users', (request, response) => {
  var userData = [];
  mysqlConnection.query("SELECT * FROM users", (error, results) => {
    if (!error) {
      for (var i = 0; i < results.length; i++) {
        var my_obj = {
          id: results[i].id,
          first_name: results[i].first_name,
          last_name: results[i].last_name,
          profile_pic: results[i].profile_pic,
          email: results[i].email,
          created_date: results[i].created
        };
        userData.push(my_obj);
      }
      response.send({
        "code": 200,
        "data": userData
      });
    } else {
      response.send({
        "code": 500,
        "message": "Server error"
      });
    }
  });
});
/***********GET USER END HERE******************** */
/************************************************** */




/************************************************** */
/*******************GET USERS BY ID******************** */
app.get('/get/user/:id', (request, response) => {
  mysqlConnection.query("SELECT * FROM users WHERE id = ?", [request.params.id], (error, results) => {
    if (!error) {
      response.send({
        "code": 200,
        "data": results
      });
    } else {
      response.send({
        "code": 500,
        "message": "Server error"
      });
    }
  });
});
/***********GET USER BY ID END HERE******************** */
/************************************************** */



/************************************************** */
/*******************DELETE USER BY ID******************** */
app.get("/delete/user/:id", (request, response) => {
  mysqlConnection.query("DELETE FROM users WHERE id = ?", [request.params.id], (error, results) => {
    if (!error) {
      response.send({
        "code": 200,
        "data": results,
        "message":"user deleted sucessfully"
      });
    } else {
      response.send({
        "code": 500,
        "error":error,
        "message": "server error"
      });
    }
  });
});

/***********DELETE USER BY ID END HERE******************** */
/************************************************** */


/**************UPDATE USER IN DATABASE******************************* */
app.put("/update/user/:id", (request, response) => {
  mysqlConnection.query("UPDATE users SET first_name = ? WHERE id = ?", [request.body.first_name, request.params.id], (error, results) => {
    if (!error) {
      response.send({
        "code": 200,
        "data": results,
        "message":"user deleted sucessfully"
      });
    } else {
      response.send({
        "code": 500,
        "error":error,
        "message": "server error"
      });
    }
  });
});

/**************UPDATE USER IN DATABASE END HERE******************************* */