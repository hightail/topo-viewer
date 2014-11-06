var _ = require('lodash');
    _.str = require('underscore.string');

function topo2Json(topoStr) {
  var env = "global";
  var topoObject = {
    "global": {}
  };

  var lines = topoStr.split('\n');

  _.each(lines, function(line) {
    //get rid of whitesapce
    line = line.replace(/\s/g,'');

    if (line === '' || _.str.startsWith(line, '#')) {
      //blank or comment, ignore
    } else if (_.str.startsWith(line, '[')) {
      //[default] or [[env]]
      env = line.replace(/[\[\]]/g, '');

      if(topoObject[env]) {
        console.log('WARNING: Same')
      } else {
        topoObject[env] = {};
      }
    } else if (_.str.contains(line, '=')) {
      var keyPair = line.split('=');
      var key = keyPair[0];
      var value = keyPair[1];

      topoObject[env][key] = value;
    } else {
      console.log('Unhandled line: ', line);
    }
  });

  return topoObject;
}

function json2Topo() {

}

module.exports = {
  topo2Json: topo2Json,
  json2Topo: json2Topo
};