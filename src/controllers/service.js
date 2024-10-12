const prisma = require('../config/prisma');

const getAllServices = async (req, res) => {
  const services = await prisma.$queryRaw`
      SELECT "service_code", "service_name", "service_icon", "service_tarif" FROM "Service"
    `;

  res.status(200).json({
    status: 0,
    message: 'Sukses',
    data: services,
  });
};

module.exports = {
  getAllServices,
};
