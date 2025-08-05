// Tipagem para as requisições e respostas da API do Next.js
import type { NextApiRequest, NextApiResponse } from 'next';

// Importa função para obter a sessão do usuário logado com next-auth
import { getServerSession } from "next-auth"

// Importa funções de acesso genérico ao banco de dados (CRUD)
import base from '../../../lib/back/base_query'

// Importa função auxiliar para log detalhado da requisição recebida
import { LogRequest } from './_helper';

// Exporta a função padrão que trata as requisições da rota de categoria_objeto
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // Obtém a sessão atual do usuário (verifica se está autenticado)
    const session = await getServerSession(req, res, { /* options */ });

    // Se o usuário estiver autenticado, executa o código principal
    if (session) {

        // Exibe detalhes da requisição no console para fins de auditoria
        LogRequest(__filename, req);

        // Se for uma requisição GET com parâmetro "id", busca uma categoria de objeto específica
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel(
                'categoria_objeto',                                 // Nome da tabela
                { 'num_seq_categoria_objeto': req.query.id }        // Filtro pelo ID
            ))

        // Se for uma requisição GET sem "id", lista todas as categorias de objeto
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels(
                'categoria_objeto',  // Nome da tabela
                req.query            // Filtros opcionais
            ))

        // Se for uma requisição POST, insere uma nova categoria de objeto no banco
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel(
                'categoria_objeto',  // Nome da tabela
                req.body             // Dados enviados no corpo da requisição
            ))

        // Se for uma requisição PUT, atualiza uma categoria de objeto existente
        } else if (req.method == 'PUT') {
            res.status(200).json(await base.updateModel(
                'categoria_objeto',                                            // Nome da tabela
                { 'num_seq_categoria_objeto': req.body.num_seq_categoria_objeto }, // Filtro pelo ID
                req.body                                                       // Novos dados
            ))

        // Se for uma requisição DELETE, remove uma categoria de objeto específica
        } else if (req.method == 'DELETE') {
            res.status(200).json(await base.deleteModel(
                'categoria_objeto',                                            // Nome da tabela
                { 'num_seq_categoria_objeto': req.body.num_seq_categoria_objeto } // Filtro pelo ID
            ))
        }

    // Se o usuário **não** estiver autenticado, bloqueia o acesso com status 401
    } else {
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        })
    }
}
