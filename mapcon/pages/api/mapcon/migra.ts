import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react';
import db from "../../../lib/back/db";
import { v1 as uuidv1 } from "uuid";
import { exec } from "child_process";
import { LogRequest } from './_helper';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (session) {
    LogRequest(__filename, req, session);
    if (!req.body.is_protesto) {
      await db("crawling.crawling_news")
        .where({ url: req.body.url })
        .delete();
    } else {
      // Marca como protesto
      await db("crawling.crawling_news")
        .where({ url: req.body.url })
        .update({ tipo: true });

      // Pega um nome único para o screenshot que será gerado
      const img_name = uuidv1();

      // Tira o screenshot
      let add_screenshot = true;
      const command = `node screenshot.js ${req.body.url} ${img_name}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro ao tirar screenshot: ${error.message}`);
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          add_screenshot = false;
          return;
        }
      });

      if (typeof req.body.existente == "number") {
        // Vincula com um protesto já existente

        // Adicionar fonte
        await db("fonte").insert({
          fonte_protesto_num_seq_fonte_protesto: 22,
          protesto_num_seq_protesto: req.body.existente,
          referencia: req.body.url,
        });
        // Adicionar documento
        if (add_screenshot) {
          await db("screenshot").insert({
            id: img_name,
            id_protesto: req.body.existente,
          });
        }
      } else {
        const ret = await db("protesto")
            .insert({
              data_protesto: req.body.data,
              tema_protesto: req.body.titulo,
            })
            .returning("*");

        // Adicionar fonte
        await db("fonte").insert({
          fonte_protesto_num_seq_fonte_protesto: 22,
          protesto_num_seq_protesto: ret[0]["num_seq_protesto"],
          referencia: req.body.url,
        });
        // Adicionar documento
        if (add_screenshot) {
          await db("screenshot").insert({
            id: img_name,
            id_protesto: ret[0]["num_seq_protesto"],
          });
        }

        await db("crawling.crawling_news")
          .where({ url: req.body.url })
          .delete();
      }
    }
    
    res.status(200).json({ ok: "Migrou" });
  }
};
