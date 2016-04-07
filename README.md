# PinkieBot

## About

PinkieBot is a lightweight discord.js bot.

Under construction.

## Module System

PinkieBot uses my own module system `modsys` which I originally wrote in Perl (now partially converted to NodeJS). Modsys resides at `/app/modsys.js` and is somewhat documented. Instead of wrapping everything, I've decided to keep it simple and flexible by using discord.js objects directly. Please consult [their documentation](http://discordjs.readthedocs.org/) for usage on those. 

From within modules one can register event hooks and chat commands to be executed when discord.js receives and distributes them across the modules.
 
Modules can be loaded, unloaded and reloaded on the fly using the core module. Later on I'm planning functionality to enable and disable certian modules in certain situations (servers, channels, users, server roles).

### Creating modules

Modules can either reside as a single file at `/app/modules/[modulename].js`, or in a directory at `/app/modules/[modulename]/[modulename].js`.
 
Here's the minimum content a module should have:

```javascript
'use strict'; // not required, but preferable

var modulename = {
    meta: {
        id: 'modulename', // must be the same as filename and object name above
        name: 'Module Name', // friendly name
        description: 'This is my module' // one-line description
    }
};

modulename.init = function (modsys) {
    return true; // return false if init failed, the module will not be loaded
};

module.exports = modulename;
```

The `init` method gets called whenever the module is (re)loaded. Register your hooks and commands there. See `/app/modsys.js` for documentation
