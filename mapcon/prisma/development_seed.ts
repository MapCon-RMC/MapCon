import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
    // INSERT INTO crawling.crawling_news (url, cidades, titulo, data) VALUES ('noticiateste.com', '[{\"uf\":\"Teste\", \"municipio\":\"Teste\", \"populacao\":0}]', 'Noticia Teste', '2000-01-01');
    await prisma.crawling_news.create({
        data: {
            url: 'noticiateste.com',
            cidades: '[{"uf":"UF Teste", "municipio":"Municipio Teste", "populacao":0}]',
            titulo: 'Noticia Teste',
            data: new Date("2000-01-01"),
            termos: ['Termo Teste']
        }
    });

    await prisma.perfil_usuario.create({
        data: {
          num_seq_perfil_usuario: 1,  
          desc_perfil_usuario: 'Administrador do sistema'
        }
    });
    
    await prisma.perfil_usuario.create({
        data: {
          num_seq_perfil_usuario: 2,  
          desc_perfil_usuario: 'Usuário comum'
        }
    });

    await prisma.usuario.create({
        data: {
          usu_login: 'admin',
          usu_senha: 'admin',
          perfil_usuario_num_seq_perfil_usuario: 1
        }
      });
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })