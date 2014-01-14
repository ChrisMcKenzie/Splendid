'use strict';
/**
 * @fileoverview App Initialization
 * @author chris@kbsurfer.com (Chris McKenzie)
 */

// Require.js Setup
require.config({
    enforceDefine: false // so that we don't have to define
});


//Define the app.
/** @constructor */
var splendid = angular.module('splendid', [
    'ui.ace',
    'splendid.config',
    'splendid.system',
    'splendid.filesystem',
    'splendid.settings',
    'splendid.header'
]);

//Basic initialization
splendid.run(function($rootScope, UI){
    UI.init();
    UI.setStatus('Welcome!');
});


//App Controller
splendid.controller('AppCtrl', function($rootScope, $scope, File, UI, Settings){

    //Place System Services on the rootScope.
    $rootScope.ui = UI;
    $rootScope.file = File;
    $rootScope.currentFile = File.getCurrentFile();
    $rootScope.files = File.get();
    $rootScope.status = UI.getStatus();


    $rootScope.settings = Settings;

    $rootScope.show = Settings.show;
});

