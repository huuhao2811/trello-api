import { boardModel } from "~/models/boardModel.js";
import { columnModel } from "~/models/columnModel.js";
import { cardModel } from "~/models/cardModel.js";
const createNew = async (reqBody) => {
    try {
        const newColumn = {
            ...reqBody
        }
        const createdColumn = await columnModel.createNew(newColumn);
        const getNewColumn = await columnModel.findOnebyId(createdColumn.insertedId);
        
        if (getNewColumn){
            getNewColumn.cards = []
            await boardModel.pushColumnOrderIds(getNewColumn)
        }

        return getNewColumn;
    } catch (error) {
        throw error
    }
}
const update = async (columnId, reqBody) => {
    try {
        const updateData = {
            ...reqBody,
            updatedAt: Date.now(),
        }
        const updatedColumn = await columnModel.update(columnId, updateData)
        return updatedColumn;
    } catch (error) {
        throw error
    }

}
const deleteItem = async (columnId) => {
    try {
        const targetColumn = await columnModel.findOnebyId(columnId);
        if (!targetColumn) {
            throw new Error('Column not found');
        }
        await columnModel.deleteOnebyId(columnId);
        await cardModel.deleteManyByColumnId(columnId);
        await boardModel.pullColumnOrderIds(targetColumn);
        return { deleteResult: 'Column deleted successfully' }
    } catch (error) {
        throw error
    }

}
export const columnService = {
    createNew,
    update,
    deleteItem
}