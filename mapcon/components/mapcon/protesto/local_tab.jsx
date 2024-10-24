import { Column } from "primereact/column";
import { Button } from "primereact/button"
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from "primereact/datatable";
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from "primereact/dropdown";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { getSession } from 'next-auth/react'

export function LocalTab({ protestId, options, selected }, props) {

    const [selectedValue, setselectedValue] = useState(selected)
    const [loading, setloading] = useState(false)
    const [bairros, setbairros] = useState(null)

    const { control, watch, handleSubmit, errors, reset } = useForm({
        defaultValues: {
            cidade_num_seq_cidade: null,
            endereco: '',
            origem_manifestacao: '',
            bairro_num_seq_bairro: null,
        }
    });

    const watchCidade = watch('cidade_num_seq_cidade')

    useEffect(() => {
        const watchCidadeFunc = async () => {
            const session = await getSession();
            if (watchCidade) {
                const r = await (await axios.get('/api/mapcon/bairro', { params: {
                    'limit': '-1',
                    'filters': JSON.stringify([{type: 'equal', field: 'cidade_num_seq_cidade', value: watchCidade }]),
                    user: {
                        id: session.user.id,
                        perfil: session.user.perfil
                    }
                
                } })).data

                setbairros(r.data)    
            }
        }
        watchCidadeFunc()
    }, [watchCidade])


    const origens = [
        { id: 'O', name: 'Origem' },
        { id: 'M', name: 'Manifestação' },
        { id: 'OM', name: 'Origem e Manifestação' }
    ]

    async function onSubmit(e) {
        console.log(e)
        e['protesto_num_seq_protesto'] = protestId 

        const nameCidade = options.filter(option => option.id == e.cidade_num_seq_cidade)[0].name;
        const nameBairro = bairros.filter(bairro => bairro.num_seq_bairro == e.bairro_num_seq_bairro)[0].bairro;

        const session = await getSession();
        const ret = await axios.post(`/api/mapcon/local`, {
            ...e,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        });
        reset();
        selectedValue.push({ 'id': ret.data[0].num_seq_local, 'name': e.endereco, 'cidade': nameCidade, 'bairro': nameBairro  })
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
                await axios.delete('/api/mapcon/local', { 
                    data: { 'num_seq_local': e.id },
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
                        <label htmlFor="endereco">Referência*</label>
                        <Controller name="endereco" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputTextarea disabled={props.view} rows={5} className={props.endereco ? "p-invalid" : ""} value={value} onChange={onChange}></InputTextarea>
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="cidade_num_seq_cidade">Cidade*</label>
                        <Controller name="cidade_num_seq_cidade" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={props.cidade_num_seq_cidade && 'p-invalid'} value={value} options={options} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name" showClear placeholder="Selecione uma cidade" />
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="bairro_num_seq_bairro">Bairro*</label>
                        <Controller name="bairro_num_seq_bairro" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={props.bairro_num_seq_bairro && 'p-invalid'} value={value} options={bairros} onChange={e => onChange(e.value)} optionLabel="bairro" optionValue="num_seq_bairro" filter filterBy="bairro" showClear placeholder="Selecione um bairro" />
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="origem_manifestacao">Origem e/ou Manifestação</label>
                        <Controller name="origem_manifestacao" control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={props.origem_manifestacao && 'p-invalid'} value={value} options={origens} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name" showClear placeholder="Selecione uma opção" />
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
                <Column field="name" header="Endereço"></Column>
                <Column field="bairro" header="Bairro"></Column>
                <Column field="cidade" header="Cidade"></Column>
                <Column fheader="Ação" body={acoesTemplate}></Column>
            </DataTable>
        </React.Fragment>
    )

}