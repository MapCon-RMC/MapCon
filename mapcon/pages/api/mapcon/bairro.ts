import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth"
import base from '../../../lib/back/base_query'
import { LogRequest } from './_helper';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, { /* options */ });
    if (session) {
        LogRequest(__filename, req);
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel('bairro', { 'num_seq_bairro': req.query.id }))
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels('bairro', req.query,'INNER JOIN cidade ON bairro.cidade_num_seq_cidade = cidade.num_seq_cidade'))
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel('bairro', req.body))
        } else if (req.method == 'PUT'){
            res.status(200).json(await base.updateModel('bairro',{ 'num_seq_bairro': req.body.num_seq_bairro },req.body))
        } else if (req.method == 'DELETE'){
            res.status(200).json(await base.deleteModel('bairro',{ 'num_seq_bairro': req.body.num_seq_bairro }))
        }
    } else {
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }
}
