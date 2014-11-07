/**
 * Topo Parser
 *
 * @class TopParser
 * @module Hightail
 * @submodule Hightail.Services
 *
 * @author justin.fiedler
 * @since 0.0.0
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.service('TopoParser', function() {
  /**
   * Converts a .topo file to JSON object
   *
   * @param topoStr
   * @returns {{global: {}}}
   */
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

  // Service Object
  var service = {
    topo2Json: topo2Json
  };

  return service;
});
