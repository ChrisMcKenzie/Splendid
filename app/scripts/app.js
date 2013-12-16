'use strict';

var splendid = angular.module('splendid', ['ui.ace']);

splendid.run(function($rootScope, UI, File){
    $rootScope.ui = UI;
    $rootScope.currentFile = File.getCurrentFile();
    $rootScope.files = File.get();
    $rootScope.status = UI.getStatus();

    UI.init();
    UI.setStatus('Welcome!');
});

splendid.controller('TitleBarCtrl', function(){});

splendid.controller('MenuCtrl', function($rootScope, $scope, File, UI){

});

splendid.controller('EditorCtrl', function($rootScope, $scope, File){

    // $rootScope.$watch('currentFile', function(val){
    //     if(val) {
    //         $scope.file = val;
    //         $rootScope._editor.getSession().setMode("ace/mode/" + val.type);
    //     }
    // });
});

