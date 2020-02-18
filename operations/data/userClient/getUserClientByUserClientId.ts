import { DataContext } from '../../../foundation/context/getDataContext'

export async function getUserClientByUserClientId(userClientId: string, context: DataContext) {
  return context.UserClient.findOne({ where: { userClientId } })
}
