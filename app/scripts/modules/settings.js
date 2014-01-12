'use strict';

angular.module('splendid.settings', ['splendid.config']).factory('Settings', function($rootScope){
	return {
		show: function(){
            //console.log('showing off...');
			$rootScope.$broadcast('settings:dialog:show');
		},
        hide: function(){
            $rootScope.$broadcast('settings:dialog:hide');
        },
        addPane: function(pane){
            $rootScope.$broadcast('settings:dialog:addPane', pane);
        }
	};
}).directive('sSettings', ['BASE_TEMPLATE_PATH', function(BASE_TEMPLATE_PATH, Settings){
    var scrollpos;

    // Show the Settings Panel
    var show = function(element){
        console.log('hello world');
        element = element.children(':first');
        //if (!element.length) return;
        console.log(element);
        var $win      = $(window),
            $doc      = $(document),
            doc       = $("html"),
            bar       = element.find(".uk-offcanvas-bar:first"),
            dir       = bar.hasClass("uk-offcanvas-bar-flip") ? -1 : 1,
            scrollbar = dir == -1 && $win.width() < window.innerWidth ? (window.innerWidth - $win.width()) : 0;


        scrollpos = {x: window.scrollX, y: window.scrollY};

        element.addClass("uk-active");

        doc.css({"width": window.innerWidth, "height": window.innerHeight}).addClass("uk-offcanvas-page");
        doc.css("margin-left", ((bar.outerWidth() - scrollbar) * dir)).width(); // .width() - force redraw

        console.log(bar);
        bar.addClass("uk-offcanvas-bar-show").width();

        element.off(".ukoffcanvas").on("click.ukoffcanvas swipeRight.ukoffcanvas swipeLeft.ukoffcanvas", function(e) {

            var target = $(e.target);

            if (!e.type.match(/swipe/)) {
                if (target.hasClass("uk-offcanvas-bar")) return;
                if (target.parents(".uk-offcanvas-bar:first").length) return;
            }

            e.stopImmediatePropagation();

            hide(element);
        });

        $doc.on('keydown.offcanvas', function(e) {
            if (e.keyCode === 27) { // ESC
                hide(element);
            }
        });
    };

    var hide = function(element){
        var doc   = $("html"),
            panel = $(".uk-offcanvas.uk-active"),
            bar   = panel.find(".uk-offcanvas-bar:first");

        if (!panel.length) return;

        if ($.UIkit.support.transition) {


            doc.one($.UIkit.support.transition.end, function() {
                doc.removeClass("uk-offcanvas-page").attr("style", "");
                panel.removeClass("uk-active");
                window.scrollTo(scrollpos.x, scrollpos.y);
            }).css("margin-left", "");

            setTimeout(function(){
                bar.removeClass("uk-offcanvas-bar-show");
            }, 50);

        } else {
            doc.removeClass("uk-offcanvas-page").attr("style", "");
            panel.removeClass("uk-active");
            bar.removeClass("uk-offcanvas-bar-show");
            window.scrollTo(scrollpos.x, scrollpos.y);
        }

        panel.off(".ukoffcanvas");
        doc.off(".ukoffcanvas");
    }


	return {
		restrict: 'E',
        transclude: true,
        scope: {},
		templateUrl: BASE_TEMPLATE_PATH + 'settings.html',
        controller: function($scope){
            var panes = $scope.panes = [];

            $scope.select = function(pane) {
              angular.forEach(panes, function(pane) {
                pane.selected = false;
              });
              pane.selected = true;
            };

            this.addPane = function(pane) {
              if (panes.length == 0) {
                $scope.select(pane);
              }
              panes.push(pane);
            };

            $scope.$on('settings:dialog:addPane', function(data){
                this.addPane(data);
            });
        },
        link: function($scope, element) {
            $scope.$on('settings:dialog:show', function(){
                show(element);
            });

            $scope.$on('settings:dialog:hide', function(){
                hide(element);
            });
        }
	};
}]).directive('sSettingsPane', ['Settings', function(Settings){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: {
            title: '@'
        }, // {} = isolate, true = child, false/undefined = no change
        // cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
        require: '^sSettings', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div class="settings-pane" ng-cloak ng-show="selected" ng-transclude></div>',
        // templateUrl: '',
        // replace: true,
        transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, sSettingsCtrl) {
            sSettingsCtrl.addPane($scope);
        }
    };
}]);
