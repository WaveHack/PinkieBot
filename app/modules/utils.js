'use strict';

var utils = {
    meta: {
        id: 'utils',
        name: 'Utils Module',
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


    modsys.addCommand(this, 'myid', function (client, message, args) {
        global.helpers.reply(client, message, ('Your User ID: ' + message.author.id));
    });


    modsys.addCommand(this, 'serverid', function (client, message, args) {
        if (message.channel.constructor.name === 'TextChannel') {
            global.helpers.reply(client, message, ('Server ID: ' + message.channel.server.id));
        }
    });

    modsys.addCommand(this, 'channelid', function (client, message, args) {
        global.helpers.reply(client, message, ('Channel ID: ' + message.channel.id));
    });

    modsys.addCommand(this, 'eval', function (client, message, args) {
       try {
           var r = eval(args.join(''));
           global.helpers.reply(client, message, r);
       } catch (e) {
           global.helpers.reply(client, message, ('Error: ' + e));
       }
    });

    return true;
};

module.exports = utils;
