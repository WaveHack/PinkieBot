'use strict';

global.helpers = require('./helpers');

// Check Discord
try {
    var discord = require('discord.js');
} catch (e) {
    console.log('Discord.js missing. Run `npm install` first.');
    process.exit();
}

// Check config file exists
try {
    require.resolve('../config.json');
} catch (e) {
    var fs = require('fs');
    fs.createReadStream('../config.json.template').pipe(fs.createWriteStream('../config.json'));

    console.log('Configuration config.json missing. A default one has been generated. Update it and re-run the script.');
    process.exit();
}

// Load config file
try {
    var config = require('../config.json');
} catch (e) {
    console.log('Unable to parse config file: ' + e);
    process.exit(1);
}

// Load modules
var modsys = require('./modsys');
modsys.config = config;

modsys.load('loader');
modsys.load('core');

// todo: from config.autoload[]
// modsys.load('test');

var client = new discord.Client();

client.on('ready', function () {
    console.log('PinkieBot ready');
    modsys.processHooks('ready', client);
});

client.on('disconnected', function () {
    console.log('Disconnected from the server');
    modsys.processHooks('disconnected', client);

    // process.exit(1);
    // todo: reconnect
});

client.on('message', function (message) {
    modsys.processHooks('message', client, message);
});

client.login(config.bot.email, config.bot.password);
