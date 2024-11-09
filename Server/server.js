import express, { response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const session = require('express-session');
const passport = require('passport');

const app = express();
const port = 5015;

var connection = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password: 'root',
  database: 'rent_car'
});
app.use(cors({origin: ['http://localhost:5500', 'http://127.0.0.1:5500']}));

app.use(
  '/ShowDataBase',
  async(req, res)=>{
    (await connection).query(`SELECT
    c.car_id,
    c.car_name,
    c.class,
    c.number_of_seats,
    c.car_quantity - COALESCE(r.cars_taken, 0) AS car_quantity,
    c.car_price,
    c.car_img,
    f.fuel_name,
    b.body_name
  FROM
    car c
    JOIN body b ON b.body_id = c.body_id
    JOIN fuel f ON f.fuel_id = c.fuel_id
    LEFT JOIN (
      SELECT car_id, COUNT(car_id) AS cars_taken
      FROM rent
      WHERE day_of_taken IS NOT NULL
        AND car_return = 'False'
      GROUP BY car_id
    ) r ON r.car_id = c.car_id;`)
    .then(response=>{
      res.send(response[0]);
  })
  }
);

app.use(
  '/AddRent',
  async(req, res)=>{
    var{car_id, client_name, client_email, client_number, number_days_rent}=req.query;
    (await connection).beginTransaction();
    try{
      await (await connection).query(`INSERT INTO rent (car_id, client_name, client_email, client_number, number_days_rent) VALUES(${car_id}, '${client_name}','${client_email}', '${client_number}', ${number_days_rent})`)
  .catch(async (error) => {
    await (await connection).rollback();
    console.log(error);
  });
await (await connection).commit();

    }
    catch(error){console.log(error);};
    res.status(200).json("success");
  }
)

// GOOGLE OAUTH2 Section (start)

function isLoggedIn(req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Redundant
// app.get('/auth', (req, res) => {
//   res.send('<a href="/auth/google">Authenticate with Google</a>');
// });

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5500/cabinet.html',
    failureRedirect: '/auth/google/failure'
  })
);


app.get('/protected', isLoggedIn, (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  let info = {
    picture: req.user.picture,
    id: req.user.id,
    email: req.user.email,
    name: req.user.given_name,
    surname: req.user.family_name,
  };
  let json = JSON.stringify(info);
  //info = req.user.id + '.id ' + req.user.email + '.email' + req.user.given_name + '.name' + req.user.family_name + '.surname';
  res.send(json);
});


app.get('/logout', (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  req.logout(err => {
      if (err) {
          return next(err);
      }
      req.session.destroy(() => {
          res.send('Logout');
          
      });
  });
});

app.get('/auth/google/failure', (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.send('Failed to authenticate..');
});

// GOOGLE OAUTH2 Section (end)

app.listen(port);
console.log('http://localhost:5015//item');


//Show clients rents
app.use(
  '/ShowClientsRents',
  async(req, res)=>{
    const {client_email} = req.query;
    (await connection).query(`SELECT
    r.rent_id,
    r.car_id,
    r.day_of_rent,
    r.number_days_rent,
    r.day_of_taken,
    r.car_return,
    r.paid,
    c.car_name,
    c.car_price
  FROM
    rent r
    JOIN car c ON c.car_id = r.car_id
  WHERE
    client_email = '${client_email}'
  ORDER BY rent_id;
    `)
    .then(response=>{
      res.send(response[0]);
  })
  }
);