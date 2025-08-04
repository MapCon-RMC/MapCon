// Importações de componentes do PrimeReact
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { Panel } from 'primereact/panel';
import { Timeline } from 'primereact/timeline';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toast } from 'primereact/toast';

// React e hooks
import React, { useRef } from 'react';

// Formulários e validação
import { useForm, Controller } from "react-hook-form";

// Requisições HTTP e autenticação
import axios from 'axios';
import { getSession } from 'next-auth/react';

// Manipulação de datas
import moment from 'moment';

// Componentes da aplicação
import ToolbarMapCon from '../../../components/toolbar_mapcon';
import { ObjetoProtestoTab } from './objeto_protesto_tab';
import { FormaProtestoTab } from './forma_protesto_tab';
import { DesdobramentoTab } from './desdobramento_tab';
import { FonteTab } from './fonte_tab';
import { LocalTab } from './local_tab';
import { AgenteTab } from './agente_tab';
import { ScreenshotTab } from './screenshot_tab';
import { useFormContext } from './FormProvider';

// Importa componente com renderização somente no client-side
import dynamic from 'next/dynamic';


export default function FormGeral(props) {
    // Carrega o componente de Geolocalização apenas no cliente (evita erro no SSR)
    const GeolocalizacaoTab = dynamic(() => import("./geolocalizacao_tab"), { ssr: false });

    // Acesso ao contexto dos formulários filhos (usado para submit global)
    const formContext = useFormContext();
    const submitForms = formContext ? formContext.submitForms : () => {
        console.log("Form context is undefined");
    };

    // Referência para exibir mensagens de feedback
    const toast = useRef(null);

    // Inicializa formulário com dados recebidos por props
    const { control, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: props.form
    });

    // Opções de status do protesto
    const status_options = [
        { id: 0, label: 'Em Preenchimento' },
        { id: 1, label: 'Finalizado (Publicado)' },
        { id: 2, label: 'Finalizado (Não Publicado)' },
    ];


       const onSubmitFormGeral = async data => {
        // Converte a data do formato DD/MM/YYYY para YYYY-MM-DD
        data['data_protesto'] = moment(data['data_protesto'], 'DD/MM/YYYY').format('YYYY-MM-DD');

        // Se estiver editando (existe um ID), faz update via PUT
        if (props.id) {
            data['num_seq_protesto'] = props.id;

            const session = await getSession();

            axios.put('/api/mapcon/protesto', {
                ...data,
                user: {
                    id: session.user.id,
                    perfil: session.user.perfil
                }
            }).then(r => {
                toast.current.show({
                    severity: 'success',
                    summary: 'Dados Atualizados',
                    detail: 'Os dados foram atualizados com sucesso.',
                    life: 3000
                });
            });
        }
    };


        const form_geral = (
        <form onSubmit={handleSubmit(onSubmitFormGeral)}>
            <div className="p-fluid p-formgrid p-grid p-mt-lg-2 p-mt-2">
                {/* Tema do protesto */}
                <div className="p-field p-col-12 p-md-9">
                    <label htmlFor="tema_protesto">Tema*</label>
                    <Controller name="tema_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                        <InputText disabled={props.view} className={errors.tema_protesto ? "p-invalid" : ""} value={value} onChange={onChange} />
                    } />
                </div>

                {/* Data do protesto */}
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="data_protesto">Data*</label>
                    <Controller name="data_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                        <InputMask disabled={props.view} className={errors.data_protesto ? "p-invalid" : ""} unmask={false} mask="99/99/9999" value={value} onChange={e => onChange(e.value)} />
                    } />
                </div>

                {/* Descrição resumida */}
                <div className="p-field p-col-12 p-md-9">
                    <label htmlFor="desc_protesto">Descrição Sumária</label>
                    <Controller name="desc_protesto" control={control} render={({field: { onChange, value = '' }}) =>
                        <InputText disabled={props.view} className={errors.desc_protesto ? "p-invalid" : ""} value={value} onChange={onChange} />
                    } />
                </div>

                {/* Quantidade de envolvidos */}
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="qtde_envolvidos_protesto">Quantidade de Envolvidos</label>
                    <Controller name="qtde_envolvidos_protesto" control={control} render={({field: { onChange, value = '' }}) =>
                        <InputNumber disabled={props.view} className={errors.qtde_envolvidos_protesto ? "p-invalid" : ""} value={value} onChange={e => onChange(e.value)} />
                    } />
                </div>

                {/* Descrição detalhada */}
                <div className="p-field p-col-12 p-md-12">
                    <label htmlFor="desc_detal_protesto">Descrição</label>
                    <Controller name="desc_detal_protesto" control={control} render={({field: { onChange, value = '' }}) =>
                        <InputTextarea disabled={props.view} rows={5} className={errors.desc_detal_protesto ? "p-invalid" : ""} value={value} onChange={onChange} />
                    } />
                </div>

                {/* Status do protesto */}
                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="status">Status*</label>
                    <Controller name="status" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                        <Dropdown className={errors.status && 'p-invalid'} value={value} options={status_options} onChange={(e) => onChange(e.value)} optionLabel="label" optionValue="id" showClear placeholder="Selecione um status" />
                    } />
                </div>

                {/* Conflito relacionado */}
                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="conflito_num_seq_conflito">Conflito</label>
                    <Controller name="conflito_num_seq_conflito" control={control} render={({field: { onChange, value = '' }}) =>
                        <Dropdown className={errors.conflito_num_seq_conflito && 'p-invalid'} value={value} options={props.conflitos_all} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name" showClear placeholder="Selecione um conflito" />
                    } />
                </div>
            </div>
        </form>
    );


     const handleSubmits = async (e) => {
        e.preventDefault();
        submitForms(); // Chama o envio do contexto que engloba todas as tabs
    };

        return (
        <div>
            <Accordion className="accordion-custom">
                <AccordionTab header={<span>Geral</span>}>
                    {form_geral}
                </AccordionTab>
                <AccordionTab header={<span>Objeto do Protesto</span>}>
                    <ObjetoProtestoTab protestId={props.id} selected={props.objetos_protesto} options={props.objetos_protesto_all} />
                </AccordionTab>
                <AccordionTab header={<span>Forma de Protesto</span>}>
                    <FormaProtestoTab protestId={props.id} selected={props.forma_protesto} options={props.repertorio_acao_all} />
                </AccordionTab>
                <AccordionTab header={<span>Desdobramento</span>}>
                    <DesdobramentoTab protestId={props.id} selected={props.desdobramento} />
                </AccordionTab>
                <AccordionTab header={<span>Fonte</span>}>
                    <FonteTab protestId={props.id} selected={props.fonte} options={props.fonte_all} />
                </AccordionTab>
                <AccordionTab header={<span>Geolocalização</span>}>
                    <GeolocalizacaoTab protestId={props.id} coordenadas={props.geolocalizacao} />
                </AccordionTab>
                <AccordionTab header={<span>Local</span>}>
                    <LocalTab protestId={props.id} selected={props.local} options={props.local_all} />
                </AccordionTab>
                <AccordionTab header={<span>Agente do Protesto</span>}>
                    <AgenteTab protestId={props.id} selected={props.agente} opt_col={props.agente_coletivos} opt_forma={props.agente_forma} />
                </AccordionTab>
                <AccordionTab header={<span>Screenshots</span>}>
                    <ScreenshotTab screenshots={props.screenshots} />
                </AccordionTab>
            </Accordion>

            {/* Botão final de envio */}
            <div className="p-field p-col-12 p-md-offset-9 p-md-3">
                <Button label="Gravar" icon="pi pi-save" onClick={handleSubmits} />
            </div>
        </div>
    );
}
