'use strict';

angular.module('splendid.system', ['splendid.filesystem']).factory('UI', function($rootScope, $q, $timeout, File){
	var _status = {};
    var _editorEl = angular.element('#editor')[0];
	var _editor = window.ace.edit(_editorEl);
    var _editorSession = _editor.getSession();

	return {
        init: function(){
            this.registerShortcut({
                name: 'saveFile',
                keys: ['ctrl+s', 'command+s'],
            }, function(){
                File.save($rootScope.currentFile).then(function(){
                    //console.log(file.name + ' saved!');
                    this.setStatus('File saved...');
                });
            });

            this.registerShortcut({
                name: 'switchFileRight',
                keys: ['ctrl+alt+right', 'command+option+right'],
            }, function(){
                //console.log('movin\' on up!');
                var index = File.get(File.getCurrentFile().name) + 1;
                //console.log(index)
                if(index > -1 && index < $rootScope.files.length) {
                    File.setCurrentFile($rootScope.files[index]);
                }
                else {
                    File.setCurrentFile($rootScope.files[0]);
                }
                $rootScope.$apply();
            });

            this.registerShortcut({
                name: 'switchFileLeft',
                keys: ['ctrl+alt+left', 'command+option+left'],
            }, function(){
                console.log('movin\' on down!');
                var index = File.get(File.getCurrentFile().name) - 1;
                //console.log(index)
                if(index > -1) {
                    File.setCurrentFile($rootScope.files[index]);
                }
                else {
                    File.setCurrentFile($rootScope.files[$rootScope.files.length - 1]);
                }
                $rootScope.$apply();
            });

            this.registerShortcut({
                name: 'openFile',
                keys: ['ctrl+o', 'command+o'],
            }, function(){
                File.open().then(function(file){
                    File.setCurrentFile(file);
                });
            });

            this.registerShortcut({
                name: 'closeMenu',
                keys: ['enter'],
            }, function(){
                this.hideMenu();
            });

            this.registerShortcut({
                name: 'openMenu',
                keys: ['command+k command+b', 'ctrl+k ctrl+b'],
            }, function(){
                this.showMenu();
            });

            this.registerShortcut({
                name: 'closeFile',
                keys: ['command+w', 'ctrl+w'],
            }, function(){
                console.log('Closing that shit!');
                File.close(File.getCurrentFile());
            });

            // $rootScope.$watch('currentFile', function(val){
            //     if(val) {
            //         $scope.file = val;
            //         $rootScope._editor.getSession().setMode("ace/mode/" + val.type);
            //     }
            // });

            $rootScope.$on('file:current:changed', function(e, file){
                console.log('gothcha let\'s set the mode!', file);
                if(file) {
                    _editorSession.setMode('ace\/mode\/' + file.type);
                }
            });
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
	};
});
