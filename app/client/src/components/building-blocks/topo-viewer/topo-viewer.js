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

  controller: ['$scope', 'TopoModel', function($scope, TopoModel) {
    var controller = this;

    controller.watchAndPersist('selectedEnvs', []);
    controller.watchAndPersist('showEmptyKeys', false);
    controller.watchAndPersist('showDefaultValues', false);
    controller.watchAndPersist('showExpandedValues', false);
    controller.watchAndPersist('filteredKeys', []);

    var topoModel;

    $scope.$watch('topos', function(topos) {
      if (!_.isEmpty(topos)) {
        console.log('topos', topos);

        topoModel = new TopoModel(topos);

        $scope.allEnvironments = topoModel.getAllEnvironments();

        $scope.envCollection = [];
        _.each($scope.allEnvironments, function (env) {
          $scope.envCollection.push({
            id: env
          });
        });
        //$scope.environments = ['default', 'sbx', 'ita', 'partners'];

        $scope.topoKeys = topoModel.getAllKeys();
        $scope.groupKeys = topoModel.getGroupNames();
        $scope.envGroups = topoModel.getGroupDicitonary();

        $scope.envSelectionManager.setDataCollection($scope.envCollection);
        _.each($scope.selectedEnvs, function (env) {
          $scope.envSelectionManager.selectById(env);
        });
      }
    });

    $scope.getTopoValue = function(env, key) {
      if ($scope.showExpandedValues) {
        return topoModel.getExpandedValue(env, key, $scope.showDefaultValues);
      } else {
        return topoModel.getValue(env, key, $scope.showDefaultValues);
      }
    };

    $scope.isDefaultValue = function(env, key) {
      return topoModel.isDefaultValue(env, key);
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
