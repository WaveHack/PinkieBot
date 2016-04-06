'use strict';

var core = {
    meta: {
        id: 'core',
        name: 'Core',
        description: 'PinkieBot core module'
    },
    dependencies: [],
    commands: {}
};

core.init = function (modsys) {
    modsys.addCommand(this, 'q', function (client, message, args) {
        global.helpers.reply(client, message, 'Going to sleep. Zzzz...');
        client.logout();
    });

    modsys.addCommand(this, 'ping', function (client, message, args) {
        global.helpers.reply(client, message, 'Pong');
    });

    modsys.addCommand(this, ['bot', 'help', 'info', 'pinkiebot'], function (client, message, args) {
        global.helpers.reply(client, message, 'Hi, my name is PinkieBot, a lightweight discord.js bot created by Sharqy! - https://github.com/WaveHack/PinkieBot.');
    });

    modsys.addCommand(this, 'commands', function (client, message, args) {
        global.helpers.reply(client, message, 'Under construction!');
    });

    return true;
};

module.exports = core;
