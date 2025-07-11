import { Pool } from "pg";
import { Subscriber } from "../models/Subscriber";
import { SubscriberFindAllInput } from "../dto/subscribers/find-all.input";
import { SubscriberCreateInput } from "../dto/subscribers/create.input";
import { SubscriberUpdateInput } from "../dto/subscribers/update.input";
import { v7 as uuidv7 } from "uuid";

export interface SubscriberRepo {
  findAll(filters?: SubscriberFindAllInput): Promise<Subscriber[]>;
  count(filters?: SubscriberFindAllInput): Promise<number>;
  findById(id: string): Promise<Subscriber | null>;
  create(input: SubscriberCreateInput): Promise<Subscriber>;
  update(id: string, input: SubscriberUpdateInput): Promise<Subscriber | null>;
  delete(id: string): Promise<void>;
}

export class PgSubscriberRepo implements SubscriberRepo {
  constructor(private pool: Pool) {}

  async findAll(filters: SubscriberFindAllInput = {}) {
    const {
      sort_by,
      order,
      page = 1,
      perPage = 10,
    } = filters;

    const {queryFilter, values} = this.generateQueryFilter(filters)
    let query = `SELECT * FROM subscribers ${queryFilter}`;

    query += ` ORDER BY ${
      ["created_at", "updated_at"].includes(sort_by || "")
        ? sort_by
        : "created_at"
    } ${order === "asc" ? "ASC" : "DESC"}`;

    values.push(perPage);
    query += ` LIMIT $${values.length}`;

    const offset = (page - 1) * perPage;
    values.push(offset);
    query += ` OFFSET $${values.length}`;

    const res = await this.pool.query(query, values);
    return res.rows;
  }

  async count(filters: SubscriberFindAllInput = {}) {
    const {queryFilter, values} = this.generateQueryFilter(filters)
    const query = `SELECT COUNT(*) FROM subscribers ${queryFilter}`
    const res = await this.pool.query(query, values);
    return parseInt(res.rows[0].count, 10);
  }

  async findById(id: string) {
    const res = await this.pool.query(
      "SELECT * FROM subscribers WHERE id = $1",
      [id]
    );
    return res.rows[0] || null;
  }

  async create(data: SubscriberCreateInput) {
    const res = await this.pool.query(
      `INSERT INTO subscribers (id, email, status, first_name, last_name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *`,
      [uuidv7(), data.email, data.status, data.first_name, data.last_name]
    );
    return res.rows[0];
  }

  async update(id: string, data: SubscriberUpdateInput) {
    const updates = Object.entries(data);
    if (updates.length === 0) return this.findById(id);

    const setClauses = updates
      .map(([key], i) => `${key} = $${i + 1}`)
      .join(", ");
    const values = updates.map(([, v]) => v);
    values.push(id);

    const query = `UPDATE subscribers
    SET ${setClauses}, updated_at = NOW()
    WHERE id = $${values.length}
    RETURNING *`;
    const res = await this.pool.query(query, values);
    return res.rows[0] || null;
  }

  async delete(id: string) {
    await this.pool.query("DELETE FROM subscribers WHERE id = $1", [id]);
  }

  private generateQueryFilter(filters: SubscriberFindAllInput = {}): {queryFilter: string, values: any[]} {
    const {
      status,
      email,
      first_name,
      last_name,
    } = filters;

    const values: any[] = [];
    const conditions: string[] = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }
    if (email) {
      values.push(`%${email.toLowerCase()}%`);
      conditions.push(`LOWER(email) LIKE $${values.length}`);
    }
    if (first_name) {
      values.push(`%${first_name.toLowerCase()}%`);
      conditions.push(`LOWER(first_name) LIKE $${values.length}`);
    }
    if (last_name) {
      values.push(`%${last_name.toLowerCase()}%`);
      conditions.push(`LOWER(last_name) LIKE $${values.length}`);
    }

    let queryFilter = '';
    if (conditions.length > 0) {
      queryFilter += " WHERE " + conditions.join(" AND ");
    }

    return {queryFilter, values}
  }
}
