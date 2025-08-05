import NextAuth from 'next-auth'  // Importa o NextAuth para autenticação
import CredentialsProvider from "next-auth/providers/credentials"; // Provedor de autenticação por credenciais
import db from '../../../lib/back/db'; // Importa a conexão com banco de dados
import bcrypt from 'bcryptjs' // Biblioteca para hash e comparação de senhas

export default NextAuth({
    // Configuração da sessão
    session: {
        strategy: 'jwt', // Usa JWT para gerenciamento de sessão
        maxAge: 3600, // Tempo de vida do token JWT: 3600 segundos = 1 hora
    },
    secret: process.env.NEXTAUTH_SECRET, // Segredo para criptografia e assinatura dos tokens

    // Configuração dos provedores de autenticação
    providers: [
        CredentialsProvider({
            // Nome exibido no formulário de login
            name: 'dados',
            // Define os campos esperados no formulário de login
            credentials: {
                csrfToken: { label: "CSRF Token", type: "hidden" }, // Campo oculto para token CSRF
                username: { label: "Usuário", type: "text" },       // Campo texto para usuário
                password: { label: "Senha",   type: "password" }    // Campo senha para senha
            },
            // Função para autorizar o usuário com base nas credenciais
            async authorize(credentials) {
                // Busca no banco o usuário com o login fornecido
                const usr = await db('usuario')
                    .select('usu_login', 'usu_senha', 'perfil_usuario_num_seq_perfil_usuario')
                    .where({ usu_login: credentials.username })
                    .first();

                if (!usr) {
                    // Se não encontrou usuário, retorna null para falha no login
                    return null;
                } else if (bcrypt.compareSync(credentials.password, usr.usu_senha)) {
                    // Se senha bate (comparação segura com bcrypt)
                    let ret = {
                        id: usr.usu_login, // Id do usuário é o login
                        perfil: usr.perfil_usuario_num_seq_perfil_usuario, // Perfil do usuário
                    };
                    // Log para depuração
                    console.debug('Logging user in: ', ret.id, ", ", ret.perfil);
                    // Retorna objeto do usuário para o NextAuth
                    return ret;
                } else {
                    // Senha incorreta, retorna null para falha no login
                    return null;
                }
            }
        })
    ],

    // Callbacks para manipular token JWT e sessão
    callbacks: {
        jwt: async ({token, user}) => {
            // Se houver usuário (no login), adiciona ele ao token JWT
            if (user) {
                token.user = user;
            }
            return token; // Retorna o token atualizado
        },
        session: async ({session, token}) => {
            // Coloca os dados do usuário do token na sessão que o cliente recebe
            session.user = token.user;
            return session; // Retorna a sessão atualizada
        }
    },

    // Configuração das páginas customizadas
    pages: {
        signIn: '/login' // Página customizada de login
    }
})
