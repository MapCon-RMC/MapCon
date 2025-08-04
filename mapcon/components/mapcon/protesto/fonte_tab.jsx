// Importações de componentes do PrimeReact
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from "primereact/datatable";
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from "primereact/dropdown";

// React e hooks
import React, { useRef, useState } from "react";

// React Hook Form para manipulação de formulários
import { useForm, Controller } from "react-hook-form";

// Axios para chamadas HTTP
import axios from "axios";

// Função do next-auth para obter a sessão do usuário logado
import { getSession } from 'next-auth/react';

// Componente que gerencia fontes associadas a um protesto
export function FonteTab({ protestId, options, selected }, props) {

    // Estados para os valores selecionados e para controle de carregamento
    const [selectedValue, setselectedValue] = useState(selected);
    const [loading, setloading] = useState(false);

    // Hook do formulário com controle de erros e envio
    const { control, watch, handleSubmit, formState: { errors }, reset } = useForm();

    // Ref usado para exibir mensagens Toast
    const toast = useRef(null);

    // Função executada ao submeter o formulário
    async function onSubmit(e) {
        // Associa o ID do protesto
        e['protesto_num_seq_protesto'] = protestId;

        // Obtém o nome da fonte com base no ID selecionado
        const nameCategory = options.filter(option => option.id == e.fonte_protesto_num_seq_fonte_protesto)[0].name;

        // Pega a sessão atual do usuário
        const session = await getSession();

        // Envia os dados via POST para a API
        const ret = await axios.post(`/api/mapcon/fonte`, {
            ...e,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        });

        // Se deu certo, limpa o formulário e atualiza a tabela com o novo item
        if (ret.status === 200) {
            reset();
            selectedValue.push({
                id: ret.data[0].num_seq_fonte,
                name: nameCategory,
                referencia: ret.data[0].referencia
            });
            setselectedValue(selectedValue);
        }
    }

    // Função que confirma e remove um item da tabela
    async function removeValue(e) {
        confirmDialog({
            message: 'Tem certeza que deseja remover esse registro?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                const session = await getSession();

                // Envia DELETE com dados do item e do usuário
                await axios.delete('/api/mapcon/fonte', {
                    data: {
                        num_seq_fonte: e.id,
                        user: {
                            id: session.user.id,
                            perfil: session.user.perfil
                        }
                    }
                });

                // Atualiza a lista após remoção
                const newSelectedValues = selectedValue.filter(v => v.id != e.id);
                setselectedValue(newSelectedValues);
            },
            reject: () => null
        });
    }

    // Função que permite copiar o conteúdo de uma célula ao clicar nela (DataTable não permite copiar nativamente)
    const onValueSelected = (e) => {
        toast.current.show({
            severity: 'info',
            summary: 'Valor copiado',
            detail: `Valor ${String(e.value).slice(8, 25).concat(String(e.value).length > 17 ? '...' : '')} copiado`
        });

        navigator.clipboard.writeText(e.value); // Copia para a área de transferência
    }

    // Template para o botão de excluir
    function acoesTemplate(rowData) {
        return (
            <Button
                onClick={() => removeValue(rowData)}
                style={{ float: 'right' }}
                icon="pi pi-times"
                className="p-button-rounded p-button-danger"
            />
        );
    }

    // Renderização do componente
    return (
        <React.Fragment>
            {/* Modal de confirmação */}
            <ConfirmDialog />

            {/* Formulário de cadastro */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-2 p-mt-2">

                    {/* Campo: Fonte */}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="fonte_protesto_num_seq_fonte_protesto">Fonte*</label>
                        <Controller
                            name="fonte_protesto_num_seq_fonte_protesto"
                            rules={{ required: true }}
                            control={control}
                            render={({ field: { onChange, value = '' } }) => (
                                <Dropdown
                                    className={errors.fonte_protesto_num_seq_fonte_protesto && 'p-invalid'}
                                    value={value}
                                    options={options}
                                    onChange={e => onChange(e.value)}
                                    optionLabel="name"
                                    optionValue="id"
                                    filter
                                    filterBy="name"
                                    showClear
                                    placeholder="Selecione uma fonte"
                                />
                            )}
                        />
                    </div>

                    {/* Campo: Referência */}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="referencia">Referência</label>
                        <Controller
                            name="referencia"
                            control={control}
                            render={({ field: { onChange, value = '' } }) => (
                                <InputTextarea
                                    disabled={props.view}
                                    rows={5}
                                    className={errors.referencia ? "p-invalid" : ""}
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                    </div>

                    {/* Botão "Adicionar" */}
                    <div className="p-field p-col-12 p-md-offset-9 p-md-3">
                        {!props.view ? <Button label="Adicionar" icon="pi pi-plus" /> : null}
                    </div>
                </div>
            </form>

            {/* Toast para exibir notificações (ex: cópia de conteúdo) */}
            <Toast ref={toast} />

            {/* Tabela com fontes cadastradas */}
            <DataTable
                loading={loading}
                value={selectedValue}
                cellSelection
                onCellSelect={onValueSelected} // permite clicar e copiar valor
            >
                <Column field="id" header="Id" />
                <Column field="name" header="Fonte" />
                <Column field="referencia" header="Referência" />
                <Column header="Ação" body={acoesTemplate} />
            </DataTable>
        </React.Fragment>
    );
}
