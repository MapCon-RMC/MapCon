// Importa os tipos do Next.js para a requisição e resposta da API
import type { NextApiRequest, NextApiResponse } from 'next';

// Importa o método para recuperar a sessão do usuário logado
import { getServerSession } from "next-auth"

// Importa funções genéricas de CRUD (create, read, update, delete) para banco de dados
import base from '../../../lib/back/base_query'

// Importa função auxiliar para logar requisições recebidas, com detalhes formatados
import { LogRequest } from './_helper';

// Função principal da rota da API, exportada como padrão
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // Recupera a sessão do usuário (verifica se ele está autenticado)
    const session = await getServerSession(req, res, { /* options */ });

    // Se o usuário está autenticado...
    if (session) {

        // Loga a requisição no console para depuração
        LogRequest(__filename, req);

        // Se for uma requisição GET com um ID específico na query string
        if (req.method == 'GET' && req.query.id) {
            // Retorna apenas o registro correspondente ao ID fornecido
            res.status(200).json(await base.getModel(
                'agente_protesto',
                { 'num_seq_agente_protesto': req.query.id }
            ))

        // Se for uma requisição GET **sem ID**, retorna todos os registros com JOIN
        } else if (req.method == 'GET') {
            res.status(200).json(await base.getModels(
                'agente_protesto',
                req.query, // pode conter filtros ou paginação
                'INNER JOIN categoria_agente ON agente_protesto.categoria_agente_num_seq_categoria_agente = categoria_agente.num_seq_categoria_agente' // faz JOIN para trazer nome da categoria do agente
            ))

        // Se for uma requisição POST, adiciona um novo agente_protesto
        } else if (req.method == 'POST') {
            res.status(200).json(await base.addModel(
                'agente_protesto',
                req.body // dados do novo registro
            ))

        // Se for uma requisição PUT, atualiza um agente existente
        } else if (req.method == 'PUT') {
            res.status(200).json(await base.updateModel(
                'agente_protesto',
                { 'num_seq_agente_protesto': req.body.num_seq_agente_protesto }, // condição de onde atualizar
                req.body // novos dados
            ))

        // Se for uma requisição DELETE, remove o agente
        } else if (req.method == 'DELETE') {
            res.status(200).json(await base.deleteModel(
                'agente_protesto',
                { 'num_seq_agente_protesto': req.body.num_seq_agente_protesto } // critério para remoção
            ))
        }

    // Se o usuário não estiver autenticado, retorna erro 401 (não autorizado)
    } else {
        res.status(401).json({
            "Acesso Negado": "Você não possui permissão para acessar esses dados."
        })
    }

}
