require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const { NODE_ENV } = process.env
const morganOption = 'common';

app.use(bodyParser.json())
app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

// Database Connection
const knex = require('knex')
const knexInstance = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});
console.log(process.env.DATABASE_URL);

Promise.all([
    knexInstance.schema.createTableIfNotExists("registrationSchema", function (table) {
      // Integer id
      table.increments(); 
      // Name
      table.string('name');
      // Address
      table.string('address');
      // Phone
      table.string('phone');
      // Email
      table.string('email');
      // Date
      table.timestamp('created_at').defaultTo(knexInstance.fn.now())
  }).then(function () {
          return knexInstance("registrationSchema").insert([
              {name: "A", address: "123 oak lane dr", phone: '555555555', email: 'Ab123@test.com',},
          ]);
      }
  ),
]);












app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = {
      error: {
        message: 'server error'
      }
    }
  } else {
    console.error(error)
    response = {
      message: error.message,
      error
    }
  }
  res.status(500).json(response)
})

require('../routes/dialogFlowRoutes')(app);
console.log('didnt die')
module.exports = app;