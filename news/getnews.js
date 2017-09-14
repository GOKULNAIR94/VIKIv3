module.exports = function(req, res, callback) {

    var os = require('os');
    console.log("Req  : " + JSON.stringify(req.body));
    var intentName = "";
    var tracker = "";
    if (req.body.intentName != null)
        intentName = req.body.intentName;
    else {
        intentName = req.body.result.metadata.intentName;
    }
    if (req.body.track != null)
        tracker = req.body.track;
    else {
        tracker = req.body.result.contexts[0].parameters.track;
    }

    console.log("intentName : " + intentName);
    console.log("tracker : " + tracker);
    var content;
    var speech = '';

    try {
        var GoogleNews, googleNews, track;

        GoogleNews = require('google-news');
        googleNews = new GoogleNews();

        track = tracker;
        var speech = "";
        var news = "";
        var count = 1;
        googleNews.stream(track, function(stream) {


            stream.on(GoogleNews.DATA, function(data) {
                //console.log('Stringify ' + JSON.stringify(data));
                //console.log('Data Event received... ' + data.link);
                //callback( data.title );
                if (data.link != null && data.link != NaN) {

                    var newsurl = data.link;
                    //tera code
                    var googl = require('goo.gl');

                    googl.setKey('AIzaSyD75VTq7NYjo6nvRgF354QomarX14NWTbY');

                    googl.getKey();

                    googl.shorten(newsurl)
                        .then(function(shortUrl) {
                            console.log("count  : " + count);
                            speech = speech + "" + os.EOL + "" + data.title + "! ";
                            speech = speech + "\n More @ : " + shortUrl + "!" + os.EOL;
                            if (count == 10) {
                                console.log(" Speech : " + speech);
                                if (req.body.intentName != null)
                                    res.json(speech);
                                else {
                                    return res.json({
                                        speech: speech,
                                        displayText: speech
                                    })
                                }
                            }
                            count++;
                        })
                        .catch(function(err) {
                            console.error(err.message);
                        });
                } else {
                    speech = speech + "" + os.EOL + "" + data.title + "! ";
                    if (count == 10) {
                        return res.json({
                            speech: speech,
                            displayText: speech
                        });
                    }
                    count++;
                }

            });

            stream.on(GoogleNews.ERROR, function(error) {
                console.log('Error Event received... ' + error);
            });

        });
    } catch (e) {
        console.log("Error : " + e);
    }

}