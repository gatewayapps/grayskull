import { getContext } from '../../data/context'
import { Setting } from '../../data/models/ISetting'
type CategoryKeys = 'Server' | 'Security' | 'Mail'

let settings: Setting[] = []


class SettingsService {
  private settings: Setting[] = []

  public async refreshSettings() {
    this.settings = []
    const db = await getContext()
    this.settings = await Setting.findAll()
  }

  private async  getSettingRecord(key: string, type: string) {

    const foundSetting = this.settings.find((s) => s.key === key && s.type === type)

    if (!foundSetting) {
      await this.refreshSettings()
    }

    return this.settings.find((s) => s.key === key && s.type === type)
  }

  public async  saveStringSetting(key: string, value: string, category: CategoryKeys) {
    await getContext()
    await Setting.upsert({ key, value, type: 'String', category })

    this.settings = []
  }

  public async  saveNumberSetting(key: string, value: number, category: CategoryKeys) {
    await getContext()
    await Setting.upsert({ key, value: value.toString(), type: 'Number', category })
    this.settings = []
  }

  public async  saveBooleanSetting(key: string, value: boolean, category: CategoryKeys) {
    const db = await getContext()
    await Setting.upsert({ key, value: value.toString(), type: 'Boolean', category })
    this.settings.splice(0, settings.length)
    this.settings = []
  }

  public async  getStringSetting(key: string) {
    const setting = await this.getSettingRecord(key, 'String')
    if (setting) {
      return setting.value
    } else {
      return undefined
    }
  }

  public async  getNumberSetting(key: string) {
    const setting = await this.getSettingRecord(key, 'Number')
    if (setting) {
      return parseInt(setting.value)
    } else {
      return undefined
    }
  }

  public async  getBooleanSetting(key: string) {
    const setting = await this.getSettingRecord(key, 'Boolean')
    if (setting) {
      return setting.value.toString() === 'true'
    } else {
      return undefined
    }
  }
}

export default new SettingsService()



