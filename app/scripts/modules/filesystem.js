'use strict';
var fs = require('fs');
var mime = require('mime');
 /*jshint unused:false */
angular.module('splendid.filesystem', ['splendid.editor']).factory('File', function($rootScope, $q, Editor){
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
            Editor.setMode(file.name);
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
            var chooser = document.querySelector('#file-open');
            chooser.addEventListener("change", function(evt) {
              var self = this;
              fs.readFile(this.value, 'utf8', function (err,data) {
                if (err) {
                  return deffered.reject();
                }
                var f = { path: self.value, name: self.value.split('/').pop(), file: data, type: mime.lookup(self.value) };
                console.log(f);
                _files.push(f);
                deffered.resolve(f);
              });
            }, false);

            chooser.click();

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
            fs.writeFile(f.path, f.file, function (err) {
              if (err) return deffered.reject(err);
              deffered.resolve(f);
            });

            // f.entry.createWriter(function(writer) {
            //     writer.onerror = function(e){deffered.reject(e);};
            //     writer.onwrite = function(){
            //         console.log(arguments);
            //         deffered.resolve(f);
            //     };

            //     f.entry.file(function(file){
            //         console.log(file);
            //         var blob = new Blob([f.file], {type: file.type || 'text/plain'});
            //         console.log(blob);
            //         writer.seek(0);
            //         writer.write(blob);
            //     });
            // }, function(e){deffered.reject(e);});

            return deffered.promise;
        }
    };
});
