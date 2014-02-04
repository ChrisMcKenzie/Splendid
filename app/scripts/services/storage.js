'use strict';

/**
 * @fileoverview Storage Api
 */

//Borrowed from Text Drive App https://github.com/vojtajina/textdrive/blob/master/app/js/services/storage.js
angular.module('splendid.storage', []).value('store', chrome.storage && chrome.storage.sync || {
  set: function(data, fn) {
    localStorage.setItem('storage', JSON.stringify(data));
    setTimeout(function() {
      fn();
    }, 0);
  },
  get: function(keys, fn) {
    setTimeout(function() {
      fn(JSON.parse(localStorage.getItem('storage') || '{}'));
    }, 0);
  }
}).factory('storage', function($rootScope, chromeStorage) {
  return {
    get: function(keys, fn) {
      chromeStorage.get(keys, function(data) {
        $rootScope.$apply(function() {
          fn(data);
        });
      });
    },
    set: function(data, fn) {
      chromeStorage.set(data, function() {
        $rootScope.$apply(function() {
          fn();
        });
      });
    }
  };
});