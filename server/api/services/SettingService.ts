import { getContext } from '../../data/context'
import { DataContext } from '../../../context/getDataContext'
import { Setting } from '../../data/models/Setting'
type CategoryKeys = 'Server' | 'Security' | 'Mail'

const settings: Setting[] = []

export async function refreshSettings(db: DataContext) {
  const settingRecords = await db.Setting.findAll()
  settings.splice(0, settings.length)
  settings.push(...settingRecords)
}

export async function saveStringSetting(db: DataContext, key: string, value: string, category: CategoryKeys) {
  await db.Setting.upsert({ key, value, type: 'String', category, createdAt: new Date(), updatedAt: new Date() })
}

export async function saveNumberSetting(db: DataContext, key: string, value: number, category: CategoryKeys) {
  await db.Setting.upsert({ key, value, type: 'Number', category, createdAt: new Date(), updatedAt: new Date() })
}

export async function saveBooleanSetting(db: DataContext, key: string, value: boolean, category: CategoryKeys) {
  await db.Setting.upsert({
    key,
    value: value.toString(),
    type: 'Boolean',
    category,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

class SettingsService {
  private settings: Setting[] = []

  public async refreshSettings() {
    this.settings = []
    const db = await getContext()
    this.settings = await Setting.findAll()
  }

  private async getSettingRecord(key: string, type: string) {
    const foundSetting = this.settings.find((s) => s.key === key && s.type === type)

    if (!foundSetting) {
      await this.refreshSettings()
    }

    return this.settings.find((s) => s.key === key && s.type === type)
  }

  public async saveStringSetting(key: string, value: string, category: CategoryKeys) {
    await Setting.upsert({ key, value, type: 'String', category, createdAt: new Date(), updatedAt: new Date() })

    this.settings = []
  }

  public async saveNumberSetting(key: string, value: number, category: CategoryKeys) {
    await Setting.upsert({
      key,
      value: value.toString(),
      type: 'Number',
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    this.settings = []
  }

  public async saveBooleanSetting(key: string, value: boolean, category: CategoryKeys) {
    await Setting.upsert({
      key,
      value: value.toString(),
      type: 'Boolean',
      category,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    this.settings = []
  }

  public async getStringSetting(key: string) {
    const setting = await this.getSettingRecord(key, 'String')
    if (setting) {
      return setting.value
    } else {
      return undefined
    }
  }

  public async getNumberSetting(key: string) {
    const setting = await this.getSettingRecord(key, 'Number')
    if (setting) {
      return parseInt(setting.value)
    } else {
      return undefined
    }
  }

  public async getBooleanSetting(key: string) {
    const setting = await this.getSettingRecord(key, 'Boolean')
    if (setting) {
      return setting.value.toString() === 'true'
    } else {
      return undefined
    }
  }
}

export default new SettingsService()
