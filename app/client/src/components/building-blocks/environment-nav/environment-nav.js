/**
 * environment-nav Component
 *
 * @class EnvironmentNavComponent
 * @module Hightail
 * @submodule Hightail.Components
 *
 * @example
 *    <ht-environment-nav></ht-environment-nav>
 *
 * @author justin.fiedler
 * @since 0.0.0
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.component('environment-nav', {
  scope: {
    groupNames: '=',
    groups: '=',
    selectionManager: '='
  },
  controller: ['$scope', '$element', function($scope, $element) {
    var controller = this;

    controller.registerDataDependency('groups');
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
