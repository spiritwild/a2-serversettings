var express = require('express'),
    path = require('path'),
    fs = require('fs')
    , config = require('./config');

var app = express();
var staticRoot = __dirname + '/';

app.set('port', (process.env.PORT || config.app.port));

app.use(express.static(staticRoot));

// GET settings route
app.get('/settings', function (req, res) {
    // create the return object
    var settings = {};


    // set the properties
    settings.title = config.app.title;
    settings.environment = config.app.environment;
    settings.webApiUrl = config.api.base_url;

    // return the settings
    res.send(settings);
});

app.use(function(req, res, next){

    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if(accept !== 'html'){
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== ''){
        return next();
    }

    fs.createReadStream(staticRoot + config.app.start).pipe(res);

});

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});
