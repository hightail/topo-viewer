/**
 * topo-file-selector Component
 *
 * @class TopoFileSelectorComponent
 * @module Hightail
 * @submodule Hightail.Components
 *
 * @example
 *    <ht-topo-file-selector></ht-topo-file-selector>
 *
 * @author justin.fiedler
 * @since 0.0.0
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.component('topo-file-selector', {
  scope: {
    topos: '='
  },
  controller: ['$scope', 'TopoService', function($scope, TopoService) {
    var controller = this;

    $scope.fileNames = [
      'environment.topo',
      'environment.topo.base',
      'workspace.topo'
    ];

    $scope.branches = [
      '14.10.0',
      '14.9.0'
    ];

    $scope.selectedFileName = $scope.fileNames[0];
    $scope.selectedBranch = $scope.branches[0];

    $scope.selectFileName = function(value) {
      $scope.selectedFileName = value;
    };

    $scope.selectBranch = function(value) {
      $scope.selectedBranch = value;
    };

    TopoService.getTopos().then(
      function(topos) {
        $scope.topos = topos;
      },
      function(error) {
        console.log('Error retrieving TOPOs', error);
      }
    );
//  controller.setState({
//    initial: '',
//    events: [
//      { name: '',  from: '',  to: '' }
//    ],
//    timeouts: [],
//    callbacks: {}
//  });
  }],
  
  link: function($scope, $element, $attrs, controller) {
  }
  
});
