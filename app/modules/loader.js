'use strict';

var reload = {
    meta: {
        id: 'reload',
        name: 'Reload',
        description: 'Module to reload other modules'
    },
    dependencies: []
};

// todo: PERMISSIONS!!!!1

reload.init = function (modsys) {
    modsys.addCommand(this, 'load', function (client, message, args) {
        // todo: DRY
        if (args.length != 1) {
            global.helpers.reply(client, message, 'Give me a module name to load, silly!');
            return;
        }

        var moduleId = args[0];

        if (modsys.load(moduleId)) {
            global.helpers.reply(client, message, ('Loaded module ' + moduleId + ' for ya! <3'));
        } else {
            global.helpers.reply(client, message, ('Uh oh. I can\'t load that module for you, because ' + modsys.lastError.toLowerCase() + '!'));
        }
    });

    modsys.addCommand(this, 'unload', function (client, message, args) {
        if (args.length != 1) {
            global.helpers.reply(client, message, 'Give me a module name to unload, silly!');
            return;
        }

        var moduleId = args[0];

        if (modsys.unload(moduleId)) {
            global.helpers.reply(client, message, ('Unloaded module ' + moduleId + ' for ya!'));
        } else {
            global.helpers.reply(client, message, ('I can\'t unload that, silly! You should know that, because ' + modsys.lastError.toLowerCase()));
        }
    });

    modsys.addCommand(this, 'reload', function (client, message, args) {
        if (args.length != 1) {
            global.helpers.reply(client, message, 'Give me a module name to reload, silly!');
            return;
        }

        var moduleId = args[0];

        if (modsys.reload(moduleId)) {
            global.helpers.reply(client, message, ('Reloaded module ' + moduleId + ' for ya! Get testing! :D'));
        } else {
            global.helpers.reply(client, message, ('Whoops! I think I broke it. Something something about ' + modsys.lastError.toLowerCase()));
        }
    });

    return true;
};

module.exports = reload;
