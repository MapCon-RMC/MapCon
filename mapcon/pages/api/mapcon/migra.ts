import type { NextApiRequest, NextApiResponse } from "next";
// Importa os tipos de requisição e resposta do Next.js

import { getServerSession } from "next-auth"
// Importa a função para obter a sessão do usuário autenticado

import db from "../../../lib/back/db";
// Importa a conexão com o banco de dados (usando query builder knex)

import { v1 as uuidv1 } from "uuid";
// Importa a função para gerar UUID versão 1 (baseado em timestamp e MAC)

import { exec } from "child_process";
// Importa exec para executar comandos externos no sistema

import { LogRequest } from './_helper';
// Importa função para logar as requisições

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // Pega a sessão do usuário (para autenticação)
    const session = await getServerSession(req, res, { /* options */ });

    if (session) { // Se usuário autenticado
        LogRequest(__filename, req); // Loga os detalhes da requisição

        if (req.body.is_protesto) {
            // Se o corpo da requisição indica que é um protesto...

            // Atualiza a tabela crawling_news, marcando o campo 'tipo' como true para a url
            await db("crawling.crawling_news")
                .where({ url: req.body.url })
                .update({ tipo: true });

            // Gera um nome único para o arquivo do screenshot
            const img_name = uuidv1();

            // Inicializa flag para indicar se o screenshot foi criado com sucesso
            let add_screenshot = true;

            // Comando que vai executar um script node para tirar o screenshot da URL
            const command = `node screenshot.js ${req.body.url} ${img_name}`;

            // Executa o comando para tirar o screenshot
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    // Se der erro ao executar o screenshot, exibe no console
                    console.error(`Erro ao tirar screenshot: ${error.message}`);
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);

                    // Marca que não será possível adicionar o screenshot
                    add_screenshot = false;
                }
            });

            // Verifica se o campo 'existente' no corpo é um número (protesto já existente)
            if (typeof req.body.existente == "number") {
                // Se sim, vincula a notícia a um protesto existente

                // Insere na tabela 'fonte' um registro ligando a fonte ao protesto
                await db("fonte").insert({
                    fonte_protesto_num_seq_fonte_protesto: 22, // ID fixo da fonte (ex: crawling)
                    protesto_num_seq_protesto: req.body.existente,
                    referencia: req.body.url,
                });

                // Se o screenshot foi gerado com sucesso, insere o registro na tabela 'screenshot'
                if (add_screenshot) {
                    await db("screenshot").insert({
                        id: img_name, // Nome único do arquivo de imagem
                        id_protesto: req.body.existente, // Protesto existente vinculado
                    });
                }
            } else {
                // Se não é protesto existente, cria um novo protesto no banco

                const ret = await db("protesto")
                    .insert({
                        data_protesto: req.body.data, // Data informada no corpo
                        tema_protesto: req.body.titulo, // Título informado no corpo
                    })
                    .returning("*"); // Retorna o registro criado

                // Insere na tabela 'fonte' ligando a fonte ao novo protesto criado
                await db("fonte").insert({
                    fonte_protesto_num_seq_fonte_protesto: 22,
                    protesto_num_seq_protesto: ret[0]["num_seq_protesto"], // ID do novo protesto
                    referencia: req.body.url,
                });

                // Se o screenshot foi criado, insere o registro do screenshot
                if (add_screenshot) {
                    await db("screenshot").insert({
                        id: img_name,
                        id_protesto: ret[0]["num_seq_protesto"],
                    });
                }
            }
            // Responde sucesso para o cliente confirmando migração da notícia
            res.status(200).json({ ok: "Notícia migrada para protestos." });
        }

        // Se não entrou no if de is_protesto, responde que alterações foram descartadas
        res.status(200).json({ ok: "Alterações descartadas." });

    } else {
        // Se não autenticado, responde erro 401
        res.status(401).json({ error: "Não autorizado." });
    }
};
