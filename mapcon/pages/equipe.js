// Importa utilitários CSS do PrimeFlex (grid, espaçamentos, flexbox, etc)
import 'primeflex/primeflex.css';

// Importa React e hook useEffect (embora não esteja usado aqui)
import React, { useEffect } from 'react';

// Importa o componente Carousel do PrimeReact para mostrar carrossel de itens
import { Carousel } from 'primereact/carousel';

// Importa o componente ToolbarSite (barra superior do site)
import ToolbarSite from '../components/toolbar_site';

// Importa estilos específicos do arquivo CSS módulo para esta página
import styles from '../styles/index.module.css'

// Importa conexão com banco de dados (Knex configurado)
import db from '../lib/back/db.js';

// Importa ícones do PrimeIcons (usados em alguns componentes)
import 'primeicons/primeicons.css';

// Componente principal da página Index
function Index(props) {
  // Número de itens visíveis no carrossel ao mesmo tempo
  const numView = 3;

  // Template para renderizar cada usuário no carrossel
  const userTemplate = (user) => {
    return (
      <div className="user-card border border-round p-m-2 p-py-6 p-px-3" style={{ backgroundImage: `url(${user.perfil})`}}>
        {/* Se o usuário tem imagem no perfil, renderiza um ícone invisível para manter estrutura */}
        {user.perfil != null && user.perfil != '' ? 
          <i className="nullicon pi pi-user p-mb-5" style={{ fontSize: '4rem', visibility: 'hidden' }}/>
        :
          // Caso contrário, mostra o ícone do usuário normalmente
          <i className="pi pi-user p-mb-5" style={{ fontSize: '4rem' }}/>
        }
        <div className="user-card-info">
          <div className="user-nome">{user.nome}</div> {/* Nome do usuário */}
          <div className="user-funcao">{user.funcao}</div> {/* Função do usuário */}
        </div>
      </div>
    );
  };

  // Função que decide o que renderizar no carrossel
  const CarouselEl = () => {
    if (!props.equipe)
      return <div className='p-carousel'>Carregando...</div> // Exibe enquanto a lista não chegou
    else if (props.equipe.length === 0)
      return <div className='p-carousel'>Nenhum usuário cadastrado</div> // Se lista vazia
    else {
      // Renderiza o carrossel com os usuários, com navegação só se houver mais do que numView
      return (
        <Carousel value={props.equipe}
                  numVisible={numView} numScroll={1} 
                  itemTemplate={userTemplate} showNavigators={props.equipe.length <= numView ? false : true}/>
      );
    }
  }

  // Renderização do componente da página
  return (
    <div>
      {/* Barra superior do site */}
      <ToolbarSite></ToolbarSite>

      {/* Título da seção */}
      <div className="p-grid p-formgrid p-m-lg-6 p-m-2">
        <div className="p-col-12 p-mb-2 p-lg-8 p-mb-lg-0">
          <div className={styles.titulo}>A Equipe</div>
        </div>
      </div>

      {/* Carrossel com a equipe */}
      {CarouselEl()}
    </div>
  );
}

// Função do Next.js para buscar dados do lado servidor a cada requisição
export async function getServerSideProps(context) {
  let equipe = [];
  try {
    // Consulta a tabela 'equipe' buscando todos os registros
    equipe = await db('equipe').select('*');
  } catch (error) {
    // Caso dê erro na consulta, mostra no console
    console.error(error);
  }
  // Retorna os dados para o componente Index via props
  return {
    props: {
      equipe: equipe
    }
  }
}

// Exporta o componente padrão da página
export default Index
