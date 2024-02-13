const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


const userDataFilePath = path.join(__dirname, 'usersData.json');
let users = readUserDataFromFile();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', users });
});

//Endpoint for User
router.get('/user', function(req, res, next) {
  const user = { userId, userName, firstName, lastName, email, age };
  res.send(user);
});

//Endpoint for Users
router.get('/users', (req, res) => {
  try {
    // Respond with the user data
    res.json(users);
  } catch (error) {
    console.error('Error reading user data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Handle POST request to /submit
router.post('/addUser', function(req, res, next) {
  const submittedData = req.body.data;
  console.log(submittedData)
  res.render('submit', { title: 'Submission Successful', data: submittedData });
});


// Handle GET request to /submit
router.get('/submit', function(req, res, next) {
  res.render('submit', { title: 'Submission Page' });
});

router.post('/Postboomi', function(req, res, next) {
  const { userId, userName, firstName, lastName, email, age } = req.body;
  const transferStatus = 0;
  const user = { userId, userName, firstName, lastName, email, age, transferStatus };
  console.log(user)
  users.push(user);
  writeUserDataToFile(users);
  // res.send("Data Stored Successfully");
  res.redirect('/');
});


router.post('/submit', function(req, res, next) {
  const { userId, userName, firstName, lastName, email, age } = req.body;
  const transferStatus = 0;
  const user = { userId, userName, firstName, lastName, email, age, transferStatus };
  console.log(user)
  users.push(user);
  writeUserDataToFile(users);
  // res.send("Data Stored Successfully");
  res.redirect('/');
});

// write data to the file
function writeUserDataToFile(userData) {
  fs.writeFile(userDataFilePath, JSON.stringify(userData, null, 2), (err) => {
    if (err) {
      console.error('Error writing user data to file:', err);
    } else {
      console.log('User data written to file successfully.');
    }
  });
}

//Read data to the file
function readUserDataFromFile() {
  try {
    const userData = fs.readFileSync(userDataFilePath, 'utf-8');
    return JSON.parse(userData) || [];
  } catch (err) {
    console.error('Error reading user data from file:', err);
    return [];
  }
}


router.delete('/delete-all', (req, res) => {
  try {
    // Read the existing user data
    const existingData = fs.readFileSync(userDataFilePath, 'utf-8');
    const users = JSON.parse(existingData);

    // Clear the user data
    const clearedUsers = [];

    // Save the cleared data back to the file
    fs.writeFileSync(userDataFilePath, JSON.stringify(clearedUsers), 'utf-8');

    console.log('All users deleted successfully.');

    // Respond with a success message or any appropriate response
    res.json({ success: true, message: 'All user data deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


module.exports = router;
