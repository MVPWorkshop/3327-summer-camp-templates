import router from './app';
import { createServer, Server } from 'http';
import db from './models';

/**
 * Start Express server.
 */
const server: Server = createServer(router);

server.listen(router.get('port'), router.get('host'), async () => {
  await db.authenticate({})
    .then(() =>
      console.log('Connection has been established successfully.')
    )
    .catch((error: Error) => console.log('Unable to connect to the database:', error)
    );

  process.on('SIGINT', async () => {
    console.debug('Closing database connection.');
    await db.close();
    process.exit();
  });

  console.log('Press CTRL-C to stop\n');
});

export default server;
