const dialogflow = require('dialogflow');
const structjson = require('./structjson');
const config = require('../config/keys');
const knex = require('knex')
const knexInstance = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});
const projectID = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient({projectID, credentials});
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);

module.exports = {
  textQuery: async function (text, userID, parameters = {}) {
    let sessionPath = sessionClient.sessionPath(projectID, sessionId + userID);
    let self = module.exports;
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: languageCode,
        },
      },
      queryParams: {
        payload: {
          data: parameters
        }
      }
    };

    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },
  eventQuery: async function (event, userID, parameters = {}) {
    let self = module.exports;
    let sessionPath = sessionClient.sessionPath(projectID, sessionId + userID);
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          name: event,
          parameters: structjson.jsonToStructProto(parameters),
          languageCode: languageCode,
        },
      },
    };
    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },

  handleAction: function (responses) {
    let queryResult = responses[0].queryResult;
    switch (queryResult.action){
      case 'recommendcourses-yes':
        if(queryResult.allRequiredParamsPresent) {
          const { name, address, phone, email } = queryResult.parameters.fields;

          knexInstance('registrationSchema').insert([
            {
              name: name.stringValue,
              address: address.stringValue,
              phone: phone.stringValue,
              email: email.stringValue,
            },
        ])
          .then(record => console.log(record))
          .catch(err => console.log(err));
        }
        break;
    }
    return responses;
  },
}