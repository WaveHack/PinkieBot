'use strict';

module.exports = {

    reply: function (client, message, str) {
        if (message.channel.constructor.name === 'TextChannel') {
            str = (message.author + ': ' + str);
        }

        client.sendMessage(message.channel, str);
    }

};
