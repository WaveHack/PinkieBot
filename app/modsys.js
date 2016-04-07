'use strict';

var escapeStringRegexp = require('escape-string-regexp');

var modsys = {
    config: {},
    modules: {
        loaded: {},
        active: {} // todo
    },
    hooks: {},
    lastError: null
};

/**
 * Attempts to load a module.
 *
 * @param {string} moduleId
 * @returns {boolean}
 */
modsys.load = function (moduleId) {
    moduleId = moduleId.toLowerCase();

    console.log('Loading module ' + moduleId);

    // Check if module is already loaded
    if (this.isLoaded(moduleId)) {
        this.lastError = ('Module ' + moduleId + ' is already loaded');
        return false;
    }

    var modulePath = ('./modules/' + moduleId);

    // Force remove module from require cache, so we can re-parse the file
    try {
        delete require.cache[require.resolve(modulePath)];
    } catch (e) {}

    // See if module file exists
    try {
        require.resolve(modulePath);
    } catch (e) {
        this.lastError = e.message;
        return false;
    }

    // Parse it
    try {
        var module = require(modulePath);
    } catch (e) {
        this.lastError = e.message;
        return false;
    }

    // Some temp validation
    if (typeof module.meta.id === 'undefined' || module.meta.id !== moduleId) {
        this.lastError = ('Module id must be same as filename for module ' + moduleId);
        return false;
    }

    // todo: check if dependencies are met. if not, load them?

    // todo: load config.json if module is in its own directory

    if (typeof module.init !== 'function') {
        this.lastError = 'Module is missing an init method';
        return false;
    }

    // Initialize it
    try {
        var initialized = module.init(this);
    } catch (e) {
        initialized = false;
    }

    if (!initialized) {
        this.lastError = 'The init method returned false';
        return false;
    }

    this.modules.loaded[moduleId] = module;

    // todo: if active then modules.active.push(module)

    return true;
};

/**
 * Attempts to unload a module.
 *
 * @param {string} moduleId
 * @returns {boolean}
 */
modsys.unload = function (moduleId) {
    moduleId = moduleId.toLowerCase();

    if (moduleId === 'loader') {
        this.lastError = 'Loader module may not be unloaded';
        return false;
    }

    console.log('Unloading module ' + moduleId);

    if (!this.isLoaded(moduleId)) {
        this.lastError = 'Module is not loaded';
        return false;
    }

    for (var hook in this.hooks) {
        if (!this.hooks.hasOwnProperty(hook)) {
            continue;
        }

        delete this.hooks[hook][moduleId];
    }

    delete this.modules.loaded[moduleId];

    return true;
};

/**
 * Attempts to reload a module.
 *
 * @param {string} moduleId
 * @returns {boolean}
 */
modsys.reload = function (moduleId) {
    // Wrapper call to load() because I'm too lazy to switch between load and reload every other parse error
    if (!this.isLoaded(moduleId)) {
        return this.load(moduleId);
    }

    return (this.unload(moduleId) && this.load(moduleId));
};

modsys.enable = function (moduleId) {
    // todo
};

modsys.disable = function (moduleId) {
    // todo
};

/**
 * Registers a hook callback for a module.
 *
 * @param {object} module
 * @param {string} hook
 * @param {function} callback
 * @returns {modsys}
 */
modsys.addHook = function (module, hook, callback) {
    var moduleId = module.meta.id;

    if (typeof this.hooks[hook] === 'undefined') {
        this.hooks[hook] = {};
    }

    if (typeof this.hooks[hook][moduleId] === 'undefined') {
        this.hooks[hook][moduleId] = [];
    }

    this.hooks[hook][moduleId].push(callback);

    return this;
};

/**
 * Proceses all registered hook callbacks.
 *
 * @param {string} hook
 * @param {Client} client
 */
modsys.processHooks = function (hook, client /*, arguments*/) {
    if (typeof this.hooks[hook] === 'undefined') {
        return;
    }

    for (var moduleId in this.hooks[hook]) {
        if (!this.hooks[hook].hasOwnProperty(moduleId)) {
            continue;
        }

        for (var i = 0; i < this.hooks[hook][moduleId].length; i++) {
            var args = [].slice.call(arguments);
            args.shift(); // shift hook

            try {
                this.hooks[hook][moduleId][i].apply(null, args);
            } catch (e) {
                console.log('Error in module ' + moduleId + ' for hook ' + hook + ': ' + e);
                this.unload(moduleId);
                break; // todo: continue rest?
            }
        }
    }
};

/**
 * Check if a module is loaded.
 *
 * @param {string} moduleId
 * @returns {boolean}
 */
modsys.isLoaded = function (moduleId) {
    return (moduleId in this.modules.loaded);
};

modsys.isActive = function (moduleId) {
    // todo
};

// Helper methods

/**
 * Helper function to register a message hook from one or more commands (aliases).
 *
 * @param {object} module
 * @param {string|string[]} command
 * @param {function} callback
 * @returns {modsys}
 */
modsys.addCommand = function (module, command, callback) {
    var prefix = (this.config.bot.prefix || '.');

    // todo: check if command already exists
    // todo: manage command dictionary
    // todo: later per server/channel/user

    this.addHook(module, 'message', function (client, message) {
        var regexString = '';

        if (Array.isArray(command)) {
            regexString = '^' + escapeStringRegexp(prefix) + '(?:';

            regexString += command.filter(function (value) {
                return escapeStringRegexp(value);
            }).join('|');

            regexString += ')';
        } else {
            regexString = ('^' + escapeStringRegexp(prefix + command));
        }

        if (!new RegExp(regexString, 'i').test(message.content)) {
            return;
        }

        var args = message.content.split(' ');
        args.shift();

        callback(client, message, args);
    });

    return this;
};

module.exports = modsys;
