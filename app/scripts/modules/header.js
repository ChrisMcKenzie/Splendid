'use strict';

angular.module('splendid.header', ['splendid.config']).factory('Header',function(){
	return {
		message: '',
		setMessage: function(message){
			this.message = message;
		},
        closeWindow: function(){
            window.chrome.app.window.current().close();
        },
        minimizeWindow: function(){
            window.chrome.app.window.current().minimize();
        },
        maximizeWindow: function(){
            var maximized = window.outerHeight === window.screen.availHeight &&
                            window.outerWidth === window.screen.availWidth;

            if (maximized) {
                window.chrome.app.window.current().restore();
            } else {
                window.chrome.app.window.current().maximize();
            }
        }
	};
}).directive('sHeader', ['BASE_TEMPLATE_PATH', 'Header', function(BASE_TEMPLATE_PATH, Header){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: BASE_TEMPLATE_PATH + 'header.html',
        controller: function($scope, Header){
            $scope.api = Header;
            console.log(Header);
        }
    };
}]);
