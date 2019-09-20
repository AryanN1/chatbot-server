require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
const { NODE_ENV } = process.env
console.log(NODE_ENV)
const morganOption = 'common';
app.use(bodyParser.json())
app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

// Database Connection
const knex = require('knex')
const knexInstance = knex({
  client: 'pg',
  connection: //This needs to be sorted out
});


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