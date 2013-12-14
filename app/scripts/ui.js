splendid.factory('UI', function($rootScope, $q, $timeout){
	var _status = {};
	var _editor = $rootScope._editor;
	return {
		getStatus: function(){
			return _status;
		},
		setStatus: function(msg){
			_status.message = msg;
			$timeout(function(){
				_status.message = '';
			}, 3000);
		},
		hideMenu: function(){
			$.UIkit.offcanvas.offcanvas.hide()
		},
		showMenu: function(){
			$.UIkit.offcanvas.offcanvas.show()
		},
		registerShortcut: function(opts, callback){
			for(var keys in opts.keys){
				var key = opts.keys[keys].replace('+', '-');
				_editor.commands.addCommand({
			    name: opts.name,
			    bindKey: key,
			    exec: callback,
			    readOnly: true // false if this command should not apply in readOnly mode
				});
			}

			Mousetrap.bind(opts.keys, callback);
		}
	}
});