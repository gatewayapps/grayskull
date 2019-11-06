import { getContext } from '../../data/context'

type CategoryKeys = 'Server' | 'Security' | 'Mail'

export async function saveStringSetting(key: string, value: string, category: CategoryKeys) {
  const db = await getContext()
  await db.Setting.upsert({ key, value, type: 'String', category })
}

export async function saveNumberSetting(key: string, value: number, category: CategoryKeys) {
  const db = await getContext()
  await db.Setting.upsert({ key, value: value.toString(), type: 'Number', category })
}

export async function saveBooleanSetting(key: string, value: boolean, category: CategoryKeys) {
  const db = await getContext()
  await db.Setting.upsert({ key, value: value.toString(), type: 'Boolean', category })
}

export async function getStringSetting(key: string) {
  const db = await getContext()
  const setting = await db.Setting.findOne({ where: { key, type: 'String' } })
  if (setting) {
    return setting.value
  } else {
    return undefined
  }
}

export async function getNumberSetting(key: string) {
  const db = await getContext()
  const setting = await db.Setting.findOne({ where: { key, type: 'Number' } })
  if (setting) {
    return parseInt(setting.value)
  } else {
    return undefined
  }
}

export async function getBooleanSetting(key: string) {
  const db = await getContext()
  const setting = await db.Setting.findOne({ where: { key, type: 'Boolean' } })
  if (setting) {
    return setting.value.toString() === 'true'
  } else {
    return undefined
  }
}
