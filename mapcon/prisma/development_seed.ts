import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
    // INSERT INTO crawling.crawling_news (url, cidades, titulo, data) VALUES ('noticiateste.com', '[{\"uf\":\"Teste\", \"municipio\":\"Teste\", \"populacao\":0}]', 'Noticia Teste', '2000-01-01');
    try {
      await prisma.crawling_news.create({
          data: {
              url: 'http://localhost:3000',
              cidades: '[{"uf":"UF Teste", "municipio":"Municipio Teste", "populacao":0}]',
              titulo: 'Noticia Teste',
              data: new Date("2000-01-01"),
              termos: ['Termo Teste']
          }
      });
    } catch (error) {
      if (error.code === 'P2002')
        console.log('Registro já existe');
    }

    try {
      await prisma.crawling_news.create({
          data: {
              url: 'https://github.com/MapCon-RMC/MapCon',
              cidades: '[{"uf":"UF Teste", "municipio":"Municipio Teste", "populacao":0}]',
              titulo: 'Noticia Teste 2',
              data: new Date()
          }
      });
    } catch (error) {
      if (error.code === 'P2002')
        console.log('Registro já existe');
    }

    try {
      await prisma.perfil_usuario.create({
        data: {
          num_seq_perfil_usuario: 1,  
          desc_perfil_usuario: 'Administrador do sistema'
        }
      });
    } catch (error) {
      if (error.code === 'P2002')
        console.log('Registro já existe');
    }
    
    try {
      await prisma.perfil_usuario.create({
        data: {
          num_seq_perfil_usuario: 2,  
          desc_perfil_usuario: 'Usuário comum'
        }
      });
    } catch (error) {
      if (error.code === 'P2002')
        console.log('Registro já existe');
    }

    try {
      await prisma.usuario.create({
        data: {
          usu_login: 'admin',
          usu_senha: 'admin',
          perfil_usuario_num_seq_perfil_usuario: 1
        }
      });
    } catch (error) {
      if (error.code === 'P2002')
        console.log('Registro já existe');
    }

    try {
      await prisma.categoria_objeto.create({
          data: {
            num_seq_categoria_objeto: 1,
            desc_categoria_objeto: 'Categoria Teste'
          }
      });
    } catch (error) {
      if (error.code === 'P2002')
        console.log('Registro já existe');
    }

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