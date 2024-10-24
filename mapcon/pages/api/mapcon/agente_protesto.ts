import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth"
import base from '../../../lib/back/base_query'
import { LogRequest } from './_helper';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, { /* options */ });
    if (session) {
        LogRequest(__filename, req);
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel('agente_protesto', { 'num_seq_agente_protesto': req.query.id }))
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels('agente_protesto', req.query,'INNER JOIN categoria_agente ON agente_protesto.categoria_agente_num_seq_categoria_agente = categoria_agente.num_seq_categoria_agente'))
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel('agente_protesto', req.body))
        } else if (req.method == 'PUT'){
            res.status(200).json(await base.updateModel('agente_protesto',{ 'num_seq_agente_protesto': req.body.num_seq_agente_protesto },req.body))
        } else if (req.method == 'DELETE'){
            res.status(200).json(await base.deleteModel('agente_protesto',{ 'num_seq_agente_protesto': req.body.num_seq_agente_protesto }))
        }
    } else {
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }

}
