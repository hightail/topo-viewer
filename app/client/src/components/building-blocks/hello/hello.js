/**
 * hello Component
 *
 * @class HelloComponent
 * @module Hightail
 * @submodule Hightail.Components
 *
 * @example
 *    <ht-hello></ht-hello>
 *
 * @author justin.fiedler
 * @since 0.0.0
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.component('hello', {
  
  controller: ['$scope', function($scope) {
    var controller = this;

    controller.setState({
      initial: 'Initial',
      events: [
        { name: 'next',  from: 'Initial',  to: 'Done' }
      ],
      timeouts: [
        { state: 'Initial', duration: 1000, timeoutEvent: 'next' }
      ],
      callbacks: {
        onenterDone: function() {
          $scope.message = controller.translate("Initialization Complete");
        }
      }
    });

    $scope.message = controller.translate("Initializing");
  }],
  
  link: function($scope, $element, $attrs, controller) {
  }
  
});
