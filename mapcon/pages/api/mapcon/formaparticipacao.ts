// Importa tipos de requisição e resposta para APIs do Next.js
import type { NextApiRequest, NextApiResponse } from 'next';

// Importa função para obter a sessão do usuário autenticado (next-auth)
import { getServerSession } from "next-auth";

// Importa módulo genérico para operações básicas no banco de dados
import base from '../../../lib/back/base_query';

// Importa função auxiliar para registrar logs detalhados da requisição
import { LogRequest } from './_helper';

// Exporta função padrão que trata as requisições à API
export default async (req: NextApiRequest, res: NextApiResponse) => {
    
    // Busca sessão do usuário para autenticação/validação
    const session = await getServerSession(req, res, { /* options */ });

    // Se houver sessão válida, permite manipulação dos dados
    if (session) {

        // Registra a requisição para fins de log/debug
        LogRequest(__filename, req);

        // Se for método GET com parâmetro 'id', busca um único registro pelo id
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(
                await base.getModel(
                    'forma_participacao',                             // Nome da tabela
                    { 'num_seq_forma_participacao': req.query.id }  // Condição para filtro pelo id
                )
            );

        // Se for GET sem id, retorna lista (possivelmente filtrada)
        } else if (req.method == 'GET') {
            res.status(200).json(
                await base.getModels('forma_participacao', req.query)
            );

        // Se for POST, cria um novo registro com dados do corpo da requisição
        } else if (req.method == 'POST') {
            res.status(200).json(
                await base.addModel('forma_participacao', req.body)
            );

        // Se for PUT, atualiza registro existente identificado pelo id no corpo
        } else if (req.method == 'PUT') {
            res.status(200).json(
                await base.updateModel(
                    'forma_participacao',
                    { 'num_seq_forma_participacao': req.body.num_seq_forma_participacao },
                    req.body
                )
            );

        // Se for DELETE, apaga registro identificado pelo id no corpo da requisição
        } else if (req.method == 'DELETE') {
            console.log(req); // Loga a requisição no console para debug
            res.status(200).json(
                await base.deleteModel(
                    'forma_participacao',
                    { 'num_seq_forma_participacao': req.body.num_seq_forma_participacao }
                )
            );
        }

    } else {
        // Caso não haja sessão, retorna status 401 (não autorizado)
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        });
    }

}
