import { Column } from "primereact/column";
import { Button } from "primereact/button"
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import React, { useState } from "react";
import { getSession } from 'next-auth/react'

export function AgenteTab({ protestId, opt_col,opt_forma, selected }, props) {

    const [selectedValue, setselectedValue] = useState(selected)
    const [loading, setloading] = useState(false)

    const { control, watch, handleSubmit, errors, reset } = useForm({
        defaultValues: {
            cidade_num_seq_cidade: null,
            endereco: '',
            origem_manifestacao: '',
            bairro_num_seq_bairro: null,
        }
    });


    async function onSubmit(e) {


       
        e['protesto_num_seq_protesto'] = protestId

        

        const nameColetivo = opt_col.filter(option => option.id == e.agente_protesto_num_seq_agente_protesto)[0].name;
        const nameForma = opt_forma.filter(option => option.id == e.forma_participacao_num_seq_forma_participacao)[0].name;

     
        const session = await getSession();
        const ret = await axios.post(`/api/mapcon/participacao_agente`, {
            e,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        })
        reset();
        selectedValue.push({ 'id': ret.data[0].num_seq_participacao_agente, 'name': nameColetivo, 'forma': nameForma  })
        // setselectedValue(selectedValue)

    }

    async function removeValue(e) {
        confirmDialog({
            message: 'Tem certeza que deseja remover esse registro?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                const session = await getSession();
                await axios.delete('/api/mapcon/participacao_agente', { 
                    data: { 'num_seq_participacao_agente': e.id },
                    user: {
                        id: session.user.id,
                        perfil: session.user.perfil
                    }
                })
                const newSelectedValues = selectedValue.filter(v => v.id != e.id)
                setselectedValue(newSelectedValues)
            },
            reject: () => null
        });

    }

    function acoesTemplate(rowData) {
        return <Button onClick={() => removeValue(rowData)} style={{ float: 'right' }} icon="pi pi-times" className="p-button-rounded p-button-danger" />;
    }

    return (
        <React.Fragment>
            <ConfirmDialog/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-2 p-mt-2">

                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="agente_protesto_num_seq_agente_protesto">Nome do Coletivo*</label>
                        <Controller name="agente_protesto_num_seq_agente_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={props.agente_protesto_num_seq_agente_protesto && 'p-invalid'} value={value} options={opt_col} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name" showClear placeholder="Selecione um coletivo" />
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="forma_participacao_num_seq_forma_participacao">Forma de Participação*</label>
                        <Controller name="forma_participacao_num_seq_forma_participacao" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={props.forma_participacao_num_seq_forma_participacao && 'p-invalid'} value={value} options={opt_forma} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name" showClear placeholder="Selecione uma forma" />
                        } />
                    </div>

                    <div className="p-field p-col-12 p-md-offset-9 p-md-3">
                        {!props.view ? <Button label="Adicionar" icon="pi pi-plus" /> : null}
                    </div>
                </div>
            </form>
            {/* <Dropdown value={selectedValue} panelStyle={{ width: '100%' }} style={{ marginBottom: '10px' }} options={comboOptions} onChange={onValueSelected} optionLabel="name" filter filterBy="name" placeholder="Selecione um valor" /> */}
            <DataTable loading={loading} value={selectedValue}>
                <Column field="id" header="Id"></Column>
                <Column field="name" header="Nome do Coletivo"></Column>
                <Column field="forma" header="Forma de Participação"></Column>
                <Column fheader="Ação" body={acoesTemplate}></Column>
            </DataTable>
        </React.Fragment>
    )

}