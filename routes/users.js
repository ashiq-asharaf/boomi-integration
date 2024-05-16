var express = require('express');
var router = express.Router();
const db = require('../db');
const request = require('request');

const table_name = process.env.TABLE_NAME;


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


router.get('/', async function(req, res, next) {
  try {
    const result = await db.query(`SELECT * FROM ${table_name}`);
    const users = result;

    res.render('index', { title: 'Express', users});
  } catch(error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/users', async(req, res) => {
  try {
    console.log("Hello")
    const users = await db.func(`get_user_data`);
    console.log("users", users)
    // const response = users[0]['get_user_data'];

    if (users.length === 0) {
      res.json({ message: 'No user data available' });
    } else {
      res.json(users);
    }

  } catch (error) {
    res.status(500).json({error: 'Internal Server Error',error  });
  }
});

router.delete('/delete-all', async(req, res) => {
  try {
    await db.query(`Delete FROM ${table_name}`);
    console.log('All users deleted successfully');
    res.json({ success: true, message: 'All user data deleted successfully.' });
  } catch (error) {
    res.status(500).json({error: 'Internal Server Error' });
  }
});



// router.get('/submit', function(req, res, next) {
//   res.render('submit', { title: 'Submission Page' });
// });

// Insert data from from
router.post('/submit', async(req, res) => {
  const { userName, firstName, lastName, email, age } = req.body;
  const transferStatus = 0;
  try {
    await db.none(
  `INSERT INTO ${table_name}(user_name, first_name, last_name, email, age, transfer_status) VALUES($1, $2, $3, $4, $5, $6)`,
  [userName, firstName, lastName, email, age, transferStatus]
    );
    console.log('User data inserted successfully');

    res.redirect('/');
  } catch (error) {
    console.error('Error handling submit', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/addUsers', async (req, res) => {
  try {
    const jsonData = req.body;
   
    const transferStatus = 0;
    const values = jsonData.map(user => [
      user.user_name,
      user.first_name,
      user.last_name,
      user.email,
      user.age,
      transferStatus
    ]);

  
    const results = [];
    for (const userValues of values) {
      const result = await db.query('INSERT INTO user_data_2(user_name, first_name, last_name, email, age, transfer_status) VALUES($1, $2, $3, $4, $5, $6)', userValues);
    console.log(result, "result")
    }
    const updateRows = await db.query('Update user_data set transfer_status = 1')

    
    res.send("Inserted successfully")
    res.redirect('/');
  } catch(error) {
    console.error('Error storing bulk data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// router.post('/addUsers', async (req, res) => {
//   try {
//     const jsonData = req.body;

    

//     const transferStatus = 0;

//     const values = jsonData.map(user =>[
//       user.user_name,
//       user.first_name,
//       user.last_name,
//       user.email,
//       user.age,
//       transferStatus]
//     );


//     // const insertUpdateQuery = 
//     // `SELECT insert_update_user_data($1, $2, $3, $4, $5, $6)`;
  
//     // const results = await db.tx(async t =>{
//     //   const promises = values.map(userValues =>
//     //     t.one(insertUpdateQuery, userValues)
//     //     );
//     //     return await Promise.all(promises);
//     // });

//     const results = [];
// for (const userValues of values) {
//   // const result = await db.query('SELECT * FROM insert_update_user_data($1, $2, $3, $4, $5, $6)', userValues);
//   const result = await db.query('INSERT INTO user_data_2(user_name,first_name,last_name,email,age,transfer_status)     Values($1, $2, $3, $4, $5, $6)', userValues);
//   results.push(result); // Assuming you expect only one row from the function call
// }

//     res.json(results);
//     res.redirect('/');
   
    

//   } catch(error) {
//     console.error('Error storing bulk data:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });

// #bhoomi EndPoint
router.post('/executeBoomiProcess', (req, res) => {
  const boomiOptions = {
    method: 'POST',
    url: process.env.BOOMI_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.BOOMI_AUTHORIZATION,
    },
    body: JSON.stringify({
      "ProcessProperties": {
        "@type": "ProcessProperties",
        "ProcessProperty": [
          {
            "@type": "",
            "Name": "priority",
            "Value": "medium"
          }
        ]
      },
      "processId": process.env.BOOMI_PROCESS_ID,
      "atomId": process.env.BOOMI_ATOM_ID
    })
  };
  request(boomiOptions, (error, response, body) => {
    if (error) {
      console.error('Error calling Boomi service:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log(body);
      res.json({ message: 'Boomi process executed successfully', response: body });
    }
  });
});


// router.post('/addUsers', async(req, res) => {
//   try {
//     const jsonData = req.body;

//     const transferStatus = 1;

//     const Values = jsonData.map(user => [
//       user.user_name,
//       user.first_name,
//       user.last_name,
//       user.email,
//       user.age,
//       transferStatus
//     ]);

//     const insertQuery = `INSERT INTO user_data (user_id, user_name, first_name, email, age, transferStatus) VALUES $1`;

//     await db.tx(async t => {
//       await t.none(insertQuery, [...Values]);
//     });

//     res.json({ success: true, message: 'Bulk data stored successfully.' });
//   } catch (error) {
//     console.error('Error storing bulk data:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// });



module.exports = router;
