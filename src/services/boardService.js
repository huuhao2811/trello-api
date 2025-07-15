import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel.js";
import { columnModel } from "~/models/columnModel.js";
import { cardModel } from "~/models/cardModel.js";
import ApiError from "~/utils/ApiError.js";
import { slugify } from "~/utils/formatters.js";
const createNew = async (reqBody) => {
    try {
        // Simulating board creation logic
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }
        const createdBoard = await boardModel.createNew(newBoard);
        const getNewBoard = await boardModel.findOnebyId(createdBoard.insertedId);
        
        return getNewBoard;
    } catch (error) {
        throw error
    }

}
const getDetails = async (boardId) => {
    try {
        // Simulating board creation logic
        const board = await boardModel.getDetails(boardId)
        if(!board) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!');
        }
        const resBoard = {...board}
        resBoard.columns.forEach(column => {
            column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
        })
        delete resBoard.cards
        return resBoard;
    } catch (error) {
        throw error
    }

}
const update = async (boardId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now(),
        }
        const updatedBoard = await boardModel.update(boardId, updateData)
        return updatedBoard;
    } catch (error) {
        throw error
    }

}
const moveCardToDifferentColumn = async (reqBody) => {
    try {
        await columnModel.update(reqBody.prevColumnId, {
            cardOrderIds: reqBody.prevCardOrderIds,
            updatedAt: Date.now()
        })
        await columnModel.update(reqBody.nextColumnId, {
            cardOrderIds: reqBody.nextCardOrderIds,
            updatedAt: Date.now()
        })
        await cardModel.update(reqBody.currentCardId, {
            columnId: reqBody.nextColumnId
        })
        return {updatedResult: "Successfully"}
    } catch (error) {
        throw error
    }

}
export const boardService = {
    createNew,
    getDetails,
    update,
    moveCardToDifferentColumn
}