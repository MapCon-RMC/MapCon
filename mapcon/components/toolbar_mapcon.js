import React from 'react';
import { useRouter } from 'next/router'
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import Link from "next/link";
import { signIn, signOut, useSession } from 'next-auth/react'

export default function ToolbarMapCon() {
  
  const router = useRouter();
  
  const { data: session, status: loading } = useSession();

  let items = [
    {
      label: 'Cadastro',
      items: [
        {
          label: 'Notícias Rastreadas',
          command:()=>{router.push("/mapcon/noticiasrastreadas");}
          // command:()=>{window.location.href = "/mapcon/noticiasrastreadas";}
        },
        {
          label: 'Protesto',
          command:()=>{router.push("/mapcon/protesto");}
          // command:()=>{window.location.href = "/mapcon/protesto";}
        },
        {
          label: 'Conflito',
          //command:()=>{history.push("/escolasevagas");}
          // command:()=>{history.push("/escolasevagas");}
        },
        {
          label: 'Agente',
          command:()=>{router.push("/mapcon/agente_protesto");}
          // command:()=>{window.location.href = "/mapcon/agente_protesto";}
        },
        // {
        //   label: 'Notícias do Blog'
        // }
      ]
    },
    {
      label: 'Complemento',
      items: [
        {
          label: 'Categoria do Objeto',
          command:()=>{router.push("/mapcon/catobj");}
          // command:()=>{window.location.href = "/mapcon/catobj";}
        },
        {
          label: 'Repertório de Ação',
          // command:()=>{router.push("/mapcon/repacao");}
          command:()=>{window.location.href = "/mapcon/repacao";}
        },
        {
          label: 'Categoria do Agente',
          // command:()=>{router.push("/mapcon/catagente");}
          command:()=>{window.location.href = "/mapcon/catagente";}
        },
        {
          label: 'Forma de Participação',
          // command:()=>{router.push("/mapcon/formaparticipacao");}
          command:()=>{window.location.href = "/mapcon/formaparticipacao";}
        },
        {
          label: 'Cidade',
          // command:()=>{router.push("/mapcon/cidade");}
          command:()=>{window.location.href = "/mapcon/cidade";}
        },
        {
          label: 'Bairro',
          // command:()=>{router.push("/mapcon/bairro");}
          command:()=>{window.location.href = "/mapcon/bairro";}
        },
        {
          label: 'Fonte',
          // command:()=>{router.push("/mapcon/fonteprotesto");}
          command:()=>{window.location.href = "/mapcon/fonteprotesto";}
        },
        // {
        //   label: 'Perfil do Usuário',
        // },
        {
          label: 'Usuário',
          // command:()=>{router.push("/mapcon/usuario");}
          command:()=>{window.location.href = "/mapcon/usuario";}
        },
      ]
    },
    {
      label: 'Relatórios',
    },
    {
      label : 'Gráficos',
      items: [
        {
          label: 'Conflitos por mês',
          // command:()=>{router.push("/mapcon/graficos/conflitosmes");}
          command:()=>{window.location.href = "/mapcon/graficos/conflitosmes";}
        },
        
      ]
    }
  ];

  const start = (
    <Link href="/mapcon">
      <img alt="logo" src="/images/logo.png" height="40" className="p-mr-2"/>
    </Link>
  );

  const right_toolbar = (
    <div>
      {!session ?
        <Button label='Login' onClick={() => signIn()} className="p-button-secondary" style={{ marginRight: '.25em' }} icon="pi pi-user" /> 
      :
        <Button label='Logout' onClick={() => signOut()} className="p-button-secondary" style={{ marginRight: '.25em' }} icon="pi pi-user" />
      }
    </div>
  )

  return (
    <div>
      <Menubar start={start} model={items} end={right_toolbar} />
    </div>
  );

}







