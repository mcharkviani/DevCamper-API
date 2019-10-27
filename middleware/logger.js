// @desc Logs request to console
const logger = (req, res, next) => {
  req.hello = 'Hello World';
  //   console.log('Middleware ran');
  //   console.log(`protocol: ${req.protocol}`);
  //   console.log(`host: ${req.get('host')}`);
  //   console.log(`url: ${req.originalUrl}`);
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next();
};

module.exports = logger;
