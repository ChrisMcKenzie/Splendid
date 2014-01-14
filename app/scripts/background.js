'use strict';
/**
 * @constructor
 */
function Background() {
    this.entriesToOpen = [];
    this.windows = [];
}

/**
 * @return {boolean}
 * True if the system window frame should be shown. It is on the systems where
 * borderless window can't be dragged or resized.
 */
Background.prototype.ifShowFrame = function() {
    var version = parseInt(navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10),
        os = 'other';

    if (navigator.appVersion.indexOf('Linux') !== -1) {
        os = 'linux';
    } else if (navigator.appVersion.indexOf('CrOS') !== -1) {
        os = 'cros';
    } else if (navigator.appVersion.indexOf('Mac OS X') !== -1) {
        os = 'mac';
    }

    return os === 'linux' && version < 27 || os === 'mac' && version < 25;
};

Background.prototype.newWindow = function() {
    var options = {
        id: 'mainWindow',
        frame: 'none',
        minWidth: 800,
        minHeight: 600,
        width: 800,
        height: 600
    };


    chrome.app.window.create('index.html', options, function(win) {
        console.log('Window opened:', win);
        win.onClosed.addListener(this.onWindowClosed.bind(this, win));
    }.bind(this));
};

/**
 * @param {Object.<string, Object>} launchData
 * Handle onLaunch event.
 */
Background.prototype.launch = function(launchData) {
    var entries = [];
    if (launchData && launchData.items) {
        for (var i = 0; i < launchData.items.length; i++) {
            entries.push(launchData.items[i].entry);
        }
    }

    if (this.windows.length === 0) {
        this.newWindow();
    }

    var openEntries = function(entry) {
        if (this.windows.length > 0) {
            this.windows[0].openEntries([entry]);
        } else {
            this.entriesToOpen.push(entry);
        }
    };

    for (var j = 0; j < entries.length; j++) {
        chrome.fileSystem.getWritableEntry(entries[j],openEntries.bind(this));
    }
};

/**
 * @param {Window} win
 * Handle onClosed.
 */
Background.prototype.onWindowClosed = function(win) {
    console.log('Window closed:', win);
    if (!win.contentWindow || !win.contentWindow.textApp) {
        console.warn('No Text.app object in the window being closed:', win.contentWindow, win.contentWindow.textApp);
        return;
    }

    var td = win.contentWindow.textApp;

    for (var i = 0; i < this.windows.length; i++) {
        if (td === this.windows[i]) {
            this.windows.splice(i, 1);
        }
    }

    var toSave = td.getFilesToSave();
    console.log('Got ' + toSave.length + ' files to save:', toSave);

    for (var j = 0; j < toSave.length; j++) {
        var entry = toSave[j].entry;
        var contents = toSave[j].contents;
        this.saveFile(entry, contents);
    }
};

/**
 * @param {FileEntry} entry
 * @param {string} contents
 */
Background.prototype.saveFile = function(entry, contents) {
    util.writeFile(entry, contents, function() {console.log('Saved', entry.name);});
};

/**
 * @param {TextApp} td
 * Called by the TextApp object in the window when the window is ready.
 */
Background.prototype.onWindowReady = function(td) {
    this.windows.push(td);
    td.setHasChromeFrame(this.ifShowFrame());

    if (this.entriesToOpen.length > 0) {
        td.openEntries(this.entriesToOpen);
        this.entriesToOpen = [];
    } else {
        td.openNew();
    }
};

/**
 * @param {FileEntry} entry
 * @param {function(FileEntry)} callback
 * Make a copy of a file entry.
 */
Background.prototype.copyFileEntry = function(entry, callback) {
    chrome.fileSystem.getWritableEntry(entry, callback);
};

var background = new Background();
chrome.app.runtime.onLaunched.addListener(background.launch.bind(background));


/* Exports */
window.background = background;
Background.prototype.copyFileEntry = Background.prototype.copyFileEntry;
Background.prototype.onWindowReady = Background.prototype.onWindowReady;
Background.prototype.newWindow = Background.prototype.newWindow;

