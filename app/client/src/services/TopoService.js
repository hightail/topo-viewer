/**
 * Topo Service
 *
 * @class TopoService
 * @module Hightail
 * @submodule Hightail.Services
 *
 * @author justin.fiedler
 * @since 0.0.0
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.service('TopoService', ['$http', '$q', 'TopoParser', function($http, $q, TopoParser) {
    function loadTopos(path) {
      return $http.get(path).then(
        function(res){
          return res.data;
        }
      );
    }

    function loadToposFromGitHub(topoName, commitHash) {
      var deferred = $q.defer();

      var topoPath = _.str.sprintf('https://stash.corp.hightail.com/projects/TOPOS/repos/topos/browse/src/topos/%s.topo?at=%s&raw', topoName, commitHash);

      $.ajax({
        url: topoPath,
        dataType: "jsonp",
        success: function (data) {
          console.log(data)
          deferred.resolve(TopoParser.topo2Json(data));
        }
      });

      return deferred.promise;
    }

//    function getExpandedValue(env, key, topos) {
//      var value = topos[env][key];
//
//
//      var topoValues = _.merge({}, topos['default'], topos[env]);
//
//      while(value && value.indexOf('${') >= 0) {
//        //console.log('topoValues', topoValues);
//        console.log('value', value);
//        value = _.template(value, topoValues, {
//          evaluate: /\$\{(.+?)\}/g
//        });
//        //console.log('new', value);
//      }
//
//      return value;
//    }

    // Service Object
    var service = {
      getTopos: function() {
        return loadTopos('/topo');
        //return loadTopos('/topo/environment/ccb5a8aefee5f18c16c376519a0cc7cd6d7c4201');
        //return loadToposFromGitHub('environment', 'ccb5a8aefee5f18c16c376519a0cc7cd6d7c4201');
      }
      //getExpandedValue: getExpandedValue
    };

    return service;
  }]
);
