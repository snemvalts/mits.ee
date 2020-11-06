require('dotenv').config();
// const createError = require("http-errors");
const url = require('url');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const i18n = require('i18n');

i18n.configure({
  locales: ['et'],
  defaultLocale: 'et',
  cookie: 'locale',
  directory: `${__dirname}/locales`,
});
const moment = require('moment');

moment.locale('et_EE');
const compression = require('compression');
const helmet = require('helmet');
const sitemap = require('express-sitemap')({
  url: 'mits.ee',
  sitemap: path.join(__dirname, 'public', 'sitemap.xml'),
  robots: path.join(__dirname, 'public', 'robots.txt'),
  map: {
    '/': ['get'],
    '/meist': ['get'],
    '/blogi': ['get'],
    '/üritused': ['get'],
    '/mentor': ['get'],
    '/login': ['get', 'post'],
  },
  route: {
    ALL: {
      lastmod: '2019-05-06',
      changefreq: 'monthly',
    },
  },
});

// Set up mongoose connection
const MongoStore = require('connect-mongo')(session);

// view engine setup
const hbs = require('hbs');

const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const blogRouter = require('./routes/blog');
const cmsRouter = require('./routes/cms');
const adminRouter = require('./routes/admin');

const mongoDB = process.env.DB_HOST;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.set('useCreateIndex', true); // avoid deprecation warning

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
hbs.registerHelper('moment', (datetime, format) => {
  moment.locale('et_EE');
  return moment(datetime).format(format);
});
// eslint-disable-next-line consistent-return
hbs.registerHelper('ifcond', (field, str, options) => {
  if (field.includes(str)) {
    return options.fn(this);
  }
});

app.use((req, res, next) => {
  res.locals = {
    url: url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: req.originalUrl,
    }),
  };
  next();
});

app.use(compression());
app.use(helmet());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'allow' }));
app.use(session({
  // eslint-disable-next-line global-require
  secret: require('crypto').randomBytes(64).toString('hex'),
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(i18n.init);

app.use('/', indexRouter);
app.use('/blogi', blogRouter);
app.use('/cms', cmsRouter);

app.use('/admin', adminRouter);

app.use('/mentor-quiz', require('./routes/mentor-quiz'));

/* Sitemap  */
sitemap.toFile();

// 404 route
app.get('*', (req, res) => {
  res.status(404);
  res.render('404.hbs', {
    title: 'Lehekülge ei leitud! - MITS',
  });
});

// catch 404 and forward to error handler
/* app.use(function (req, res, next) {
    next(createError(404));
}); */

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
