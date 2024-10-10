module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel", "react-native-reanimated/plugin"], // Đảm bảo rằng bạn thêm plugin cho reanimated nếu bạn đang sử dụng nó
  };
};
