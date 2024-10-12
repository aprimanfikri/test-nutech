const prisma = require('../config/prisma');
const ApiError = require('../utils/apiError');
const {
  topupValidation,
  transactionValidation,
} = require('../utils/validation');

const balance = async (req, res) => {
  const balance = await prisma.$queryRaw`
          SELECT "balance" FROM "User" WHERE "id" = ${req.user.id}
        `;

  res.status(200).json({
    status: 0,
    message: 'Get Balance Berhasil',
    data: balance[0],
  });
};

const topup = async (req, res, next) => {
  try {
    const result = topupValidation.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(result.error.errors[0].message, 400);
    }

    const { top_up_amount } = req.body;

    await prisma.$executeRaw`
    UPDATE "User" 
    SET "balance" = "balance" + ${top_up_amount}
    WHERE "id" = ${req.user.id}
  `;

    const invoice_number = `INV-${Date.now()}`;

    await prisma.$executeRaw`
        INSERT INTO "Transaction" ("userId", "invoice_number", "transaction_type", "description", "total_amount")
        VALUES (${req.user.id}, ${invoice_number}, 'TOPUP', 'Top Up Saldo', ${top_up_amount})
        `;

    const user = await prisma.$queryRaw`
        SELECT "balance" FROM "User" WHERE "id" = ${req.user.id}
        `;

    res.status(201).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: user[0],
    });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const result = transactionValidation.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(result.error.errors[0].message, 400);
    }

    const { service_code } = req.body;

    const service = await prisma.$queryRaw`
        SELECT * FROM "Service" WHERE "service_code" = ${service_code}
        `;

    if (!service.length) {
      throw new ApiError('Service atau Layanan tidak ditemukan', 404);
    }

    const invoice_number = `INV-${Date.now()}`;

    await prisma.$executeRaw`
        INSERT INTO "Transaction" ("userId", "invoice_number", "transaction_type", "description", "total_amount")
        VALUES (${req.user.id}, ${invoice_number}, 'PAYMENT', ${service[0].service_name}, ${service[0].service_tarif})
        `;

    await prisma.$executeRaw`
        UPDATE "User" 
        SET "balance" = "balance" - ${service[0].service_tarif}
        WHERE "id" = ${req.user.id}
        `;

    const transaction = await prisma.$queryRaw`
        SELECT * FROM "Transaction" WHERE "invoice_number" = ${invoice_number}`;

    res.status(201).json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number,
        service_code: service[0].service_code,
        service_name: service[0].service_name,
        transaction_type: transaction[0].transaction_type,
        total_amount: transaction[0].total_amount,
        created_on: transaction[0].created_on,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionHistory = async (req, res) => {
  const { limit, offset } = req.query;

  const limitValue = limit ? parseInt(limit) : null;
  const offsetValue = parseInt(offset) || 0;

  const transactions = await prisma.$queryRaw`
        SELECT * FROM "Transaction" WHERE "userId" = ${req.user.id} 
        ORDER BY "created_on" DESC LIMIT ${limitValue} OFFSET ${offsetValue}
    `;
  res.status(200).json({
    status: 0,
    message: 'Get History Berhasil',
    data: {
      offset: offsetValue,
      limit: limitValue === null ? 0 : limitValue,
      records: transactions,
    },
  });
};

module.exports = { balance, topup, createTransaction, getTransactionHistory };
