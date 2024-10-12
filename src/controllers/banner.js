const prisma = require('../config/prisma');

const getAllBanners = async (req, res) => {
  const banners = await prisma.$queryRaw`
      SELECT "banner_name", "banner_image", "description" FROM "Banner"
    `;

  res.status(200).json({
    status: 0,
    message: 'Sukses',
    data: banners,
  });
};

module.exports = {
  getAllBanners,
};
