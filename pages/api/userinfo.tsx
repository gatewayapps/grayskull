import TokenService from '../../server/api/services/TokenService'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildContext, getClientRequestOptionsFromRequest, RequestContext } from '../../server/utils/authentication'
import { ScopeMap } from '../../server/api/services/ScopeService'
import { ensureScope } from '../../server/utils/ensureScope'
import { IClientRequestOptions } from '../../server/data/IClientRequestOptions'
import { UserAccount } from '../../server/data/models/IUserAccount'
import UserAccountRepository from '../../server/data/repositories/UserAccountRepository'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { requestContext } = await buildContext(req, res)
  const clientOptions = await getClientRequestOptionsFromRequest(requestContext)
  switch (req.method) {
    case 'GET': {
      getUserProfile(clientOptions, requestContext, res)
      break
    }
    case 'POST': {
      postUserProfile(clientOptions, requestContext, res)
      break
    }
    default: {
      res.status(405).json({ success: false, message: 'Method not allowed' })
    }
  }
}

async function getUserProfile(
  clientOptions: IClientRequestOptions,
  requestContext: RequestContext,
  res: NextApiResponse
) {
  const isClientAuthorized = await ensureScope(ScopeMap.openid.id, requestContext)
  if (!isClientAuthorized) {
    res.status(403)
    return
  }

  const profile = await TokenService.getUserProfileForClient(clientOptions.client, clientOptions.userAccount, {
    userContext: clientOptions.userAccount
  })
  res.json(profile)
}

async function postUserProfile(
  clientOptions: IClientRequestOptions,
  requestContext: RequestContext,
  res: NextApiResponse
) {
  const isClientAuthorized = await ensureScope(ScopeMap['profile:write'].id, requestContext)
  if (!isClientAuthorized) {
    res.status(403)
    return
  }

  try {
    const reqBody: UserAccount = requestContext.body as UserAccount
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
        const response = await TokenService.getUserProfileForClient(clientOptions.client, clientOptions.userAccount, {
          userContext: clientOptions.userAccount
        })
        res.json({ success: true, profile: response })
        return
      } else {
        res.json({ success: false, message: 'Something went wrong' })
      }
    }
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
