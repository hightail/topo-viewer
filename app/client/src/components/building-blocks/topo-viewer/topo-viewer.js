/**
 * topo-viewer Component
 *
 * @class TopoViewerComponent
 * @module Hightail
 * @submodule Hightail.Components
 *
 * @example
 *    <ht-topo-viewer></ht-topo-viewer>
 *
 * @author justin.fiedler
 * @since 0.0.0
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.component('topo-viewer', {

  controller: ['$scope', 'TopoService', function($scope, TopoService) {
    var controller = this;

    controller.watchAndPersist('selectedEnvs', []);
    controller.watchAndPersist('showEmptyKeys', false);
    controller.watchAndPersist('showExpandedValues', false);
    controller.watchAndPersist('filteredKeys', []);

    TopoService.getTopos().then(
      function(topos) {
        $scope.topos = topos;

        $scope.allEnvironments = _.keys(topos);
        $scope.envCollection = [];
        _.each($scope.allEnvironments, function(env) {
          $scope.envCollection.push({
            id: env
          });
        });
        //$scope.environments = ['default', 'sbx', 'ita', 'partners'];

        var topoKeys = [];

        _.each($scope.allEnvironments, function(env) {
          topoKeys = _.union(topoKeys, _.keys(topos[env]));
        });

        $scope.topoKeys = topoKeys;

        var envGroupsLocators = {
          'global': 'global',
          'default': 'default',
          'ITX': /^it.?/i,
          'SQX': /^sq.?/i,
          'ODP': /^odp.?/i,
          'SJCPRD': /^sjcprd/i,
          'misc': ''
        };

        var grouppedEnvs = [];
        $scope.groupKeys = _.keys(envGroupsLocators);
        $scope.envGroups = {};

        _.each(envGroupsLocators, function(locator, key) {
          $scope.envGroups[key] = _.filter($scope.allEnvironments, function(env) {
            var match = false;
            if (_.isString(locator)) {
              match = (locator === env);
            } else {
              //console.log(typeof locator);
              //regex
              match = locator.test(env);
            }

            if (match) {
              grouppedEnvs.push(env);
            }

            return match;
          });
        });

        grouppedEnvs = _.uniq(grouppedEnvs);

        $scope.envGroups['misc'] = _.difference($scope.allEnvironments, grouppedEnvs);

        //console.log($scope.envGroups);

        $scope.envSelectionManager.setDataCollection($scope.envCollection);
        _.each($scope.selectedEnvs, function(env) {
          $scope.envSelectionManager.selectById(env);
        });
      },
      function(error) {
        console.log(error);
      }
    );

    $scope.getTopoValue = function(env, key) {
      var value = $scope.topos[env][key];

      if ($scope.showExpandedValues) {
        value = TopoService.getExpandedValue(env, key, $scope.topos);
      }

      return value;
    };

    controller.setState({
      initial: 'Viewer',
      events: [
        { name: 'next',  from: 'Viewer',  to: 'Editor' },
        { name: 'next',  from: 'Editor',  to: 'Viewer' }
      ],
      timeouts: [],
      callbacks: {}
    });

    function updateFilteredKeys() {
      var filteredKeys;
      var showEmptyKeys = $scope.showEmptyKeys;

      if (showEmptyKeys) {
        filteredKeys = $scope.topoKeys;
      } else {
        filteredKeys = _.filter($scope.topoKeys, function(key) {
          return _.any($scope.selectedEnvs, function(env) {
            return $scope.topos[env][key];
          });
        })
      }

      $scope.filteredKeys = filteredKeys;
    }

    $scope.$watch('showEmptyKeys', function(showEmptyKeys) {
      updateFilteredKeys();
    });

    $scope.$watch('selectedEnvs', function(selectedEnvs) {
      updateFilteredKeys();
    });
  }],

  link: function($scope, $element, $attrs, controller) {
    // Set up edit listeners
    if ($scope.envSelectionManager) {
      controller.autosubscribe($scope.envSelectionManager, 'selected', function (event) {
        //console.log('event', event);
        var selected = _.pluck($scope.envSelectionManager.getSelectedEntries(), 'id');
        $scope.selectedEnvs = selected;
        //angular.wilson.utils.replaceArray($scope.selectedEnvs, selected);
      });

      controller.autosubscribe($scope.envSelectionManager, 'deselected', function (event) {
        var selected = _.pluck($scope.envSelectionManager.getSelectedEntries(), 'id');
        $scope.selectedEnvs = selected;
        //angular.wilson.utils.replaceArray($scope.selectedEnvs, selected);
      });
    }
  }
  
});
