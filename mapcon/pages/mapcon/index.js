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
  const conflitos = await db.raw(`SELECT num_seq_protesto, tema_protesto, to_char(data_protesto,'DD/MM/YYYY') as data,latitude,longitude 
                                  FROM protesto p INNER JOIN geolocalizacao g ON p.num_seq_protesto = g.protesto_num_seq_protesto WHERE status = 1;`);
  const session = await getSession({req: context.req})
  if(!session){
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


