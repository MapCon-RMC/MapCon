import { Column } from "primereact/column";            // Colunas para o DataTable do PrimeReact
import { Button } from "primereact/button"              // Botão estilizado do PrimeReact
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';  // Caixa de diálogo de confirmação
import { DataTable } from "primereact/datatable";       // Componente tabela do PrimeReact
import { InputTextarea } from 'primereact/inputtextarea'; // Campo de texto multilinha
import { Dropdown } from "primereact/dropdown";         // Dropdown para seleção de opções
import React, { useState, useEffect } from "react";     // React e hooks
import { useForm, Controller } from "react-hook-form";  // Gerenciamento de formulários e campos controlados
import axios from "axios";                               // Cliente HTTP para chamadas API
import { getSession } from 'next-auth/react'            // Pega sessão do usuário autenticado

// Componente principal da aba Local
export function LocalTab({ protestId, options, selected }, props) {

    // Estado para armazenar os locais selecionados inicialmente e atualizados
    const [selectedValue, setselectedValue] = useState(selected)
    // Estado para controlar o loading (ex: spinner na tabela)
    const [loading, setloading] = useState(false)
    // Estado para armazenar os bairros disponíveis conforme a cidade selecionada
    const [bairros, setbairros] = useState(null)

    // Configurações do React Hook Form para controlar o formulário
    const { control, watch, handleSubmit, formState: { errors }, reset } = useForm();

    // "watch" para observar o valor do campo "cidade_num_seq_cidade" e reagir a mudanças
    const watchCidade = watch('cidade_num_seq_cidade')

    // Efeito que executa sempre que a cidade selecionada mudar
    useEffect(() => {
        // Função assíncrona para buscar os bairros da cidade selecionada
        const watchCidadeFunc = async () => {
            const session = await getSession(); // Pega sessão do usuário atual
            if (watchCidade) {
                // Faz a requisição GET para buscar bairros da cidade selecionada
                const r = await (await axios.get('/api/mapcon/bairro', { params: {
                    'limit': '-1', // Sem limite, pega todos
                    'filters': JSON.stringify([{type: 'equal', field: 'cidade_num_seq_cidade', value: watchCidade }]), // filtro por cidade
                    user: {
                        id: session.user.id,
                        perfil: session.user.perfil
                    }
                } })).data

                // Atualiza o estado com os bairros retornados
                setbairros(r.data)    
            }
        }
        watchCidadeFunc()
    }, [watchCidade])  // Dependência: executa quando watchCidade muda


    // Opções fixas para o campo "Origem e/ou Manifestação"
    const origens = [
        { id: 'O', name: 'Origem' },
        { id: 'M', name: 'Manifestação' },
        { id: 'OM', name: 'Origem e Manifestação' }
    ]

    // Função executada ao submeter o formulário
    async function onSubmit(e) {
        e['protesto_num_seq_protesto'] = protestId  // Adiciona o id do protesto nos dados

        // Busca o nome da cidade pelo id selecionado para exibir na tabela
        const nameCidade = options.filter(option => option.id == e.cidade_num_seq_cidade)[0].name;
        // Busca o nome do bairro pelo id selecionado
        const nameBairro = bairros.filter(bairro => bairro.num_seq_bairro == e.bairro_num_seq_bairro)[0].bairro;

        // Pega a sessão do usuário atual para enviar no corpo da requisição
        const session = await getSession();

        // Faz requisição POST para criar o local com os dados do formulário
        const ret = await axios.post(`/api/mapcon/local`, {
            ...e,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        });

        // Se sucesso no retorno
        if (ret.status === 200) {
            reset(); // Limpa o formulário
            // Atualiza a lista de locais adicionados com o novo local criado
            selectedValue.push({ 'id': ret.data[0].num_seq_local, 'name': e.endereco, 'cidade': nameCidade, 'bairro': nameBairro  });
            setselectedValue(selectedValue); // Atualiza o estado para refletir na UI
        }
    }

    // Função para remover um local da lista com confirmação modal
    async function removeValue(e) {
        confirmDialog({
            message: 'Tem certeza que deseja remover esse registro?',  // Mensagem do diálogo
            header: 'Confirmação',  // Título do diálogo
            icon: 'pi pi-exclamation-triangle',  // Ícone do diálogo
            acceptLabel: 'Sim',  // Texto do botão aceitar
            rejectLabel: 'Não',  // Texto do botão rejeitar
            // Se usuário aceitar, executa exclusão via API
            accept: async () => {
                const session = await getSession();
                await axios.delete('/api/mapcon/local', {data: { 
                    'num_seq_local': e.id,
                    user: {
                        id: session.user.id,
                        perfil: session.user.perfil
                    }
                }})
                // Atualiza a lista removendo o item excluído
                const newSelectedValues = selectedValue.filter(v => v.id != e.id)
                setselectedValue(newSelectedValues)
            },
            // Se rejeitar, não faz nada
            reject: () => null
        });
    }

    // Template para a coluna de ação na tabela, com botão para remover local
    function acoesTemplate(rowData) {
        return <Button onClick={() => removeValue(rowData)} style={{ float: 'right' }} icon="pi pi-times" className="p-button-rounded p-button-danger" />;
    }

    // Renderização do componente
    return (
        <React.Fragment>
            {/* Componente para habilitar a exibição do diálogo de confirmação */}
            <ConfirmDialog/>
            {/* Formulário para adicionar local */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid p-formgrid p-grid p-mt-lg-2 p-mt-2">

                    {/* Campo de texto multilinha para referência/endereço */}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="endereco">Referência*</label>
                        <Controller name="endereco" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <InputTextarea disabled={props.view} rows={5} className={errors.endereco ? "p-invalid" : ""} value={value} onChange={onChange}></InputTextarea>
                        } />
                    </div>

                    {/* Dropdown para selecionar cidade */}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="cidade_num_seq_cidade">Cidade*</label>
                        <Controller name="cidade_num_seq_cidade" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={errors.cidade_num_seq_cidade && 'p-invalid'} value={value} options={options} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name" showClear placeholder="Selecione uma cidade" />
                        } />
                    </div>

                    {/* Dropdown para selecionar bairro (carregado dinamicamente) */}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="bairro_num_seq_bairro">Bairro*</label>
                        <Controller name="bairro_num_seq_bairro" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={errors.bairro_num_seq_bairro && 'p-invalid'} value={value} options={bairros} onChange={e => onChange(e.value)} optionLabel="bairro" optionValue="num_seq_bairro" filter filterBy="bairro" showClear placeholder="Selecione um bairro" />
                        } />
                    </div>

                    {/* Dropdown para selecionar origem/manifestaçao (opcional) */}
                    <div className="p-field p-col-12 p-md-12">
                        <label htmlFor="origem_manifestacao">Origem e/ou Manifestação</label>
                        <Controller name="origem_manifestacao" control={control} render={({field: { onChange, value = '' }}) =>
                            <Dropdown className={errors.origem_manifestacao && 'p-invalid'} value={value} options={origens} onChange={e => onChange(e.value)} optionLabel="name" optionValue="id" filter filterBy="name" showClear placeholder="Selecione uma opção" />
                        } />
                    </div>

                    {/* Botão para adicionar o local, oculto se modo visualização */}
                    <div className="p-field p-col-12 p-md-offset-9 p-md-3">
                        {!props.view ? <Button label="Adicionar" icon="pi pi-plus" /> : null}
                    </div>
                </div>
            </form>

            {/* Tabela que lista os locais adicionados */}
            <DataTable loading={loading} value={selectedValue}>
                <Column field="id" header="Id"></Column>
                <Column field="name" header="Endereço"></Column>
                <Column field="bairro" header="Bairro"></Column>
                <Column field="cidade" header="Cidade"></Column>
                <Column fheader="Ação" body={acoesTemplate}></Column> {/* Botão remover */}
            </DataTable>
        </React.Fragment>
    )
}
