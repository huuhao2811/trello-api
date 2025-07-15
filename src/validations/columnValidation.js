import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError.js';
const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().required().min(3).max(50).trim().strict()
    })

    try {
        await correctCondition.validateAsync(req.body, {abortEarly: false});
        next();
        //res.status(StatusCodes.CREATED).json({message: 'From validation API create board',});
    } catch (error) {
        const errorMessages = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages);
        next(customError);
    }
}
const update = async (req, res, next) => {
    const correctCondition = Joi.object({
        // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().min(3).max(50).trim().strict(),
        cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    })

    try {
        await correctCondition.validateAsync(req.body, {abortEarly: false, allowUnknown: true});
        next();
    } catch (error) {
        const errorMessages = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages);
        next(customError);
    }
}
const deleteItem = async (req, res, next) => {
    const correctCondition = Joi.object({
        // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    })

    try {
        await correctCondition.validateAsync(req.params)
        next();
    } catch (error) {
        const errorMessages = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages);
        next(customError);
    }
}
export const columnValidation = {
    createNew,
    update,
    deleteItem
}