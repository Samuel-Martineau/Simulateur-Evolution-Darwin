const webpack = require('webpack');
const WebpackModules = require('webpack-modules');
const sveltePreprocess = require('svelte-preprocess');
const { mdsvex } = require('mdsvex');
const path = require('path');
const u = require('unist-builder');

const config = require('sapper/config/webpack.js');
const pkg = require('./package.json');

const getAstTreeForDependencies = (deps) =>
  u(
    'list',
    deps.map(({ name, version, url }) =>
      u('listItem', [
        u('link', { url }, [u('text', name)]),
        u('text', ` v${version}`),
      ]),
    ),
  );

const mode = config.dev ? 'development' : 'production';
const dev = mode === 'development';
const prod = mode === 'production';
const websiteHost = dev ? 'localhost:3000' : 'expo.smartineau.me';

const alias = { svelte: path.resolve('node_modules', 'svelte') };
const extensions = ['.mjs', '.js', '.ts', '.json', '.svelte', '.html', '.svx'];
const mainFields = ['svelte', 'module', 'browser', 'main'];
const preprocessors = [
  sveltePreprocess({ postcss: true }),
  mdsvex({
    remarkPlugins: [
      [
        require('remark-toc'),
        {
          heading: 'Table des matières',
          tight: true,
        },
      ],
    ],
    rehypePlugins: [
      require('rehype-slug'),
      [
        require('rehype-autolink-headings'),
        {
          behavior: 'wrap',
        },
      ],
      [
        require('rehype-urls'),
        function (url, node) {
          if (url.host && url.host !== websiteHost)
            node.properties.target = '_blank';
        },
      ],
    ],
  }),
];

const tsLoaderRule = {
  test: /\.ts$/,
  loader: 'ts-loader',
};
const fileLoaderRule = {
  test: /\.(png|jpe?g|gif)$/i,
  use: ['file-loader'],
};

module.exports = {
  client: {
    entry: {
      main: config.client.entry().main.replace(/\.js$/, '.ts'),
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
            loader: 'svelte-loader',
            options: {
              dev,
              hydratable: true,
              preprocess: preprocessors,
              hotReload: false,
            },
          },
        },
        fileLoaderRule,
      ],
    },
    mode,
    plugins: [
      new webpack.DefinePlugin({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
    ],
    devtool: dev && 'inline-source-map',
  },

  server: {
    entry: {
      server: config.server.entry().server.replace(/\.js$/, '.ts'),
    },
    output: config.server.output(),
    target: 'node',
    resolve: {
      alias,
      extensions,
      mainFields,
    },
    externals: Object.keys(pkg.dependencies).concat('encoding'),
    module: {
      rules: [
        tsLoaderRule,
        {
          test: /\.(svelte|html|svx)$/,
          use: {
            loader: 'svelte-loader',
            options: {
              css: false,
              generate: 'ssr',
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
    plugins: [new WebpackModules()],
    performance: {
      hints: false,
    },
  },

  serviceworker: {
    entry: {
      'service-worker': config.serviceworker
        .entry()
        ['service-worker'].replace(/\.js$/, '.ts'),
    },
    output: config.serviceworker.output(),
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.json'],
    },
    module: {
      rules: [tsLoaderRule],
    },
    mode,
  },
};
