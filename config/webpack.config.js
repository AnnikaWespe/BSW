const webpackConfig = require('@ionic/app-scripts/config/webpack.config');
var webpack = require('webpack');
webpackConfig.plugins.push(new webpack.EnvironmentPlugin(['IONIC_ENV']));  