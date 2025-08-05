// Importa o arquivo global de estilos CSS
import '../styles/globals.css'

// Importa o tema "saga-blue" do PrimeReact para estilização dos componentes
import 'primereact/resources/themes/saga-blue/theme.css';
// Importa a biblioteca PrimeFlex para utilitários CSS (flexbox, espaçamentos, grids, etc)
import 'primeflex/primeflex.css';
// Importa os estilos base do PrimeReact
import 'primereact/resources/primereact.min.css';
// Importa os ícones do PrimeIcons usados em componentes PrimeReact
import 'primeicons/primeicons.css';

// Importa o provider de sessão do NextAuth para autenticação
import { SessionProvider } from 'next-auth/react'
// Importa o axios para fazer requisições HTTP
import axios from 'axios';

// Configura a baseURL padrão do axios para a variável de ambiente NEXTAUTH_URL
axios.defaults.baseURL = process.env.NEXTAUTH_URL;

// Componente principal da aplicação Next.js
function MyApp({ Component, pageProps }) {
  return (
    // Envolve toda a aplicação com o provider de sessão para controle de autenticação
    <SessionProvider session={pageProps.session}>
      {/* Renderiza o componente da página atual, passando suas props */}
      <Component {...pageProps} />
    </SessionProvider>
  )
}

// Exporta o componente principal para ser usado pelo Next.js
export default MyApp
