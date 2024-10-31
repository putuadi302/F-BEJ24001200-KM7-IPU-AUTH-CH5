const supertest = require("supertest");
const app = require("../app");

describe("Transaction Controller Suite", () => {
  describe("GET /api/v1/transactions - Fetch All Transactions", () => {
    it("responds with a list of transactions and status 200", async () => {
      const res = await supertest(app).get("/api/v1/transactions");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Berhasil menampilkan data transaksi"
      );
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(true);
    });
  });

  describe("POST /api/v1/transactions - Create Transaction", () => {
    it("creates a new transaction successfully", async () => {
      const transactionData = {
        source_account_id: 1,
        destination_account_id: 2,
        amount: 1000,
      };
      const res = await supertest(app)
        .post("/api/v1/transactions")
        .send(transactionData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Transaksi berhasil");
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(true);
    });

    it("returns 404 when source account is missing", async () => {
      const res = await supertest(app).post("/api/v1/transactions").send({
        source_account_id: 100,
        destination_account_id: 2,
        amount: 1000,
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Account not found");
    });

    it("returns 404 when destination account is missing", async () => {
      const res = await supertest(app).post("/api/v1/transactions").send({
        source_account_id: 1,
        destination_account_id: 100,
        amount: 1000,
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Account not found");
    });

    it("returns 400 when balance is insufficient", async () => {
      const res = await supertest(app).post("/api/v1/transactions").send({
        source_account_id: 1,
        destination_account_id: 2,
        amount: 100000000,
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Balance not enough");
    });
  });

  describe("GET /api/v1/transactions/:transactionId - Get Transaction by ID", () => {
    it("fetches transaction details by ID and returns status 200", async () => {
      const res = await supertest(app).get("/api/v1/transactions/1");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Berhasil menampilkan detail transaksi"
      );
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(true);
    });

    it("returns 404 when transaction ID does not exist", async () => {
      const res = await supertest(app).get("/api/v1/transactions/100");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Transaction not found");
    });
  });
});
