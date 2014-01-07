'use strict';

splendid.factory('File', function($rootScope, $q){
    var _files = [];
    var _currentFile = {};

    return {
        get: function(name){
            if(!name) { return _files; }
            for(var file in _files){
                if(_files[file].name === name){
                    return _files[file];
                }
            }
        },
        setCurrentFile: function(file){
            _currentFile = file;
            $rootScope.$broadcast('file:current:changed', file);
            return true;
        },
        getCurrentFile: function(){
            return _currentFile;
        },
        create: function(){

        },
        fileExists: function(file){
            for(var f in _files){
                if(_files[f].name === file.name){
                    return true;
                }
            }
            return false;
        },
        open: function(){
            var deffered = $q.defer();
            var self = this;

            chrome.fileSystem.chooseEntry({type: 'openWritableFile'}, function(entry) {

                entry.file(function(file) {
                    var reader = new FileReader();

                    reader.onerror = function(e){
                        deffered.reject(e);
                    };

                    reader.onloadend = function() {
                        //console.log(e.target.result);
                        var f = { name: entry.name, entry: entry, file: reader.result, type: file.type !== 'text/plain' ? file.type.split('/')[1] : 'text' };

                        if(self.fileExists(f)) {
                            deffered.reject();
                            return;
                        }

                        _files.push(f);
                        //console.log(_files);
                        deffered.resolve(f);
                    };

                    reader.readAsText(file);
                });
            });

            return deffered.promise;
        },
        close: function(file){
            for(var index in _files){
                console.log(_files[index], file);
                if(_files[index].name === file.name && _files.length > index) {
                    _currentFile = _files[index - 1];
                    _files.splice(index, 1);
                }
            }
        },
        save: function(f){
            var deffered = $q.defer();

            f.entry.createWriter(function(writer) {
                writer.onerror = function(e){deffered.reject(e);};
                writer.onwrite = function(){
                    console.log(arguments);
                    deffered.resolve(f);
                };

                f.entry.file(function(file){
                    console.log(file);
                    var blob = new Blob([f.file], {type: file.type || 'text/plain'});
                    console.log(blob);
                    writer.seek(0);
                    writer.write(blob);
                });
            }, function(e){deffered.reject(e);});

            return deffered.promise;
        }
    };
});
