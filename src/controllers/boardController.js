import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError.js';
import { boardService } from '~/services/boardService.js';
import { request } from 'express';

const createNew = async (req, res, next) => {
    try {
        // console.log('req.body', req.body);
        // console.log('req.query', req.query);
        // console.log('req.params', req.params);
        const createdBoard = await boardService.createNew(req.body)
        res.status(StatusCodes.CREATED).json(createdBoard);
        //throw new ApiError(StatusCodes.BAD_GATEWAY,'This is a test error'); // Simulating an error for testing purposes
    } catch (error) {
        next(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //     error: error.message,
        // });
    }

}
const getDetails = async (req, res, next) => {
    try {
        // console.log('req.params', req.params);
        const boardId = req.params.id;
        const board = await boardService.getDetails(boardId)
        res.status(StatusCodes.OK).json(board);
        //throw new ApiError(StatusCodes.BAD_GATEWAY,'This is a test error'); // Simulating an error for testing purposes
    } catch (error) {
        next(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //     error: error.message,
        // });
    }

}
const update = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const updatedBoard = await boardService.update(boardId, req.body);
        res.status(StatusCodes.OK).json(updatedBoard);

    } catch (error) {
        next(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //     error: error.message,
        // });
    }

}
const moveCardToDifferentColumn = async (req, res, next) => {
    try {
        const result = await boardService.moveCardToDifferentColumn( req.body);
        res.status(StatusCodes.OK).json(result);

    } catch (error) {
        next(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //     error: error.message,
        // });
    }

}
export const boardController = {
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn
}