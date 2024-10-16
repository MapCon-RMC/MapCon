import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import base from '../../../lib/back/base_query'
import { LogRequest } from './_helper';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (session) {
        LogRequest(__filename, req, session);
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel('categoria_objeto', { 'num_seq_categoria_objeto': req.query.id }))
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels('categoria_objeto', req.query))
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel('categoria_objeto', req.body))
        } else if (req.method == 'PUT'){
            res.status(200).json(await base.updateModel('categoria_objeto',{ 'num_seq_categoria_objeto': req.body.num_seq_categoria_objeto },req.body))
        } else if (req.method == 'DELETE'){
            res.status(200).json(await base.deleteModel('categoria_objeto',{ 'num_seq_categoria_objeto': req.body.num_seq_categoria_objeto }))
        }
    } else {
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }
}
