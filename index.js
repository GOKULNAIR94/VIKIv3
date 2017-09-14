module.exports = function( req, res ) {
  
  const express = require('express');
  const bodyParser = require('body-parser');
  const restService = express();
  var http = require('https');
  var fs = require('fs');


  var intentName = req.body.result.metadata.intentName;
  console.log( "intentName : " + intentName );
  try{
    var speech = "";    
    if( intentName == "Default Welcome Intent")
    {
      speech = "Hi Kaaman! My name is VIKI (Virtual Interactive Kinetic Intelligence) and I am here to help!";
        return res.json({
          speech: speech,
          displayText: speech
        })
    }
  }
  catch(e)
  {
    console.log( "Error : " + e );
  }

    console.log( "intentName : " + intentName);
    try
    {
        if( intentName == 'News' || intentName == 'News - link' ){
            var GetNews = require("./news/getnews");
            GetNews(req, res, function(result) {
              console.log("GetNews Called");
            });
        }
    
    if( intentName == 'Budget' || intentName == 'Expense' || intentName.indexOf( "DCP -" ) == 0 || intentName.indexOf( "ADS_" ) == 0 ){
            var GetDemo = require("./demo/getdemo");
            GetDemo(req, res, function(result) {
              console.log("GetDemo Called");
            });
        }
        
        if( intentName == 'reporting' ){
            var SendEmail = require("./email/sendEmail");
            SendEmail(req, res, function(result) {
              console.log("SendEmail Called");
            });
        }
        
        if( intentName == 'oppty' || intentName=='oppty - next' || intentName=='oppty - custom' || intentName=='oppty - News'  ){
            var OSC = require("./osc/osc");
            OSC(req, res, function(result) {
              console.log("OSC Called");
            });
        }

    }
    catch(e)
    {
        console.log("Error : " + e );
    }
}
