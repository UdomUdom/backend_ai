const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');

const app = express();

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

//static-folder
//app.use(express.static(path.join(__dirname, 'public'))); ---fetching

app.use('/openai', require('./routes/openaiRoutes'));

app.listen(port, () => console.log('Server start on port ' + port));

const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to PlanetScale!');

app.post('/logins', function (req, res) {
  const { username, password, email } = req.body;
  connection.query(
    'SELECT * FROM user WHERE username=?',
    [username],
    (err, result) => {
      if (err) {
        return res.status(400);
      }
      if (result.length === 0) {
        return res.json({ status: 'error' });
      }
      if (password === result[0].password) {
        return res.json({ status: 200, result: result[0] });
      }
      console.log(result);
    }
  );
});

// app.post('/signup', function (req, res) {
//   const { username, password, email } = req.body;
//   connection.query(
//     'INSERT INTO Users (`username`, `password`, `email`) VALUES (?)',
//     (err, result) => {
//       if (result) return res.json({ status: 200 });
//     }
//   );
// });

app.post('/signup', (req, res) => {
  const sql = 'INSERT INTO user (`username`, `password`, `email`) VALUES (?)';
  const values = [req.body.username, req.body.password, req.body.email];
  connection.query(sql, [values], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ message: 'Error in Node' });
    } else {
      return res.json(result);
    }
  });
});
