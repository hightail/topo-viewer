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

  controller: ['$scope', '$templateCache', 'TopoModel', function($scope, $templateCache, TopoModel) {
    var controller = this;

    $templateCache.put('keyTypeAhead.html',
      '<a ng-class="{ \'selected\': $parent.$parent.$parent.keySelectionManager.isIdSelected(match.label) }">' +
        '<span bind-html-unsafe="match.label | typeaheadHighlight:query"></span>' +
      '</a>'
    );

    $templateCache.put('envTypeAhead.html',
      '<a ng-class="{ \'selected\': $parent.$parent.$parent.envSelectionManager.isIdSelected(match.label) }">' +
        '<span bind-html-unsafe="match.label | typeaheadHighlight:query"></span>' +
      '</a>'
    );

    function updateEnvNavHeaderText() {
      $scope.ENV_NAV_HEADER_TEXT = _.str.sprintf('Environments (%s)', $scope.selectedEnvs.join(', '));
    }

    controller.watchAndPersist('selectedEnvs', ['default']);
    controller.watchAndPersist('selectedKeys', []);
    controller.watchAndPersist('showEmptyKeys', false);
    controller.watchAndPersist('showSelectedKeys', false);
    controller.watchAndPersist('showDefaultValues', false);
    controller.watchAndPersist('showExpandedValues', false);
    controller.watchAndPersist('filteredKeys', []);

    var topoModel;

    $scope.onScroll = function() {
      //console.log('topo-viewer:onScroll', event);
    };

    controller.registerDataDependency('topos');

    $scope.$watch('topos', function(topos) {
      if (!_.isEmpty(topos)) {
        console.log('topos', topos);

        topoModel = new TopoModel(topos);

        $scope.allEnvironments = topoModel.getAllEnvironments();
        $scope.topoKeys = topoModel.getAllKeys();
        $scope.groupKeys = topoModel.getGroupNames();
        $scope.envGroups = topoModel.getGroupDicitonary();


        $scope.envCollection = [];
        _.each($scope.allEnvironments, function (env) {
          $scope.envCollection.push({
            id: env
          });
        });

        $scope.keyCollection = [];
        _.each($scope.topoKeys, function (key) {
          $scope.keyCollection.push({
            id: key
          });
        });

        $scope.envSelectionManager.setDataCollection($scope.envCollection);
        _.each($scope.selectedEnvs, function (env) {
          $scope.envSelectionManager.selectById(env);
        });

        $scope.keySelectionManager.setDataCollection($scope.keyCollection);
        _.each($scope.selectedKeys, function (key) {
          $scope.keySelectionManager.selectById(key);
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

    $scope.onTypeAheadKeySelect = function(item, model, label) {
      $scope.keySelectionManager.toggleSelectionById(label);
      $scope.searchKeyValue = "";
    };

    $scope.onTypeAheadEnvSelect = function(item, model, label) {
      $scope.envSelectionManager.toggleSelectionById(label);
      $scope.searchEnvValue = "";
    };

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
        });
      }

      if ($scope.showSelectedKeys) {
        filteredKeys = _.filter(filteredKeys, function(key) {
          return $scope.keySelectionManager.isIdSelected(key);
        });
      }

      $scope.filteredKeys = filteredKeys;
    }

    $scope.$watch('showEmptyKeys', function(showEmptyKeys) {
      updateFilteredKeys();
    });

    $scope.$watch('showSelectedKeys', function(showSelectedKeys) {
      updateFilteredKeys();
    });

    $scope.$watch('selectedEnvs', function(selectedEnvs) {
      updateFilteredKeys();
      updateEnvNavHeaderText();
    });

    $scope.$watch('selectedKeys', function(selectedKeys) {
      updateFilteredKeys();
    });

    updateEnvNavHeaderText();
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

      controller.autosubscribe($scope.keySelectionManager, 'selected', function (event) {
        //console.log('event', event);
        var selected = _.pluck($scope.keySelectionManager.getSelectedEntries(), 'id');
        $scope.selectedKeys = selected;
      });

      controller.autosubscribe($scope.keySelectionManager, 'deselected', function (event) {
        var selected = _.pluck($scope.keySelectionManager.getSelectedEntries(), 'id');
        $scope.selectedKeys = selected;
      });
    }
  }
  
});
