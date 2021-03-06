module.exports = function(req, res) {
    const express = require('express');
    const bunyan = require('bunyan');
    const nodemailer = require('nodemailer');
    const restService = express();
    const bodyParser = require('body-parser');
    var fs = require('fs');
    var intent_name = req.body.result.metadata.intentName;
    console.log(intent_name);
    console.log("Inside");
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        service: 'Outlook365', // no need to set host or port etc.
        auth: {
            user: 'reachme@kaaman.onmicrosoft.com',
            pass: 'K@agar55wal'
        }
    });

    var to_email = req.body.result.parameters.emailadd;
    var reportName = req.body.result.parameters.reportName;
    var apps = req.body.result.parameters.applicationsforReport;
    var yearName = req.body.result.parameters.year;
    var scenario = req.body.result.parameters.reportScenario;
    var speech = reportName + ' ' + scenario + ' - ' + apps + ' (' + yearName + ') has been emailed to ' + to_email + '. Please give a few minutes for the email to arrive in your inbox. Is there anything else I can help you with?';



    var speech = 'Report : ' + reportName + ' for ' + projects + ' - ' + chartfield + ' (' + yearName + ') has been emailed to ' + to_email + '. Please give a few minutes for the email to arrive in your inbox. Is there anything else I can help you with?';

    console.log(speech);
    console.log('SMTP Configured');
    fs.readFile("/PTVPLAN_PPCMRC_ReconReport.pdf", function(err, data) {
        // Message object
        let message = {
            from: 'VIKI <reachme@kaaman.onmicrosoft.com>',
            // Comma separated list of recipients
            to: to_email,

            // Subject of the message
            subject: 'PTV Plan Recon Report', //

            // HTML body
            html: '<p><b>Hello Kaaman,</b></p>' +
                '<p>Attached is the PTV Plan Recon Report as Requested.</p>' +
                '<p>Thanks,<br><b>Viki</b></p>',

            // Apple Watch specific HTML body
            watchHtml: '<b>Hello</b> to myself',

            //An array of attachments
            attachments: [{
                'filename': 'PTVPLAN_PPCMRC_ReconReport.pdf',
                'content': data
            }]

        };

        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });

        console.log('Sending Mail');
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log('Error occurred');
                console.log(error.message);
                return;
            }
            console.log('Message sent successfully!');
            console.log('Server responded with "%s"', info.response);
            transporter.close();
        })
    });
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-OSC-oppty'
    });
}