'use strict';

const
  os = require('os'),
  networkInterfaces = os.networkInterfaces(),

  filteredNetworkInterfaces = Object.keys(networkInterfaces).reduce((accumulator, currentValue) => {
    const addresses = networkInterfaces[currentValue]
      .filter(networkInterface => networkInterface.family === 'IPv4' && !networkInterface.internal)
      .map(networkInterface => networkInterface.address);

    if (addresses.length > 0) {
      accumulator[currentValue] = addresses;
    }

    return accumulator;
  }, {});

module.exports = filteredNetworkInterfaces;
