// metro.config.js (à la racine, à côté de package.json)
const { getDefaultConfig } = require('@expo/metro-config');

/**
 * @type {import('expo/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Ajoute le support WASM pour expo-sqlite
config.resolver.assetExts.push('wasm');

// Headers pour SharedArrayBuffer (requis pour WASM threading)
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    // COEP + COOP pour wa-sqlite
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return middleware(req, res, next);
  };
};

module.exports = config;