const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

describe("Auth Controller Tests", () => {
  describe("User Registration - POST /api/v1/auth/register", () => {
    it("creates a new user and returns 201", async () => {
      const newUserResponse = await supertest(app)
        .post("/api/v1/auth/register")
        .send({
          email: "adi@mail.com",
          name: "adi",
          password: "adi",
        });

      expect(newUserResponse.status).toBe(201);
      expect(newUserResponse.body).toHaveProperty(
        "message",
        "User berhasil dibuat"
      );
      expect(newUserResponse.body).toHaveProperty("data");
      expect(newUserResponse.body.status).toBe(201);
    });

    it("returns 400 if the email is already registered", async () => {
      const duplicateEmailResponse = await supertest(app)
        .post("/api/v1/auth/register")
        .send({
          email: "adi@mail.com",
          name: "adi",
          password: "adi",
        });

      expect(duplicateEmailResponse.status).toBe(400);
      expect(duplicateEmailResponse.body).toHaveProperty(
        "message",
        "Bad Request"
      );
      expect(duplicateEmailResponse.body).toHaveProperty("status", "failed");
    });
  });

  describe("User Login - POST /api/v1/auth/login", () => {
    it("logs in a valid user and returns 200", async () => {
      const loginResponse = await supertest(app)
        .post("/api/v1/auth/login")
        .send({
          email: "adi@mail.com",
          password: "adi",
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty("message", "Login berhasil");
      expect(loginResponse.body).toHaveProperty("token");
      expect(loginResponse.body.status).toBe(200);
    });

    it("returns 400 if the email does not exist", async () => {
      const invalidEmailResponse = await supertest(app)
        .post("/api/v1/auth/login")
        .send({
          email: "qwerty@mail.com",
          password: "adi",
        });

      expect(invalidEmailResponse.status).toBe(400);
      expect(invalidEmailResponse.body).toHaveProperty(
        "message",
        "Email atau password salah"
      );
      expect(invalidEmailResponse.body).toHaveProperty("status", "failed");
    });

    it("returns 400 if the password is incorrect", async () => {
      const incorrectPasswordResponse = await supertest(app)
        .post("/api/v1/auth/login")
        .send({
          email: "adi@mail.com",
          password: "qwerty",
        });

      expect(incorrectPasswordResponse.status).toBe(400);
      expect(incorrectPasswordResponse.body).toHaveProperty(
        "message",
        "Email atau password salah"
      );
      expect(incorrectPasswordResponse.body).toHaveProperty("status", "failed");
    });
  });

  describe("User Authentication - GET /api/v1/auth/authenticate", () => {
    let token;

    beforeAll(() => {
      token = jwt.sign({ id: 1, email: "test@mail.com" }, JWT_SECRET);
    });

    it("authenticates a valid user token and returns 200", async () => {
      const authResponse = await supertest(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `Bearer ${token}`);

      expect(authResponse.status).toBe(200);
      expect(authResponse.body).toHaveProperty("message", "yeayy berhasil");
    });

    it("returns 401 if token is missing", async () => {
      const noTokenResponse = await supertest(app).get(
        "/api/v1/auth/authenticate"
      );

      expect(noTokenResponse.status).toBe(401);
      expect(noTokenResponse.body).toHaveProperty("message", "Unauthorized");
      expect(noTokenResponse.body.status).toBe(401);
    });

    it("returns 401 for an invalid token", async () => {
      const invalidTokenResponse = await supertest(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `Bearer ${token}ascasc`);

      expect(invalidTokenResponse.status).toBe(401);
      expect(invalidTokenResponse.body).toHaveProperty(
        "message",
        "Unauthorized"
      );
      expect(invalidTokenResponse.body.status).toBe(401);
    });
  });
});
