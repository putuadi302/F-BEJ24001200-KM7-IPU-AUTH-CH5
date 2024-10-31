const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT);

class userController {
  /* POST /api/v1/users: menambahkan user
    baru beserta dengan profilnya. */
  static async createUser(req, res, next) {
    try {
      const { name, email, password, identity_type, identity_number, address } =
        req.body;
      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

      const cekEmail = await prisma.users.findUnique({
        where: {
          email,
        },
      });
      if (cekEmail) {
        throw { status: 400, message: "Email already exist", flagging: true };
      }

      const cekIdentityNumber = await prisma.profiles.findUnique({
        where: {
          identity_number,
        },
      });
      if (cekIdentityNumber) {
        throw { status: 400, message: "Identity Number already exist" };
      }

      const newUser = await prisma.users.create({
        data: {
          email,
          name,
          password: hashedPassword,
          profile: {
            create: {
              identity_type,
              identity_number,
              address,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      res.status(201).json({
        status: true,
        message: "User created successfully",
        user: newUser,
      });
    } catch (error) {
      if (error.status) {
        if (error.flagging) {
          return res.status(error.status).json({
            status: error.status,
            message: "Email Already Used",
          });
        } else {
          return res.status(error.status).json({
            status: "Failed",
            message: error.message,
          });
        }
      }
      next(error);
    }
  }

  /* 
    GET /api/v1/users: menampilkan daftar
    users. 
    */
  static async getUsers(req, res, next) {
    try {
      const users = await prisma.users.findMany({
        orderBy: {
          id: "asc",
        },
        include: {
          profile: true,
        },
      });
      if (!users) {
        throw { status: 404, message: "User not found" };
      }
      res.status(200).json({
        status: true,
        message: "Berhasil Menampilkan Data User",
        data: users,
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

  /* GET /api/v1/users/:userId: menampilkan
    detail informasi user (tampilkan juga
    profilnya). */

  static async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await prisma.users.findUnique({
        where: {
          id: Number(userId),
        },
        include: {
          profile: true,
        },
      });
      if (!user) {
        throw { status: 404, message: "User not found" };
      }
      res.status(200).json({
        status: true,
        message: "Berhasil Menampilkan Data User",
        data: user,
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

module.exports = userController;
