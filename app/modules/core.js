'use strict';

var core = {
    meta: {
        id: 'core',
        name: 'Core',
        description: 'Core module to manage other modules'
    },
    dependencies: []
};

// todo: PERMISSIONS!!!!1

core.init = function (modsys) {

    /*
     * .module
     * x .module load [module]
     * x .module unload [module]
     * x .module reload [module]
     * .module enable [module]
     * .module disable [module]
     *
     * x .module loaded
     * x .module loaded [module]
     * .module active
     * .module active [module]
     *
     * x .module info [module]
     *
     * .commands
     * .commands [module]
     */

    modsys.addCommand(this, 'module load [module]', function (client, message, moduleId) {
        if (modsys.load(moduleId)) {
            global.helpers.reply(client, message, ('Loaded module ' + moduleId + ' for ya! <3'));
        } else {
            global.helpers.reply(client, message, ('Uh oh. I can\'t load that module for you, because ' + modsys.lastError.toLowerCase() + '!'));
        }
    });

    modsys.addCommand(this, 'module unload [module]', function (client, message, moduleId) {
        if (modsys.unload(moduleId)) {
            global.helpers.reply(client, message, ('Unloaded module ' + moduleId + ' for ya!'));
        } else {
            global.helpers.reply(client, message, ('I can\'t unload that, silly! You should know that, because ' + modsys.lastError.toLowerCase()));
        }
    });

    modsys.addCommand(this, 'module reload [module]', function (client, message, moduleId) {
        if (modsys.reload(moduleId)) {
            global.helpers.reply(client, message, ('Reloaded module ' + moduleId + ' for ya! Get testing! :D'));
        } else {
            global.helpers.reply(client, message, ('Whoops! I think I broke it. It said something about ' + modsys.lastError.toLowerCase()));
        }
    });

    modsys.addCommand(this, 'module loaded', function (client, message) {
        var loadedModules = [];

        for (var moduleId in modsys.modules.loaded) {
            loadedModules.push(moduleId);
        }

        loadedModules.sort();

        global.helpers.reply(client, message, ('The following modules are loaded: ' + loadedModules.join(', ') + '.'));
    });

    modsys.addCommand(this, 'module loaded [module]', function (client, message, moduleId) {
        var moduleLoaded = modsys.isLoaded(moduleId);

        global.helpers.reply(client, message, ('Module ' + moduleId + (moduleLoaded ? ' is loaded!' : ' doesn\'t seem loaded.')));
    });

    modsys.addCommand(this, 'module info [module]', function (client, message, moduleId) {
        if (!modsys.isLoaded(moduleId)) {
            global.helpers.reply(client, message, ('I don\'t seem to know anything about module ' + moduleId + '. :('));
            return;
        }

        var module = modsys.getModule(moduleId);

        global.helpers.reply(client, message, (module.meta.name + ' (' + module.meta.id + ')\n*' + module.meta.description + '*'));
    });

    return true;
};

module.exports = core;
