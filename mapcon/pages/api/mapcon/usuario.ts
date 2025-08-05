import type { NextApiRequest, NextApiResponse } from 'next';
// Importa tipos para as requisições e respostas do Next.js

import base from '../../../lib/back/base_query'
// Importa módulo para operações genéricas de banco (CRUD)

import { LogRequest } from './_helper';
// Importa função para registrar logs das requisições para depuração

import { getServerSession } from "next-auth"
// Importa função para obter a sessão do usuário autenticado via next-auth

var bcrypt = require('bcryptjs');
// Importa biblioteca para hashing de senhas, garantindo segurança

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Função principal da API para tratar requisições HTTP

    const session = await getServerSession(req, res, { /* options */ });
    // Obtém a sessão do usuário para verificar se está autenticado

    if (session) {
        // Se o usuário estiver autenticado, processa a requisição

        LogRequest(__filename, req);
        // Registra no log detalhes da requisição e arquivo fonte

        if (req.method == 'GET' && req.query.id) {
            // GET com id: retorna usuário específico pelo ID
            res.status(200).json(await base.getModel('usuario', { 'num_seq_usuario': req.query.id }))
        } else if (req.method == 'GET') {
            // GET geral: retorna lista de usuários com filtros na query (se houver)
            res.status(200).json(await base.getModels('usuario', req.query))
        } else if (req.method == 'POST') {
            // POST: cria novo usuário
            console.debug('INFO POST', req.body);
            // Gera hash da senha recebida no corpo para salvar no banco
            var hash = bcrypt.hashSync(req.body.usu_senha, 8);
            req.body.usu_senha = hash;
            // Insere o usuário com a senha já criptografada
            res.status(200).json(await base.addModel('usuario', req.body))
        } else if (req.method == 'PUT'){
            // PUT: atualiza usuário existente
            console.debug('INFO PUT', req.body);
            // Gera hash da nova senha para atualizar no banco
            var hash = bcrypt.hashSync(req.body.usu_senha, 8);
            req.body.usu_senha = hash;
            // Atualiza o usuário identificado pelo num_seq_usuario
            res.status(200).json(await base.updateModel('usuario',{ 'num_seq_usuario': req.body.num_seq_usuario },req.body))
        } else if (req.method == 'DELETE'){
            // DELETE: remove usuário identificado pelo num_seq_usuario
            console.log(req);
            res.status(200).json(await base.deleteModel('usuario',{ 'num_seq_usuario': req.body.num_seq_usuario }))
        }
    } else {
        // Se não autenticado, retorna erro 401 (não autorizado)
        res.status(401).json({ "Acesso Negado": "Você não possui permissão para acessar esses dados." })
    }

}
