const express = require('express'); //Set up the express module
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path')
app.engine('pug', require('pug').__express)
app.set('views', '.')
app.set('view engine', 'pug')
var fs = require("fs");

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 

//sends to index.html when visiting our link
router.get('/', function(req, res){ 
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.use('/', router);

//we need one of these for each html page we have. 
router.get('/reg', function(req, res){ // set this to be the same as your href <a> tag in the nav menu 
  res.sendFile(path.join(__dirname, '/reg.html')); // the registration page
});
app.use('/reg', router); //same as top

router.get('/geninfo', function(req, res){ 
  res.sendFile(path.join(__dirname, '/geninfo.html')); // the general information page
});
app.use('/geninfo', router);

router.get('/speakers', function(req, res){ 
  res.sendFile(path.join(__dirname, '/speakers.html')); // the speakers page
});
app.use('/speakers', router);

router.get('/account', function(req, res){ 
  res.sendFile(path.join(__dirname, '/account.html')); // the account page
});
app.use('/account', router);

router.get('/admin', function(req, res){ 
  res.sendFile(path.join(__dirname, '/admin.html')); // the admin page
});
app.use('/admin', router);

router.get('/search', function(req, res){ 
  res.sendFile(path.join(__dirname, '/search.html')); // the admin page
});
app.use('/search', router);

router.get('/delete', function(req, res){ 
  res.sendFile(path.join(__dirname, '/delete.html')); // the admin page
});
app.use('/delete', router);

router.get('/update', function(req, res){ 
  res.sendFile(path.join(__dirname, '/update.html')); // the admin page
});
app.use('/update', router);


app.get('/style.css', function(req, res){
  res.sendFile(path.join(__dirname, '/style.css')); //link the css
});

var img = require('path').join(__dirname,'/assets');
app.use(express.static(img)); //link to images and other assets. 

//remoteSQL database connection
var mysql = require('mysql');

var con = mysql.createPool({ // .createPool if we want the connection to stay open(pool), .createConnection closes after a amount of time (normal)
  host: "remotemysql.com", //do not change these four lines. login details for our DB
  user: "IlrItX2rk6",
  password: "0qev7AlyWm",
  database:"IlrItX2rk6"
});

con.getConnection(function(err) { // .getConnection for pool connection, .connect for normal connection.
  if (err){
console.log(err)
return
}
  console.log("Connected to database!");
});

//insert data into database

app.post('/create_session',function(req,res){

  var session=req.body.session;
  var time=req.body.time;
  var room=req.body.room;
  var subject=req.body.subject;
  var presenter=req.body.presenter;
  var participants=req.body.participants;

  var sql = "INSERT INTO Organizer (session_id, time, room_id, subject, presenter, participants) VALUES ('"+req.body.session+"','"+req.body.time+"','"+req.body.room+"','"+req.body.subject+"','"+req.body.presenter+"','"+req.body.participants+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
      res.end();
  });
  res.send('<h3>Session Created!</h3><br> <button type="button"><a href="/admin">Back</a></button>');  
});

app.post('/update',function(req,res){

  var session=req.body.session;
  var participants=req.body.participants;

  var sql = "UPDATE Organizer SET participants = ? WHERE session_id = ? ";
  con.query(sql, [ req.body.participants, req.body.session], function (err, result, fields) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
  res.send('<h3>Session Updated!</h3><br> <button type="button"><a href="/update">Back</a></button>');  
});

app.post('/delete',function(req,res){

  var session=req.body.session;

  var sql = "DELETE FROM Organizer WHERE session_id = ? ";
   con.query(sql, [session], function (err, result, fields) {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
  res.send('<h3>Session Deleted!</h3><br> <button type="button"><a href="/delete">Back</a></button>'); 
});

// app.get('/search', function (req, res, next) {
  
  con.query("SELECT * FROM Organizer", function (err, result, fields) {
    if (err) throw err;
    console.log(result);


  // var session=req.body.session;

  // con.query("SELECT * FROM Organizer WHERE (session_id) =" + session + 
  //  function (err, result, fields) {
  //   if (err) throw err;
  //   console.log(result);
  // });
  // keep on while troubleshooting search feature
  // res.send('<h3>Search Submitted!</h3><br> <button type="button"><a href="/search">Back</a></button>');
});

app.post('/register',function(req,res) {

  var fname=req.body.fname;
  var address=req.body.address;
  var email=req.body.email;
  var school=req.body.school;
  var role=req.body.role;
  var topics=req.body.topics;

  var sql = "INSERT INTO Registrant (name, address, email, school, role, topics) VALUES ('"+req.body.fname+"','"+req.body.address+"','"+req.body.email+"','"+req.body.school+"','"+req.body.role+"','"+req.body.topics+"')";
  con.query(sql, function (err, html) {
    if (err) throw err;
      console.log(html);
  });

res.send('<h3>Registration Submitted!</h3><br> <button type="button"><a href="/">Home</a></button>');

});

//display html
let server = app.listen(8080, function(){
});