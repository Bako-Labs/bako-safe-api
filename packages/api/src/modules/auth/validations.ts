import Joi from 'joi';

import { Encoder } from '@src/models';

import { AddressValidator, validator } from '@utils/index';
import { Address } from 'fuels';

const allowedEncoders = Object.values(Encoder);

export const validateSignInPayload = validator.body(
  Joi.object({
    encoder: Joi.string()
      .valid(...allowedEncoders)
      .required(),
    signature: Joi.string().required(),
    digest: Joi.string().required(),
  }),
);

export const validateSignInDappPayload = validator.body(
  Joi.object({
    sessionId: Joi.string().required(),
    url: Joi.string().required(),
    name: Joi.string().optional(),
    address: Joi.string().required().custom(AddressValidator.validate),
  }),
);

export const validateSignInCodeParams = validator.params(
  Joi.object({
    address: Joi.string().required().custom(AddressValidator.validate),
  }),
);
