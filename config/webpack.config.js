const webpackConfig = require('@ionic/app-scripts/config/webpack.config');
const webpack = require('webpack');
const parser = require('yargs-parser');

let env = parser(process.argv.slice(2)).env

process.env.ENV = env || process.env.ENV || process.env.IONIC_ENV;

console.log('Ionic ClI running in project environment ' + process.env.ENV);
console.log('Ionic ClI running in ionic environment ' + process.env.IONIC_ENV);

webpackConfig.plugins.push(new webpack.EnvironmentPlugin(['IONIC_ENV', 'ENV']));
