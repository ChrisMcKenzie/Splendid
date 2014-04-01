'use strict';
/**
 * @fileoverview API and Directive Settings Module.
 * @author chris@kbsurfer.com (Chris McKenzie)
 */

/** @constructor */
angular.module('splendid.settings', ['splendid.config']).factory('Settings', function($rootScope, $compile, $q){
    var _element = angular.element('s-settings'); // categories

	return {
        categories: {},
        categorySettings: {},
        /**
         * Initiate api for settings panel.
         */
        init: function(element){
            _element = element;
        },
        /**
         * Fires the show event and shows the main panel.
         */
		show: function(){
            //console.log('showing off...');
			$rootScope.$broadcast('settings:dialog:show');
		},
        /**
         * Fires the hide event and hides the main panel.
         */
        hide: function(){
            $rootScope.$broadcast('settings:dialog:hide');
        },
        /**
         * Change setting value.
         * @param {string} the setting id eg: editor.theme
         * @param {*} the value to be set.
         * @return {promise}
         */
        set: function(setting, value){
            var deffered = $q.defer(),
                s = {};

            s[setting] = value;

            window.chrome.storage.sync.set(s, function(){
                deffered.resolve(value);
            });

            return deffered.promise;
        },
        /**
         * Get setting value
         * @param {string} setting id
         * @return {promise}
         */
        get: function(setting){
            var deffered = $q.defer();

            window.chrome.storage.sync.get(setting, function(data){
                if(data) {
                    deffered.resolve(data[setting]);
                } else {
                    deffered.reject();
                }
            });

            return deffered.promise;
        },
        /**
         * Register a new Setting Section or new setting element/group
         * @param {string} title of the section.
         */
        register: function(category, settings) {
            var self = this;
            //TODO: storage system.
            //Section registration
            //TODO: register a section a create DOM element.
            // Create Settings Pane if doesn't exist.
            var lowered = angular.lowercase(category);
            if(!this.categories[category]) {
                // Category doesn't exist
                this.categories[category] = {
                    id: lowered,
                    title: category
                };

                this.categorySettings[lowered] = {};
            }

            if(settings){
                //console.log(settings);
                angular.forEach(settings, function(setting){
                    self.get(setting.id).then(function(data){
                        console.log('Settings exists loading it into memory');
                        setting.value = data;
                    }, function(){
                        console.log('Settings could not be found loading default');
                        //setting.value = setting.value;
                        self.set(setting.id, setting.value);
                    });
                });

                this.categorySettings[lowered] = settings;
            }
        },
        registerShortcut: function(){

        },
        SELECT: 0,
        SWITCH: 1
	};
}).directive('sSettings', ['BASE_TEMPLATE_PATH', 'Editor', 'Settings', function(BASE_TEMPLATE_PATH, Editor, Settings){
    var scrollpos;

    // Show the Settings Panel
    var show = function(element){
        //console.log('hello world');
        element = element.children(':first');
        //if (!element.length) return;
        //console.log(element);
        var $win      = $(window),
            $doc      = $(document),
            doc       = $('html'),
            bar       = element.find('.uk-offcanvas-bar:first'),
            dir       = bar.hasClass('uk-offcanvas-bar-flip') ? -1 : 1,
            scrollbar = dir === -1 && $win.width() < window.innerWidth ? (window.innerWidth - $win.width()) : 0;


        scrollpos = {x: window.scrollX, y: window.scrollY};

        element.addClass('uk-active');

        doc.css({'width': window.innerWidth, 'height': window.innerHeight}).addClass('uk-offcanvas-page');
        doc.css('margin-left', ((bar.outerWidth() - scrollbar) * dir)).width(); // .width() - force redraw

        //console.log(bar);
        bar.addClass('uk-offcanvas-bar-show').width();

        //Listen and close onSwipe or outClick.
        element.off('.ukoffcanvas').on('click.ukoffcanvas swipeRight.ukoffcanvas swipeLeft.ukoffcanvas', function(e) {

            var target = $(e.target);

            if (!e.type.match(/swipe/)) {
                if (target.hasClass('uk-offcanvas-bar')) { return; }
                if (target.parents('.uk-offcanvas-bar:first').length) { return; }
            }

            e.stopImmediatePropagation();

            hide(element);
        });

        // Listen and close onEscape.
        $doc.on('keydown.offcanvas', function(e) {
            if (e.keyCode === 27) { // ESC
                hide(element);
            }
        });
    };

    //Hide Settings Panel
    var hide = function(){
        var doc   = $('html'),
            panel = $('.uk-offcanvas.uk-active'),
            bar   = panel.find('.uk-offcanvas-bar:first');

        if (!panel.length) { return; }

        if ($.UIkit.support.transition) {


            doc.one($.UIkit.support.transition.end, function() {
                doc.removeClass('uk-offcanvas-page').attr('style', '');
                panel.removeClass('uk-active');
                window.scrollTo(scrollpos.x, scrollpos.y);
            }).css('margin-left', '');

            setTimeout(function(){
                bar.removeClass('uk-offcanvas-bar-show');
            }, 50);

        } else {
            doc.removeClass('uk-offcanvas-page').attr('style', '');
            panel.removeClass('uk-active');
            bar.removeClass('uk-offcanvas-bar-show');
            window.scrollTo(scrollpos.x, scrollpos.y);
        }

        panel.off('.ukoffcanvas');
        doc.off('.ukoffcanvas');
        Editor.focus();
    };


	return {
		restrict: 'E',
        scope: {},
		templateUrl: BASE_TEMPLATE_PATH + 'settings.html',
        controller: function($scope){
            $scope.categories = Settings.categories;
            $scope.categorySettings = Settings.categorySettings;

            $scope.change = function(category, setting){
                //console.log(setting);
                $scope.categorySettings[category.id][setting.id].value = setting.value;
                Settings.set(setting.id, setting.value);
            };

            $scope.select = function(category) {
                angular.forEach($scope.categories, function(category) {
                    category.selected = false;
                });
                category.selected = true;
            };

            $scope.$watch('categories', function(scope, categories){
                if (Object.keys(categories).length) {
                    $scope.select(categories[Object.keys(categories)[0]]);
                }
            });
        },
        link: function($scope, element) {
            Settings.init(element);

            //Listen for show
            $scope.$on('settings:dialog:show', function(){
                show(element);
            });
            //Listener for hide
            $scope.$on('settings:dialog:hide', function(){
                hide(element);
            });
        }
	};
}]).directive('sSettingsPane', ['Settings', 'BASE_TEMPLATE_PATH', function(Settings, BASE_TEMPLATE_PATH){
    return {
        scope: {
            title: '@',
        },
        require: '^sSettings',
        restrict: 'E',
        transclude: true,
        templateUrl: BASE_TEMPLATE_PATH + 'settings-pane.html',
        controller: function($scope){
            console.log($scope);
        },
        link: function(/*$scope, element, attrs, sSettingsCtrl*/) {
            //console.log($scope.$eval(attrs.settings));
            //sSettingsCtrl.addPane($scope);
        }
    };
}]);
