import type { NextApiRequest, NextApiResponse } from 'next';
import base from '../../../lib/back/base_query'
import { getServerSession } from 'next-auth/next';
// import { getSession } from 'next-auth/react';
var bcrypt = require('bcryptjs');


export default async (req: NextApiRequest, res: NextApiResponse) => {
    // const session = await getSession({ req });
    const session = await getServerSession(req , res, {});
    console.debug('session ts api', session);
    if (session) {
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel('usuario', { 'num_seq_usuario': req.query.id }))
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels('usuario', req.query))
        } else if (req.method == 'POST') {
            console.debug('INFO POST', req.body);
            var hash = bcrypt.hashSync(req.body.usu_senha, 8);
            req.body.usu_senha = hash
            res.status(200).json(await base.addModel('usuario', req.body))
        } else if (req.method == 'PUT'){
            console.debug('INFO PUT', req.body);
            var hash = bcrypt.hashSync(req.body.usu_senha, 8);
            req.body.usu_senha = hash
            res.status(200).json(await base.updateModel('usuario',{ 'num_seq_usuario': req.body.num_seq_usuario },req.body))
        } else if (req.method == 'DELETE'){
            console.log(req)
            res.status(200).json(await base.deleteModel('usuario',{ 'num_seq_usuario': req.body.num_seq_usuario }))
        }
    } else {
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }

}