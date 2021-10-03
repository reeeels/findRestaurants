const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.restaurantsschema = Joi.object({
    campground: Joi.object({
        alias: Joi.string().required().escapeHTML(),
        name: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(0),
        ratingCount: Joi.number().required().min(0),
        url: Joi.string().required(),
        location: Joi.array().required(),
    }).required(),
    deleteImages: Joi.array()
});