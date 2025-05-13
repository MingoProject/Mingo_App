// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);
// const {
//   wrapWithReanimatedMetroConfig,
// } = require("react-native-reanimated/metro-config");

// module.exports = withNativeWind(config, { input: "./global.css" });

// module.exports = wrapWithReanimatedMetroConfig(config);

// metro.config.js
// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./global.css" });

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

module.exports = config;
