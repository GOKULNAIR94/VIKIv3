module.exports = function(req, res, callback) {
    var DCPData = require("./dcpdata");
    var ADSData = require("./adsdata");
    var SendEmail = require("./sendEmail");
    var sendAdhocEmail = require("./sendAdhocEmail");

    var intentName = req.body.result.metadata.intentName;

    console.log("intentName THIS : " + intentName);

    var Market = '';
    var Period = '';
    var dateperiod = '';
    var Month = '';

    var speech = '';
    var query = '';

    //req =  JSON.parse(content);
    //console.log( "Req : " + JSON.stringify(req.body) );


    var content;
    try {
        if (intentName == 'Budget') {
            Market = req.body.result.parameters.Market;
            Period = req.body.result.parameters.Period;
            dateperiod = req.body.result.parameters.dateperiod;
            Month = dateperiod.split("/")[1];


            console.log("Market : " + Market);
            console.log("Period : " + Period);
            console.log("dateperiod : " + dateperiod);
            console.log("Month : " + Month);

            content = fs.readFileSync('data.json', 'utf8');
            console.log("Content : " + content);
            content = JSON.parse(content);

            if (Market != "Global") {
                query = "Market=" + Market + " & ";
            }
            if (Period == "MTD") {
                query = query + "Month=" + Month;
                //query = query + "Period=" + Period + " & Month=" + Month;
            } else {
                var fyStartDate = "";
                var arr = Month.split("-");
                if (arr[1] >= 4) {
                    fyStartDate = arr[0] + "-0" + 4 + "-" + 1;
                } else {
                    fyStartDate = (parseInt(arr[0]) - 1) + "-0" + 4 + "-" + 1;
                }
                console.log("fyStartDate : " + fyStartDate);
                query = query + "Month >= " + fyStartDate + " & Month <= " + Month;
            }


            console.log("query : " + query);
            var output =
                jsonQuery('items[* ' + query + '][Remaining Budget]', {
                    data: content
                }).value;
            console.log("Output : " + output);
            console.log("Output Length : " + output.length);
            if (output.length == 0) {
                speech = "No records found."
            }
            if (output.length == 1) {
                console.log("Output : " + output);
                speech = "The remaining YTD Budget for Entertainment is " + output + "$. Is there anything else I can help you with?"
            }
            if (output.length > 1) {
                var sum = 0;
                for (var i = 0; i < output.length; i++) {
                    sum = sum + parseFloat(output[i]);
                }
                console.log("Sum : " + sum);
                speech = "The remaining YTD Budget for Entertainment is " + sum + "$. Is there anything else I can help you with?"
            }
            return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            })
        }

        if (intentName == 'Expense') {
            Market = req.body.result.parameters.Market;
            Period = req.body.result.parameters.Period;
            dateperiod = req.body.result.parameters.dateperiod;
            Month = dateperiod.split("/")[1];

            console.log("intentName : " + intentName);
            console.log("Market : " + Market);
            console.log("Period : " + Period);
            console.log("dateperiod : " + dateperiod);
            console.log("Month : " + Month);


            content = fs.readFileSync('data.json', 'utf8');
            console.log("Content : " + content);
            content = JSON.parse(content);

            query = "Month = " + Month;

            if (Market != "Global") {
                query = query + " & Market =" + Market;
            }

            console.log("query : " + query);
            var output =
                jsonQuery('items[* ' + query + '][Expense]', {
                    data: content
                }).value;
            console.log("Output : " + output);
            console.log("Output Length : " + output.length);
            if (output.length == 0) {
                speech = "No records found."
            }
            if (output.length == 1) {
                console.log("Output : " + output);
                speech = "The Entertainment expense for " + Market + " is " + output + "$. Is there anything else I can help you with?"
            }
            if (output.length > 1) {
                var sum = 0;
                for (var i = 0; i < output.length; i++) {
                    sum = sum + parseFloat(output[i]);
                }
                console.log("Sum : " + sum);
                speech = "The Entertainment expense for " + Market + " is " + sum + "$. Is there anything else I can help you with?"
            }
            return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            })
        }
        if (intentName.indexOf("DCP -") == 0) {
            DCPData(req, res, function(result) {
                console.log("EmpData Called");
            });
        }
        if (intentName.indexOf("ADS_") == 0 && intentName != 'ADS_HyperionReport' && intentName != 'ADS_AdhocData') {
            ADSData(req, res, function(result) {
                console.log("ADSData Called");
            });
        }
        if (intentName == 'ADS_HyperionReport') {
            SendEmail(req, res, function(result) {
                console.log("SendEmail Called");
            });
        }
        if (intentName == 'ADS_AdhocData') {
            sendAdhocEmail(req, res, function(result) {
                console.log("SendEmail Called");
            });
        }

    } catch (e) {
        console.log("Error : " + e);
    }

}