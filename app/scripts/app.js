'use strict';

var splendid = angular.module('splendid', [
    'ui.ace',
    'splendid.config',
    'splendid.settings',
    'splendid.header'
]);


splendid.run(function($rootScope, UI, Settings){
    UI.init();
    UI.setStatus('Welcome!');
});

splendid.controller('AppCtrl', function($rootScope, $scope, File, UI, Settings){
    $rootScope.ui = UI;
    $rootScope.file = File;
    $rootScope.currentFile = File.getCurrentFile();
    $rootScope.files = File.get();
    $rootScope.status = UI.getStatus();


    $rootScope.settings = Settings;

    $rootScope.show = Settings.show;

    // $rootScope.$watch('currentFile', function(val){
    //     if(val) {
    //         $scope.file = val;
    //         $rootScope._editor.getSession().setMode("ace/mode/" + val.type);
    //     }
    // });
});

