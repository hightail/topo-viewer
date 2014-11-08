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
angular.wilson.behavior('scroll', {
  restrict: 'A',
  link: function($scope, $element, $attrs) {
    var el = $(window);

    var scrollThreshold = 0;
    if ($attrs.scrollThreshold) {
      scrollThreshold = parseInt($attrs.scrollThreshold);
    }

    var scrollFunc = $attrs.htScroll;

    el.scroll(function(event) {
      var scrollValue = el.scrollTop();

      if (scrollValue > scrollThreshold) {
        $scope.isScrollActive = true;
      } else {
        $scope.isScrollActive = false;
      }

      if (scrollFunc) {
        $scope.$apply(scrollFunc);
      }
    });
  }
});
