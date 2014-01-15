'use strict';

/**
 * @fileoverview Editor API  
 * @author chris@kbsurfer.com (Christopher McKenzie)
 */
 /*jshint unused:false */
angular.module('splendid.editor', ['splendid.settings']).factory('Editor', function(Settings){
    var _editor,
        themeList = window.ace.require('ace/ext/themelist'),
        modeList  = window.ace.require('ace/ext/modelist');

    Settings.register('General', [{
        title: 'Theme',
        type: Settings.SELECT,
        values: themeList.themes,
        default: themeList.themes[15]
    }]);

    var Editor = {
        get themes() { return themeList.themes; },

        modes: modeList.modes,
        
        _theme: themeList.themes[15],
        get theme() {
            //console.log(this._theme); 
            return this._theme;
        },
        set theme(theme) {
            //console.log('setting', theme); 
            this._theme = theme;
        },

        mode: 'text',
        showGutter: true,
        wrap: true,
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

    return Editor;
}).directive('sEditor', function(Editor){
    return {
        restrict: 'E',
        require: '?ngModel',
        template: '<div class="editor"></div>',
        link: function($scope, element, attrs, ngModel){
            //console.log(Editor.theme);
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

            //watch theme property and change on editor.
            $scope.$watch(function(scope){ return Editor.theme; }, function(theme){
                theme = theme.name;
                console.log(theme);
                $scope.editor.setTheme('ace/theme/' + theme);
            }, false);

            // Watch mode property and change in session.
            $scope.$watch(function(scope){ return Editor.mode; }, function(mode){
                $scope.session.setMode('ace/mode/' + mode);
            });

            $scope.$watch(function(scope){ return Editor.showGutter; }, function(showGutter){
                $scope.editor.renderer.setShowGutter(showGutter);
            });

            
        }
    };
});
