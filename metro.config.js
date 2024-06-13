const { getDefaultConfig } = require('expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('jsx');
defaultConfig.resolver.sourceExts.push('js');
module.exports = defaultConfig;
