// Importa o React
import React from 'react';

// Hook de roteamento do Next.js para navegar entre páginas programaticamente
import { useRouter } from 'next/router';

// Componentes da biblioteca PrimeReact
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';

// Componente de link do Next.js para navegação leve entre páginas
import Link from "next/link";

// Funções do NextAuth para controle de sessão e login/logout
import { signIn, signOut, useSession } from 'next-auth/react';

export default function ToolbarMapCon() {
  const router = useRouter(); // Inicializa o roteador

  // Hook para obter o estado da sessão (usuário logado ou não)
  const { data: session, status: loading } = useSession();

  // Itens do menu da barra superior (Menubar)
  let items = [
    {
      label: 'Cadastro',
      items: [
        {
          label: 'Notícias Rastreadas',
          // Redireciona para a rota de notícias rastreadas
          command:()=>{router.push("/mapcon/noticiasrastreadas");}
        },
        {
          label: 'Protesto',
          // Redireciona para a rota de protesto
          command:()=>{router.push("/mapcon/protesto");}
        },
        {
          label: 'Conflito',
          // Ainda sem comando definido
        },
        {
          label: 'Agente',
          // Redireciona para a rota de agente
          command:()=>{router.push("/mapcon/agente_protesto");}
        }
      ]
    },
    {
      label: 'Complemento',
      items: [
        {
          label: 'Categoria do Objeto',
          // Redireciona para a rota de categoria do objeto
          command:()=>{router.push("/mapcon/catobj");}
        },
        {
          label: 'Repertório de Ação',
          // Redireciona usando window.location.href (força recarregamento completo)
          command:()=>{window.location.href = "/mapcon/repacao";}
        },
        {
          label: 'Categoria do Agente',
          command:()=>{window.location.href = "/mapcon/catagente";}
        },
        {
          label: 'Forma de Participação',
          command:()=>{window.location.href = "/mapcon/formaparticipacao";}
        },
        {
          label: 'Cidade',
          command:()=>{window.location.href = "/mapcon/cidade";}
        },
        {
          label: 'Bairro',
          command:()=>{window.location.href = "/mapcon/bairro";}
        },
        {
          label: 'Fonte',
          command:()=>{window.location.href = "/mapcon/fonteprotesto";}
        },
        {
          label: 'Usuário',
          command:()=>{window.location.href = "/mapcon/usuario";}
        },
      ]
    },
    {
      label: 'Relatórios',
      // Ainda não possui subitens
    },
    {
      label : 'Gráficos',
      items: [
        {
          label: 'Conflitos por mês',
          command:()=>{window.location.href = "/mapcon/graficos/conflitosmes";}
        }
      ]
    }
  ];

  // Logotipo clicável à esquerda da barra
  const start = (
    <Link href="/mapcon">
      <img alt="logo" src="/images/logo.png" height="40" className="p-mr-2"/>
    </Link>
  );

  // Área à direita da barra: botão de login ou logout dependendo do estado da sessão
  const right_toolbar = (
    <div>
      {!session ? (
        // Usuário não logado: exibe botão de login
        <Button
          label='Login'
          onClick={() => signIn()}
          className="p-button-secondary"
          style={{ marginRight: '.25em' }}
          icon="pi pi-user"
        />
      ) : (
        // Usuário logado: exibe botão de logout
        <Button
          label='Logout'
          onClick={() => signOut()}
          className="p-button-secondary"
          style={{ marginRight: '.25em' }}
          icon="pi pi-user"
        />
      )}
    </div>
  );

  // Renderiza o Menubar com logo à esquerda, itens no meio e login/logout à direita
  return (
    <div>
      <Menubar start={start} model={items} end={right_toolbar} />
    </div>
  );
}

