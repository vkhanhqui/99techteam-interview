import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { SubscriberService } from "../../services/SubscriberService";
import { SubscriberUpdateInput } from "../../dto/subscribers/update.input";
import { SubscriberCreateSchema } from "../../dto/subscribers/create.input";
import { SubscriberFindAllInput } from "../../dto/subscribers/find-all.input";
import { ERRORS } from "./errors";
import { PG_ERROR_CODE } from "../../constants/errors";

export class SubscriberController {
  constructor(private service: SubscriberService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: SubscriberFindAllInput = req.query;
      filters.page = Math.max(1, filters.page || 1);
      filters.perPage = Math.max(1, filters.perPage || 10);

      const { subs, total } = await this.service.getAll(filters);
      res.json({
        data: subs,
        pagination: {
          page: filters.page,
          perPage: filters.perPage,
          total,
          totalPages: Math.ceil(total / filters.perPage),
        },
      });
    } catch (err: any) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sub = await this.service.getOne(req.params.id);
      if (!sub) {
        return res.status(404).json({ error: ERRORS.SUBSCRIBER_NOT_FOUND });
      }
      res.json(sub);
    } catch (err: any) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = SubscriberCreateSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: z.prettifyError(parseResult.error),
        });
      }

      const sub = await this.service.create(parseResult.data);
      res.status(201).json(sub);
    } catch (err: any) {
      if (err.code === PG_ERROR_CODE.DUPLICATE_KEY) {
        return res.status(400).json({ error: ERRORS.EMAIL_ALREADY_EXISTS });
      }
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const input: SubscriberUpdateInput = req.body;

      const sub = await this.service.update(id, input);
      if (!sub) {
        return res.status(404).json({ error: ERRORS.SUBSCRIBER_NOT_FOUND });
      }
      res.json(sub);
    } catch (err: any) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      next(err);
    }
  };
}
