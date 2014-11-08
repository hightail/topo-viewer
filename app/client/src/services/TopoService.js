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
    function loadFromGit(topoFile, treeish) {
      var topoEndpointUrl = _.str.sprintf('/topo/%s/%s', topoFile, encodeURIComponent(treeish));

      return $http.get(topoEndpointUrl).then(
        function(res){
          return res.data;
        }
      );
    }

//    function loadToposFromGitHub(topoName, commitHash) {
//      var deferred = $q.defer();
//
//      var topoPath = _.str.sprintf('https://stash.corp.hightail.com/projects/TOPOS/repos/topos/browse/src/topos/%s.topo?at=%s&raw', topoName, commitHash);
//
//      $.ajax({
//        url: topoPath,
//        dataType: "jsonp",
//        success: function (data) {
//          console.log(data)
//          deferred.resolve(TopoParser.topo2Json(data));
//        }
//      });
//
//      return deferred.promise;
//    }

    // Service Object
    var service = {
      loadFromGit: loadFromGit
    };

    return service;
  }]
);
