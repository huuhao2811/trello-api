import Joi from "joi";

import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError.js';
import {BOARD_TYPES} from '~/utils/constants.js';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators.js";
const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict().messages({
            'any.required': 'Title is required (huuhao)',
            'string.empty': 'Title cannot be empty (huuhao)',
            'string.min': 'Title must be at least 3 characters long (huuhao)',
            'string.max': 'Title must be at most 50 characters long (huuhao)',
            'string.trim': 'Title cannot contain leading or trailing spaces (huuhao)'
        }),
        description: Joi.string().required().min(3).max(256).trim().strict(),
        type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
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
        title: Joi.string().min(3).max(50).trim().strict(),
        description: Joi.string().min(3).max(256).trim().strict(),
        type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
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
const moveCardToDifferentColumn = async (req, res, next) => {
    const correctCondition = Joi.object({
        currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        prevCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)),
        nextColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        nextCardOrderIds: Joi.array().required().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    })

    try {
        await correctCondition.validateAsync(req.body, {abortEarly: false});
        next();
    } catch (error) {
        const errorMessages = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages);
        next(customError);
    }
}
export const boardValidation = {
    createNew,
    update,
    moveCardToDifferentColumn
}