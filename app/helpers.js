'use strict';

module.exports = {

    /**
     * Helper function to reply a string to the message's author.
     *
     * In a text channel, the invoker's name is prepended to the string's contents.
     *
     * @param {Client} client
     * @param {Message} message
     * @param {string} str
     */
    reply: function (client, message, str) {
        if (message.channel.constructor.name === 'TextChannel') {
            str = (message.author + ': ' + str);
        }

        client.sendMessage(message.channel, str);
    },

    /**
     * Checks if the user is Sharqy. :)
     *
     * @param {User} user
     * @returns {boolean}
     */
    isSharqy: function (user) {
        return (user.id === '166795785915203584');
    }

};
