var rucksack = require('rucksack-css')
var webpack = require('webpack')
var path = require('path')
var extraPlugins = [];
if (process.env.NODE_ENV == 'production') extraPlugins = [
  // new webpack.optimize.UglifyJsPlugin({compress: {warnings: false, keep_fnames: true}}),
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.AggressiveMergingPlugin(),
  // new webpack.optimize.OccurenceOrderPlugin()
];

module.exports = {
  context: path.join(__dirname, './app'),
  entry: {
    jsx: './index.js',
    html: './index.html',
    vendor: [
      'react', 'react-dom', 'lodash', 'bluebird', 'web3', 'hooked-web3-provider',
      'cerebral', 'cerebral-addons', 'cerebral-view-react',
      './semantic'
    ],
  },
  output: {
    path: path.join(__dirname, './static'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.(html|png|svg|eot|woff2|woff|ttf)$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        include: /app/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]',
          'postcss-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: /app/,
        loader: 'style!css'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ]
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.PrefetchPlugin("react"),
    new webpack.PrefetchPlugin("react-dom"),
    new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),

    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.js', minChunks: Infinity}),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
    })
  ].concat(extraPlugins),
  devServer: {
    contentBase: './app',
    hot: true,
    // stats: {
    //   colors: true,
    //   chunkModules: true,
    //   modules: true
    // }
  }
};
