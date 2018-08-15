const inquirer = require("inquirer");
const Conversion = require("./models/Conversion");
const request = require('request');

inquirer
  .prompt([
    {
      type: "input",
      message: "What currency do you want to convert from (Default is USD)? Use the 3 digit currency code.",
      name: "startCurrency",
      default: "USD"
    },
    {
      type: "input",
      message: "How much of the currency are you converting (Default is 1)?",
      name: "startAmount",
      default: "1"
    }
  ]).then((inquirerResponse) => {
        const euroConversion = inquirerResponse.startCurrency + "_EUR";
        const poundConversion = inquirerResponse.startCurrency + "_GBP";
        request("https://free.currencyconverterapi.com/api/v6/convert?q=" + euroConversion + "," + poundConversion, { json: true }, (err, res, body) => {
            if (err) { return console.log(err); 
        }
        const amount = inquirerResponse.startAmount;
        const euroVal = body.results[euroConversion].val;
        const poundVal = body.results[poundConversion].val;
        console.log(
            "EXCHANGE RATES" +
            "\n" + euroConversion + ": " + euroVal + 
            "\n" + poundConversion + ": " + poundVal +
            "\n-------------" +
            "\nYOUR EXCHANGES" + 
            "\n" + amount + " " + inquirerResponse.startCurrency + " = " + amount*euroVal + " Euros" +
            "\n" + amount + " " + inquirerResponse.startCurrency + " = " + amount*poundVal + " Pounds"
        );
    });
  });