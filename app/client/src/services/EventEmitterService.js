/**
 * EventEmitter Service
 *
 * @class EventEmitterService
 * @module Hightail
 * @submodule Hightail.Services
 *
 * @author justin.fiedler
 * @since 0.0.1
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.service('EventEmitterService', function() {

  /**
   * Creates and returns a new EventEmitter
   */
  var create = function() {
    return new EventTarget();
  };


  // Service Object
  var service = {
    create: create
  };

  return service;
});
