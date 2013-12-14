'use strict';

var splendid = angular.module('splendid', ['ngRoute', 'ui.ace']);

splendid.config(['$routeProvider', function($routeProvider){

}]);

splendid.run(function($rootScope){
    $rootScope._editorEl = angular.element('#editor')[0];
    $rootScope._editor = window.ace.edit($rootScope._editorEl);
    $rootScope._editorSession = $rootScope._editor.getSession(),
    $rootScope._editorRenderer = $rootScope._editor.renderer;

    $rootScope.close = function(){
        window.chrome.app.window.current().close();
    };

    $rootScope.maximize = function(){
        var maximized = window.outerHeight == window.screen.availHeight &&
                  window.outerWidth == window.screen.availWidth;

        if (maximized) {
            window.chrome.app.window.current().restore();
        } else {
            window.chrome.app.window.current().maximize();
        }
    };
});

splendid.controller('TitleBarCtrl', function($scope, $timeout, UI){
    $scope.status = UI.getStatus();
});

splendid.controller('MenuCtrl', function($rootScope, $scope, File, UI){
    $scope.files = File.get();
    $rootScope.currentFile = File.getCurrentFile();
    UI.registerShortcut({
        name: 'saveFile',
        keys: ['ctrl+s', 'command+s'],
    }, function(){
        File.save($rootScope.currentFile).then(function(file){
            //console.log(file.name + ' saved!');
            UI.setStatus('File saved...');
        });
    });

    UI.registerShortcut({
        name: 'switchFileRight',
        keys: ['ctrl+alt+right', 'command+option+right'],
    }, function(){
        //console.log('movin\' on up!');
        var index = $scope.files.indexOf($rootScope.currentFile) + 1;
        //console.log(index)
        if(index > -1 && index < $scope.files.length)
            File.setCurrentFile($scope.files[index]);
        else
            File.setCurrentFile($scope.files[0]);
        $rootScope.$apply();
    });

    UI.registerShortcut({
        name: 'switchFileLeft',
        keys: ['ctrl+alt+left', 'command+option+left'],
    }, function(){
        //console.log('movin\' on down!');
        var index = $scope.files.indexOf($rootScope.currentFile) - 1;
        //console.log(index)
        if(index > -1)
            $rootScope.currentFile = $scope.files[index];
        else
            $rootScope.currentFile = $scope.files[$scope.files.length - 1];
        $rootScope.$apply();
    });

    UI.registerShortcut({
        name: 'openFile',
        keys: ['ctrl+o', 'command+o'],
    }, function(){
        File.open().then(function(file){
            $rootScope.currentFile = file;
        });
    });

    UI.registerShortcut({
        name: 'closeMenu',
        keys: ['enter'],
    }, function(){
        UI.hideMenu();
    });

    UI.registerShortcut({
        name: 'openMenu',
        keys: ['command+k command+b', 'ctrl+k ctrl+b'],
    }, function(){
        UI.showMenu();
    });

    UI.registerShortcut({
        name: 'closeFile',
        keys: ['command+w', 'ctrl+w'],
    }, function(){
        console.log('Closing that shit!')
        File.close(File.getCurrentFile());
    });

    UI.setStatus('Welcome!');

    $scope.openFile = function(){
        File.open().then(function(file){
            //$rootScope.currentFile = file;
            File.setCurrentFile(file);
        });
    };

    $scope.switchFile = function(name){
        $rootScope.currentFile = File.get(name);
    }

    $scope.saveFile = function(file){
        console.log(file);
        File.save(file).then(function(file){
            //console.log(file.name + ' saved!');
            UI.setStatus('File saved...');
        });
    }

    $scope.closeFile = function(file){
        var index = $scope.files.indexOf(file);

        if($scope.files[index].name == file.name && $scope.files.length > index)
            $rootScope.currentFile = $scope.files[index - 1];

        File.close(file);
    }
});

splendid.controller('EditorCtrl', function($rootScope, $scope, File){
    $scope.aceLoaded = function(_editor){
        // Editor part
        var _session = $scope._session = _editor.getSession();
        var _renderer = _editor.renderer;
        var _editorEl = document.getElementById('editor');

        // Options
        _editor.setReadOnly(false);
        _session.setUndoManager(new ace.UndoManager());
        _renderer.setShowGutter(true);
        _editor.setTheme("ace/theme/monokai");
        _editor.getSession().setMode("ace/mode/javascript");
        _editor.focus();
        _editorEl.style.fontSize='18px';
    };

    $rootScope.currentFile = File.getCurrentFile();

    $rootScope.$watch('currentFile', function(val){
        if(val) {
            $scope.file = val;
            $rootScope._editor.getSession().setMode("ace/mode/" + val.type);
        }
    });
});

