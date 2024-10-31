const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class transactionController {
  /* 
        POST /api/v1/transactions: mengirimkan
        uang dari 1 akun ke akun lain (tentukan
        request body nya). */
  static async createTransaction(req, res, next) {
    try {
      const { source_account_id, destination_account_id, amount } = req.body;

      const sourceAccount = await prisma.bank_accounts.findUnique({
        where: {
          id: source_account_id,
        },
      });

      const dstAccount = await prisma.bank_accounts.findUnique({
        where: {
          id: destination_account_id,
        },
      });

      if (!sourceAccount || !dstAccount) {
        throw { status: 404, message: "Account not found" };
      }
      if (sourceAccount.balance < amount) {
        throw { status: 400, message: "Balance not enough" };
      }
      await prisma.bank_accounts.update({
        where: {
          id: sourceAccount.id,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
      await prisma.bank_accounts.update({
        where: {
          id: dstAccount.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      await prisma.transactions.create({
        data: {
          source_account_id: sourceAccount.id,
          destination_account_id: dstAccount.id,
          amount,
        },
      });
      res.status(201).json({
        status: true,
        message: "Transaksi berhasil",
        data: {
          source_account_id: sourceAccount.id,
          destination_account_id: dstAccount.id,
          amount,
        },
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

  /* GET /api/v1/transactions: menampilkan
        daftar transaksi. */
  static async getTransactions(req, res, next) {
    try {
      const transactions = await prisma.transactions.findMany({
        orderBy: {
          id: "asc",
        },
      });
      res.status(200).json({
        status: true,
        message: "Berhasil menampilkan data transaksi",
        data: transactions,
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

  /* GET /api/v1/transactions/:transaction:
    menampilkan detail transaksi (tampilkan
    juga pengirim dan penerimanya). */
  static async getTransactionById(req, res, next) {
    const { transactionId } = req.params;
    const transaction = await prisma.transactions.findUnique({
      where: {
        id: Number(transactionId),
      },
    });
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Berhasil menampilkan detail transaksi",
      data: transaction,
    });
  }
}

module.exports = transactionController;
