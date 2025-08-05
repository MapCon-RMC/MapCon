// Importa o React para definir componentes funcionais
import React from 'react';

// Importa o componente da barra de ferramentas específica do módulo de mapas
import ToolbarMapCon from '../../components/toolbar_mapcon';

// Importa a função getSession do NextAuth para verificar a autenticação do usuário
import { getSession } from 'next-auth/react';

// Importa a instância do banco de dados configurada
import db from '../../lib/back/db.js';

// Importa o dynamic do Next.js para carregar componentes dinamicamente
import dynamic from 'next/dynamic'

// Componente principal da página
function Index(props) {
  // Importa dinamicamente o componente MainMap, desativando a renderização no lado do servidor (SSR)
  const MainMap = dynamic(() => import("../../components/mapcon/main_map"), { ssr: false });

  // Retorna a estrutura da página com a toolbar e o mapa, passando os conflitos como props
  return (
    <div>
      <ToolbarMapCon/> {/* Barra superior da tela */}
      <MainMap conflitos={props.conflitos}/> {/* Componente de mapa que recebe os dados de conflitos */}
    </div>
  );
}

// Função de renderização no servidor para buscar dados antes de carregar a página
export async function getServerSideProps(context){
  // Busca todos os registros da tabela 'mapa_protestos' diretamente do banco de dados
  const conflitos = await db.raw(`SELECT * FROM mapa_protestos;`);

  // Recupera a sessão do usuário (verifica se está logado)
  const session = await getSession({ req: context.req });
