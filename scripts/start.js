/**
 *
 */

const chalk = require('chalk');
const config = require('../config/webpack.config.dev');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
/** **/
const DEFAULT_PORT = process.env.PORT || 50001;

var handleCompile;
var friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

function formatMessage(message) {
  return message
    // Make some common errors shorter:
    .replace(
      // Babel syntax error
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    )
    .replace(
      // Webpack file not found error
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
    // Webpack loader names obscure CSS filenames
    .replace('./~/css-loader!./~/postcss-loader!', '');
}

function clearConsole() {
  process.stdout.write('\x1bc');
}

function setupCompiler(port) {
  compiler = webpack(config, handleCompile);

  compiler.plugin('invalid', function() {
    clearConsole();
    console.log('Compiling...');
  });

  compiler.plugin('done', function(stats) {
    clearConsole();
    var hasErrors = stats.hasErrors();
    var hasWarnings = stats.hasWarnings();
    if (!hasErrors && !hasWarnings) {
      console.log(chalk.green('Compiled successfully!'));
      console.log();
      console.log('The app is running at http://localhost:' + port + '/');
      console.log();
      return;
    }

    var json = stats.toJson();
    var formattedErrors = json.errors.map(message =>
      'Error in ' + formatMessage(message)
    );
    var formattedWarnings = json.warnings.map(message =>
      'Warning in ' + formatMessage(message)
    );

    if (hasErrors) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      if (formattedErrors.some(isLikelyASyntaxError)) {
        // If there are any syntax errors, show just them.
        // This prevents a confusing ESLint parsing error
        // preceding a much more useful Babel syntax error.
        formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
      }
      formattedErrors.forEach(message => {
        console.log(message);
        console.log();
      });
      // If errors exist, ignore warnings.
      return;
    }

    if (hasWarnings) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();
      formattedWarnings.forEach(message => {
        console.log(message);
        console.log();
      });

      console.log('You may use special comments to disable some warnings.');
      console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
      console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
    }
  });
}

function runDevServer(port) {
  new WebpackDevServer(compiler, {
    historyApiFallback: true,
    hot: true, // Note: only CSS is currently hot reloaded
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }).listen(port, (err, result) => {
    if (err) {
      return console.log(err);
    }

    clearConsole();
    console.log(chalk.cyan('Starting the development server...'));
    console.log();
    // openBrowser(port);
  });
}

function run(port) {
  setupCompiler(port);
  runDevServer(port);
}



run(DEFAULT_PORT);