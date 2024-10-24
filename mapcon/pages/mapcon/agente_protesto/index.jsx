import React, { useEffect,useRef, useState } from 'react';
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

export default function AgenteProtestoPage(props) {

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
        const r = await axios.get('/api/mapcon/catagente?limit=-1', { params: {
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        }})

        setshowForm({ visible: true, categoria_agentes: r.data['data'] })
    }

    async function editButtonClicked(row) {
        const session = await getSession();
        const r = await axios.get('/api/mapcon/agente_protesto', { params: {
            id: row[0].num_seq_agente_protesto,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        } })
        const r2 = await axios.get('/api/mapcon/catagente?limit=-1', { params: {
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        }})
        
        setshowForm({
            //visible: true,
            data: r.data,
            categoria_agentes: r2.data['data'],
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
            await axios.delete('/api/mapcon/agente_protesto', { 
                data: { num_seq_agente_protesto: item.num_seq_agente_protesto },
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
        { label: 'Nome do Agente', value: 'agente_protesto', types: ['contain', 'equal'] },
    ];


    return (loading ? <Loading></Loading> :
        <div>
            <ToolbarMapCon></ToolbarMapCon>
            <ConfirmDialog/>
            <div className="p-grid p-formgrid p-m-lg-3 p-m-2">
                <div className="p-col-12 p-mb-12 p-lg-12 p-mb-lg-0">

                    <TableCrud ref={childRef}
                        {...props}
                        title="Agentes"
                        filters={filters}
                        onAddButtonClicked={addButtonClicked}
                        onEditButtonClicked={editButtonClicked}
                        onDeleteButtonClicked={deleteButtonClicked}
                        url='/api/mapcon/agente_protesto'>

                        <Column field="num_seq_agente_protesto" header="Código" sortable={true} />
                        <Column field="agente_protesto" header="Nome do Agente" sortable={true} />
                        <Column field="desc_categoria_agente" header="Descrição do Agente" sortable={true} />
                        {/* <Column header="Ações" body={actionBodyTemplate}></Column> */}
                    </TableCrud>

                </div>
            </div>
            {showForm.visible ? <AgenteForm showForm={showForm} closeForm={(update) => closeFormDialog(update)}></AgenteForm> : null}
        </div>
    );

}

/*
    Dialog para formulário de inclusão/edição do crud
*/
function AgenteForm(props) {

    const categoria_agentes = props.showForm.categoria_agentes;
    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: props.showForm.data });

    const onSubmit = async data => {
        const session = await getSession();
        if(props.showForm.data) { // Editar
            await axios.put('/api/mapcon/agente_protesto', {
                num_seq_agente_protesto: props.showForm.data.num_seq_agente_protesto,
                ...data,
                user: {
                    id: session.user.id,
                    perfil: session.user.perfil
                }
            })
        } else {
            await axios.post('/api/mapcon/agente_protesto', {
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
        
        <Dialog header="Agente" className="p-fluid" modal visible={props.showForm.visible} onHide={() => props.closeForm(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-4 p-mt-4">
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="agente_protesto">Nome do Agente*</label>
                        <Controller name="agente_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText disabled={props.view} className={errors.bairro ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="categoria_agente_num_seq_categoria_agente">Categoria do Agente*</label>
                        <Controller name="categoria_agente_num_seq_categoria_agente" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={errors.categoria_agente_num_seq_categoria_agente && 'p-invalid'} value={value} options={categoria_agentes} onChange={e => onChange(e.value)} optionLabel="desc_categoria_agente" optionValue="num_seq_categoria_agente" showClear placeholder="Selecione uma Categoria" />
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
