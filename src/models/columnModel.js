/**
 * Updated by trungquandev.com's author on Oct 8 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'
import {GET_DB} from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'
// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'boardId']
const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, {abortEarly: false})
}
const findOnebyId = async (id) => {
  try {
      const board = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
      return board;
  }
  catch (error) {
      throw new Error(error);
  }
}
const createNew = async (data) => {
  try {
      const validData = await validateBeforeCreate(data);
      const newColumnToAdd = {
        ...validData,
        boardId: new ObjectId(validData.boardId)
      }
      const createdColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnToAdd)
      return createdColumn;
  }
  catch (error) {
      throw new Error(error);
  }
}
const pushCardOrderIds = async (card) => {
  try {
      const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
          { _id: new ObjectId(card.columnId) },
          { $push: { cardOrderIds: new ObjectId(card._id )}},
          { ReturnDocument: 'after' }
      )
      return result
  }
  catch (error) {
      throw new Error(error);
  }
}
const update = async (columnId, updateData) => {
  try {
      Object.keys(updateData).forEach(fieldName => {
          if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
              delete updateData[fieldName]
          }
      })
      if (updateData.cardOrderIds) {
          updateData.cardOrderIds = updateData.cardOrderIds.map(id => new ObjectId(id))
      }
      const result = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
          { _id: new ObjectId(columnId) },
          { $set: updateData},
          { ReturnDocument: 'after' }
      )
      return result
  }
  catch (error) {
      throw new Error(error);
  }
}
const deleteOnebyId = async (columnId) => {
  try {
      const board = await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: new ObjectId(columnId) });
      return board;
  }
  catch (error) {
      throw new Error(error);
  }
}
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  findOnebyId,
  createNew,
  pushCardOrderIds,
  update,
  deleteOnebyId
}
