const inquirer = require("inquirer");
const Conversion = require("./models/Conversion");
const request = require('request');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/currenyConverter";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

inquirer
    .prompt([{
        type: "list",
        message: "Would you like help before you get started on your exchange?",
        choices: ["Yes", "No"],
        name: "help"
    }]).then((response) => {
        if (response.help == "Yes") {
            console.log(
                "\n------------" +
                "\nStep 1: Choose your currency you want to convert using the 3 letter currency code." +
                "\nStep 2: Choose your currency amount." +
                "\nStep 3: View your exchanges (only converted to Euros and Pounds) and decide if you want to view your exchange history."
            )
        }
    }).then(() => {
        inquirer
            .prompt([{
                    type: "input",
                    message: "What currency do you want to convert from (Default is USD)? Use the 3 letter currency code.",
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
                request("https://free.currencyconverterapi.com/api/v6/convert?q=" + euroConversion + "," + poundConversion, {
                    json: true
                }, (err, res, body) => {
                    if (err) {
                        return console.log(err);
                    }
                    const amount = inquirerResponse.startAmount;
                    const euroVal = body.results[euroConversion].val;
                    const poundVal = body.results[poundConversion].val;
                    Conversion.create({
                            startAmount: amount,
                            startCurrency: inquirerResponse.startCurrency,
                            euroConvertedAmount: amount * euroVal,
                            poundConvertedAmount: amount * poundVal
                        })
                        .then((dbConverted) => {
                            console.log(
                                "\n-----------" +
                                "\nEXCHANGE RATES:" +
                                "\n" + euroConversion + ": " + euroVal +
                                "\n" + poundConversion + ": " + poundVal +
                                "\n-------------" +
                                "\nYOUR EXCHANGES:" +
                                "\n" + amount + " " + inquirerResponse.startCurrency + " = " + amount * euroVal + " Euros" +
                                "\n" + amount + " " + inquirerResponse.startCurrency + " = " + amount * poundVal + " Pounds" +
                                "\n-------------"
                            );
                        })
                        .catch((err) => {
                            return err;
                        })
                        .then(() => {
                            inquirer
                                .prompt([{
                                    type: "list",
                                    message: "Would you like to view your most recent exchange history?",
                                    choices: ["Yes", "No"],
                                    name: "exchangeHistory"
                                }]).then((inquirerResponse) => {
                                    if (inquirerResponse.exchangeHistory == "Yes") {
                                        Conversion.find({}, null, {
                                                limit: 10,
                                                sort: {
                                                    _id: -1
                                                }
                                            })
                                            .then((exchanges) => {
                                                for (var i = 0; i < 5; i++) {
                                                    console.log(
                                                        "\n------------" +
                                                        "\nDate and Time of Exchange: " + exchanges[i]._id.getTimestamp() +
                                                        "\n" + exchanges[i].startAmount + " " + exchanges[i].startCurrency + " = " + exchanges[i].euroConvertedAmount + " Euros" +
                                                        "\n" + exchanges[i].startAmount + " " + exchanges[i].startCurrency + " = " + exchanges[i].poundConvertedAmount + " Pounds"
                                                    )
                                                }
                                                process.exit()
                                            });
                                    } else {
                                        process.exit()
                                    }
                                });
                        });
                });
            });
    });