const lodash = require('lodash');
const queryString = require('querystring');
const superagent = require('superagent');
const xml2js = require('xml2js');
const nodemailer = require('nodemailer');
const ZILLOW_API_KEY = 'X1-ZWz1gj6yr1934b_9r65p';


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

module.exports = ( app ) => {
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
};
