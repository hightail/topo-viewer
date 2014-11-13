/**
 * home Component
 *
 * @class HomeComponent
 * @module Hightail
 * @submodule Hightail.Components
 *
 * @example
 *    <ht-home></ht-home>
 *
 * @author justin.fiedler
 * @since 0.0.0
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.component('home', {
  page: true,
  controller: ['$scope', function($scope) {
    var controller = this;

//    controller.setState({
//      initial: 'Viewer',
//      events: [
//        { name: 'next',  from: 'Viewer',  to: 'Editor' },
//        { name: 'next',  from: 'Editor',  to: 'Viewer' }
//      ],
//      timeouts: [],
//      callbacks: {}
//    });
  }]
});
