const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const jsonGraphqlExpress = require('json-graphql-server');
const got = require('got');

const app = express();

const router = express.Router();
// router.get('/', (req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.write('<h1>Hello from Express.js!</h1>');
//   res.end();
// });

router.use('/', async (req, res, next) => {
  const url = process.env.URL
  let data = {};

  const body = await got(url).json();
  data = body.result
  jsonGraphqlExpress.default(data)(req, res, next)

  setTimeout(async () => {
    const body = await got.post(url, {
      json: data
    }).json();

    console.log(body);
  }, 2000);
});

app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
