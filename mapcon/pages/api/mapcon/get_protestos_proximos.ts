import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import db from '../../../lib/back/db';
import { LogRequest } from './_helper';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (session) {
        LogRequest(__filename, req, session);
        if (req.method == 'GET' && req.query.data) {
            const query = await db.raw("SELECT num_seq_protesto,to_char(data_protesto,'DD/MM/YYYY') as data_protesto, tema_protesto FROM protesto ORDER BY ABS(data_protesto::date - TO_DATE(?,'YYYY-MM-DD')) LIMIT 10;", [req.query.data]);
            res.status(200).json(query.rows)
        }
    } else {
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }

}
