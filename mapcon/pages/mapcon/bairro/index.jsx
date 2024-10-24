import React, { useEffect, useRef, useState } from 'react';
import TableCrud from '../../../lib/front/cruddatatable/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router'
import axios from 'axios';
import ToolbarMapCon from '../../../components/toolbar_mapcon';
import Loading from '../../../components/loading/loading';
import { getSession } from 'next-auth/react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useForm, Controller } from "react-hook-form";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

export default function BairroPage(props) {

    const router = useRouter()

    const [showForm, setshowForm] = useState({ visible: false })
    const [loading, setloading] = useState(true)

    // Para conseguir atualizar datatable
    const childRef = useRef();

    // Redireciona para login caso não esteja autenticado
    useEffect(() => {
        const login = async () => {
            const session = await getSession();
            if (!session) {
              router.push("/login");
            } else {
              setloading(false);
            }
        };
        login();
    }, []);


    async function addButtonClicked(e) {
        const session = await getSession();
        const r = await axios.get('/api/mapcon/cidade?limit=-1', { params: {
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        }})

        setshowForm({ visible: true, cidades: r.data['data'] })
    }

    async function editButtonClicked(row) {
        const session = await getSession();
        const r = await axios.get('/api/mapcon/bairro', { params: { 
            id: row[0].num_seq_bairro,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        } })
        const r2 = await axios.get('/api/mapcon/cidade?limit=-1', { params: {
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        }})

        setshowForm({
            //visible: true,
            data: r.data,
            cidades: r2.data['data'],
            visible: true
        })
    }


    async function deleteButtonClicked(e, search) {
        confirmDialog({
            message: e.length > 1 ? 'Tem certeza que deseja remover os dados selecionados?' : 'Tem certeza que deseja remover o dado selecionado?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            accept: () => removeRows(e),
            acceptLabel: 'Sim',
            rejectLabel: 'Não'
            // reject: () => rejectFunc()
        });
    }

    async function removeRows(e) {
        const session = await getSession();
        for (const item of e) {
            await axios.delete('/api/mapcon/bairro', { 
                data: { num_seq_bairro: item.num_seq_bairro },
                user: {
                    id: session.user.id,
                    perfil: session.user.perfil
                }
            })
        }

        childRef.current.updateDatatable()
    }

    // Essa function atualiza fecha o dialog e atualiza o datatable o form tiver atualizado
    function closeFormDialog(update) {
        setshowForm(false)
        if (update) {
            childRef.current.updateDatatable()
        }
    }

    // Filtros
    const filters = [
        { label: 'Bairro', value: 'bairro', types: ['contain', 'equal'] },
        { label: 'Cidade', value: 'cidade', types: ['contain', 'equal'] },
    ];


    return (loading ? <Loading></Loading> :
        <div>
            <ToolbarMapCon></ToolbarMapCon>
            <ConfirmDialog/>
            <div className="p-grid p-formgrid p-m-lg-3 p-m-2">
                <div className="p-col-12 p-mb-12 p-lg-12 p-mb-lg-0">
                    <TableCrud ref={childRef}
                        {...props}
                        title="Bairros"
                        filters={filters}
                        onAddButtonClicked={addButtonClicked}
                        onEditButtonClicked={editButtonClicked}
                        onDeleteButtonClicked={deleteButtonClicked}
                        url='/api/mapcon/bairro'>

                        <Column field="num_seq_bairro" header="Código" sortable={true} />
                        <Column field="bairro" header="Nome do Bairro" sortable={true} />
                        <Column field="cidade" header="Cidade" sortable={true} />
                        {/* <Column header="Ações" body={actionBodyTemplate}></Column> */}
                    </TableCrud>

                </div>
            </div>
            {showForm.visible ? <BairroForm showForm={showForm} closeForm={(update) => closeFormDialog(update)}></BairroForm> : null}
        </div>

    );

}


/*
    Dialog para formulário de inclusão/edição do crud
*/
function BairroForm(props) {
    const cidades = props.showForm.cidades;
    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: props.showForm.data });

    const onSubmit = async data => {
        const session = await getSession();
        if (props.showForm.data) { // Editar
            await axios.put('/api/mapcon/bairro', {
                num_seq_bairro: props.showForm.data.num_seq_bairro,
                ...data,
                user: {
                    id: session.user.id,
                    perfil: session.user.perfil
                }
            })
        } else {
            await axios.post('/api/mapcon/bairro', {
                ...data,
                user: {
                    id: session.user.id,
                    perfil: session.user.perfil
                }
            })
        }

        props.closeForm(true)
    }


    return (
        <Dialog header="Bairro" className="p-fluid" modal visible={props.showForm.visible} onHide={() => props.closeForm(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-4 p-mt-4">
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="bairro">Nome do Bairro*</label>
                        <Controller name="bairro" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText disabled={props.view} className={errors.bairro ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="cidade_num_seq_cidade">Cidade*</label>
                        <Controller name="cidade_num_seq_cidade" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={errors.cidade_num_seq_cidade && 'p-invalid'} value={value} options={cidades} onChange={e => onChange(e.value)} optionLabel="cidade" optionValue="num_seq_cidade" showClear placeholder="Selecione uma Cidade" />
                        } />
                    </div>

                    <div className="p-field p-col-12 p-md-offset-6 p-md-6">
                        <Button label={props.showForm.data !== undefined ? "Atualizar" : "Adicionar"} icon="pi pi-check" />
                    </div>
                </div>
            </form>
        </Dialog>
    )
}
