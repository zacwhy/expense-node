'use strict';

const
  os = require('os'),
  networkInterfaces = os.networkInterfaces(),

  addressMap = Object.keys(networkInterfaces).reduce((accumulator, currentValue) => {
    const filtered = networkInterfaces[currentValue]
      .filter(networkInterface => networkInterface.family === 'IPv4' && !networkInterface.internal);

    if (filtered.length > 0) {
      accumulator[currentValue] = filtered.map(networkInterface => networkInterface.address);
    }

    return accumulator;
  }, {});

module.exports = addressMap;
