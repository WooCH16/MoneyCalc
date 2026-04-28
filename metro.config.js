const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand') {
    return context.resolveRequest(context, 'zustand/index.js', platform);
  }
  if (moduleName === 'zustand/middleware') {
    return context.resolveRequest(context, 'zustand/middleware.js', platform);
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
