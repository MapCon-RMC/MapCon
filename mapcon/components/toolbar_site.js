// Importa o React para criação do componente
import React from 'react';

// Hook de navegação do Next.js para redirecionamento de rotas
import { useRouter } from 'next/router';

// Componentes do PrimeReact usados na interface
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';

// Link do Next.js para navegação leve entre páginas
import Link from "next/link";

// Funções de autenticação com NextAuth (não estão sendo usadas no momento)
import { signIn, signOut, useSession } from 'next-auth/react';

export default function ToolbarSite() {
  const router = useRouter(); // Hook para redirecionamento de páginas

  // Define os itens do menu de navegação
  let items = [
    {
      label: 'Início',
      // Redireciona para a página inicial
      command: () => { router.push("/") }
    },
    {
      label: 'Sobre Nós',
      // Redireciona para a página "Sobre Nós"
      command: () => { router.push("/sobrenos") }
    },
    {
      label: 'Equipe',
      // Redireciona para a página da equipe
      command: () => { router.push("/equipe") }
    },
    // Itens comentados: podem ser ativados futuramente
    // {
    //   label: 'Outras Publicações',
    //   command: () => { router.push("/outraspublicacoes") }
    // },
    // {
    //   label: 'Publicação Científica',
    //   command: () => { router.push("/publicacaocientifica") }
    // },
    {
      label: 'MapCon',
      // Redireciona para a página principal do MapCon
      command: () => { router.push("/mapcon") }
    },
    // Versão comentada de um submenu para o MapCon (mais detalhada)
    // {
    //   label: 'MapCon',
    //   items: [
    //     { label: 'Dashboard' },
    //     { label: 'Escolas e Vagas' },
    //     { label: 'Cadastros' },
    //     { label: 'Histórico de Cadastros' },
    //     { label: 'Definir Período de Cadastro' }
    //   ]
    // },
  ];

  // Logo clicável à esquerda da barra
  const start = (
    <Link href="/">
      <img alt="logo" src="/images/logo.png" height="40" className="p-mr-2" />
    </Link>
  );

  // Área à direita da barra — está vazia no momento, mas pode conter login/logout
  const right_toolbar = (
    <div>
      {/* 
        Exemplo de botão de login/logout usando autenticação NextAuth 
        (comentado, mas pode ser usado no futuro)

      {!session ?
        <Button label='Login' onClick={() => signIn()} className="p-button-danger" style={{ marginRight: '.25em' }} icon="pi pi-user" /> :
        <Button label='Logout' onClick={() => signOut()} className="p-button-warning" style={{ marginRight: '.25em' }} icon="pi pi-user" />
      } 
      */}
    </div>
  );

  return (
    <div>
      {/* Renderiza a barra de menu (Menubar) com logo, itens de menu e área de login (vazia) */}
      {/* Exemplo: para mostrar o nome do usuário logado — {session && session.user.name} */}
      <Menubar start={start} model={items} end={right_toolbar} />
    </div>
  );
}
