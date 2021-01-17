const webpack = require("webpack");
const WebpackModules = require("webpack-modules");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const sveltePreprocess = require("svelte-preprocess");
const { mdsvex } = require("mdsvex");
const path = require("path");

const config = require("sapper/config/webpack.js");
const pkg = require("./package.json");

const mode = config.dev ? "development" : "production";
const dev = mode === "development";
// const prod = mode === 'production';
const websiteHost = dev ? "localhost:3000" : "expo.smartineau.me";

const alias = { svelte: path.resolve("node_modules", "svelte") };
const extensions = [".mjs", ".js", ".ts", ".json", ".svelte", ".html", ".svx"];
const mainFields = ["svelte", "module", "browser", "main"];
const preprocessors = [
  sveltePreprocess(),
  mdsvex({
    remarkPlugins: [
      [
        require("remark-toc"),
        {
          heading: "Table des matières",
          tight: true,
        },
      ],
    ],
    rehypePlugins: [
      require("rehype-slug"),
      [
        require("rehype-autolink-headings"),
        {
          behavior: "wrap",
        },
      ],
      [
        require("rehype-urls"),
        function (url, node) {
          if (url.host && url.host !== websiteHost)
            node.properties.target = "_blank";
        },
      ],
    ],
  }),
];

const tsLoaderRule = {
  test: /\.ts$/,
  loader: "ts-loader",
};
const fileLoaderRule = {
  test: /\.(png|jpe?g|gif|svg)$/i,
  use: [
    "file-loader",
    {
      loader: ImageMinimizerPlugin.loader,
      options: {
        minimizerOptions: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            [
              "svgo",
              {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                ],
              },
            ],
          ],
        },
      },
    },
  ],
};

module.exports = {
  client: {
    entry: {
      main: config.client.entry().main.replace(/\.js$/, ".ts"),
    },
    output: config.client.output(),
    resolve: {
      alias,
      extensions,
      mainFields,
    },
    module: {
      rules: [
        tsLoaderRule,
        {
          test: /\.(svelte|html|svx)$/,
          use: {
            loader: "svelte-loader",
            options: {
              dev,
              hydratable: true,
              preprocess: preprocessors,
              hotReload: false,
              emitCss: true,
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [require("autoprefixer")],
                },
              },
            },
          ],
        },
        fileLoaderRule,
      ],
    },
    mode,
    plugins: [
      new webpack.DefinePlugin({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
    ],
    devtool: dev && "inline-source-map",
  },

  server: {
    entry: {
      server: config.server.entry().server.replace(/\.js$/, ".ts"),
    },
    output: config.server.output(),
    target: "node",
    resolve: {
      alias,
      extensions,
      mainFields,
    },
    externals: Object.keys(pkg.dependencies).concat("encoding"),
    module: {
      rules: [
        tsLoaderRule,
        {
          test: /\.(svelte|html|svx)$/,
          use: {
            loader: "svelte-loader",
            options: {
              css: false,
              generate: "ssr",
              hydratable: true,
              preprocess: preprocessors,
              dev,
            },
          },
        },
        fileLoaderRule,
      ],
    },
    mode,
    plugins: [
      new webpack.DefinePlugin({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
      new WebpackModules(),
    ],
    performance: {
      hints: false,
    },
  },

  serviceworker: {
    entry: {
      "service-worker": config.serviceworker
        .entry()
        ["service-worker"].replace(/\.js$/, ".ts"),
    },
    output: config.serviceworker.output(),
    resolve: {
      alias,
      extensions,
      mainFields,
    },
    module: {
      rules: [tsLoaderRule],
    },
    mode,
    plugins: [
      new webpack.DefinePlugin({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
    ],
    devtool: dev && "inline-source-map",
  },
};
