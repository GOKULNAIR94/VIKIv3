'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var https = require('https');
var fs = require('fs'),
    path = require('path');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

var Index = require("./index");
var speech = "";
restService.get('/login', onRequest);
restService.use(express.static(path.join(__dirname, '/public')));

var someUserID = "";
var userid = "";
function onRequest(request, response){
    someUserID = request.query.id;
    console.log(' Awe: someUserID : ' + someUserID);
  response.sendFile(path.join(__dirname, '/public/index.html'));
}

restService.post('/newuser',function(request,response){
console.log('App . POST');
//console.log('Req : '+ JSON.stringify(request.body)  );

    var varAuth = new Buffer( request.body.username + ':' + request.body.password).toString('base64');
    var vikiAuthBody = {
        "UserId_c" : someUserID,
        "OSCAuth_c": varAuth
    };
    
    console.log('vikiAuthBody : '+ JSON.stringify( vikiAuthBody )  );
  
    var newoptions = {
        host: 'acs.crm.ap2.oraclecloud.com',
        port: 443,
        path: '/salesApi/resources/latest/VikiAuthv1_c/',
        data: vikiAuthBody,
        method:'POST',
        headers: {
        'Authorization': 'Basic ' + varAuth,
        'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
      }
  };
    var respString = "", resObj;
  var post_req = https.request(newoptions, function(res) {
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
          respString = respString + chunk;
      });
        res.on('end', function() {
            console.log('rES sTATUS: ' + JSON.stringify(res.statusCode));
            if( res.statusCode >= 200 && res.statusCode < 300 )
                response.send("Success");
            else
                response.send("Fail");
      })
    }).on('error', function(e){
      console.log('error: ' + error);
      response.send("Error : " + error );
  });
    post_req.write(JSON.stringify( vikiAuthBody ));
    post_req.end();
});


var GetAuth = require("./getauth");

restService.post('/inputmsg', function(req, res) {
    
    try{
        https.get("https://vikinews.herokuapp.com");
                    https.get("https://vikiviki.herokuapp.com");
                    https.get("https://salty-tor-67194.herokuapp.com");
                    https.get("https://opty.herokuapp.com");

        
        console.log("Req  : " + JSON.stringify(req.body));
        req.body.headers = req.headers;
//        var Id = req.body.Id;
//        console.log( "Id : " + Id );
        if( req.body.originalRequest != null ){
            if (req.body.originalRequest.source == "skype") {
                userid = req.body.originalRequest.data.address.user.id;
                console.log("skype userid : " + userid);
            }
            if (req.body.originalRequest.source == "twitter") {
                userid = req.body.originalRequest.data.direct_message.sender_id;
                console.log("Tweet userid : " + userid);
            }
            if (req.body.originalRequest.source == "slack") {
                userid = req.body.originalRequest.data.event.user;
                console.log("Slack userid : " + userid);
            }

            if (req.body.originalRequest.source == "google") {
                userid = req.body.originalRequest.data.user.userId;
                console.log("Google userid : " + userid);
            }
		}
        
        GetAuth( req, res, function( req, res, rowCount ){
            if ( rowCount == 0 ) {
                speech = "Hi! My name is VIKI (Virtual Interactive Kinetic Intelligence) and I am here to help! \nPlease Login @ https://vikii.herokuapp.com/login?id=" + userid;
                return res.json({
                    speech: speech,
                    displayText: speech,
                    source: 'webhook-OSC-oppty'
                });
            }
            else if( rowCount == 1 ){
                    
                    Index( req, res, function( result ) {
                        console.log("Index Called");
                    });
                }
        });
//        
//        var accessToken = req.body.originalRequest.data.user.access_token;
//        console.log( "accessToken : " + accessToken );
//        var stringyJSON = JSON.stringify(req.body);
//        console.log( "stringJSON : " + stringyJSON );
        

        
        
    }
    catch(e)
    {
        console.log( "Error : " + e );
    }

});


restService.listen((process.env.PORT || 9000), function() {
  console.log("Server up and listening");
});