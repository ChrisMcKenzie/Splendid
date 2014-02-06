/**
 * @fileoverview Basic App configuration options.
 * @author chris@kbsurfer.com (Chris McKenzie)
 */

/** Module def (Mos Def!) */
var config = angular.module('splendid.config', []);

/** @const {string} Base path for html templates */
config.constant('BASE_TEMPLATE_PATH', './templates/');
/** @const {string} Base path for Plugins */
config.constant('BASE_PLUGIN_PATH', '/plugins');
