const webpackConfig = require('@ionic/app-scripts/config/webpack.config');
const webpack = require('webpack');

if (process.argv.indexOf('--env')>-1 && process.argv[process.argv.indexOf('--env')+1]) {
    process.env.ENV = process.argv[process.argv.indexOf('--env')+1];
} else if (!process.env.ENV) {
    process.env.ENV = process.env.IONIC_ENV;
}

webpackConfig.plugins.push(new webpack.EnvironmentPlugin(['IONIC_ENV', 'ENV']));
