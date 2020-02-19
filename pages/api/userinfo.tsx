import { NextApiRequest, NextApiResponse } from 'next'
import { getClientRequestOptionsFromRequest } from '../../operations/logic/authentication'
import { ScopeMap } from '../../foundation/constants/scopes'
import { ensureScope } from '../../server/utils/ensureScope'
import { IClientRequestOptions } from '../../foundation/models/IClientRequestOptions'
import { UserAccount } from '../../foundation/models/UserAccount'
import UserAccountRepository from '../../server/data/repositories/UserAccountRepository'
import { prepareContext, IRequestContext } from '../../foundation/context/prepareContext'
import { getUserProfileForClient } from '../../operations/logic/getUserProfileForClient'

async function getUserProfile(clientOptions: IClientRequestOptions, context: IRequestContext) {
  const isClientAuthorized = await ensureScope(ScopeMap.openid.id, context)
  if (!isClientAuthorized) {
    context.res.status(403)
    return
  }

  const profile = getUserProfileForClient(clientOptions.userAccount, clientOptions.client)

  context.res.json(profile)
}

async function postUserProfile(clientOptions: IClientRequestOptions, context: IRequestContext) {
  const isClientAuthorized = await ensureScope(ScopeMap['profile:write'].id, context)
  if (!isClientAuthorized) {
    context.res.status(403)
    return
  }

  try {
    const reqBody: UserAccount = context.req.body as UserAccount
    if (reqBody) {
      const { firstName, lastName, displayName, gender, birthday } = reqBody

      const result = await UserAccountRepository.updateUserAccount(
        {
          userAccountId: clientOptions.userAccount.userAccountId
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
        const response = getUserProfileForClient(clientOptions.userAccount, clientOptions.client)
        context.res.json({ success: true, profile: response })
        return
      } else {
        context.res.json({ success: false, message: 'Something went wrong' })
      }
    }
  } catch (err) {
    context.res.json({ success: false, message: err.message })
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const context = await prepareContext(req, res)

  const clientOptions = await getClientRequestOptionsFromRequest(context)
  switch (req.method) {
    case 'GET': {
      getUserProfile(clientOptions, context)
      break
    }
    case 'POST': {
      postUserProfile(clientOptions, context)
      break
    }
    default: {
      res.status(405).json({ success: false, message: 'Method not allowed' })
    }
  }
}
