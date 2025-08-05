// Importações de bibliotecas e componentes necessários
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';
import db from '../../../lib/back/db'
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react'
import moment from 'moment';
import { Panel } from 'primereact/panel';
import { Timeline } from 'primereact/timeline';
import { InputMask } from 'primereact/inputmask';
import ToolbarMapCon from '../../../components/toolbar_mapcon';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react'

// Importação de abas/componentes específicos da tela de protesto
import { ObjetoProtestoTab } from '../../../components/mapcon/protesto/objeto_protesto_tab'
import { FormaProtestoTab } from '../../../components/mapcon/protesto/forma_protesto_tab'
import { DesdobramentoTab } from '../../../components/mapcon/protesto/desdobramento_tab'
import { FonteTab } from '../../../components/mapcon/protesto/fonte_tab'
import dynamic from 'next/dynamic'
import { LocalTab } from '../../../components/mapcon/protesto/local_tab';
import { AgenteTab } from '../../../components/mapcon/protesto/agente_tab';
import { ScreenshotTab } from '../../../components/mapcon/protesto/screenshot_tab';
import { FormProvider, useFormContext } from '../../../components/mapcon/protesto/FormProvider';
import FormGeral from '../../../components/mapcon/protesto/FormGeral';

function ProtestoForm(props) {

    // Carregamento dinâmico da aba de geolocalização (evita problemas com SSR)
    const GeolocalizacaoTab = dynamic(() => import("../../../components/mapcon/protesto/geolocalizacao_tab"), { ssr: false });

    const toast = useRef(null); // Referência para o componente de Toast (mensagens)

    // Hook para lidar com o formulário
    const { control, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: props.form // Carrega os dados do formulário via props
    });

    // Opções possíveis para o status do protesto
    const status_options = [
        { id: 0, label: 'Em Preenchimento' },
        { id: 1, label: 'Finalizado (Publicado)' },
        { id: 2, label: 'Finalizado (Não Publicado)' },
    ];

    return (
        <div>
            <Toast ref={toast} />
            <ToolbarMapCon />

            <div className="p-grid p-formgrid p-fluid p-m-lg-1 p-m-1">
                <div className="p-col-12 p-mb-8 p-lg-8 p-mb-lg-0">

                    {/* Exibe o painel de histórico, se existir */}
                    {props.hist ? (
                        <Panel header="Histórico" id="historico" toggleable collapsed={true}>
                            <Timeline
                                value={hist}
                                opposite={(item) => item.status}
                                content={(item) => <small className="p-text-secondary">{item.date}</small>}
                            />
                        </Panel>
                    ) : null}

                    <div className="p-field p-col-12"><h2>Protesto</h2></div>

                    {/* Encapsula o formulário dentro de um FormProvider customizado */}
                    <FormProvider>
                        <FormGeral {...props}/>
                    </FormProvider>
                </div>
            </div>
        </div>
    )
}

// Função que roda no servidor e carrega os dados da página antes de renderizar
export async function getServerSideProps(context) {
    // Se estiver editando um protesto existente (possui ID)
    if (context.query.id) {
        let cad = await db('protesto').where({ num_seq_protesto: context.query.id }).first();
        cad['data_protesto'] = moment(cad['data_protesto']).format('DD/MM/YYYY');

        // Carregamento de dados relacionados ao protesto (objetos, formas, fontes, locais etc.)
        const conflitos_all = await db('conflito').select('num_seq_conflito as id', 'ident_conflito as name').orderBy('ident_conflito');

        const objetos_protesto = await db('objeto_protesto')
            .select('num_seq_objeto_protesto as id', 'objeto_protesto as name', 'desc_categoria_objeto as categoria')
            .join('categoria_objeto', 'objeto_protesto.categoria_objeto_num_seq_categoria_objeto', '=', 'categoria_objeto.num_seq_categoria_objeto')
            .where({ protesto_num_seq_protesto: context.query.id });

        const objetos_protesto_all = await db('categoria_objeto').select('num_seq_categoria_objeto as id', 'desc_categoria_objeto as name').orderBy('desc_categoria_objeto');

        const forma_protesto = await db('forma_protesto')
            .select('num_seq_forma_protesto as id', 'forma_protesto as name', 'desc_repertorio_acao as repertorio')
            .join('repertorio_acao', 'forma_protesto.repertorio_acao_num_seq_repertorio_acao', '=', 'repertorio_acao.num_seq_repertorio_acao')
            .where({ protesto_num_seq_protesto: context.query.id });

        const repertorio_acao_all = await db('repertorio_acao').select('num_seq_repertorio_acao as id', 'desc_repertorio_acao as name').orderBy('desc_repertorio_acao');

        const desdobramento = await db('desdobramento')
            .select('num_seq_desdobramento as id', 'desdobramento as name')
            .where({ protesto_num_seq_protesto: context.query.id });

        const fonte = await db('fonte')
            .select('num_seq_fonte as id', 'desc_fonte_protesto as name', 'referencia')
            .join('fonte_protesto', 'fonte_protesto.num_seq_fonte_protesto', '=', 'fonte.fonte_protesto_num_seq_fonte_protesto')
            .where({ protesto_num_seq_protesto: context.query.id });

        const fonte_all = await db('fonte_protesto').select('num_seq_fonte_protesto as id', 'desc_fonte_protesto as name').orderBy('desc_fonte_protesto');

        const local = await db('local')
            .select('num_seq_local as id', 'endereco as name', 'bairro', 'cidade')
            .join('bairro', 'bairro.num_seq_bairro', '=', 'local.bairro_num_seq_bairro')
            .join('cidade', 'cidade.num_seq_cidade', '=', 'local.cidade_num_seq_cidade')
            .where({ protesto_num_seq_protesto: context.query.id });

        const local_all = await db('cidade').select('num_seq_cidade as id', 'cidade as name').orderBy('cidade');

        const agente = await db('participacao_agente')
            .select('num_seq_participacao_agente as id', 'agente_protesto as name', 'desc_forma_participacao as forma')
            .join('agente_protesto', 'agente_protesto.num_seq_agente_protesto', '=', 'participacao_agente.agente_protesto_num_seq_agente_protesto')
            .join('forma_participacao', 'forma_participacao.num_seq_forma_participacao', '=', 'participacao_agente.forma_participacao_num_seq_forma_participacao')
            .where({ protesto_num_seq_protesto: context.query.id });

        const agente_coletivos = await db('agente_protesto').select('num_seq_agente_protesto as id', 'agente_protesto as name').orderBy('agente_protesto');
        const agente_forma = await db('forma_participacao').select('num_seq_forma_participacao as id', 'desc_forma_participacao as name').orderBy('desc_forma_participacao');

        const screenshots = await db('screenshot').select('id').where({ id_protesto: context.query.id });

        // Dados retornados como props para a página
        return {
            props: {
                form: { ...cad },
                id: context.query.id,
                conflitos_all,
                objetos_protesto,
                objetos_protesto_all,
                forma_protesto,
                repertorio_acao_all,
                desdobramento,
                fonte,
                fonte_all,
                local,
                local_all,
                agente,
                agente_coletivos,
                agente_forma,
                screenshots
                // hist, // Comentado por padrão
                // view: context.query.view ? true : false
            }
        }
    }
}

export default ProtestoForm;
