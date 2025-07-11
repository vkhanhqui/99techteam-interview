import { PgSubscriberRepo } from '../../services/api/src/repositories/SubscriberRepo';
import { SubscriberService, SubscriberServiceImp } from '../../services/api/src/services/SubscriberService';
import { Pool } from 'pg';

export const ENV = {
    API_BASE_URL: process.env.API_BASE_URL ?? 'http://localhost:3000',
    PG_DB_CONN_URI: process.env.PG_DB_CONN_URI
};

const pool = new Pool({
  connectionString: process.env.PG_DB_CONN_URI
});

export class Seeder {
  constructor(private service: SubscriberService) {}

  getSubscriberService() {
    return this.service
  }
}

export function seeder(): Seeder {
  const repo = new PgSubscriberRepo(pool);
  const service = new SubscriberServiceImp(repo);

  return new Seeder(service)
}