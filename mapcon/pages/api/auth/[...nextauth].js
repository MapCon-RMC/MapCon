import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import db from '../../../lib/back/db';
import bcrypt from 'bcryptjs'

export default NextAuth({
    // Configure one or more authentication providers
    session: {
        strategy: 'jwt',
        jwt: true,
        maxAge: 3600, // 1 hour
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'dados',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                username: { label: "Usuário", type: "text" },
                password: { label: "Senha",   type: "password" }
            },
            async authorize(credentials, req) {
                const usr = await db('usuario')
                    .select('usu_login', 'usu_senha', 'perfil_usuario_num_seq_perfil_usuario')
                    .where({ usu_login: credentials.username })
                    .first();

                if (!usr) {
                    return null;
                } else if (bcrypt.compareSync(credentials.password, usr.usu_senha)) {
                        let ret = {
                            id: usr.usu_login,
                            perfil: usr.perfil_usuario_num_seq_perfil_usuario,
                        };
                        console.debug('Logging user in: ', ret.id, ", ", ret.perfil);
                        return ret;
                } else {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        jwt: async ({token, user, account, profile}) => {
            //  "user" parameter is the object received from "authorize"
            //  "token" is being send below to "session" callback...
            //  ...so we set "user" param of "token" to object from "authorize"...
            //  ...and return it...
            if (user) {
                token.user = user;
            }
            return token;
        },
        session: async (session) => {
            if (session) {
                session.user = session.token.user;
                return session;
            } else {
                // Handle the case where session or user is undefined
                console.error('Session or user is undefined', { session });
                return session;
            }
        }
    },
    pages: {
        signIn: '/login'
    }
})