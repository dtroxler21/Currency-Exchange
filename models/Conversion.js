var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ConversionSchema = new Schema({
    startAmount: {
        type: Number,
    },
    startCurrency: {
        type: String
    },
    convertedAmount: {
	    type: Number
    },
    convertedCurrency: {
        type: String,
    },
});

var Conversion = mongoose.model("Conversion", ConversionSchema);

module.exports = Conversion;
