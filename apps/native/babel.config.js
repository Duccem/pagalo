module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  plugins.push("react-native-reanimated/plugin");
  plugins.push("inline-imports");
  plugins.push({ extensions: [".sql"] });

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins,
  };
};

