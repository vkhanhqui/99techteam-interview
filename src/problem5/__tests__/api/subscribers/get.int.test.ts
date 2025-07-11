import request from "supertest";
import { v7 as uuidv7 } from "uuid";
import { ENV, seeder } from "../../seed/seeder";

describe("GET /subscribers/:id", () => {
  let createdId: string;

  beforeAll(async () => {
    const s = seeder();
    const svc = s.getSubscriberService();

    const sub = await svc.create({
      email: `john+${uuidv7()}@example.com`,
      status: "active",
      first_name: "mock",
      last_name: "mock",
    });
    createdId = sub.id;
  });

  it("should return subscriber by id", async () => {
    const res = await request(ENV.API_BASE_URL).get(
      `/subscribers/${createdId}`
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", createdId);
    expect(res.body).toHaveProperty("email");
  });

  it("should return 404 for nonexistent id", async () => {
    const res = await request(ENV.API_BASE_URL).get(`/subscribers/${uuidv7()}`);
    expect(res.status).toBe(404);
  });
});
