import { Column } from "primereact/column";
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { getSession } from 'next-auth/react'

// Componente que recebe várias props, incluindo lista de opções, selecionados, nome da tabela, campos e children
export default function RelatedTable({ protestId, options, selected, table, fields, children }) {

    // Estado para os valores selecionados na tabela, inicializado com o prop selected
    const [selectedValue, setselectedValue] = useState(selected)
    // Estado para as opções disponíveis no dropdown, inicializado com o prop options
    const [comboOptions, setcomboOptions] = useState(options)
    // Estado para controlar indicador de carregamento
    const [loading, setloading] = useState(false)

    // Função chamada ao selecionar um valor no dropdown
    async function onValueSelected(e) {
        // Imprime o valor selecionado no console
        console.log(e.value)

        // Remove o item selecionado das opções do dropdown
        setcomboOptions(comboOptions.filter(v => v.id != e.value.id))

        // Atualiza o estado selectedValue adicionando o novo item
        // Aqui usa selected.push, que retorna o novo tamanho do array, não o array atualizado
        setselectedValue(selected.push(e.value))

        // TODO: inserir na tabela table e depois inserir na datatable
        // Pega a sessão do usuário para autenticação
        const session = await getSession();
        // Chama a API para inserir o novo item na tabela correspondente
        // Note que 'data' não está definido no código — precisa ajustar
        await axios.post(`/api/mapcon/${table}`, {
            ...data,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        })

    }

    // Função para remover um valor selecionado
    async function removeValue() {

        // TODO: remover na tabela table e depois remover na datatable

    }

    // Função que renderiza o botão de ação (remover) para cada linha da tabela
    function acoesTemplate(rowData) {
        return <Button style={{ float: 'right' }} icon="pi pi-times" className="p-button-rounded p-button-danger" />;
    }

    return (
        <React.Fragment>
            {/* Dropdown para selecionar valores que ainda não foram selecionados */}
            <Dropdown
                value={selectedValue} // Aqui está usando selectedValue como valor selecionado no dropdown
                panelStyle={{ width: '100%' }}
                style={{ marginBottom: '10px' }}
                options={comboOptions} // opções disponíveis para seleção
                onChange={onValueSelected} // função chamada ao selecionar
                optionLabel="name" // campo para mostrar na lista
                filter
                filterBy="name"
                placeholder="Selecione um valor"
            />
            {/* Tabela que exibe os itens selecionados */}
            <DataTable loading={loading} value={selected}>
                {children}
                {/* Coluna com botão para remover */}
                <Column fheader="Ação" body={acoesTemplate}></Column>
            </DataTable>
        </React.Fragment>
    )

}
