var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var session = require('express-session');
var contract = require('./routes/emake/contract');
var singlecontract = require('./routes/emake/singlecontract');
var ElectroniOrder = require('./routes/emake/ElectroniOrder');
var individualtechnicalagreement = require('./routes/emake/individualtechnicalagreement');
var biddingtechnical = require('./routes/bidding/technicalprotocol');
var biddingcontract = require('./routes/bidding/contract');
var biddingsinglecon = require('./routes/bidding/singlecontract');
var indcont = require('./routes/emake/indcont');
var sup = require('./routes/emake/sup');
var config = require('./config');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//这里传入一个密钥加 session_id
app.use(cookieParser('Zxx'));
//就依靠这个中间件
app.use(session({
  resave: false, //添加 resave 选项
  saveUninitialized: true, //添加 saveUninitialized 选项 
  secret: 'zxx'
}))



app.use('/', routes);
app.use('/contract', contract);
app.use('/singlecontract', singlecontract);
app.use('/order', ElectroniOrder);
app.use('/individual', individualtechnicalagreement);
app.use('/biddingtec', biddingtechnical);
app.use('/biddingcon', biddingcontract);
app.use('/biddingsinglecon', biddingsinglecon);
app.use('/indcont', indcont);
app.use('/sup', sup);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.error('WRONG:', '404 Not Found');
  next(err);
});
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
// app.listen(9000);
console.log("+++++++++++++")
console.log(config.listen);
console.log("+++++++++++++")
app.listen(config.listen);
module.exports = app;
