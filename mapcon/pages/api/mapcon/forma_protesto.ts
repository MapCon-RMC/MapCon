// Importa os tipos de requisição e resposta do Next.js
import type { NextApiRequest, NextApiResponse } from 'next';

// Importa a função para obter a sessão do usuário autenticado via next-auth
import { getServerSession } from "next-auth";

// Importa funções genéricas para operações no banco de dados
import base from '../../../lib/back/base_query';

// Importa função auxiliar para registrar logs da requisição
import { LogRequest } from './_helper';

// Exporta o handler padrão da API para manipulação da entidade 'forma_protesto'
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // Obtém a sessão do usuário autenticado a partir da requisição e resposta
    const session = await getServerSession(req, res, { /* options */ });

    // Verifica se o usuário está autenticado
    if (session) {

        // Registra a requisição no log para auditoria e debug
        LogRequest(__filename, req);

        // Verifica qual método HTTP está sendo utilizado na requisição

        // Caso seja GET com query param 'id', busca um único registro de 'forma_protesto' pelo ID
        if (req.method == 'GET' && req.query.id) {
            res.status(200).json(await base.getModel(
                'forma_protesto',                            // Nome da tabela
                { 'num_seq_forma_protesto': req.query.id } // Condição para busca pelo ID
            ));

        // Caso seja GET sem 'id', retorna uma lista (possivelmente filtrada) de registros
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels(
                'forma_protesto',   // Nome da tabela
                req.query           // Filtros opcionais passados via query string
            ));

        // Caso seja POST, adiciona um novo registro com os dados enviados no corpo da requisição
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel(
                'forma_protesto',  // Nome da tabela
                req.body           // Dados do novo registro
            ));

        // Caso seja PUT, atualiza um registro existente identificado pelo ID enviado no corpo
        } else if (req.method == 'PUT') {
            res.status(200).json(await base.updateModel(
                'forma_protesto',                                     // Nome da tabela
                { 'num_seq_forma_protesto': req.body.num_seq_forma_protesto }, // Condição para atualização
                req.body                                             // Novos dados
            ));

        // Caso seja DELETE, exclui o registro identificado pelo ID no corpo da requisição
        } else if (req.method == 'DELETE') {
            res.status(200).json(await base.deleteModel(
                'forma_protesto',                                     // Nome da tabela
                { 'num_seq_forma_protesto': req.body.num_seq_forma_protesto }  // Condição para exclusão
            ));
        }

    // Se o usuário não estiver autenticado, retorna status 401 com mensagem de acesso negado
    } else {
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        });
    }
}
