import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth"
import base from '../../../lib/back/base_query'
import { LogRequest } from './_helper';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, { /* options */ });
    if (session) {
        LogRequest(__filename, req);
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel('desdobramento', { 'num_seq_desdobramento': req.query.id }))
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels('desdobramento', req.query))
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel('desdobramento', req.body))
        } else if (req.method == 'PUT'){
            res.status(200).json(await base.updateModel('desdobramento',{ 'num_seq_desdobramento': req.body.num_seq_desdobramento },req.body))
        } else if (req.method == 'DELETE'){
            res.status(200).json(await base.deleteModel('desdobramento',{ 'num_seq_desdobramento': req.body.num_seq_desdobramento }))
        }
    } else {
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }
}
