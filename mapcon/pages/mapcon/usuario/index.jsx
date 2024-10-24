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
import {Password} from 'primereact/password';

export default function UsuarioPage(props) {

    const router = useRouter()

    const [showForm, setshowForm] = useState({ visible: false })
    const [loading, setloading] = useState(true)
    const [showSenhaForm, setshowSenhaForm] = useState({ visible: false })

    // Para conseguir atualizar datatable
    const childRef = useRef();

    const login = async () => {
        const session = await getSession();
        if (!session) {
          router.push("/login");
        } else {
          setloading(false);
        }
      };
    
      useEffect(() => {
        login();
      }, []);


    async function addButtonClicked(e) {
        setshowForm({ visible: true })
    }

    async function editButtonClicked(row) {
        const session = await getSession();
        const r = await axios.get('/api/mapcon/usuario', { 
            params: { id: row[0].num_seq_usuario },
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        })
        
        setshowForm({
            visible: true,
            data: r.data,
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
            await axios.delete('/api/mapcon/usuario', { 
                data: { num_seq_usuario: item.num_seq_usuario },
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

    async function openSenhaDialog(row) {
        setshowSenhaForm({
            visible: true,
            num: row.num_seq_usuario
        })
    }

    function closeSenhaDialog(update) {
        setshowSenhaForm(false)
    }

    // Filtros
    const filters = [
        { label: 'Username', value: 'usu_login', types: ['contain', 'equal'] },
    ];

    function actionBodyTemplate(rowData) {
        return (
            <React.Fragment>
                <span className="p-column-title">Ações</span>
                <Button icon='pi pi-key' className="p-button-primary p-mr-2" onClick={() => openSenhaDialog(rowData)} />
            </React.Fragment>
        );
    }

    return (loading ? <Loading></Loading> :
        <div>
            <ToolbarMapCon/>
            <ConfirmDialog/>
            <div className="p-grid p-formgrid p-m-lg-3 p-m-2">
                <div className="p-col-12 p-mb-12 p-lg-12 p-mb-lg-0">
                    <TableCrud ref={childRef}
                        {...props}
                        title="Usuários"
                        filters={filters}
                        onAddButtonClicked={addButtonClicked}
                        onEditButtonClicked={editButtonClicked}
                        onDeleteButtonClicked={deleteButtonClicked}
                        url='/api/mapcon/usuario'>

                        <Column field="num_seq_usuario" header="Código" sortable={true} />
                        <Column field="usu_login" header="Username" sortable={true} />

                        <Column header="Ações" body={actionBodyTemplate}></Column>
                    </TableCrud>
                </div>
            </div>
            {showForm.visible ? <UsuarioForm showForm={showForm} closeForm={(update) => closeFormDialog(update)}></UsuarioForm> : null}
            {showSenhaForm.visible ? <UsuarioSenhaForm showForm={showSenhaForm} closeForm={(update) => closeSenhaDialog(update)}></UsuarioSenhaForm> : null}
        </div>
    );
}

/*
    Dialog que permite atualizar a situação de um cadastro
*/
function UsuarioSenhaForm(props) {
    // const { control, watch, handleSubmit, errors } = useForm({ defaultValues: props.showForm.values });
    const { watch, handleSubmit, control, formState, reset } = useForm({ defaultValues: props.showForm.values });

    const watchSenha = watch('usu_senha')

    const onSubmit = async data => {
        console.debug('ATUALIZANDO SENHA', data)
        delete data['usu_senha_repetir']
        const session = await getSession();
        await axios.put('/api/mapcon/usuario', {
                ...data,
                user: {
                    id: session.user.id,
                    perfil: session.user.perfil
                },
                num_seq_usuario: props.showForm.num
            })

        props.closeForm(true)
        
    }

    return (
        <Dialog header="Atualizar Senha" className="p-fluid" modal visible={props.showForm.visible} onHide={() => props.closeForm(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-4 p-mt-4">
        
                <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="usu_senha">Senha*</label>
                        <Controller name="usu_senha" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            // <InputText disabled={props.view} className={errors.usu_senha ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                            <Password id="usu_senha" disabled={props.view} promptLabel={'Digite uma senha'} weakLabel={'Fraca'} mediumLabel={'Média'} strongLabel={'Forte'} className={props.usu_senha ? "p-invalid" : ""} value={value} onChange={onChange}></Password>
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="usu_senha_repetir">Repetir Senha*</label>
                        <Controller name="usu_senha_repetir" rules={{ validate: value => value === watchSenha }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText id="usu_senha_repetir" disabled={props.view} type="password" className={props.usu_senha_repetir ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>  

                    <div className="p-field p-col-12 p-md-offset-6 p-md-6">
                        <Button label={"Atualizar"} icon="pi pi-check"/>
                    </div>
                </div>
            </form>
        </Dialog>
    )
}


/*
    Dialog para formulário de inclusão/edição do crud
*/
function UsuarioForm(props) {
    const { control, watch, handleSubmit, errors } = useForm({ defaultValues: props.showForm.data });

    const onSubmit = async data => {
        console.debug('DATA: ', data);
        console.debug('PROPS DATA: ', props);
        const session = await getSession();
        if(props.showForm.data) {
            await axios.put('/api/mapcon/usuario',{
                num_seq_usuario: props.showForm.data.num_seq_usuario,
                user: {
                    id: session.user.id,
                    perfil: session.user.perfil
                },
                ...data
            })
        } else {
            console.debug('SESSION ON SUBMIT', await getSession());
            delete data['usu_senha_repetir']
            await axios.post('/api/mapcon/usuario',{
                ...data,
                user: {
                    id: session.user.id,
                    perfil: session.user.perfil
                }
            })
        }
        props.closeForm(true)
    }

    const watchSenha = watch('usu_senha')

    const perfis = [
        {
            id : 1,
            value: 'Administrador'
        },
        {
            id : 2,
            value: 'Usuário'
        },
    ]

    return (
        <Dialog header="Usuário" className="p-fluid" modal visible={props.showForm.visible} onHide={() => props.closeForm(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-4 p-mt-4">
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="usu_login">Username*</label>
                        <Controller name="usu_login" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText id="usu_login" disabled={props.view} className={props.usu_login ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>
                    {props.showForm.data == undefined ?
                    <React.Fragment>
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="usu_senha">Senha*</label>
                        <Controller name="usu_senha" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Password id="usu_senha" disabled={props.view} promptLabel={'Digite uma senha'} weakLabel={'Fraca'} mediumLabel={'Média'} strongLabel={'Forte'} className={props.usu_senha ? "p-invalid" : ""} value={value} onChange={onChange}></Password>
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="usu_senha_repetir">Repetir Senha*</label>
                        <Controller name="usu_senha_repetir" rules={{ validate: value => value === watchSenha }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText id="usu_senha_repetir" disabled={props.view} type="password" className={props.usu_senha_repetir ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>
                    
                    </React.Fragment>
                    :null}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="perfil_usuario_num_seq_perfil_usuario">Perfil*</label>
                        <Controller name="perfil_usuario_num_seq_perfil_usuario" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown
                                id="perfil_usuario_num_seq_perfil_usuario"
                                className={props.perfil_usuario_num_seq_perfil_usuario && 'p-invalid'}
                                value={value}
                                options={perfis}
                                onChange={e => onChange(e.value)} // Adding a default no-op function
                                optionLabel="value"
                                optionValue="id"
                                showClear
                                placeholder="Selecione um Perfil"
                            />                        
                        } />
                    </div>
                    <div className="p-field p-col-12 p-md-12">
                        <Button label={props.showForm.data == undefined ? "Adicionar" : "Atualizar"} icon="pi pi-check" />
                    </div>
                </div>
            </form>
        </Dialog>
    )
}
