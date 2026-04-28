const Joi = require("joi");

module.exports.ListingSchema = Joi.object({
    listing: Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price: Joi.number()
        .min(0)
        .required()
        .messages({
            "any.required": "Price is required",
            "number.base": "Price must be a number",
            "number.min": "Price cannot be negative"
        }),
        image : Joi.string().allow("", null),
        category : Joi.string().required() 
    }).required()
});


module.exports.ReviewSchema = Joi.object({
    review: Joi.object({
        name: Joi.string().required(),
        comment : Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});


module.exports.searchSchema = Joi.object({
    destination: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
});