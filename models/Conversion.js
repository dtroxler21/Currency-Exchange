var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ConversionSchema = new Schema({
    startAmount: {
        type: String,
    },
    startCurrency: {
        type: String
    },
    euroConvertedAmount: {
	    type: String
    },
    poundConvertedAmount: {
        type: String
    }
});

var Conversion = mongoose.model("Conversion", ConversionSchema);

module.exports = Conversion;
