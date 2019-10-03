# Chatbot Server

This is the server for the React Chatbot
The Client repo can be found here [https://react-chatbot.aryannaimi.now.sh/]

## Technology Used: (PERN Stack)

Postgres => Database

Knex => Connection for the database

Express => Server Side

React => Client Side/Front End

Node => Server Side

## Deploying

Database, connection to database and server are hosted on Heroku.

Client is hosted on Zeit.

## Endpoints

POST /api/df_text_query will post text queries to DialogFlow. Dialogflow will return the text query.

POST /api/df_event_query will post event queries like the cards the chatbot recommends to the user in the chat.