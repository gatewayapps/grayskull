import { DataContext } from '../../../foundation/context/getDataContext'

export async function setUserAccountActive(userAccountId: string, isActive = true, dataContext: DataContext) {
	await dataContext.UserAccount.update({ isActive }, { where: { userAccountId }, validate: false })
}
