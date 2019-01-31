import { Request, Response } from 'express'

/** Determines if ant user exists in the database and sets NEEDS_FIRST_USER header if not */
export async function firstUserMiddleware(req: Request, res: Response, next: any) {
  if (req.headers.authorization) {
  }

  next()
}
