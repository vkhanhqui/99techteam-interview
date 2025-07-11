import request from "supertest";
import { v7 as uuidv7 } from "uuid";
import { ENV, seeder } from "../../seed/seeder";

describe("DELETE /subscribers/:id", () => {
  let createdId: string;

  beforeAll(async () => {
    const s = seeder();
    const svc = s.getSubscriberService();
    const sub = await svc.create({
      email: `delete+${uuidv7()}@example.com`,
      status: "inactive",
      first_name: "mock",
      last_name: "mock",
    });
    createdId = sub.id;
  });

  it("should delete subscriber and return 204", async () => {
    const res = await request(ENV.API_BASE_URL).delete(`/subscribers/${createdId}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it("should return 404 when deleting non-existent subscriber", async () => {
    const res = await request(ENV.API_BASE_URL).delete(`/subscribers/${uuidv7()}`);
    expect(res.status).toBe(204);
  });
});
