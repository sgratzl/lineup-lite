const { removeWebpackPlugin } = require('@rescripts/utilities');
const fs = require('fs');
const path = require('path');

function isWorkspace() {
  return (
    fs.existsSync('../../package.json') && JSON.parse(fs.readFileSync('../../package.json')).name === 'lineup-lite'
  );
}

module.exports = [
  (config) => {
    config.resolve = removeWebpackPlugin('ModuleScopePlugin', config.resolve);

    if (isWorkspace()) {
      // create a shared cache directory
      for (const loader of config.module.rules[1].oneOf) {
        if (loader.options && loader.options.cacheDirectory) {
          loader.options.cacheDirectory = path.resolve(__dirname, '../.cache/babel-loader');
        }
      }
    }
    return config;
  },
];
