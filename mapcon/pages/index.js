import React from 'react';
import dynamic from 'next/dynamic'
import db from '../lib/back/db.js';
import ToolbarSite from '../components/toolbar_site';


function Index(props) {
  const MainMap = dynamic(() => import("../components/mapcon/main_map"), { ssr: false });
  return (
    <div>
      <ToolbarSite /> 
      <MainMap conflitos={props.conflitos}/>
    </div>
  );
}

export async function getServerSideProps(context) {
  const conflitos = await db.raw('SELECT * FROM mapa_protestos;');
  return {
    props: {
      conflitos: conflitos.rows
    }
  }

}

export default Index