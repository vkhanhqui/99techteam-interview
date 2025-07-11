import request from "supertest";
import { v7 as uuidv7 } from "uuid";
import { ENV } from "../../seed/seeder";

describe("POST /subscribers", () => {
  const seedEmail = `example+${uuidv7()}@example.com`;
  it("should create a new subscriber and return 201", async () => {
    const body = {
      email: seedEmail,
      status: "active",
      first_name: "mock",
      last_name: "mock",
    };
    const res = await request(ENV.API_BASE_URL)
      .post("/subscribers")
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(body);
    expect(res.body.id).toBeDefined();
  });

  it("should return 400 if email already exists", async () => {
    const res = await request(ENV.API_BASE_URL)
      .post("/subscribers")
      .send({
        email: seedEmail,
        status: "active",
      });

    expect(res.status).toBe(400);
  });

  it("should return 400 for missing required fields", async () => {
    const res = await request(ENV.API_BASE_URL)
      .post("/subscribers")
      .send({});

    expect(res.status).toBe(400);
  });
});
