import { Router } from 'express';
import { SubscriberController } from './SubscriberController';

export function SubscriberRoute(controller: SubscriberController): Router {
  const r = Router();
  r.get('/', controller.getAll);
  r.get('/:id', controller.getOne);
  r.post('/', controller.create);
  r.put('/:id', controller.update);
  r.delete('/:id', controller.delete);
  return r;
}