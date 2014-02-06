'use strict';
 /*jshint unused:false */
angular.module('splendid.system', ['splendid.filesystem']).factory('UI', function($rootScope, $q, $timeout, File, Editor){
	var _status = {};

	return {
        init: function(){

        },

        openFile: function(){
            File.open().then(function(file){
                //$rootScope.currentFile = file;
                File.setCurrentFile(file);
            });
        },
        switchFile: function(name){
            File.setCurrentFile(File.get(name));
        },
        saveFile: function(file){
            console.log(file);
            File.save(file).then(function(){
                //console.log(file.name + ' saved!');
                this.setStatus('File saved...');
            });
        },
        closeFile: function(file){
            var f = File.get(file.name);


            if(f.name === file.name) {
                File.setCurrentFile(file); //TODO: make open previous file
            }

            File.close(file);
        },
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
			$.UIkit.offcanvas.offcanvas.hide();
		},
		showMenu: function(){
			$.UIkit.offcanvas.offcanvas.show();
		},
		registerShortcut: function(opts, callback){
			/*for(var keys in opts.keys){
				var key = opts.keys[keys].replace('+', '-');
				_editor.commands.addCommand({
                    name: opts.name,
                    bindKey: key,
                    exec: callback,
                    readOnly: true // false if this command should not apply in readOnly mode
				});
			}*/

			Mousetrap.bind(opts.keys, callback);
		}
	};
});
