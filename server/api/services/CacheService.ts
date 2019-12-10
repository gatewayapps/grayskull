import { KeyValueCache } from "../../data/models/IKeyValueCache"
import Sequelize from "sequelize"
import { decrypt, encrypt } from "../../utils/cipher"
import moment from "moment"

export const getValueFromCache = async (key: string, encrypted = false) => {
  await deleteExpiredFromCache()

  const record = await KeyValueCache.findOne({ where: { key } })
  if (record) {
    const resultObject: any = record.toJSON()
    if (encrypted) {

      return decrypt(resultObject.value)
    } else {
      return resultObject.value
    }
  } else {
    return undefined
  }
}

export const cacheValue = async (key: string, value: string, ttlSeconds: number, encrypted = false) => {
  await deleteExpiredFromCache()
  await deleteFromCache(key)
  const expires = moment().add(ttlSeconds, 'second').toDate()

  const newRecord = new KeyValueCache({
    key,
    expires,
    value: encrypted ? encrypt(value) : value
  })

  await newRecord.save()

}

export const deleteFromCache = async (key: string) => {
  await KeyValueCache.destroy({
    where: {
      key
    }
  })
}

const deleteExpiredFromCache = async () => {
  await KeyValueCache.destroy({
    where: {
      expires: {
        [Sequelize.Op.lte]: new Date()
      }

    }
  })
}
