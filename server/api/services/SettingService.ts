import { DataContext } from '../../../context/getDataContext'

type CategoryKeys = 'Server' | 'Security' | 'Mail'

export async function saveStringSetting(key: string, value: string, category: CategoryKeys, dataContext: DataContext) {
  await dataContext.Setting.upsert({
    key,
    value,
    type: 'String',
    category,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

export async function saveNumberSetting(key: string, value: number, category: CategoryKeys, dataContext: DataContext) {
  await dataContext.Setting.upsert({
    key,
    value: value.toString(),
    type: 'Number',
    category,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

export async function saveBooleanSetting(
  key: string,
  value: boolean,
  category: CategoryKeys,
  dataContext: DataContext
) {
  await dataContext.Setting.upsert({
    key,
    value: value.toString(),
    type: 'Boolean',
    category,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}
