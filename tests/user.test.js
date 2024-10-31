const supertest = require("supertest");
const app = require("../app");

describe("User Controller Tests", () => {
  describe("Fetching Users - GET /api/v1/users", () => {
    it("returns a list of users with status 200", async () => {
      const res = await supertest(app).get("/api/v1/users");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Berhasil Menampilkan Data User"
      );
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(true);
    });
  });

  describe("Creating a User - POST /api/v1/users", () => {
    it("creates a new user and returns status 201", async () => {
      const newUser = {
        email: "example@mail.com",
        name: "example",
        password: "example123",
        identity_type: "KTP",
        identity_number: "654321",
        address: "Jl. Example",
      };

      const res = await supertest(app).post("/api/v1/users").send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "User created successfully");
      expect(res.body).toHaveProperty("user");
      expect(res.body.status).toBe(true);
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).toHaveProperty("profile");
    });

    it("returns 400 if email is already in use", async () => {
      const res = await supertest(app).post("/api/v1/users").send({
        email: "example@mail.com",
        name: "duplicateTest",
        password: "duplicate123",
        identity_type: "KTP",
        identity_number: "123456789",
        address: "Jl. Duplicate",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Email Already Used");
    });

    it("returns 400 if identity number is already in use", async () => {
      const res = await supertest(app).post("/api/v1/users").send({
        email: "unique@mail.com",
        name: "testIdentity",
        password: "test123",
        identity_type: "KTP",
        identity_number: "654321",
        address: "Jl. Unique",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Identity Number already exist"
      );
    });
  });

  describe("Fetching a User by ID - GET /api/v1/users/:userId", () => {
    it("returns user details for valid ID", async () => {
      const res = await supertest(app).get("/api/v1/users/1");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Berhasil Menampilkan Data User"
      );
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(true);
    });

    it("returns 404 for a non-existent user", async () => {
      const res = await supertest(app).get("/api/v1/users/999");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });
  });
});
