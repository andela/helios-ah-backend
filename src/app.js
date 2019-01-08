
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';
import socketIO from 'socket.io';
import session from 'express-session';
import './utilities/socialAuthStrategies';
import routes from './routes';

// Create global app object
const app = express();

// let's start our server...
const server = app.listen(process.env.PORT || 4001, () => {
  console.log(`Server is up and running on port ${server.address().port}...!`); //eslint-disable-line
});

const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('inAppNotifications', (data) => {
    socket.emit('inAppNotifications', data);
  });
});

const ioMiddleware = (req, res, next) => {
  req.io = io;
  next();
};


app.use(cors());
dotenv.config();

// Normal express config defaults
if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use(session({
  secret: process.env.express_session_secrete,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.use(ioMiddleware);

routes(app);

// / catch 404 and forward to error handler
app.all('*', (req, res) => {
  res.status(404).send({
    message: 'The page you are looking for is not found'
  });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    console.log(err.stack); // eslint-disable-line
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
    next();
  });
}

// production error handler
// no stack traces leaked to user
if (app.get('env') === 'production') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: {}
      }
    });
    next();
  });
}

export default app;
