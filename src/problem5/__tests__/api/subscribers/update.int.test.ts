import request from "supertest";
import { v7 as uuidv7 } from "uuid";
import { ENV, seeder } from "../../seed/seeder";

describe("PUT /subscribers/:id", () => {
  let createdId: string;

  beforeAll(async () => {
    const s = seeder();
    const svc = s.getSubscriberService();
    const sub = await svc.create({
      email: `update+${uuidv7()}@example.com`,
      status: "inactive",
      first_name: "mock",
      last_name: "mock",
    });
    createdId = sub.id;
  });

  it("should update allowed fields and return updated subscriber", async () => {
    const update = {
      status: "active",
      first_name: "Updated",
      last_name: "Name",
    };

    const res = await request(ENV.API_BASE_URL)
      .put(`/subscribers/${createdId}`)
      .send(update);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(update);
    expect(res.body.id).toBe(createdId);
  });

  it("should return 404 for non-existent id", async () => {
    const res = await request(ENV.API_BASE_URL)
      .put(`/subscribers/${uuidv7()}`)
      .send({ status: "active" });

    expect(res.status).toBe(404);
  });
});
