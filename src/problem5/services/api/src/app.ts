import express, { Application } from 'express';
import { initSubscriberRoute } from './api';
import { Pool } from 'pg';

const app: Application = express();

export const initialize = async (): Promise<void> => {
  const pool = new Pool({
    connectionString: process.env.PG_DB_CONN_URI,
  });

  const subscribers = initSubscriberRoute(pool)

  app.use(express.json());
  app.use('/subscribers', subscribers);
};

export default app;
