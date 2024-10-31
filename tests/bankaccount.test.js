const supertest = require("supertest");
const app = require("../app");

describe("Bank Account Controller Tests", () => {
  describe("GET /api/v1/accounts - Retrieve All Accounts", () => {
    it("returns all accounts with status 200", async () => {
      const res = await supertest(app).get("/api/v1/accounts");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Berhasil menampilkan data akun"
      );
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(true);
    });
  });

  describe("POST /api/v1/accounts - Create Account", () => {
    it("creates a new account and returns status 201", async () => {
      const accountData = {
        user_id: 2,
        bank_name: "BANK 1",
        bank_account_number: "789456",
        balance: 1000000,
      };
      const res = await supertest(app)
        .post("/api/v1/accounts")
        .send(accountData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Akun berhasil dibuat");
      expect(res.body).toHaveProperty("account");
      expect(res.body.status).toBe(true);
    });

    it("returns 404 when the user is not found", async () => {
      const res = await supertest(app).post("/api/v1/accounts").send({
        user_id: 100,
        bank_name: "BANK 1",
        bank_account_number: "789456",
        balance: 1000000,
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });

    it("returns 400 when account number already exists", async () => {
      const res = await supertest(app).post("/api/v1/accounts").send({
        user_id: 1,
        bank_name: "BANK 1",
        bank_account_number: "789456",
        balance: 1000000,
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Bank Account Number already exists"
      );
    });
  });

  describe("GET /api/v1/accounts/:accountId - Get Account by ID", () => {
    it("retrieves account details by ID with status 200", async () => {
      const res = await supertest(app).get("/api/v1/accounts/1");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Berhasil menampilkan detail akun"
      );
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(true);
    });

    it("returns 404 when account ID is not found", async () => {
      const res = await supertest(app).get("/api/v1/accounts/100");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Account not found");
    });
  });
});
