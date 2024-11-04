import React from 'react';
import ToolbarMapCon from '../../components/toolbar_mapcon';
import { getSession } from 'next-auth/react';
import db from '../../lib/back/db.js';
import dynamic from 'next/dynamic'

function Index(props) {
  const MainMap = dynamic(() => import("../../components/mapcon/main_map"), { ssr: false });
  return (
    <div>
      <ToolbarMapCon/>
      <MainMap conflitos={props.conflitos}/>
    </div>
  );
}

export async function getServerSideProps(context){
  const conflitos = await db.raw(`SELECT * FROM mapa_protestos;`);
  const session = await getSession({req: context.req})
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return{
    props: {
      conflitos: conflitos.rows,
      session
    }
  }
}


export default Index


