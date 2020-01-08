import { NextApiRequest, NextApiResponse } from 'next'
import { getClientRequestOptionsFromRequest } from '../../../../server/utils/authentication'
import UserClientService from '../../../../server/api/services/UserClientService'
import { ScopeMap } from '../../../../server/api/services/ScopeService'
import { UserAccount } from '../../../../server/data/models/UserAccount'
import UserAccountRepository from '../../../../server/data/repositories/UserAccountRepository'
import TokenService from '../../../../server/api/services/TokenService'
import { Permissions } from '../../../../server/utils/permissions'
import { ensureScope } from '../../../../server/utils/ensureScope'
import { prepareContext } from '../../../../context/prepareContext'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const context = await prepareContext(req, res)
  const requestContext = context.req

  const fullPath = requestContext.parsedUrl.pathname
  const targetUserAccountId = fullPath.replace('/users/', '').replace('/userinfo', '')
  if (!targetUserAccountId) {
    res.json({ success: false, message: 'Missing user account id' })
    return
  }

  const clientOptions = await getClientRequestOptionsFromRequest(requestContext)

  const isClientAuthorized = await ensureScope(ScopeMap['admin-profile:write'].id, requestContext)
  if (!isClientAuthorized) {
    res.status(403)
    return
  }

  if (clientOptions.userAccount.permissions! >= Permissions.Admin) {
    try {
      // Get the calling user's user client to check permissions
      const callingUserClient = await UserClientService.getUserClient(
        { client_id: clientOptions.client.client_id, userAccountId: clientOptions.userAccount.userAccountId },
        { userContext: clientOptions.userAccount }
      )

      // Has the calling user granted admin-profile:write to the calling client
      if (
        callingUserClient &&
        UserClientService.UserClientHasAllowedScope(callingUserClient, ScopeMap['admin-profile:write'].id)
      ) {
        const reqBody: UserAccount = req.body as UserAccount

        if (reqBody) {
          const { firstName, lastName, displayName, gender, birthday } = reqBody

          // We need to get the UserClient for the target user
          const targetUserClient = await UserClientService.getUserClient(
            { client_id: clientOptions.client.client_id, userClientId: targetUserAccountId },
            { userContext: clientOptions.userAccount }
          )

          // Has the target user authorized the target client
          if (targetUserClient) {
            const result = await UserAccountRepository.updateUserAccount(
              {
                userAccountId: targetUserClient.userAccountId
              },
              {
                firstName,
                lastName,
                displayName,
                gender,
                birthday
              },
              { userContext: clientOptions.userAccount }
            )

            if (result) {
              const response = await TokenService.getUserProfileForClient(
                clientOptions.client,
                clientOptions.userAccount,
                { userContext: clientOptions.userAccount }
              )
              res.json({ success: true, profile: response })
              return
            } else {
              res.json({ success: false, message: 'Something went wrong' })
            }
          } else {
            res.json({ success: false, message: 'Unable to find a user with that id' })
          }
        }
      } else {
        res.json({ success: false, message: 'Not authorized' })
      }
    } catch (err) {
      res.json({ success: false, message: err.message })
    }
  } else {
    res.json({ succes: false, message: 'You must be an administrator to do that' })
  }
}
