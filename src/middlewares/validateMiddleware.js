const { validationResult, checkSchema } = require('express-validator');
const { formatResponse } = require('../utils/helpers');

const validate = (schema) => {
    return async (req, res, next) => {
        await Promise.all(
            Object.values(schema).map(validation => validation.run(req))
        );

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(
                formatResponse(false, null, 'Validation error', errors.array())
            );
        }
        next();
    };
};

module.exports = validate;
