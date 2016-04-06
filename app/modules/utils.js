'use strict';

var utils = {
    meta: {
        id: 'core',
        name: 'Core',
        description: 'PinkieBot core module'
    },
    dependencies: [],
    commands: {}
};

utils.init = function (modsys) {
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

    modsys.addCommand(this, 'serverid', function (client, message, args) {
        // todo: only in non-pm
        global.helpers.reply(client, message, message.channel.server.id);
    });

    modsys.addCommand(this, 'channelid', function (client, message, args) {
        global.helpers.reply(client, message, message.channel.id);
    });

    return true;
};

module.exports = utils;
