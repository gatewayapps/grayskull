import { getContext } from '../../data/context'
import { ISetting } from '../../data/models/ISetting'
type CategoryKeys = 'Server' | 'Security' | 'Mail'
let settings: ISetting[] = []

export async function refreshSettings() {
  const db = await getContext()
  settings = await db.Setting.findAll()
}

async function getSettingRecord(key: string, type: string) {
  if (settings.length === 0) {
    await refreshSettings()
  }
  return settings.find((s) => s.key === key && s.type === type)
}

export async function saveStringSetting(key: string, value: string, category: CategoryKeys) {
  const db = await getContext()
  await db.Setting.upsert({ key, value, type: 'String', category })
  settings = []
}

export async function saveNumberSetting(key: string, value: number, category: CategoryKeys) {
  const db = await getContext()
  await db.Setting.upsert({ key, value: value.toString(), type: 'Number', category })
  settings = []
}

export async function saveBooleanSetting(key: string, value: boolean, category: CategoryKeys) {
  const db = await getContext()
  await db.Setting.upsert({ key, value: value.toString(), type: 'Boolean', category })
  settings = []
}

export async function getStringSetting(key: string) {
  const setting = await getSettingRecord(key, 'String')
  if (setting) {
    return setting.value
  } else {
    return undefined
  }
}

export async function getNumberSetting(key: string) {
  const setting = await getSettingRecord(key, 'Number')
  if (setting) {
    return parseInt(setting.value)
  } else {
    return undefined
  }
}

export async function getBooleanSetting(key: string) {
  const setting = await getSettingRecord(key, 'Boolean')
  if (setting) {
    return setting.value.toString() === 'true'
  } else {
    return undefined
  }
}
