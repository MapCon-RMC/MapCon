// Importa a conexão com o banco de dados
import db from '../../../lib/back/db'

// Importa o React
import React from 'react'

// Importa o componente de gráfico da biblioteca PrimeReact
import { Chart } from 'primereact/chart';

// Importa a biblioteca moment para manipulação de datas
import moment from 'moment';

// Importa a barra superior da interface do sistema
import ToolbarMapCon from '../../../components/toolbar_mapcon';

// Componente principal da página
export default function ConflitosMes(props) {

    // Define os dados que serão usados no gráfico de barras
    const chartData = {
        labels: props.conflitosmes.map(r => r.to_char), // Mês formatado
        datasets: [
            {
                data: props.conflitosmes.map(r => r.count), // Quantidade de protestos por mês
                label: 'Total', // Legenda da série de dados
                backgroundColor: 'red' // Cor das barras
                // backgroundColor: props.totaissit.map(r => getColor(r.situacao)) <- comentário anterior, exemplo de como definir cor por situação
            }
        ]
    }

    // Define as opções de configuração do gráfico
    const options = {
        title: {
            display: true, // Exibe o título
            text: 'Protestos por mês', // Texto do título
            fontSize: 16 // Tamanho da fonte do título
        }
    };

    // Retorno visual do componente
    return (
        <div>
            <ToolbarMapCon /> {/* Componente de toolbar padrão */}
            <div className="p-grid p-formgrid p-m-lg-3 p-m-2">
                <div className=" p-col-12 p-md-12 p-mb-lg-0">
                    {/* <div className='title-form'>Situação dos Cadastros</div> <- comentário anterior */}
                    <Chart type="bar" options={options} data={chartData} /> {/* Renderiza o gráfico de barras */}
                </div>
            </div>
        </div>
    )
}

// Função de carregamento de dados no lado do servidor (SSR)
export async function getServerSideProps(context) {

    // Pega o ano atual (não utilizado diretamente, mas pode ser útil)
    const anoatual = moment().format('YYYY')

    // Consulta o banco para obter a quantidade de protestos por mês
    let conflitosmes = await db.raw(`
        SELECT 
            to_char(data_protesto, 'YYYY-MM'), -- Formata a data como ano-mês
            COUNT(num_seq_protesto) 
        FROM protesto 
        GROUP BY 1 
        ORDER BY 1;
    `)

    conflitosmes = conflitosmes.rows // Extrai apenas as linhas do resultado

    // Retorna os dados como props para o componente
    return {
        props: {
            conflitosmes
        },
    }
}
