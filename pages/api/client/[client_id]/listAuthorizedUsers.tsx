import { NextApiResponse, NextApiRequest } from "next";
import {prepareClientContext} from '../../../../foundation/context/prepareClientContext'
export default async (req: NextApiRequest, res: NextApiResponse) {
  const context = await prepareClientContext(req, res)
    
}
