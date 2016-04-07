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
     * .module load [module]
     * .module unload [module]
     * .module reload [module]
     * .module enable [module]
     * .module disable [module]
     *
     * .module loaded
     * .module loaded [module]
     * .module active
     * .module active [module]
     *
     * .commands
     * .commands [module]
     */

    modsys.addCommand(this, 'module load [module]', function (client, message, module) {
        if (modsys.load(module)) {
            global.helpers.reply(client, message, ('Loaded module ' + module + ' for ya! <3'));
        } else {
            global.helpers.reply(client, message, ('Uh oh. I can\'t load that module for you, because ' + modsys.lastError.toLowerCase() + '!'));
        }
    });

    modsys.addCommand(this, 'module unload [module]', function (client, message, module) {
        if (modsys.unload(module)) {
            global.helpers.reply(client, message, ('Unloaded module ' + module + ' for ya!'));
        } else {
            global.helpers.reply(client, message, ('I can\'t unload that, silly! You should know that, because ' + modsys.lastError.toLowerCase()));
        }
    });

    modsys.addCommand(this, 'module reload [module]', function (client, message, module) {
        if (modsys.reload(module)) {
            global.helpers.reply(client, message, ('Reloaded module ' + module + ' for ya! Get testing! :D'));
        } else {
            global.helpers.reply(client, message, ('Whoops! I think I broke it. It said something about ' + modsys.lastError.toLowerCase()));
        }
    });

    return true;
};

module.exports = core;
