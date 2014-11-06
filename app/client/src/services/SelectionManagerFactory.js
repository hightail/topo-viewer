/**
 * SelectionManagerFactory Service
 *
 * @class SelectionManagerFactory
 * @module Hightail
 * @submodule Hightail.Services
 *
 * @author justin.fiedler
 * @since 0.0.1
 *
 * @copyright (c) 2014 Hightail Inc. All Rights Reserved
 */
'use strict';

angular.wilson.service('SelectionManagerFactory', ['EventEmitterService', function(EventEmitterService) {
  /**
   * Creates and returns a new SelectionManager
   *
   * @param options { dataCollection: data,
   *                  idField: 'id',
   *                  maxSelections: 1,
   *                  overrideSelections: true}
   * @returns {{SelectionManager}}
   */
  var create = function(options) {
    var emitter = EventEmitterService.create();

    var areSelectionsEnabled = true;

    /**
     * The data collection
     */
    var dataCollection = options.dataCollection || [];
    var unselectableIds = {};

    var setDataCollection = function(newDataCollection) {
      dataCollection = newDataCollection;
    };

    /**
     * The maximum number of concurrent selections
     * @type {number}
     */
    var maxSelections = options.maxSelections;
    var hasSelectionLimit = (options.maxSelections > 0) ? true : false;

    /**
     * If true the new selections will overide old selections in FIFO order
     *
     * @type {boolean}
     */
    var overrideSelections = (options.overrideSelections === true) ? true : false;
    var selectionQueue = [];

    /**
     * Current selections
     * @type {Array}
     */
    var selectedEntries = [];

    /**
     * The field to use as an identifier for the entries
     */
    var idField = options.idField || 'id';

    var getFinderObject = function(id) {
      var finderObject = {};
      finderObject[idField] = id;

      return finderObject;
    };

    /**
     * Convenience function to get an entry by id
     */
    var getEntryById = function(id) {
      return _.findWhere(dataCollection, getFinderObject(id));
    };

    /**
     * getSelectedEntries
     *
     * NOTE: By default this only applies to entries in the CURRENT data collection
     *
     * @param useGlobalFilter If true returns all selections regardless of filters. Default is false
     * @returns {Array}
     */
    var getSelectedEntries = function(useGlobalFilter) {
      if (useGlobalFilter !== true) {
        useGlobalFilter = false;
      }

      //Determine what set we are working with
      var selected;
      if (useGlobalFilter) {
        //get ALL selected entries ignoring the current filters
        selected = _.clone(selectedEntries);
      } else {
        // only return selected items in the current filter set
        // Note: since the dataCollection may be changed externally
        // we need to verify that each selected item is still in the
        // the current dataCollection
        var filtered = dataCollection;
        selected = _.filter(selectedEntries, function(entry) {
          return !_.isUndefined(_.findWhere(filtered, getFinderObject(entry[idField])));
        });
      }

      return selected;
    };

    /**
     * Returns true is there are any selected entries
     *
     * @param useGlobalFilter
     * @returns {boolean}
     */
    var hasSelectedEntries = function(useGlobalFilter) {
      //Determine what set we are working with
      var selected = getSelectedEntries(useGlobalFilter);

      return selected.length > 0;
    };

    /**
     * Returns true is there are any deselected entries
     *
     * @param useGlobalFilter
     * @returns {boolean}
     */
    var hasDeselectedEntries = function(useGlobalFilter) {
      //Determine what set we are working with
      var selected = getSelectedEntries(useGlobalFilter);

      return selected.length < dataCollection.length;
    };

    /**
     * Returns true if the entry with the given id is currently selected.
     */
    var isIdSelected = function(id) {
      return !_.isUndefined(_.findWhere(selectedEntries, getFinderObject(id)));
    };

    /**
     * Returns true if the entry with the given id is currently selected.
     */
    var isSelected = function(item) {
      return !_.isUndefined(_.findWhere(selectedEntries, getFinderObject(item[idField])));
    };

    /**
     * Selects entry by id
     * @param id
     */
    var selectById = function(id) {
      if (!isIdSelected(id) && areSelectionsEnabled && !unselectableIds[id]) {
        var entryToSelect = getEntryById(id);

        if (!hasSelectionLimit) {
          selectedEntries.push(entryToSelect);

          emitter.publish('selected', { selectionId: id });
        } else {
          var isAtSelectionLimit = (selectedEntries.length >= maxSelections);
          if (!isAtSelectionLimit || overrideSelections) {

            if (isAtSelectionLimit) {
              var entryToDeselect = selectionQueue.pop();
              deselectById(entryToDeselect[idField]);
            }

            selectionQueue.unshift(entryToSelect);
            selectedEntries.push(entryToSelect);

            emitter.publish('selected', { selectionId: id });
          }
        }
      }
    };

    /**
     * Selects all entries in the dataCollection
     */
    var selectAll = function() {
      _.each(dataCollection, function(entry) {
        selectById(entry[idField]);
      });
    };

    /**
     * Deselects entry by id
     * @param id
     */
    var deselectById = function(id) {
      if (isIdSelected(id)) {
        //remove from the selected list
        selectedEntries = _.reject(selectedEntries, getFinderObject(id));

        //remove from selectionQueue
        selectionQueue = _.reject(selectionQueue, function(entry) {
          return (entry[idField] === id);
        });

        emitter.publish('deselected', { selectionId: id });
      }
    };

    /**
     * Deselects all entries in the dataCollection
     */
    var deselectAll = function() {
      _.each(dataCollection, function(entry) {
        deselectById(entry[idField]);
      });
    };

    /**
     * Toggles entry selection by id
     * @param id
     */
    var toggleSelectionById = function(id) {
      if (isIdSelected(id)) {
        deselectById(id);
      } else {
        selectById(id);
      }
    };

    /**
     * Toggles all selections
     *
     * NOTE: By default this only applies to entries in the CURRENT dataCollection
     *
     * @param useGlobalFilter If true toggles all selections regardless of filters. Default is false
     */
    var toggleAllSelected = function(useGlobalFilter) {
      if (useGlobalFilter !== true) {
        useGlobalFilter = false;
      }

      //Determine what set we are working with
      var selected = getSelectedEntries(useGlobalFilter);
      var entries = dataCollection;

      // Note: There is no way to select/delect items not in the current dataCollection
      // so if this set is filtered externally only items in the current filtered dataCollection
      // will be selected/deselected
//      if (useGlobalFilter) {
//        entries = controller.dataCollection;
//      } else {
//        entries = controller.filteredEntries();
//      }

      if (selected.length > 0) {
        //deselect the selected items
        _.each(selected, function(entry) {
          deselectById(entry[idField]);
        });
      } else {
        //select all items
        _.each(entries, function(entry) {
          selectById(entry[idField]);
        });
      }
    };

    var enableSelections = function() {
      areSelectionsEnabled = true;
    };

    var disableSelections = function() {
      areSelectionsEnabled = false;
    };

    var makeIdUnselectable = function(id) {
      if (_.isUndefined(unselectableIds[id])) {
        deselectById(id);
        unselectableIds[id] = true;
      }
    };

    var makeIdSelectable = function(id) {
      if (!_.isUndefined(unselectableIds[id])) {
        delete unselectableIds[id];
      }
    };

    var makeAllSelectable = function() {
      unselectableIds = {};
    };

    var makeAllUnselectable = function() {
      _.each(selectedEntries, function(entry) {
        unselectableIds[ entry[idField] ] = true;
      });
    };

    var selectionManager = {
      setDataCollection: setDataCollection,
      getSelectedEntries: getSelectedEntries,
      hasSelectedEntries: hasSelectedEntries,
      hasDeselectedEntries: hasDeselectedEntries,
      isSelected: isSelected,
      isIdSelected: isIdSelected,
      selectById: selectById,
      selectAll: selectAll,
      deselectById: deselectById,
      deselectAll: deselectAll,
      getEntryById: getEntryById,
      toggleSelectionById: toggleSelectionById,
      toggleAllSelected: toggleAllSelected,
      enableSelections: enableSelections,
      disableSelections: disableSelections,
      makeIdUnselectable: makeIdUnselectable,
      makeIdSelectable: makeIdUnselectable,
      makeAllSelectable: makeAllSelectable,
      makeAllUnselectable: makeAllUnselectable,
      //event emitter functions
      subscribe: emitter.subscribe,
      unsubscribe: emitter.unsubscribe
    };

    return selectionManager;
  };

  // SelectionManagerFactory Object
  var service = {
    create: create
  };

  return service;
}]);
