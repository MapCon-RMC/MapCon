// Importações de componentes da biblioteca PrimeReact
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";

// Importações de bibliotecas auxiliares
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import React, { useState } from "react";
import { getSession } from 'next-auth/react';

// Componente AgenteTab: manipula dados de participação de coletivos em protestos
export function AgenteTab({ protestId, opt_col, opt_forma, selected }, props) {
    
    // Estado que armazena os valores selecionados e o estado de carregamento
    const [selectedValue, setselectedValue] = useState(selected);
    const [loading, setloading] = useState(false);

    // Hook de formulário com React Hook Form
    const { control, watch, handleSubmit, formState: { errors }, reset } = useForm();

    // Função chamada ao submeter o formulário
    async function onSubmit(e) {
        // Associa o ID do protesto ao envio
        e['protesto_num_seq_protesto'] = protestId;

        // Busca os nomes correspondentes ao coletivo e à forma de participação selecionados
        const nameColetivo = opt_col.filter(option => option.id == e.agente_protesto_num_seq_agente_protesto)[0].name;
        const nameForma = opt_forma.filter(option => option.id == e.forma_participacao_num_seq_forma_participacao)[0].name;

        // Recupera a sessão do usuário logado
        const session = await getSession();

        // Envia os dados para a API via POST
        const ret = await axios.post(`/api/mapcon/participacao_agente`, {
            ...e,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        });

        // Se a resposta for bem-sucedida, reseta o formulário e atualiza a tabela
        if (ret.status === 200) {
            reset();
            selectedValue.push({
                id: ret.data[0].num_seq_participacao_agente,
                name: nameColetivo,
                forma: nameForma
            });
            // Nota: setselectedValue não é chamado aqui diretamente, pois o push modifica o array referenciado
        }
    }

    // Função que confirma e executa a remoção de um item
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
                    data: {
                        num_seq_participacao_agente: e.id,
                        user: {
                            id: session.user.id,
                            perfil: session.user.perfil
                        }
                    }
                });

                // Filtra e atualiza a lista após remoção
                const newSelectedValues = selectedValue.filter(v => v.id != e.id);
                setselectedValue(newSelectedValues);
            },
            reject: () => null
        });
    }

    // Template para a coluna de ações (botão de deletar)
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
            {/* Componente de confirmação (diálogo modal) */}
            <ConfirmDialog />

            {/* Formulário de cadastro */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-2 p-mt-2">
                    {/* Campo: Nome do Coletivo */}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="agente_protesto_num_seq_agente_protesto">Nome do Coletivo*</label>
                        <Controller
                            name="agente_protesto_num_seq_agente_protesto"
                            rules={{ required: true }}
                            control={control}
                            render={({ field: { onChange, value = '' } }) => (
                                <Dropdown
                                    className={errors.agente_protesto_num_seq_agente_protesto && 'p-invalid'}
                                    value={value}
                                    options={opt_col}
                                    onChange={e => onChange(e.value)}
                                    optionLabel="name"
                                    optionValue="id"
                                    filter
                                    filterBy="name"
                                    showClear
                                    placeholder="Selecione um coletivo"
                                />
                            )}
                        />
                    </div>

                    {/* Campo: Forma de Participação */}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="forma_participacao_num_seq_forma_participacao">Forma de Participação*</label>
                        <Controller
                            name="forma_participacao_num_seq_forma_participacao"
                            rules={{ required: true }}
                            control={control}
                            render={({ field: { onChange, value = '' } }) => (
                                <Dropdown
                                    className={errors.forma_participacao_num_seq_forma_participacao && 'p-invalid'}
                                    value={value}
                                    options={opt_forma}
                                    onChange={e => onChange(e.value)}
                                    optionLabel="name"
                                    optionValue="id"
                                    filter
                                    filterBy="name"
                                    showClear
                                    placeholder="Selecione uma forma"
                                />
                            )}
                        />
                    </div>

                    {/* Botão de adicionar */}
                    <div className="p-field p-col-12 p-md-offset-9 p-md-3">
                        {!props.view ? (
                            <Button label="Adicionar" icon="pi pi-plus" />
                        ) : null}
                    </div>
                </div>
            </form>

            {/* Tabela com os registros adicionados */}
            <DataTable loading={loading} value={selectedValue}>
                <Column field="id" header="Id" />
                <Column field="name" header="Nome do Coletivo" />
                <Column field="forma" header="Forma de Participação" />
                <Column header="Ação" body={acoesTemplate} />
            </DataTable>
        </React.Fragment>
    );
}
