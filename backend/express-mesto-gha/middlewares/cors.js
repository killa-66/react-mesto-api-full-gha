const allowedCors = [
  'http://killa.students.nomoredomains.xyz',
  'https://killa.students.nomoredomains.xyz',
  'https://api.killa.students.nomoredomains.xyz',
  'http://api.killa.students.nomoredomains.xyz',
  'http://localhost:3001',
  'http://localhost:3000',
];

module.exports = (req, res, next) => {
  // console.log('req!!!!!!', req);
  const { origin } = req.headers;
  console.log(origin);
  if (origin === undefined || allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', true);
  }
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  // console.log(requestHeaders);
  if (method === 'OPTIONS') {
    // console.log('HUY');
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', '*');
    return res.end();
  }
  return next();
};
