/**
 * selection-helper Behavior
 *
 * @class SelectionHelperBehavior
 * @module Hightail
 * @submodule Hightail.Behaviors
 *
 * @example
 *    <element ht-selection-helper="mySelectionManager"
 *             selection-data="myDataCollection"
 *             selection-id-field="myId">
 *    </element>
 *
 *    Note: MUST be used as an attribute.
 *
 * @author justin.fiedler
 * @since 0.0.1
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.behavior('selection-helper', function() {
  return {
    restrict: 'A',
    scope: {
      dataCollection: '=selectionData',
      idField: '@selectionIdField',
      maxSelections: '=?maxSelections',
      overrideSelections: '@?overrideSelections'
    },
    controller: ['$scope', 'SelectionManagerFactory', function($scope, SelectionManagerFactory) {
      var controller = this;

      var options = {
        dataCollection: $scope.dataCollection,
        idField: $scope.idField
      };

      if ($scope.maxSelections) {
        options.maxSelections = $scope.maxSelections;
      }

      if ($scope.overrideSelections) {
        options.overrideSelections = angular.wilson.utils.parseBoolean($scope.overrideSelections);
      }

      var selectionManager = SelectionManagerFactory.create(options);

      $scope.$watch('dataCollection', function(newValue) {
        selectionManager.setDataCollection(newValue);
      });

      //expose the selectionManagers interface on the controller
      _.extend(controller, selectionManager);
    }],

    link: function($scope, $element, $attrs, controller) {
      var name = $attrs.htSelectionHelper;

      //If a name is provided expose the controller on the parent scope
      if (name && $scope.$parent) {
        $scope.$parent[name] = controller;
      }
    }
  };
});