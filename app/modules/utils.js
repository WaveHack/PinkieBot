'use strict';

var utils = {
    meta: {
        id: 'utils',
        name: 'Utils',
        description: 'Utilities module'
    },
    dependencies: [],
    commands: {}
};

utils.init = function (modsys) {
    this.initModuleCommands(modsys);
    this.initHelpCommands(modsys);
    this.initBotControlCommands(modsys);
    this.initMiscCommands(modsys);

    return true;
};

utils.initModuleCommands = function (modsys) {

    // todo

};

utils.initHelpCommands = function (modsys) {

    modsys.addCommand(this, ['bot', 'help', 'info', 'pinkiebot'], function (client, message, args) {
        global.helpers.reply(client, message, 'Hi, my name is PinkieBot, a lightweight discord.js bot created by Sharqy! - https://github.com/WaveHack/PinkieBot.');
    });

    modsys.addCommand(this, 'version', function (client, message, args) {
        var proc = require('child_process').spawn('git', ['log', '-1', '--format=[%h] %s']);

        proc.stdout.on('data', function (data) {
            global.helpers.reply(client, message, data);
        });
    });

    modsys.addCommand(this, 'commands', function (client, message, args) {
        global.helpers.reply(client, message, 'Under construction!');
    });

};

utils.initBotControlCommands = function (modsys) {

    modsys.addCommand(this, 'q', function (client, message, args) {
        if (!global.helpers.isSharqy(message.author)) {
            return;
        }

        global.helpers.reply(client, message, 'Going to sleep. Zzzz...');
        client.logout();
    });

};

utils.initMiscCommands = function (modsys) {

    modsys.addCommand(this, 'ping', function (client, message, args) {
        global.helpers.reply(client, message, 'Pong');
    });

    modsys.addCommand(this, 'eval', function (client, message, args) {
        if (!global.helpers.isSharqy(message.author)) {
            return;
        }

        try {
            var r = eval(args.join(''));
            global.helpers.reply(client, message, r);
        } catch (e) {
            global.helpers.reply(client, message, ('Error: ' + e));
        }
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

};


module.exports = utils;
