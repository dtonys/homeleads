const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const requestIp = require('request-ip');

// load env
dotenv.load({
  path: path.resolve(__dirname, '../.env'),
});
// setup express and middleware
const app = express();

// serve webpack compiled assets
if ( process.env.NODE_ENV !== 'production' ) {
  const compiler = webpack(webpackConfig('development'));
  app.use( webpackDevMiddleware(compiler) );
  app.use( webpackHotMiddleware(compiler) );
}
else {
  app.use( express.static('dist') );
}

app.use( express.static('public') );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(requestIp.mw());

// api routes
require('./api')( app );

// serve production html
app.get('*', ( req, res ) => {
  res.sendFile( path.join(__dirname, '../dist/index.html') );
});

app.listen(process.env.PORT || 3000, () => {
  console.log('app listening on port 3000'); // eslint-disable-line no-console
});
