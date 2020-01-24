import { NextApiRequest, NextApiResponse } from 'next'
import { prepareContext } from '../../context/prepareContext'

import { backup } from '../../services/backup/backup'
import { getValue } from '../../services/persistentCache/getValue'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const context = await prepareContext(req, res)

  if (!req.query.code) {
    res.status(404)
    return
  } else {
    const code = req.query.code
    const cachedCode = await getValue('BACKUP_DOWNLOAD_CODE', context.dataContext)

    if (code !== cachedCode) {
      res.status(403)
      return
    }

    const encryptedBackup = await backup(context.dataContext)
    res.status(200)
    res.setHeader('Content-Disposition', 'attachment; filename="backup.gsb"')
    res.setHeader('Content-Type', 'application/octet-stream; charset=utf-8')
    res.send(encryptedBackup)
  }
}
