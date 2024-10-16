import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import base from '../../../lib/back/base_query'
import { LogRequest } from './_helper';
import db from '../../../lib/back/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (session) {
        LogRequest(__filename, req, session);
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel('geolocalizacao', { 'num_seq_geolocalizacao': req.query.id }))
        } else if (req.method == 'GET' && req.query.protesto_num_seq_protesto) {
            res.status(200).json(await db('geolocalizacao').where( {'protesto_num_seq_protesto': req.query.protesto_num_seq_protesto}).first())   
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels('geolocalizacao', req.query))
        } else if (req.method == 'POST') {
            // Verifica se já foi marcado
            const marked = await db('geolocalizacao').where( {'protesto_num_seq_protesto': req.body.protesto_num_seq_protesto}).first()
         
            if(marked){ // Atualizar
                res.status(200).json(await base.updateModel('geolocalizacao',{ 'num_seq_geolocalizacao': marked.num_seq_geolocalizacao },req.body))
            }else{ // Inserir
                res.status(200).json(await base.addModel('geolocalizacao', req.body))
            }

        } else if (req.method == 'DELETE'){
            res.status(200).json(await base.deleteModel('geolocalizacao',{ 'num_seq_geolocalizacao': req.body.num_seq_geolocalizacao }))
        }

    } else {
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }

}
