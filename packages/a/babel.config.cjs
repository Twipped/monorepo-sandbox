module.exports = (api) => ({
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
        exclude: ["transform-typeof-symbol"],
        modules: process.env.ESM ? false : "cjs",
        targets: "maintained node versions",
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  plugins: api.env("test")
    ? []
    : [
        [
          "babel-plugin-add-import-extension",
          { extension: process.env.ESM ? "mjs" : "cjs" },
        ],
      ],
});
