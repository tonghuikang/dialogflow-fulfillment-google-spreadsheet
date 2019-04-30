const fs = require('fs');
const {google} = require('googleapis');
var {OAuth2Client} = require('google-auth-library');
var util = require('util');

console.log(process.env.SPREADSHEET_API_KEY);



function putFormParameters(parameters) {
  console.log("executing googleSpreadsheet.putFormParameters");
  
  return new Promise((resolve, reject) => {
    // console.log('getDataFromSpreadsheet', typeof content);

    var tabName = 'Compiled Information';  // XKCD
    var startCell = 'A1';
    var endCell = '1';

    const sheets = google.sheets({
      version: 'v4',
      auth: process.env.SPREADSHEET_API_KEY
    });

    // get the first now
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${tabName}!${startCell}:${endCell}`,
    }, (err, res) => {
      if (err) reject('The API returned an error getting the first row: ' + err);

      // console.log(res);
      var column_headers = res.data.values[0];
      console.log("column_headers");
      console.log(column_headers);
      
      var param_keys = [];
      for(var k in parameters) param_keys.push(k);
      console.log("param_keys");
      console.log(param_keys);
      
      var param_vals = [];
      for(var k in parameters) param_vals.push(parameters[k]);
      console.log("param_vals");
      console.log(param_vals);
      
      var param_column_loc = [];
      for(var k in param_keys) param_column_loc.push(column_headers.indexOf(param_keys[k]));
      console.log("param_column_loc");
      console.log(param_column_loc);
      
      var column_headers_to_add_loc = [];
      var column_headers_to_add_val = [];
      var new_column_index = column_headers.length
      for(var k in param_column_loc) {
        if(param_column_loc[k] == -1) {
          new_column_index = new_column_index + 1;
          param_column_loc[k] = new_column_index;
          column_headers_to_add_loc.push(new_column_index);
          column_headers_to_add_val.push(param_keys[k]);
        }
      } 
      
      console.log("param_column_loc");
      console.log(param_column_loc);
      console.log("param_vals");
      console.log(param_vals);
      
      console.log("column_headers_to_add_loc");
      console.log(column_headers_to_add_loc);      
      console.log("column_headers_to_add_val");
      console.log(column_headers_to_add_val);
      
      // converting them into specific rows
      var headers_extended = [];
      for(var k in column_headers_to_add_loc) headers_extended[column_headers_to_add_loc[k]] = column_headers_to_add_val[k];
      
      var new_row = [];
      for(var k in param_column_loc) new_row[param_column_loc[k]] = param_vals[k]
      
      // add in the first row column_headers_to_add_val in each column_headers_to_add_loc
      // add in the first empty row param_vals in each column_headers_to_add_loc
      console.log("headers_extended");
      console.log(headers_extended);
      console.log("new_row");
      console.log(new_row);
      
      
      var headers_extended_JSON = {};
      headers_extended_JSON["values"] = []
      headers_extended_JSON["values"][0]  = headers_extended;
      headers_extended_JSON["majorDimension"] = "ROWS";
      headers_extended_JSON["range"] = "Compiled Information!A1";
      var new_row_JSON = {};
      new_row_JSON["values"] = [] 
      new_row_JSON["values"][0] = new_row;
      new_row_JSON["majorDimension"] = "ROWS";
      new_row_JSON["range"] = "Compiled Information!A10";  // TODO: location of row to be determined      
      
      var batchUpdateRequest = {};
      batchUpdateRequest["valueInputOption"] = "USER_ENTERED";
      batchUpdateRequest["data"] = [new_row_JSON, headers_extended_JSON]
      
      console.log(batchUpdateRequest);
      
      sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: process.env.SPREADSHEET_ID,
        resource: batchUpdateRequest,
      }, (err, result) => {
        if (err) {
          // Handle error
          console.log(err);
        } else {
          console.log('%d cells updated.', result.totalUpdatedCells);
        }
      });
      resolve(parameters["date.original"]);
    });
  });
}

var params = JSON.parse(`{
          "date.original": "12-12-2018",
          "currency-name.original": "SGD",
          "mode-of-payment": "in cash",
          "invoice-number": "00-00-0000",
          "invoice-number.original": "00-00-0000",
          "unit-currency.original": "$58.19.",
          "mode-of-payment.original": "in cash.",
          "date": [
            "2018-12-12T12:00:00+08:00"
          ],
          "unit-currency": {
            "amount": 58.19,
            "currency": "USD"
          },
          "currency-name": "SGD"
        }`)

const flatten = (obj, path = '') => {        
    if (!(obj instanceof Object)) return {[path.replace(/\.$/g, '')]:obj};

    return Object.keys(obj).reduce((output, key) => {
        return obj instanceof Array ? 
             {...output, ...flatten(obj[key], path +  '[' + key + '].')}:
             {...output, ...flatten(obj[key], path + key + '.')};
    }, {});
};

params = flatten(params);  // TODO: flatten should be done in the function
putFormParameters(params);
