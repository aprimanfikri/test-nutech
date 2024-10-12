const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function main() {
  await prisma.transaction.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.user.deleteMany({});

  const banners = [
    {
      banner_name: 'Banner 1',
      banner_image: 'https://nutech-integrasi.app/dummy.jpg',
      description: 'Lerem Ipsum Dolor sit amet',
    },
    {
      banner_name: 'Banner 2',
      banner_image: 'https://nutech-integrasi.app/dummy.jpg',
      description: 'Lerem Ipsum Dolor sit amet',
    },
    {
      banner_name: 'Banner 3',
      banner_image: 'https://nutech-integrasi.app/dummy.jpg',
      description: 'Lerem Ipsum Dolor sit amet',
    },
    {
      banner_name: 'Banner 4',
      banner_image: 'https://nutech-integrasi.app/dummy.jpg',
      description: 'Lerem Ipsum Dolor sit amet',
    },
    {
      banner_name: 'Banner 5',
      banner_image: 'https://nutech-integrasi.app/dummy.jpg',
      description: 'Lerem Ipsum Dolor sit amet',
    },
    {
      banner_name: 'Banner 6',
      banner_image: 'https://nutech-integrasi.app/dummy.jpg',
      description: 'Lerem Ipsum Dolor sit amet',
    },
  ];

  for (const banner of banners) {
    await prisma.banner.create({
      data: banner,
    });
  }

  console.log('Banners seeding complete!');

  const services = [
    {
      service_code: 'PAJAK',
      service_name: 'Pajak PBB',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 40000,
    },
    {
      service_code: 'PLN',
      service_name: 'Listrik',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 10000,
    },
    {
      service_code: 'PDAM',
      service_name: 'PDAM Berlangganan',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 40000,
    },
    {
      service_code: 'PULSA',
      service_name: 'Pulsa',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 40000,
    },
    {
      service_code: 'PGN',
      service_name: 'PGN Berlangganan',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 50000,
    },
    {
      service_code: 'MUSIK',
      service_name: 'Musik Berlangganan',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 50000,
    },
    {
      service_code: 'TV',
      service_name: 'TV Berlangganan',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 50000,
    },
    {
      service_code: 'PAKET_DATA',
      service_name: 'Paket data',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 50000,
    },
    {
      service_code: 'VOUCHER_GAME',
      service_name: 'Voucher Game',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 100000,
    },
    {
      service_code: 'VOUCHER_MAKANAN',
      service_name: 'Voucher Makanan',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 100000,
    },
    {
      service_code: 'QURBAN',
      service_name: 'Qurban',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 200000,
    },
    {
      service_code: 'ZAKAT',
      service_name: 'Zakat',
      service_icon: 'https://nutech-integrasi.app/dummy.jpg',
      service_tarif: 300000,
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log('Services seeding complete!');

  const hashedPassword = await bcrypt.hash(process.env.USER_PASSWORD, 10);

  const user = {
    first_name: 'Test',
    last_name: 'User',
    email: process.env.USER_EMAIL,
    password: hashedPassword,
  };

  await prisma.user.create({
    data: user,
  });

  console.log('User seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
