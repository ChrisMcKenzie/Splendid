'use strict';

/**
 * @fileoverview Editor API  
 * @author chris@kbsurfer.com (Christopher McKenzie)
 */
 /*jshint unused:false */
angular.module('splendid.editor', ['splendid.settings']).factory('Editor', function(Settings){
    var _editor;

    var Editor = {
        /**
         * Add editor to the api.
         */
        register: function(editor){
            _editor = editor;
        },
        /**
         * Get editor instance.
         */
        get: function(){
            return _editor;
        },
        /**
         * Focus Editor
         */
        focus: function(){
            _editor.focus();
        },
        /**
         * Set Mode Based on FilePath
         */
        setMode: function(file){
            this.modemodeList.getModeForPath(file.name);
        }
    };

    // Settings registration;
    Settings.register('General', {
        'editor.wordWrap': {
            id: 'editor.wordWrap',
            title: 'Word Wrap',
            type: Settings.SWITCH,
            value: false
        },
        'editor.theme': {
            id: 'editor.theme',
            title: 'Theme',
            options: window.ace.require('ace/ext/themelist').themes,
            value: window.ace.require('ace/ext/themelist').themes[10],
            type: 0
        },
        'editor.showGutter': {
            id: 'editor.showGutter',
            title: 'Show Gutter',
            type: 1,
            value: true
        },
    });

    return Editor;
}).directive('sEditor', function(Editor, Settings){
    return {
        restrict: 'E',
        require: '?ngModel',
        template: '<div class="editor"></div>',
        link: function($scope, element, attrs, ngModel){
            //console.log(Editor.theme);
            $scope.theme = Settings.categorySettings['general']['editor.theme'];
            $scope.showGutter = Settings.categorySettings['general']['editor.showGutter'];
            $scope.wordWrap = Settings.categorySettings['general']['editor.wordWrap'];
            $scope.editor = window.ace.edit(element.children('.editor')[0]);
            $scope.session = $scope.editor.getSession();

            Editor.register($scope.editor);

            attrs.$observe('ngModel', function(value){ // Got ng-model bind path here
                $scope.$watch(value,function(newValue){ // Watch given path for changes
                    $scope.session.setValue(newValue);
                });
            });
        },
        controller: function($scope){

            $scope.$watch('theme', function(theme){
                console.log(theme);
                $scope.editor.setTheme(theme.value.theme);
            }, true);

            // Watch showGutter property and change in editor.
            $scope.$watch('showGutter', function(showGutter){
                //console.log(showGutter);
                $scope.editor.renderer.setShowGutter(showGutter.value);
            }, true);

            $scope.$watch('wordWrap', function(wordWrap){
                //console.log(wordWrap);
                $scope.session.setUseWrapMode(wordWrap.value);
            }, true);
        }
    };
});
