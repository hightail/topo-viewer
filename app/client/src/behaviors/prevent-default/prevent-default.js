/**
 * Prevents click event propagation
 *
 * @class PreventDefault
 * @module Hightail
 * @submodule Hightail.Behaviors
 *
 * @example
 *    <element ht-prevent-default></element>
 *
 * @author justin.fiedler
 * @since 0.0.1
 *
 * @copyright (c) 2013 Hightail Inc. All Rights Reserved
 */
'use strict';
angular.wilson.behavior('prevent-default', {
  restrict: 'A',
  link: function($scope, $element, $attrs) {
    $element.bind('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
    });
  }
});
