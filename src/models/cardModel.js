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
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'boardId']
const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {abortEarly: false})
}
const findOnebyId = async (id) => {
  try {
      const board = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
      return board;
  }
  catch (error) {
      throw new Error(error);
  }
}
const createNew = async (data) => {
  try {
      const validData = await validateBeforeCreate(data);
      const newCardToAdd = {
        ...validData,
        boardId: new ObjectId(validData.boardId),
        columnId: new ObjectId(validData.columnId)
      }
      const createdCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(newCardToAdd)
      return createdCard;
  }
  catch (error) {
      throw new Error(error);
  }
}
const update = async (cardId, updateData) => {
  try {
      Object.keys(updateData).forEach(fieldName => {
          if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
              delete updateData[fieldName]
          }
      })
      if (updateData.columnId) {
          updateData.columnId = new ObjectId(updateData.columnId)
      }
      const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
          { _id: new ObjectId(cardId) },
          { $set: updateData},
          { ReturnDocument: 'after' }
      )
      return result
  }
  catch (error) {
      throw new Error(error);
  }
}
const deleteManyByColumnId = async (columnId) => {
  try {
      const board = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({ columnId: new ObjectId(columnId) });
      return board;
  }
  catch (error) {
      throw new Error(error);
  }
}
export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew, 
  findOnebyId,
  update,
  deleteManyByColumnId
}