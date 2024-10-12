const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const ApiError = require('../utils/apiError');
const cloudinary = require('../config/cloudinary');
const {
  registerValidation,
  loginValidation,
  updateValidation,
} = require('../utils/validation');

const register = async (req, res, next) => {
  try {
    const result = registerValidation.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(result.error.errors[0].message, 400);
    }

    const { first_name, last_name, email, password } = req.body;

    const exist = await prisma.$queryRaw`
      SELECT * FROM "User" WHERE "email" = ${email}
    `;

    if (exist.length) {
      throw new ApiError('Email ini sudah di gunakan', 409);
    }

    const hashed = await bcrypt.hashSync(password, 10);

    await prisma.$executeRaw`
    INSERT INTO "User" ("first_name", "last_name", "email", "password") 
    VALUES (${first_name}, ${last_name}, ${email}, ${hashed})
  `;

    res.status(201).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = loginValidation.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(result.error.errors[0].message, 400);
    }

    const { email, password } = req.body;

    const user = await prisma.$queryRaw`
      SELECT * FROM "User" WHERE "email" = ${email}
    `;

    if (!user.length) {
      throw new ApiError('Email tidak ada', 404);
    }

    const valid = await bcrypt.compareSync(password, user[0].password);

    if (!valid) {
      throw new ApiError('Password salah', 401);
    }

    const token = jwt.sign({ email: user[0].email }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    res.status(200).json({
      status: 0,
      message: 'Login Sukses',
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res) => {
  res.status(200).json({
    status: 0,
    message: 'Sukses',
    data: {
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      profile_image: req.user.profile_image,
    },
  });
};

const update = async (req, res, next) => {
  try {
    const result = updateValidation.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(result.error.errors[0].message, 400);
    }

    const { first_name, last_name } = req.body;

    await prisma.$executeRaw`
    UPDATE "User" SET "first_name" = ${first_name}, "last_name" = ${last_name} 
    WHERE "id" = ${req.user.id}
  `;

    const user = await prisma.$queryRaw`
      SELECT "email", "first_name", "last_name", "profile_image" 
      FROM "User" WHERE "id" = ${req.user.id}
    `;

    res.status(200).json({
      status: 0,
      message: 'Update Pofile berhasil',
      data: user[0],
    });
  } catch (error) {
    next(error);
  }
};

const image = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      throw new ApiError('Parameter image harus di isi', 400);
    }

    const result = await cloudinary.uploader.upload(file.path);
    // if (req.user.profile_image_id) {
    //   await cloudinary.uploader.destroy(req.user.profile_image_id);
    // }

    await prisma.$executeRaw`
    UPDATE "User" SET "profile_image" = ${result.secure_url}, "profile_image_id" = ${result.public_id} 
    WHERE "id" = ${req.user.id}
  `;

    const user = await prisma.$queryRaw`
      SELECT "email", "first_name", "last_name", "profile_image" 
      FROM "User" WHERE "id" = ${req.user.id}
    `;

    res.status(200).json({
      status: 0,
      message: 'Update Profile Image berhasil',
      data: user[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, profile, update, image };
