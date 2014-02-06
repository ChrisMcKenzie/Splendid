'use strict';
/**
 * @fileoverview API and Directive for App Header Element.
 * @author chris@kbsurfer.com (Chris McKenzie)
 */

angular.module('splendid.header', ['splendid.config', 'splendid.filesystem']).factory('Header',function(){
	return {
		message: '',
        /**
         * Sets the message on the header notif area.
         * @param {string} the message to display.
         */
		setMessage: function(message){
			this.message = message;
		},
        /**
         * Close App window.
         */
        closeWindow: function(){
            window.chrome.app.window.current().close();
        },
        /**
         * Minimize App window.
         */
        minimizeWindow: function(){
            window.chrome.app.window.current().minimize();
        },
        /**
         * Maximize App window.
         */
        maximizeWindow: function(){
            if (this.isMaximized()) {
                window.chrome.app.window.current().restore();
            } else {
                window.chrome.app.window.current().maximize();
            }
        },
        /**
         * Is current Window Maximized.
         * @return {boolean} true if window is at maximum size.
         */
        isMaximized: function(){
            return window.outerHeight === window.screen.availHeight &&
                            window.outerWidth === window.screen.availWidth;
        }
	};
}).directive('sHeader', ['BASE_TEMPLATE_PATH', 'Header', function(BASE_TEMPLATE_PATH){
    return {
        restrict: 'E', //Element only
        scope: {}, //Private Scope.
        templateUrl: BASE_TEMPLATE_PATH + 'header.html', // templates/header.html
        controller: function($scope, Header, File){
            //Place Header API on directive scope.
            $scope.api = Header;
            $scope.files = File.get();
        }
    };
}]);
