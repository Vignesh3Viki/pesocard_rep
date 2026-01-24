import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateProfileSchema = Joi.object({
  first_name: Joi.string().max(100).optional(),
  second_name: Joi.string().max(100).optional(),
  qualification: Joi.string().max(150).optional(),
  job_position: Joi.string().max(150).optional(),
  company: Joi.string().max(150).optional(),
  bio: Joi.string().optional(),
  address: Joi.string().optional(),
  phone: Joi.string().max(20).optional(),
  website_url: Joi.string().uri().optional().allow(""),
  linkedin_url: Joi.string().uri().optional().allow(""),
});
