import type { NextApiRequest, NextApiResponse } from 'next';
import base from '../../../lib/back/base_query'
import { LogRequest } from './_helper';
import { getServerSession } from "next-auth"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, { /* options */ });
    if (session) {
        LogRequest(__filename, req);
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel('crawling.crawling_news', { 'url': req.query.id }))
        } else if (req.method == 'GET') {     
            res.status(200).json(await base.getModels('crawling.crawling_news', req.query))
        } else if (req.method == 'PUT'){
            res.status(200).json(await base.updateModel('crawling.crawling_news',{ 'url': req.body.url },req.body))
        } else if (req.method == 'DELETE'){
            res.status(200).json(await base.deleteModel('crawling.crawling_news',{ 'url': req.body.url }))
        }
    } else {
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }
}
