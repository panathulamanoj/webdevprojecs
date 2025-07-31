const Joi=require('joi');
const campgroundschema=Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        // image:Joi.string().required(),
        price:Joi.number().min(0).required(),
        location:Joi.string().required()
}).required().unknown(),
deleteimgs:Joi.array()
});
const reviewschema=Joi.object({
review:Joi.object({
 rating:Joi.number().required().min(1).max(5),
 body:Joi.string().required()
}).required()
});

module.exports.campgroundschema=campgroundschema;
module.exports.reviewschema=reviewschema;