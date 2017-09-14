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
            var GetNews - require("./news/getnews");
            GetNews(req, res, function(result) {
              console.log("SendEmail Called");
            });
        }
    
    if( intentName == 'Budget' || intentName == 'Expense' || intentName.indexOf( "DCP -" ) == 0 || intentName.indexOf( "ADS_" ) == 0 ){
            varHost = 'vikiviki.herokuapp.com';
            varPath = '/inputmsg'; 
        }
        
        if( intentName == 'reporting' ){
            varHost = 'salty-tor-67194.herokuapp.com';
            varPath = '/report';
        }
        
        if( intentName == 'oppty' || intentName=='oppty - next' || intentName=='oppty - custom' || intentName=='oppty - News'  ){
            //varHost = 'polar-sea-99105.herokuapp.com';
            varHost = 'opty.herokuapp.com';
            varPath = '/oppty';
        }
        console.log( "varHost : " + varHost );
        console.log( "varPath : " + varPath);

    }
    catch(e)
    {
        console.log("Error : " + e );
    }
}
