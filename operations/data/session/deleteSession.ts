import { DataContext } from '../../../foundation/context/getDataContext'
export async function deleteSession(sessionId: string, dataContext: DataContext) {
  await dataContext.Session.destroy({ where: { sessionId }, force: true })
}
