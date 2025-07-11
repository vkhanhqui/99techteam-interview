import { SubscriberRepo } from "../repositories/SubscriberRepo";
import { SubscriberCreateInput } from "../dto/subscribers/create.input";
import { SubscriberUpdateInput } from "../dto/subscribers/update.input";
import { SubscriberFindAllInput } from "../dto/subscribers/find-all.input";
import { Subscriber } from "../models/Subscriber";

export interface SubscriberService {
  getAll(filters?: SubscriberFindAllInput): Promise<{subs: Subscriber[], total: number}>;
  getOne(id: string): Promise<Subscriber | null>;
  create(input: SubscriberCreateInput): Promise<Subscriber>;
  update(id: string, input: SubscriberUpdateInput): Promise<Subscriber | null>;
  delete(id: string): Promise<void>;
}

export class SubscriberServiceImp implements SubscriberService{
  constructor(private repo: SubscriberRepo) {}

  async getAll(filters?: SubscriberFindAllInput) {
    const [subs, total] = await Promise.all([
      this.repo.findAll(filters),
      this.repo.count(filters),
    ]);
    return { subs, total };
  }

  async getOne(id: string) {
    return this.repo.findById(id);
  }

  async create(input: SubscriberCreateInput) {
    return this.repo.create(input);
  }

  async update(id: string, input: SubscriberUpdateInput) {
    return this.repo.update(id, input);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
