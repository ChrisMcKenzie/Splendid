'use strict';
/**
 * @fileoverview API and Directive Settings Module.
 * @author chris@kbsurfer.com (Chris McKenzie)
 */

/** @constructor */
angular.module('splendid.settings', ['splendid.config']).factory('Settings', function($rootScope){
	return {
        /**
         * Settings Type: Select
         */
        get SELECT() {
            return '<select></select>';
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
         * Fires the addPane event and adds a pane to the dialog.
         * @param {SettingPane} the pane object to be added
         */
        addPane: function(pane){
            $rootScope.$broadcast('settings:dialog:addPane', pane);
        },
        /**
         * Register a new Setting Section or new setting element/group
         * @param {string} title of the section.
         */
        register: function() {
            //TODO: storage system.
            var args = arguments;
            console.log(args);

            if(args.length <= 1 /** TODO: Or section doesn't exist */){
                //Section registration
                //TODO: register a section a create DOM element.
            } else if(args.length > 1 && typeof args[1] === 'string'){
                // Section group registration
            } else if(args.length > 1 && Object.prototype.toString.call( args[1] ) === '[object Array]') {
                // Section settings registration
            }
        }
	};
}).directive('sSettings', ['BASE_TEMPLATE_PATH', 'Editor', function(BASE_TEMPLATE_PATH, Editor){
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
        transclude: true,
        scope: {},
		templateUrl: BASE_TEMPLATE_PATH + 'settings.html',
        controller: function($scope){
            //panes displayed on the panel
            var panes = $scope.panes = [];

            /**
             * Set given pane as selected
             * @param {SettingsPane} the pane to be selected.
             */
            $scope.select = function(pane) {
                // deselect all panes
                angular.forEach(panes, function(pane) {
                    pane.selected = false;
                });
                pane.selected = true;
            };

            /**
             * Add pane to @code { $scope.panes }
             * @param {SettingsPane} the pane to be added.
             */
            this.addPane = function(pane) {
                if (panes.length === 0) {
                    $scope.select(pane);
                }
                panes.push(pane);
                $scope.$emit('settings:dialog:paneAdded');
            };

            //Listener for adding panes.
            $scope.$on('settings:dialog:addPane', function(data){
                this.addPane(data);
            });
        },
        link: function($scope, element) {
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
}]).directive('sSettingsPane', ['Settings', function(){
    return {
        scope: {
            title: '@'
        },
        require: '^sSettings',
        restrict: 'E',
        template: '<div class="settings-pane" ng-cloak ng-show="selected" ng-transclude></div>',
        transclude: true,
        link: function($scope, iElm, iAttrs, sSettingsCtrl) {
            sSettingsCtrl.addPane($scope);
        }
    };
}]);
