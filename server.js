// TODO: make a template search row by entry in a specified column
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var googleSpreadsheet = require('./googleSpreadsheet');
var dialogflow = require('./dialogflow');

app.use(express.static('public'));
app.use(bodyParser.json());

// To give out some informations on the current project
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// the DialogFlow fulfillment endpoint
app.post('/', function(request, response) {
  const dialogflowRequest = request.body;
  // An intent's action serves as a mapping mechanism between your intent and a function living in your app.
  // const action = dialogflowRequest.queryResult.action;
  console.log(dialogflowRequest);
  // these 3 variables could come from your intent's parameters !
  const tabName = 'Class Data';
  const startCell = 'A2';
  const endCell = 'E';

  console.log(dialogflowRequest.queryResult.intent.displayName);
  // console.log(dialogflowRequest.queryResult.parameters['number-integer']);

  if (dialogflowRequest.queryResult.intent.displayName == 'SAP-number') {
    var client_id = dialogflowRequest.queryResult.parameters['SAP-number']['number-integer'];
    return googleSpreadsheet.getDataGivenID(client_id)
      .then((results) => {
        response.json(
          dialogflow.confirmName(results)
        );
      }).catch((error) => {
        throw new Error(error);
      });

  } else if (dialogflowRequest.queryResult.intent.displayName == 'name-is-correct') {
    console.log(dialogflowRequest);
    console.log(dialogflowRequest.queryResult.outputContexts);
    var client_id = dialogflowRequest.queryResult.outputContexts[0]['parameters']['number-integer'];
    return googleSpreadsheet.getDataGivenID(client_id)
      .then((results) => {
        response.json(
          dialogflow.showBalance(results)
        );
      }).catch((error) => {
        throw new Error(error);
      });

  } else if (dialogflowRequest.queryResult.intent.displayName == 'confirmed-details-send-details') {
    console.log(dialogflowRequest);
    console.log(dialogflowRequest.queryResult.outputContexts[0].parameters);

    return googleSpreadsheet.putFormParameters(dialogflowRequest.queryResult.outputContexts[0].parameters)
      .then((results) => {
        response.json(
          dialogflow.confirmComplete(results)
        );
      }).catch((error) => {
        throw new Error(error);
      });


  } else {
    return googleSpreadsheet.getDataFromSpreadsheet(tabName, startCell, endCell)
      .then((results) => {
        response.json(
          dialogflow.convertFormat(results)
        );
      }).catch((error) => {
        throw new Error(error);
      });
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});