import { Column } from "primereact/column";
import { Button } from "primereact/button"
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from "primereact/datatable";
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { getSession } from 'next-auth/react'

export function FormaProtestoTab({ protestId, options, selected }, props) {

    const [selectedValue, setselectedValue] = useState(selected)
    const [loading, setloading] = useState(false)

    const { control, watch, handleSubmit, errors, reset } = useForm({
        defaultValues: {
            objeto_protesto: '',
            categoria_objeto_num_seq_categoria_objeto: null,
            descritor_objeto_protesto: ''
        }
    });

    async function onSubmit(e) {

        e['protesto_num_seq_protesto'] = protestId

        const nameCategory = options.filter(option => option.id == e.repertorio_acao_num_seq_repertorio_acao)[0].name;
        const session = await getSession();
        const ret = await axios.post(`/api/mapcon/forma_protesto`, {
            ...e,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        })
        reset();
        selectedValue.push({ 'id': ret.data[0].num_seq_forma_protesto, 'name': ret.data[0].forma_protesto, 'repertorio': nameCategory })
        setselectedValue(selectedValue)

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
                await axios.delete('/api/mapcon/forma_protesto', { 
                    data: { 'num_seq_forma_protesto': e.id },
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
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="forma_protesto">Forma de Protesto*</label>
                        <Controller name="forma_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText disabled={props.view} className={props.forma_protesto ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="repertorio_acao_num_seq_repertorio_acao">Repertório da Ação*</label>
                        <Controller name="repertorio_acao_num_seq_repertorio_acao" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={props.repertorio_acao_num_seq_repertorio_acao && 'p-invalid'} value={value} options={options} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name" showClear placeholder="Selecione uma categoria" />
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
                <Column field="name" header="Objeto do Protesto"></Column>
                <Column field="repertorio" header="Repertório da ação"></Column>
                <Column fheader="Ação" body={acoesTemplate}></Column>
            </DataTable>
        </React.Fragment>
    )

}