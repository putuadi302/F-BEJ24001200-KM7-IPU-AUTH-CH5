const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class bankAccountController {
  /* POST /api/v1/accounts: menambahkan
        akun baru ke user yang sudah
        didaftarkan. */
  static async createAccount(req, res, next) {
    try {
      const { user_id, bank_name, bank_account_number, balance } = req.body;

      const user = await prisma.users.findUnique({
        where: {
          id: user_id,
        },
      });
      if (!user) {
        throw { status: 404, message: "User not found" };
      }

      const account = await prisma.bank_accounts.findUnique({
        where: {
          bank_account_number,
        },
      });
      if (account) {
        throw { status: 400, message: "Bank Account Number already exists" };
      }

      const newAccount = await prisma.bank_accounts.create({
        data: {
          user_id: user.id,
          bank_name,
          bank_account_number,
          balance,
        },
      });
      res.status(201).json({
        status: true,
        message: "Akun berhasil dibuat",
        account: newAccount,
      });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          status: "failed",
          message: error.message,
        });
      }
      next(error);
    }
  }

  /* 
        GET /api/v1/accounts: menampilkan
        daftar akun. */

  static async getAccounts(req, res) {
    const accounts = await prisma.bank_accounts.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan data akun",
      data: accounts,
    });
  }

  /* GET /api/v1/accounts: menampilkan
    detail akun. */
  static async getAccountById(req, res, next) {
    try {
      const { accountId } = req.params;
      const account = await prisma.bank_accounts.findUnique({
        where: {
          id: Number(accountId),
        },
      });

      if (!account) {
        throw { status: 404, message: "Account not found" };
      }
      res.status(200).json({
        status: true,
        message: "Berhasil menampilkan detail akun",
        data: account,
      });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({
          status: "failed",
          message: error.message,
        });
      }
      next(error);
    }
  }
}

module.exports = bankAccountController;
