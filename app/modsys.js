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

    // See if module file exists
    try {
        var resolvedModulePath = require.resolve(modulePath);
    } catch (e) {
        this.lastError = e.message;
        return false;
    }

    // Force remove module from require cache, so we can re-parse the file
    delete require.cache[resolvedModulePath];

    // Parse it
    try {
        var module = require(modulePath);
    } catch (e) {
        this.lastError = e.message;
        return false;
    }

    // Some temp validation
    if ((typeof module.meta.id === 'undefined') || (module.meta.id !== moduleId)) {
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

    if (moduleId === 'core') {
        this.lastError = 'Core module may not be unloaded';
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
    return (moduleId.toLowerCase() in this.modules.loaded);
};

modsys.isActive = function (moduleId) {
    // todo
};

modsys.getModule = function (moduleId) {
    moduleId = moduleId.toLowerCase();

    if (!this.isLoaded(moduleId)) {
        return null;
    }

    return this.modules.loaded[moduleId];
};

// Helper methods

/**
 * Helper function to register a message hook for a command.
 *
 * Do not include any command prefixes, this is added automatically. If you
 * want your own custom prefix (or no prefix), use a manual message hook with
 * modsys.addHook() instead.
 *
 * Only one optional command parameter is supported in the form of 'cmd [arg]'.
 * But you can add spaces in the command name e.g. command = 'module load
 * [module]'. Argument must be at end of line and may not contain spaces.
 *
 * If you want more sophisticated functionality for handling arguments, do a
 * pull request. :^)
 *
 * @param {object} module
 * @param {string} command
 * @param {function} callback
 * @returns {modsys}
 */
modsys.addCommand = function (module, command, callback) {
    var prefix = (this.config.bot.prefix || '.');

    // todo: check if command already exists
    // todo: manage command dictionary
    // todo: later per server/channel/user

    var regexString = '';
    var hasArg = false;

    // Check if this is a command with an argument
    if (/\[\w+]$/.test(command)) {
        command = command.replace(/(\s\[\w+])$/, ''); // strip argument

        regexString = ('^' + escapeStringRegexp(prefix + command) + '\\s(\\w+)$');
        hasArg = true;
    } else {
        regexString = ('^' + escapeStringRegexp(prefix + command) + '$');
    }

    //console.log('Adding command \'' + command + '\'' + (hasArg ? ' with argument' : '') + ' with regex string "' + regexString + '"');

    this.addHook(module, 'message', function (client, message) {
        if (!new RegExp(regexString).test(message.content)) {
            return;
        }

        var arg = null;

        if (hasArg) {
            arg = new RegExp(regexString).exec(message.content)[1];
        }

        callback(client, message, arg);
    });

    return this;
};

module.exports = modsys;
