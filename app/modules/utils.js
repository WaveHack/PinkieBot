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
    this.initHelpCommands(modsys);
    this.initBotControlCommands(modsys);
    this.initMiscCommands(modsys);

    return true;
};

utils.initHelpCommands = function (modsys) {

    modsys.addCommand(this, 'info', function (client, message) {
        global.helpers.reply(client, message, 'Hi, my name is PinkieBot, a lightweight discord.js bot created by Sharqy! - https://github.com/WaveHack/PinkieBot.');
    });

    modsys.addCommand(this, 'version', function (client, message) {
        var proc = require('child_process').spawn('git', ['log', '-1', '--format=[%h] %s']);

        proc.stdout.on('data', function (data) {
            global.helpers.reply(client, message, data);
        });
    });

    modsys.addCommand(this, 'commands', function (client, message) {
        global.helpers.reply(client, message, 'Under construction!');
    });

};

utils.initBotControlCommands = function (modsys) {

    modsys.addCommand(this, 'q', function (client, message) {
        if (!global.helpers.isSharqy(message.author)) {
            return;
        }

        global.helpers.reply(client, message, 'Going to sleep. Zzzz...');
        client.logout();
    });

};

utils.initMiscCommands = function (modsys) {

    modsys.addCommand(this, 'ping', function (client, message) {
        global.helpers.reply(client, message, 'Pong');
    });

    modsys.addHook(this, 'message', function (client, message) {
        if (!/^\.eval/.test(message.content)) {
            return;
        }

        if (!global.helpers.isSharqy(message.author)) {
            global.helpers.reply(client, message, '( ͡° ͜ʖ ͡°)');
            return;
        }

        var stringToEval = message.content.replace(/^(\.eval\s)/, '');
        try {
            var result = eval(stringToEval);
            global.helpers.reply(client, message, result);
        } catch (e) {
            global.helpers.reply(client, message, ('Something went wrong: ' + e));
        }
    });

    modsys.addCommand(this, 'myid', function (client, message) {
        global.helpers.reply(client, message, ('Your User ID: ' + message.author.id));
    });


    modsys.addCommand(this, 'serverid', function (client, message) {
        if (message.channel.constructor.name === 'TextChannel') {
            global.helpers.reply(client, message, ('Server ID: ' + message.channel.server.id));
        }
    });

    modsys.addCommand(this, 'channelid', function (client, message) {
        global.helpers.reply(client, message, ('Channel ID: ' + message.channel.id));
    });

};


module.exports = utils;
