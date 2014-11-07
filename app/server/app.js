var express = require('express'),
    Wilson = require('wilson'),
    path = require('path'),
    fs = require('fs'),
    hbs = require('hbs'),
    http = require('http'),
    request = require('request'),
    _ = require('lodash'),
    TopoParser = require('./services/TopoParser');

_.str = require('underscore.string');

//Create the express app
var app = express();
app.set('port', '5000');

//Set up static assets
app.use('/client', express.static(path.join(__dirname, '../client')));

//Load wilson, and set up routes
var wilsonConfigJson = require('./config/wilson-config.json');
var wilson = Wilson(app, wilsonConfigJson);

//attach the wilson routes under '/wilson'
app.use(wilson.config.client.app.mountpath, wilson.router);

//Load topos
var TOPO_NAME = 'environment-sbx';
//var TOPO_NAME = 'environment-ita-11-6-14';
var toposPath = path.join(wilson.config.server.projectPaths.root, '/server/topos/' + TOPO_NAME +'.topo');
var toposStr = fs.readFileSync(toposPath, 'utf8');
var topoJson = TopoParser.topo2Json(toposStr);

app.get('/topo', function(req, res) {
  res.send(topoJson);
});

app.get('/topo/:name/:commitHash', function(req, res) {
  var topoPath = _.str.sprintf('https://stash.corp.hightail.com/projects/TOPOS/repos/topos/browse/src/topos/%s.topo?at=%s&raw', req.params.name, req.params.commitHash);

  console.log('topoPath', topoPath);
  request.get({
    url: topoPath,
    strictSSL: false
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('body', body);

      res.send(TopoParser.topo2Json(body));
    } else {
      console.log('ERROR');
      console.log('body', body);
      console.log('error', error);

      var errorObject = {
        message: "An unknown error occurred"
      };

      if (body && body.response) {
        errorObject = body.response;
      } else if (error) {
        errorObject = error;
      }

      res.send(errorObject);
    }
  })

});

//Load index page
var indexHbsPath = path.join(wilson.config.server.projectPaths.root, '/server/templates/index.hbs');
var indexHbs = fs.readFileSync(indexHbsPath, 'utf8');
var indexTemplate = hbs.compile(indexHbs);

// CATCH ALL ROUTE
app.get('*', wilson.middleware, function(req, res) {
  //console.log('render template');

  //TODO: Is there a way to not have to pass in res.locals? Maybe res.render() instead of send
  var result = indexTemplate(res.locals);

  res.send(result);
});

// Start the server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on http port ' + app.get('port'));
});