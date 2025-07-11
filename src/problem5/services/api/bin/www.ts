import 'dotenv/config';
import app, { initialize } from '../src/app';
import debug from 'debug';
import http from 'http';

const debugServer = debug('api:server');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

function normalizePort(val: string): number | string | false {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const onListening = async (): Promise<void> => {
  await initialize();
};

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
