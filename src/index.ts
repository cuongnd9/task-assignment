import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import { executeWorker } from './worker';
import { schema } from './schema';

const main = () => {
  const PORT = 50000;
  const app = express();

  app.use('*', cors({ origin: `http://localhost:${PORT}` }));

  const server = new ApolloServer({ schema, introspection: true, playground: true });
  server.applyMiddleware({ app, path: '/', cors: true });

  // Wrap the Express server
  const ws = createServer(app);
  // server.installSubscriptionHandlers(ws);
  ws.listen(PORT, () => {
    // Set up the WebSocket for handling GraphQL subscriptions
    SubscriptionServer.create({
      execute,
      subscribe,
      schema,
      onConnect: () => {
        console.log('-----------onConnect');
      },
      onDisconnect: () => {
        console.log('----------onDisconnect');
      },
      onOperation: (_: any, params: any) => {
        console.log('--------onOperation');
        return params;
      },
      onOperationComplete: () => {
        console.log('------onOperationComplete');
      },
    }, {
      server: ws,
      path: '/graphql',
    });
    console.log(`🚀 Apollo Server is now running on http://localhost:${PORT}`);
  });

  // executeWorker();
};

try {
  main();
} catch (e) {
  console.error(e);
}
