var express = require('express'),
    Wilson = require('wilson'),
    path = require('path'),
    fs = require('fs'),
    hbs = require('hbs'),
    http = require('http'),
    request = require('request'),
    _ = require('lodash'),
    TopoLoader = require('./services/TopoLoader'),
    TopoParser = require('./services/TopoParser');

_.str = require('underscore.string');

//Create the express app
var app = express();
app.set('port', process.env.PORT);

//Load wilson, and set up routes
var wilsonConfigJson = require('./config/wilson-config.json');
var wilson = Wilson(app, wilsonConfigJson);

//Set up static assets
app.use('/client', express.static(path.join(__dirname, '../client')));

//attach the wilson routes under '/wilson'
app.use(wilson.config.client.app.mountpath, wilson.router);

//Load topos
app.get('/topo/:name/:commitHash', function(req, res) {
  var topoFilePath = 'src/topos/' + req.params.name;
  var commitHash = req.params.commitHash;

  TopoLoader.loadFromGit(topoFilePath, commitHash).then(
    function(fileContents) {
      res.send(TopoParser.topo2Json(fileContents));
    }
  );
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