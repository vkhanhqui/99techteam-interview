import { Router } from 'express';
import { PgSubscriberRepo } from '../../repositories/SubscriberRepo';
import { SubscriberServiceImp } from '../../services/SubscriberService';
import { SubscriberController } from './SubscriberController';
import { SubscriberRoute } from './route';
import { Pool } from 'pg';

export function initSubscriberRoute(pool: Pool): Router {
  const repo = new PgSubscriberRepo(pool);
  const service = new SubscriberServiceImp(repo);
  const controller = new SubscriberController(service);
  return SubscriberRoute(controller);
}