'use strict';

/**
 * @fileoverview Editor API
 * @author chris@kbsurfer.com (Christopher McKenzie)
 */
 /*jshint unused:false */

var Theme = function(name, id) {
  this.name = name;
  this.id = id || 'ace/theme/' + name.toLowerCase().replace(/\s/g, '_');
  this.cls = this.id.replace(/[_\/]/g, '-');
};

var LightTheme = function() {
  Theme.apply(this, arguments);
  this.cls += ' ace-theme-light';
};

var DarkTheme = function() {
  Theme.apply(this, arguments);
  this.cls += ' ace-theme-dark';
};

angular.module('splendid.editor', ['splendid.settings'])
.value('THEMES', [
  new LightTheme('Chrome'),
  new LightTheme('Clouds'),
  new DarkTheme('Clouds Midnight'),
  new DarkTheme('Cobalt'),
  new LightTheme('Crimson Editor'),
  new LightTheme('Dawn'),
  new LightTheme('Dreamweaver'),
  new LightTheme('Eclipse'),
  new DarkTheme('idleFingers', 'ace/theme/idle_fingers'),
  new DarkTheme('krTheme', 'ace/theme/kr_theme'),
  new DarkTheme('Merbivore'),
  new DarkTheme('Merbivore Soft'),
  new DarkTheme('Mono Industrial'),
  new DarkTheme('Monokai'),
  new DarkTheme('Pastel on dark'),
  new DarkTheme('Solarized Dark'),
  new LightTheme('Solarized Light'),
  new LightTheme('TextMate'),
  new DarkTheme('Twilight'),
  new LightTheme('Tomorrow'),
  new DarkTheme('Tomorrow Night'),
  new DarkTheme('Tomorrow Night Blue'),
  new DarkTheme('Tomorrow Night Bright'),
  new DarkTheme('Tomorrow Night 80s', 'ace/theme/tomorrow_night_eighties'),
  new DarkTheme('Vibrant Ink')
]).factory('Editor', function(Settings, THEMES){
    var _editor;

    var Editor = {
        mode: null,
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
            console.log(window.ace.require('ace/ext/modelist').getModeForPath(file));
            this.mode = window.ace.require('ace/ext/modelist').getModeForPath(file);
        }
    };

    // Settings registration;
    Settings.register('General', {
        'editor.fontSize': {
            id: 'editor.fontSize',
            title: 'Text Size',
            type: 0,
            options: [{
                name: 'Small',
                size: 10
            },{
                name: 'Medium',
                size: 16
            },{
                name: 'Large',
                size: 18
            }, {
                name: 'Extra Large',
                size: 24
            }],
            value: {
                name: 'Medium',
                size: 16
            }
        },
        'editor.theme': {
            id: 'editor.theme',
            title: 'Theme',
            options: THEMES,
            value: THEMES[13],
            type: 0
        },
        'editor.showGutter': {
            id: 'editor.showGutter',
            title: 'Show Gutter',
            type: 1,
            value: true
        },
        'editor.wordWrap': {
            id: 'editor.wordWrap',
            title: 'Word Wrap',
            type: Settings.SWITCH,
            value: false
        }
    });

    return Editor;
}).directive('sEditor', function(Editor, Settings){
    return {
        restrict: 'E',
        require: '?ngModel',
        template: '<div class="editor"></div>',
        link: function($scope, element, attrs, ngModel){
            //console.log(Editor.theme);
            $scope.theme = Settings.categorySettings.general['editor.theme'];
            $scope.showGutter = Settings.categorySettings.general['editor.showGutter'];
            $scope.wordWrap = Settings.categorySettings.general['editor.wordWrap'];
            $scope.fontSize = Settings.categorySettings.general['editor.fontSize'];
            $scope.mode = Editor.mode;

            $scope.editor = window.ace.edit(element.children('.editor')[0]);
            $scope.session = $scope.editor.getSession();

            Editor.register($scope.editor);

            attrs.$observe('ngModel', function(value){ // Got ng-model bind path here
                $scope.$watch(value,function(newValue){ // Watch given path for changes
                    $scope.session.setValue(newValue);
                });
            });

            $scope.editor.setShowFoldWidgets(true);
        },
        controller: function($scope){

            $scope.$watch('theme', function(theme){
                console.log(theme);
                $scope.editor.setTheme(theme.value.id);
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

            $scope.$watch('fontSize', function(fontSize) {
                console.log(fontSize);
                $scope.editor.setFontSize(fontSize.value.size);
            }, true);

            $scope.$watch(function(){ return Editor.mode; }, function(mode){
                console.log(mode);
                if(mode){
                    $scope.session.setMode(mode.mode);
                }
            });
        }
    };
});
