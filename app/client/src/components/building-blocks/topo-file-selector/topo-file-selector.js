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

    function loadToposFromGit(topoFile, treeish) {
      TopoService.loadFromGit(topoFile, treeish).then(
        function(topos) {
          $scope.topos = topos;
        },
        function(error) {
          console.log('Error retrieving TOPOs', error);
        }
      );
    }

    $scope.fileNames = [
      'environment.topo',
      'environment.topo.base',
      'workspace.topo'
    ];

    $scope.branches = [
      'release/14.10.0',
      'hotfix/14.9.52',
      'hotfix/14.9.51',
      'hotfix/14.9.50',
      'hotfix/14.9.49',
      'hotfix/14.9.48',
      'hotfix/14.9.47',
      'hotfix/14.9.46'
    ];

    $scope.selectedFileName = $scope.fileNames[0];
    $scope.selectedBranch = $scope.branches[0];

    $scope.selectFileName = function(value) {
      $scope.selectedFileName = value;
      loadToposFromGit($scope.selectedFileName, $scope.selectedBranch);
    };

    $scope.selectBranch = function(value) {
      $scope.selectedBranch = value;
      loadToposFromGit($scope.selectedFileName, $scope.selectedBranch);
    };

    loadToposFromGit($scope.selectedFileName, $scope.selectedBranch);
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
