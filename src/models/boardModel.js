/**
 * Updated by trungquandev.com's author on Oct 8 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import {GET_DB} from '~/config/mongodb.js'
import {BOARD_TYPES} from '~/utils/constants.js';
import {columnModel} from '~/models/columnModel.js'
import {cardModel} from '~/models/cardModel.js'
// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const validateBeforeCreate = async (data) => {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {abortEarly: false})
}
const findOnebyId = async (id) => {
    try {
        const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
        return board;
    }
    catch (error) {
        throw new Error(error);
    }
}
const createNew = async (data) => {
    try {
        const validData = await validateBeforeCreate(data);
        const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
        return createdBoard;
    }
    catch (error) {
        throw new Error(error);
    }
}
const getDetails = async (id) => {
    try {
        //const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
        const board = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
           { $match: {
            _id: new ObjectId(id),
            _destroy: false
           } },
           { $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
           }
           },
           { $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
           }
           }
        ]).toArray()
        console.log(board)
        return board[0] || null
    }
    catch (error) {
        throw new Error(error);
    }
}
const pushColumnOrderIds = async (column) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(column.boardId) },
            { $push: { columnOrderIds: new ObjectId(column._id )}},
            { ReturnDocument: 'after' }
        )
        return result
    }
    catch (error) {
        throw new Error(error);
    }
}
const update = async (boardId, updateData) => {
    try {
        Object.keys(updateData).forEach(fieldName => {
            if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
                delete updateData[fieldName]
            }
        })
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(boardId) },
            { $set: updateData},
            { ReturnDocument: 'after' }
        )
        return result
    }
    catch (error) {
        throw new Error(error);
    }
}
const pullColumnOrderIds = async (column) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(column.boardId) },
            { $pull: { columnOrderIds: new ObjectId(column._id )}},
            { ReturnDocument: 'after' }
        )
        return result
    }
    catch (error) {
        throw new Error(error);
    }
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  findOnebyId,
  getDetails,
  createNew,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds
}