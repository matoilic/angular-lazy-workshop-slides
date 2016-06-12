'use strict';

const os = require('os');

const localIp = module.exports = function() {
    const interfaces = os.networkInterfaces();

    for(let interfaceName in interfaces) {
        const publicInterface = interfaces[interfaceName].find((i) => i.family === 'IPv4' && !i.internal);

        if(publicInterface) {
            return publicInterface.address;
        }
    }
    
    return null;
}

if(!module.parent) {
    console.log(localIp());
}
