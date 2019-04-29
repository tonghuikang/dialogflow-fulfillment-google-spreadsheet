const fs = require('fs');
const {google} = require('googleapis');

function getDataFromSpreadsheet(tabName, startCell, endCell) {
  return new Promise((resolve, reject) => {
    console.log('executing getDataFromSpreadsheet', typeof content);

    const sheets = google.sheets({
      version: 'v4',
      auth: process.env.SPREADSHEET_API_KEY
    });

    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${tabName}!${startCell}:${endCell}`,
    }, (err, res) => {
      if (err) reject('The API returned an error: ' + err);

      const rows = res.data.values;
      console.log(rows);

      resolve(rows);
    });
  });
}

function getDataGivenID(clientID) {
  console.log("executing googleSpreadsheet.getDataGivenID");
  return new Promise((resolve, reject) => {
    
    var tabName = 'Class Data';
    var startCell = 'A2';
    var endCell = 'E';

    const sheets = google.sheets({
      version: 'v4',
      auth: process.env.SPREADSHEET_API_KEY
    });

    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${tabName}!${startCell}:${endCell}`,
    }, (err, res) => {
      if (err) reject('The API returned an error: ' + err);

      const rows = res.data.values;
      console.log('database :');
      console.log(rows);

      const arrayColumn = (arr, n) => arr.map(x => x[n]);
      var ID_list = arrayColumn(rows, 1);
      var client_data = rows[ID_list.indexOf(clientID.toString())];
      console.log('client data :');
      console.log(client_data);
      resolve(client_data);
    });
  });
}


function putFormParameters(parameters) {
  console.log("executing googleSpreadsheet.putFormParameters");

  return new Promise((resolve, reject) => {
    // console.log('getDataFromSpreadsheet', typeof content);

    var tabName = 'Class Data';
    var startCell = 'A2';
    var endCell = 'E';

    const sheets = google.sheets({
      version: 'v4',
      auth: process.env.SPREADSHEET_API_KEY
    });

    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${tabName}!${startCell}:${endCell}`,
    }, (err, res) => {
      if (err) reject('The API returned an error: ' + err);

      console.log(parameters.date[0]);
      console.log(parameters['unit-currency']);
      console.log(parameters['mode-of-payment.original']);
      console.log(parameters['mode-of-payment']);
      console.log(parameters['invoice-number']);
      console.log(parameters['unit-currency.original']);
      console.log(parameters['invoice-number.original']);
      console.log(parameters['currency-name']);
      var client_data = parameters.date[0];

      // TODO: UPDATE THE FORM HERE, MANUALLY BY COLUMNS
      // KIV: Automatically match the correct columns without hardcoding
      // KIV: Auto create new columns where appropriate

      console.log('client data :');
      console.log(client_data);
      resolve(client_data);
    });
  });
}

exports.getDataGivenID = getDataGivenID;
exports.getDataFromSpreadsheet = getDataFromSpreadsheet;
exports.putFormParameters = putFormParameters;