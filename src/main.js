const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const dev = process.env.NODE_ENV !== 'production';
const next = require('next');
const pathMatch = require('path-match');
const app = next({ dev, dir: './src', conf: withSass(withCss()) });
const handle = app.getRequestHandler();
const { parse } = require('url');

// const apiRoutes = require('./server/routes/apiRoutes.js');

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.urlencoded());

  // server.use('/api', apiRoutes);

  // Server-side
  const route = pathMatch();

  server.get('/login', (req, res) => {
    
    return app.render(req, res, '/login', req.query);
  });

  server.post('/login', (req, res) => {
    res.locals.error = {message: 'suck it'}
    return app.render(req, res, '/login', { data: {name: 'daniel', blah: 'what', more: 123}, ...req.query})
  });

  server.get('/artist/:id', (req, res) => {
    const params = route('/artist/:id')(parse(req.url).pathname);
    return app.render(req, res, '/artist', params);
  });

  server.get('/album/:id', (req, res) => {
    const params = route('/album/:id')(parse(req.url).pathname);
    return app.render(req, res, '/album', params);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('Server ready on http://localhost:3000');
  });
});