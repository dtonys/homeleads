const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const superagent = require('superagent');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
const queryString = require('querystring');
const xml2js = require('xml2js');
const lodash = require('lodash');
const requestIp = require('request-ip');


const ZILLOW_API_KEY = 'X1-ZWz1gj6yr1934b_9r65p';

// load env
dotenv.load({
  path: path.resolve(__dirname, '../.env'),
});

// setup mailer
const gmailTransport = nodemailer.createTransport(
  `smtps://${process.env.MAILER_EMAIL}:${process.env.MAILER_PASSWORD}@smtp.gmail.com`
);

function sendMail({
  from = '"HomeLeads" <homeleads@gmail.com>',
  toEmailArray,
  subject,
  text,
}) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from,
      to: toEmailArray.join(', '),
      subject,
      text,
    };
    gmailTransport.sendMail( mailOptions, ( err, info ) => {
      if ( err ) {
        console.log(err); // eslint-disable-line no-console
        reject(err);
        return;
      }
      console.log('Message sent: ' + info.response ); // eslint-disable-line no-console
      resolve();
    });
  });
}


// setup express and middleware
const app = express();
app.use( express.static('dist') );
app.use( express.static('public') );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(requestIp.mw());

if ( process.env.NODE_ENV !== 'production' ) {
  const compiler = webpack(webpackConfig('development'));
  app.use( webpackDevMiddleware(compiler) );
}

// api routes
app.get('/property-data', ( req, res ) => {
  const qs = queryString.stringify({
    address: req.query.address,
    citystatezip: req.query.citystatezip,
    'zws-id': ZILLOW_API_KEY,
    rentzestimate: true,
  });
  const request = superagent('GET', `http://www.zillow.com/webservice/GetSearchResults.htm?${qs}`);
  request.end(( error, response ) => {
    if ( error ) {
      res.json({ data: null });
      return;
    }
    xml2js.parseString(response.text, (err, result) => {
      if ( err ) {
        res.json({ data: null });
        return;
      }
      const monthlyRent = lodash.get(result, 'SearchResults:searchresults.response[0].results[0].result[0].rentzestimate[0].amount[0]._');
      const totalPrice = lodash.get(result, 'SearchResults:searchresults.response[0].results[0].result[0].zestimate[0].amount[0]._');
      if ( !monthlyRent && !totalPrice ) {
        res.json({ data: null });
        return;
      }
      res.json({
        data: {
          monthlyRent,
          totalPrice,
          address: req.query.address,
        },
      });
    });
  });
});

app.post('/signup', ( req, res ) => {
  sendMail({
    toEmailArray: [ req.body.email ],
    subject: 'Welcome to HomeLeads',
    text: `Thank you for signing up! \r\n\r\n We received the property you submitted, here it is: \r\n\r\n ${JSON.stringify(req.body)}`,
  });

  res.json({
    body: req.body,
    IP: req.clientIp,
  });
});

// serve production html
app.get('*', ( req, res ) => {
  res.sendFile( path.join(__dirname, '../dist/index.html') );
});

app.listen(process.env.PORT || 3000, () => {
  console.log('app listening on port 3000'); // eslint-disable-line no-console
});
