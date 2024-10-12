const { z } = require('zod');

const registerValidation = z.object({
  first_name: z.string({
    message: 'Parameter first_name harus di isi',
  }),
  last_name: z.string({
    message: 'Parameter last_name harus di isi',
  }),
  email: z
    .string({
      message: 'Parameter email harus di isi',
    })
    .email({
      message: 'Parameter email tidak sesuai format',
    }),
  password: z
    .string({
      message: 'Parameter password harus di isi',
    })
    .min(8, {
      message: 'Password length minimal 8 karakter',
    }),
});

const loginValidation = z.object({
  email: z
    .string({
      message: 'Parameter email harus di isi',
    })
    .email({
      message: 'Parameter email tidak sesuai format',
    }),
  password: z
    .string({
      message: 'Parameter password harus di isi',
    })
    .min(8, {
      message: 'Password length minimal 8 karakter',
    }),
});

const updateValidation = z.object({
  first_name: z.string({
    message: 'Parameter first_name harus di isi',
  }),
  last_name: z.string({
    message: 'Parameter last_name harus di isi',
  }),
});

const topupValidation = z.object({
  top_up_amount: z
    .number({
      required_error: 'Parameter top_up_amount harus di isi',
      invalid_type_error: 'Parameter top_up_amount harus berupa number',
    })
    .min(1, { message: 'Jumlah top up harus lebih besar dari 0' }),
});

const transactionValidation = z.object({
  service_code: z.string({
    message: 'Parameter service_code harus di isi',
  }),
});

module.exports = {
  registerValidation,
  loginValidation,
  updateValidation,
  topupValidation,
  transactionValidation,
};
