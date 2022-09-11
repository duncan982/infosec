const express = require('express');
const helmet = require('helmet');
const app = express();

// https://boilerplate-infosec.duncanndegwa.repl.co/

// remove the X-Powered-By header
app.use(helmet.hidePoweredBy())

// Mitigate the Risk of Clickjacking // Restricts who can put your site in a frame. 
app.use(helmet.frameguard({action: 'deny'}))

// Mitigate the Risk of Cross Site Scripting (XSS) Attacks with helmet.xssFilter()
app.use(helmet.xssFilter())

//Avoid Inferring the Response MIME Type with helmet.noSniff()
app.use(helmet.noSniff())

// Prevent IE from Opening Untrusted HTML with helmet.ieNoOpen()
app.use(helmet.ieNoOpen())

// Ask Browsers to Access Your Site via HTTPS Only with helmet.hsts()
// Note: Configuring HTTPS on a custom website requires the acquisition of a domain, and a SSL/TLS Certificate.
let ninetyDaysInSeconds = 90*24*60*60
let timeInSeconds = ninetyDaysInSeconds 
app.use(helmet.hsts({maxAge: timeInSeconds, force: true}))

// Disable DNS Prefetching with helmet.dnsPrefetchControl()
app.use(helmet.dnsPrefetchControl());

// Disable Client-Side Caching with helmet.noCache()
app.use(helmet.noCache());

// Set a Content Security Policy with helmet.contentSecurityPolicy()
app.use(helmet.contentSecurityPolicy((
  {
    directives:{
      "defaultSrc":["'self'"], 
      "scriptSrc":["'self'", 'trusted-cdn.com']
    }
  }
  )))

// Configure Helmet Using the ‘parent’ helmet() Middleware
// app.use(helmet()) will automatically include all the middleware introduced above, except noCache(), and contentSecurityPolicy(), but these can be enabled if necessary. You can also disable or configure any other middleware individually, using a configuration object.
// app.use(helmet({
//   frameguard: {         // configure
//     action: 'deny'
//   },
//   contentSecurityPolicy: {    // enable and configure
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ['style.com'],
//     }
//   },
//   dnsPrefetchControl: false     // disable
// }))









































module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
