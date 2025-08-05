import { promises as fs } from 'fs'; // Importa o módulo fs (filesystem) usando Promises
import path from 'path';             // Importa o módulo path para manipulação de caminhos

export default async function handler(req, res) {
  // Extrai o nome do arquivo da query string da requisição
  const { file } = req.query;

  // Cria o caminho absoluto para o arquivo dentro da pasta 'public/images/news'
  const filePath = path.join(process.cwd(), 'public/images/news', file);

  try {
    // Lê o arquivo solicitado de forma assíncrona
    const fileContents = await fs.readFile(filePath);

    // Define o Content-Type apropriado baseado na extensão do arquivo
    if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (file.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (file.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else {
      // Caso a extensão seja diferente, envia como stream de bytes genérico
      res.setHeader('Content-Type', 'application/octet-stream');
    }

    // Envia o conteúdo do arquivo como resposta
    res.send(fileContents);

  } catch (err) {
    // Se der erro (arquivo não encontrado, por exemplo), retorna status 404 e mensagem JSON de erro
    res.status(404).json({ error: 'File not found' });
  }
}

