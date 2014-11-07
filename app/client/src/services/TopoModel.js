/**
 * Topo Model
 *
 * @class TopoModel
 * @module Hightail
 * @submodule Hightail.Services
 *
 * @author justin.fiedler
 * @since 0.0.0
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.service('TopoModel', function() {

  function TopoModel(topos) {
    this.topos = topos;
  }

  TopoModel.prototype.getExpandedValue = function(env, key) {
    var topos = this.topos;

    var value = topos[env][key];

    var topoValues = _.merge({}, topos['default'], topos[env]);

    while(value && value.indexOf('${') >= 0) {
      //console.log('topoValues', topoValues);
      console.log('value', value);
      value = _.template(value, topoValues, {
        evaluate: /\$\{(.+?)\}/g
      });
      //console.log('new', value);
    }

    return value;
  };

  TopoModel.prototype.getTopoValue = function(env, key, expand) {
    var value = this.topos[env][key];

    if (expand) {
      value = this.getExpandedValue(env, key);
    }

    return value;
  };

  TopoModel.prototype.getAllEnvironments = function() {
    console.log('this', this);
    return _.keys(this.topos);
  };


  TopoModel.prototype.getAllKeys = function() {
    console.log('this', this);

    var topoKeys = [];
    var envs = this.getAllEnvironments();
    var topos = this.topos;

    console.log('envs', envs);
    _.each(envs, function(env) {
      topoKeys = _.union(topoKeys, _.keys(topos[env]));
    });

    return topoKeys;
  };

  return TopoModel;
});