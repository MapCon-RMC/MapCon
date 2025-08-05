import React, { useEffect } from 'react';
import Image from 'next/image'  // Componente Next.js para otimizar imagens
// import { Card } from 'primereact/card';  // Card comentado, não usado no momento
import { Button } from 'primereact/button'; // Botão estilizado do PrimeReact
import { InputText } from 'primereact/inputtext' // Input estilizado do PrimeReact
import Link from 'next/link'  // Componente Next.js para links internos
import ToolbarSite from '../components/toolbar_site'; // Componente da barra superior do site
import styles from '../styles/index.module.css' // Importa estilos específicos para a página


function Index() {
  // Header para o card infantil com uma imagem responsiva
  const card_infantil_header = (
    <Image layout={'responsive'} height={200} width={400} alt="Card" src='/images/imagem1.jpeg' />
  );

  // Footer para o card infantil com botão que leva para a página infantil
  const card_infantil_footer = (
    <span>
      {/* Link que leva para /educacao/infantil com botão dentro */}
      <Link href={"/educacao/infantil"} passHref>
        <a>
          <Button label="Continuar a Ler" className="p-button-danger" />
        </a>
      </Link>
    </span>
  )


  // Header para o card fundamental com outra imagem responsiva
  const card_fundamental_header = (
    <Image layout={'responsive'} height={200} width={400} alt="Card" src='/images/imagem2.jpeg' />
  )

  // Footer para o card fundamental com botão que leva para página fundamental
  const card_fundamental_footer = (
    <span>
      <Link href="/educacao/fundamental" passHref>
        <a>
          <Button label="Continuar a Ler" className="p-button-danger" />
        </a>
      </Link>
    </span>
  )


  return (
    <div>
      <ToolbarSite></ToolbarSite> {/* Barra superior fixa */}

      <div className="p-grid p-formgrid p-m-lg-6 p-m-2">
        {/* Área do título principal "Quem Somos" */}
        <div className="p-col-12 p-mb-2 p-lg-8 p-mb-lg-0">
          <div className={styles.titulo}>Quem Somos</div>
        </div>

        {/* Coluna da direita com busca e últimas postagens */}
        <div className="p-col-12 p-mb-2 p-lg-4 p-mb-lg-0">
          <div className={styles.titulo}>Busca</div>

          {/* Campo de busca com input e botão de lupa */}
          <div className={styles.busca + " p-inputgroup"}>
            <InputText placeholder="Pesquisar ..." />
            <Button icon="pi pi-search" className="p-button-danger" />
          </div>

          {/* Título da seção de últimas postagens */}
          <div className={styles.titulo}>Últimas Postagens</div>

          {/* Listagem de títulos de notícias estáticas */}
          <div className={styles.titulo_noticia}>Título da primeira noticia</div>
          <div className={styles.titulo_noticia}>Título da segunda noticia</div>
          <div className={styles.titulo_noticia}>Título da terceira noticia</div>
          <div className={styles.titulo_noticia}>Título da quarta noticia, com tamanho maior e quebrando a linha</div>
        </div>
      </div>
    </div>
  );
}

export default Index
