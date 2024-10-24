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
import { ObjetoProtestoTab } from '../../../components/mapcon/protesto/objeto_protesto_tab'
import { FormaProtestoTab } from '../../../components/mapcon/protesto/forma_protesto_tab'
import { DesdobramentoTab } from '../../../components/mapcon/protesto/desdobramento_tab'
import { FonteTab } from '../../../components/mapcon/protesto/fonte_tab'

import dynamic from 'next/dynamic'
import { LocalTab } from '../../../components/mapcon/protesto/local_tab';
import { AgenteTab } from '../../../components/mapcon/protesto/agente_tab';
import { ScreenshotTab } from '../../../components/mapcon/protesto/screenshot_tab';


export default function ProtestoForm(props) {

    // const hist = props.hist?.map(h => ({ status: h['quem'] + ' - ' + h['acao'], date: h['quando'] }))
    console.log('PROPS: ', props);
    const GeolocalizacaoTab = dynamic(() => import("../../../components/mapcon/protesto/geolocalizacao_tab"), { ssr: false });

    const router = useRouter();

    const toast = useRef(null);

    const { control, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: props.form
    });

    const conflitos_all = props.conflitos_all;


    const status_options = [
        {
            id: 0,
            label: 'Em Preenchimento'
        },
        {
            id: 1,
            label: 'Finalizado (Publicado)'
        },
        {
            id: 2,
            label: 'Finalizado (Não Publicado)'
        },



    ]

    const onSubmit = async data => {
        data['data_protesto'] = moment(data['data_protesto'], 'DD/MM/YYYY').format('YYYY-MM-DD')

        if (props.id) {
            data['num_seq_protesto'] = props.id
            const session = await getSession();
            axios.put('/api/mapcon/protesto', {
                ...data,
                user: {
                    id: session.user.id,
                    perfil: session.user.perfil
                }
            }).then(r => {
                toast.current.show({ severity: 'success', summary: 'Dados Atualizados', detail: 'Os dados foram atualizados com sucesso.', life: 3000 });
            })
        }

    }

    const form_geral = (<form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-fluid p-formgrid p-grid p-mt-lg-2 p-mt-2">
            <div className="p-field p-col-12 p-md-9">
                <label htmlFor="tema_protesto">Tema*</label>
                <Controller name="tema_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                    <InputText disabled={props.view} className={errors.tema_protesto ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                } />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label htmlFor="data_protesto">Data*</label>
                <Controller name="data_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                    <InputMask disabled={props.view} className={errors.data_protesto ? "p-invalid" : ""} unmask={false} mask="99/99/9999" value={value} onChange={e => onChange(e.value)}></InputMask>
                } />
            </div>
            <div className="p-field p-col-12 p-md-9">
                <label htmlFor="desc_protesto">Descrição Sumária</label>
                <Controller name="desc_protesto" control={control} render={({field: { onChange, value = '' }}) =>
                    <InputText disabled={props.view} className={errors.desc_protesto ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                } />
            </div>
            <div className="p-field p-col-12 p-md-3">
                <label htmlFor="qtde_envolvidos_protesto">Quantidade de Envolvidos</label>
                <Controller name="qtde_envolvidos_protesto" control={control} render={({field: { onChange, value = '' }}) =>
                    <InputNumber disabled={props.view} className={errors.qtde_envolvidos_protesto ? "p-invalid" : ""} value={value} onChange={e => onChange(e.value)}></InputNumber>
                } />
            </div>
            <div className="p-field p-col-12 p-md-12">
                <label htmlFor="desc_detal_protesto">Descrição</label>
                <Controller name="desc_detal_protesto" control={control} render={({field: { onChange, value = '' }}) =>
                    <InputTextarea disabled={props.view} rows={5} className={errors.desc_detal_protesto ? "p-invalid" : ""} value={value} onChange={onChange}></InputTextarea>
                } />
            </div>
            {/* <div className="p-field p-col-12 p-md-6">
            <label htmlFor="cidade_num_seq_cidade">Conflito</label>
            <Controller name="cidade_num_seq_cidade" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                <Dropdown className={props.cidade_num_seq_cidade && 'p-invalid'} value={value} options={cidades} onChange={e => onChange(e.value)} optionLabel="cidade" optionValue="num_seq_cidade" showClear placeholder="Selecione uma Cidade" />
            } />
        </div> */}
            <div className="p-field p-col-12 p-md-6">
                <label htmlFor="status">Status*</label>
                <Controller name="status" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                    <Dropdown className={errors.status && 'p-invalid'} value={value} options={status_options} onChange={(e) => onChange(e.value)} optionLabel="label" optionValue="id" showClear placeholder="Selecione um status" />
                }/>
            </div>

            <div className="p-field p-col-12 p-md-6">
                <label htmlFor="conflito_num_seq_conflito">Conflito</label>
                <Controller name="conflito_num_seq_conflito" control={control} render={({field: { onChange, value = '' }}) =>
                    <Dropdown className={errors.conflito_num_seq_conflito && 'p-invalid'} value={value} options={props.conflitos_all} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name"  showClear placeholder="Selecione um conflito" />
                }/>
            </div>
            <div className="p-field p-col-12 p-md-offset-9 p-md-3">
                {!props.view ? <Button label="Gravar" icon="pi pi-save" /> : null}
            </div>
        </div>
    </form>)

    return (
        <div>
            <Toast ref={toast} />
            <ToolbarMapCon></ToolbarMapCon>
            <div className="p-grid p-formgrid p-fluid p-m-lg-1 p-m-1">
                <div className="p-col-12 p-mb-2 p-lg-2 p-mb-lg-0">

                </div>
                <div className="p-col-12 p-mb-8 p-lg-8 p-mb-lg-0">

                    {props.hist ? <Panel header="Histórico" id="historico" toggleable collapsed={true}>
                        <Timeline value={hist} opposite={(item) => item.status} content={(item) => <small className="p-text-secondary">{item.date}</small>} />
                    </Panel> : null}

                    <div className="p-field p-col-12"><h2>Protesto</h2></div>

                    <Accordion className="accordion-custom">
                        <AccordionTab header={<React.Fragment><span>Geral</span></React.Fragment>}>
                            {form_geral}
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><span>Objeto do Protesto</span></React.Fragment>}>
                            <ObjetoProtestoTab protestId={props.id} selected={props.objetos_protesto} options={props.objetos_protesto_all} ></ObjetoProtestoTab>
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><span>Forma de Protesto</span></React.Fragment>}>
                            <FormaProtestoTab protestId={props.id} selected={props.forma_protesto} options={props.repertorio_acao_all} ></FormaProtestoTab>
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><span>Desdobramento</span></React.Fragment>}>
                            <DesdobramentoTab protestId={props.id} selected={props.desdobramento}></DesdobramentoTab>
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><span>Fonte</span></React.Fragment>}>
                            <FonteTab protestId={props.id} selected={props.fonte} options={props.fonte_all} ></FonteTab>
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><span>Geolocalização</span></React.Fragment>}>
                            <GeolocalizacaoTab protestId={props.id} coordenadas={props.geolocalizacao}></GeolocalizacaoTab>
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><span>Local</span></React.Fragment>}>
                            <LocalTab protestId={props.id} selected={props.local} options={props.local_all}  ></LocalTab>
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><span>Agente do Protesto</span></React.Fragment>}>
                            <AgenteTab protestId={props.id} selected={props.agente} opt_col={props.agente_coletivos} opt_forma={props.agente_forma}   ></AgenteTab>
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><span>Screenshots</span></React.Fragment>}>
                            <ScreenshotTab screenshots={props.screenshots}></ScreenshotTab>
                        </AccordionTab>
                       
                    </Accordion>

                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    if (context.query.id) {
        let cad = await db('protesto').where({ num_seq_protesto: context.query.id }).first();
        cad['data_protesto'] = moment(cad['data_protesto']).format('DD/MM/YYYY')

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

        //  hist = await db('saude.covid_hist').column(db.raw("to_char(quando,'DD/MM/yyyy') as quando"), 'quem', 'acao').where({ num: context.query.id })
        // hist.unshift({ quem: cad['resp_digit'], acao: 'Realizou o cadastro', quando: cad['data_cadastro'] })

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

                // hist,
                // view: context.query.view ? true : false
            }
        }

    }

}