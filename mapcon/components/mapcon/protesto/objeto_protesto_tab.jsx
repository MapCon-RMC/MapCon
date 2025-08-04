import { Column } from "primereact/column";            // Colunas para DataTable PrimeReact
import { Button } from "primereact/button"              // Botões estilizados PrimeReact
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'; // Diálogo de confirmação
import { DataTable } from "primereact/datatable";       // Componente tabela
import { InputText } from 'primereact/inputtext';       // Campo texto simples
import { InputTextarea } from 'primereact/inputtextarea'; // Campo texto multilinha
import { Dropdown } from "primereact/dropdown";         // Dropdown para seleção
import React, { useState } from "react";                 // React e hooks
import { useForm, Controller } from "react-hook-form";  // Formulário controlado
import axios from "axios";                               // Cliente HTTP
import { getSession } from 'next-auth/react'            // Sessão do usuário autenticado
import SubForm from './SubForm';                         // Componente de formulário personalizado

export function ObjetoProtestoTab({ protestId, options, selected }, props) {

    // Estado para armazenar os objetos de protesto selecionados ou já carregados
    const [selectedValue, setselectedValue] = useState(selected)
    // Estado para controle de loading, ex: spinner na tabela
    const [loading, setloading] = useState(false)

    // Configuração do react-hook-form
    const { control, watch, handleSubmit, formState: { errors }, reset } = useForm();

    // Função executada ao submeter o formulário
    async function onSubmit(e) {
        e['protesto_num_seq_protesto'] = protestId  // Adiciona o id do protesto ao objeto de envio

        // Busca o nome da categoria do objeto selecionada para exibir na tabela
        const nameCategory = options.filter(option => option.id === e.categoria_objeto_num_seq_categoria_objeto)[0].name;
        const session = await getSession(); // Busca dados do usuário autenticado

        // Chamada POST para criar o objeto de protesto no backend
        const ret = await axios.post(`/api/mapcon/objeto_protesto`, {
            ...e,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        })

        // Se inserção foi bem sucedida
        if (ret.status === 200) {
            reset(); // Limpa formulário
            // Atualiza lista com novo objeto adicionado
            selectedValue.push({ 'id': ret.data[0].num_seq_objeto_protesto, 'name': ret.data[0].objeto_protesto, 'categoria': nameCategory });
            setselectedValue(selectedValue);
        }    
    }

    // Função para remover um objeto de protesto da lista após confirmação do usuário
    async function removeValue(e) {
        confirmDialog({
            message: 'Tem certeza que deseja remover esse registro?',  // Mensagem de confirmação
            header: 'Confirmação',                                    // Título do diálogo
            icon: 'pi pi-exclamation-triangle',                       // Ícone de aviso
            acceptLabel: 'Sim',                                       // Texto botão "sim"
            rejectLabel: 'Não',                                       // Texto botão "não"
            // Se usuário aceitar, remove registro via API e atualiza lista
            accept: async () => {
                const session = await getSession();
                await axios.delete('/api/mapcon/objeto_protesto', {data: { 
                    'num_seq_objeto_protesto': e.id,
                    user: {
                        id: session.user.id,
                        perfil: session.user.perfil
                    }
                }})
                // Remove item da lista em estado local
                const newSelectedValues = selectedValue.filter(v => v.id != e.id)
                setselectedValue(newSelectedValues)
            },
            reject: () => null // Se rejeitar, não faz nada
        });
    }

    // Template da coluna "Ação" para botão remover em cada linha da tabela
    function acoesTemplate(rowData) {
        return <Button onClick={() => removeValue(rowData)} style={{ float: 'right' }} icon="pi pi-times" className="p-button-rounded p-button-danger" />;
    }

    return (
        <>
            {/* Componente que habilita o diálogo de confirmação */}
            <ConfirmDialog/>

            {/* Componente de formulário personalizado, recebe função onSubmit já ligada ao handleSubmit */}
            <SubForm onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-2 p-mt-2">
                    {/* Campo de texto para o nome do objeto do protesto */}
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="objeto_protesto">Objeto do Protesto*</label>
                        <Controller name="objeto_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputText disabled={props.view} className={errors.objeto_protesto ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                        } />
                    </div>

                    {/* Dropdown para selecionar categoria do objeto */}
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="categoria_objeto_num_seq_categoria_objeto">Categoria do Objeto*</label>
                        <Controller name="categoria_objeto_num_seq_categoria_objeto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={errors.categoria_objeto_num_seq_categoria_objeto && 'p-invalid'} value={value} options={options} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name" showClear placeholder="Selecione uma categoria" />
                        } />
                    </div>

                    {/* Campo de texto multilinha para descrição opcional do objeto */}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="descritor_objeto_protesto">Descritor</label>
                        <Controller name="descritor_objeto_protesto" control={control} render={({field: { onChange, value = '' }}) =>
                            <InputTextarea disabled={props.view} rows={5} className={errors.descritor_objeto_protesto ? "p-invalid" : ""} value={value} onChange={onChange}></InputTextarea>
                        } />
                    </div>
                </div>
            </SubForm>

            {/* Tabela que lista os objetos de protesto já adicionados */}
            <DataTable loading={loading} value={selectedValue}>
                <Column field="id" header="Id"></Column>
                <Column field="name" header="Objeto do Protesto"></Column>
                <Column field="categoria" header="Categoria do Objeto"></Column>
                <Column fheader="Ação" body={acoesTemplate}></Column> {/* Botão remover */}
            </DataTable>
        </>
    )
}

