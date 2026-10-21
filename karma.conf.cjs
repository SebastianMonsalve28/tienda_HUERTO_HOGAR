module.exports = function (config) {
  // Usa Chrome instalado o el navegador descargado por Puppeteer.
  if (!process.env.CHROME_BIN)
    process.env.CHROME_BIN = require("puppeteer").executablePath({
      headless: "shell",
    });
  const inContainer =
    typeof process.getuid === "function" && process.getuid() === 0;
  config.set({
    frameworks: ["jasmine", "webpack"],
    files: [
      { pattern: "public/img/*", included: false, served: true },
      "tests/**/*.spec.jsx",
    ],
    proxies: { "/img/": "/base/public/img/" },
    preprocessors: { "tests/**/*.spec.jsx": ["webpack"] },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.[jt]sx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "120" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                plugins: [
                  [
                    "istanbul",
                    {
                      include: ["src/**/*.{js,jsx}"],
                      exclude: ["src/principal.jsx", "src/productos.js"],
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    },
    reporters: ["progress", "coverage"],
    coverageReporter: {
      check: {
        global: { statements: 90, branches: 85, functions: 85, lines: 90 },
      },
      dir: "coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text-summary" },
        { type: "json-summary", subdir: ".", file: "coverage-summary.json" },
        { type: "lcovonly", subdir: ".", file: "lcov.info" },
      ],
    },
    browsers: [inContainer ? "ChromeHeadlessContainer" : "ChromeHeadless"],
    customLaunchers: {
      ChromeHeadlessContainer: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-dev-shm-usage"],
      },
    },
    client: { jasmine: { random: false } },
    singleRun: false,
    browserNoActivityTimeout: 60000,
  });
};
