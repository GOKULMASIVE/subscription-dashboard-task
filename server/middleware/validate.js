const yup = require("yup");

const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  role: yup.string().oneOf(["user", "admin"]).optional(),
});

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    next();
  } catch (err) {
    const errors = err.inner.reduce((acc, e) => {
      acc[e.path] = e.message;
      return acc;
    }, {});
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
};

module.exports = { registerSchema, loginSchema, validate };
