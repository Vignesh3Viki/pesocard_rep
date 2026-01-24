import Joi from "joi";

export const shareSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  type: Joi.string().valid("QR", "shareLink").required(),
  visitor_id: Joi.number().integer().positive().optional().allow(null),
});

export const viewSchema = Joi.object({
  visitor_id: Joi.string().required(),
  country_name: Joi.string().max(100).optional().allow(""),
});

export const saveSchema = Joi.object({
  visitor_id: Joi.string().required(),
});

export const profileVisitSchema = Joi.object({
  visitor_id: Joi.string().required(),
  visiting_source: Joi.string()
    .valid(
      "linkedin",
      "website",
      "instagram",
      "facebook",
      "twitter",
      "direct",
      "other",
    )
    .required(),
});
