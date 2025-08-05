import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { getSession } from 'next-auth/react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import axios from 'axios';
import styles from './datatable.module.css';

/*
    Esse componente abstrai a criação de um DataTable com funcionalidades de busca,
    paginação, ordenação, seleção e botões para ações externas (visualizar, adicionar, editar, excluir).
    Ele usa a API do município via axios para buscar os dados.
*/

const TableCrud = forwardRef((props, ref) => {
    // Estado dos dados retornados da API para popular a tabela
    const [rows, setRows] = useState([]);
    // Estado para controle do total de registros (para paginação)
    const [total, setTotal] = useState(0);
    // Campo do filtro atual (por padrão, o primeiro da lista de filtros recebida via props)
    const [field, setField] = useState(props.filters[0].value);
    // Tipo do filtro aplicado (contain, equal, etc)
    const [typeFilter, setTypeFilter] = useState('contain');
    // Valor do filtro (texto digitado para pesquisa)
    const [value, setValue] = useState('');
    // Quantidade de linhas por página
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // Página atual (zero-indexed)
    const [page, setPage] = useState(0);
    // Registros selecionados na tabela
    const [selected, setSelected] = useState([]);
    // Campo usado para ordenar a tabela
    const [sortField, setSortField] = useState(null);
    // Ordem da ordenação: 1 para ascendente, -1 para descendente
    const [sortOrder, setsortOrder] = useState(null);
    // Índice do primeiro registro da página (para paginator)
    const [first, setFirst] = useState(null);
    // Estado para mostrar ou esconder indicador de carregamento
    const [loading, setloading] = useState(false);

    // Permite que o componente pai chame o método updateDatatable via ref
    useImperativeHandle(ref, () => ({
        updateDatatable() {
            search();
        }
    }));

    // Opções do botão split (atualmente só placeholder)
    const options_splitbutton = [
        {
            label: 'Adicionar filtro',
            icon: 'pi pi-plus',
            command: (e) => {
                // Exemplo de ação futura para adicionar filtro
            }
        },
    ];

    // Função para executar a busca usando os parâmetros atuais
    const search = () => {
        searchDataTable().then(
            result => {
                setRows(result['data']['data']); // atualiza dados da tabela
                setTotal(result['data']['total']); // atualiza total para paginação
            },
            error => {
                console.debug('error: ', error);
            }
        );
    }

    // Função que chama a API para buscar dados com filtros, paginação e ordenação
    async function searchDataTable(sField, sOrder, p = null, rows = null) {
        setloading(true);
        try {
            const session = await getSession(); // pega dados do usuário para enviar no request
            const ret = await axios.get(props.url, {
                params: {
                    filters: JSON.stringify([{ "type": typeFilter, "field": field, "value": value }]),
                    order: JSON.stringify({ "order": sOrder ? sOrder : sortOrder, "field": sField ? sField : sortField }),
                    limit: rows != null ? rows : rowsPerPage,
                    page: p != null ? p : page,
                    user: {
                        id: session.user.id,
                        perfil: session.user.perfil
                    }
                }
            });
            return ret;
        } catch (e) {
            console.error(e);
        } finally {
            setloading(false);
        }
    }

    // Função chamada quando a ordenação da tabela muda
    function orderDataTable(e) {
        console.debug(e);
        searchDataTable(e.sortField, e.sortOrder).then(
            result => {
                setRows(result['data']['data']);
                setTotal(result['data']['total']);
                setSortField(e.sortField == null ? sortField : e.sortField);
                setsortOrder(e.sortOrder == null ? sortOrder : e.sortOrder);
            }
        );
    }

    // Função chamada na troca de página (paginator)
    function pagDataTable(e) {
        searchDataTable(null, null, e.page, e.rows).then(
            result => {
                setRows(result['data']['data']);
                setTotal(result['data']['total']);
                setRowsPerPage(e.rows == null ? rowsPerPage : e.rows);
                setPage(e.page == null ? page : e.page);
                setFirst(e.first);
            }
        );
    }

    // Atualiza a seleção na tabela
    function selectDataTable(e) {
        setSelected(e.value);
    }

    // Ativa a busca ao pressionar Enter no campo de filtro
    function keyPress(e) {
        if (e.keyCode === 13) {
            search();
        }
    }

    /*
        Função chamada quando o campo do filtro é alterado.
        Atualiza o campo e o tipo do filtro padrão para o campo selecionado.
    */
    function changedTheFilterField(value) {
        setField(value);
        // Atualiza o tipo do filtro para o primeiro tipo permitido para esse campo
        setTypeFilter(props.filters[props.filters.findIndex(filter => filter.value === value)].types[0]);
    }

    // Template para renderizar colunas responsivamente (mostrando título e valor)
    const responsiveBodyTemplate = (rowData, field, header) => {
        return (
            <React.Fragment>
                <span className="p-column-title">{header}</span>
                {rowData[field]}
            </React.Fragment>
        );
    }

    return (
        <div>
            {/* Filtros de busca */}
            <div className="p-fluid p-formgrid p-grid  p-align-end">
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="dd_field">Buscar em</label>
                    <Dropdown name="dd_field" value={field} options={props.filters} onChange={(e) => { changedTheFilterField(e.value) }} />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="dd_type">Tipo de Busca</label>
                    <Dropdown
                        name="dd_type"
                        value={typeFilter}
                        options={props.filters[props.filters.findIndex(filter => filter.value === field)].types}
                        onChange={(e) => { setTypeFilter(e.value) }}
                        placeholder="Tipo de Busca"
                    />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="input_value">Valor</label>
                    <InputText
                        id="input_value"
                        value={value}
                        onKeyDown={(e) => keyPress(e)}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <Button
                        id="split_filters"
                        label="Buscar"
                        onClick={() => search()}
                        model={options_splitbutton}
                        icon="pi pi-search"
                    />
                </div>
            </div>

            {/* Botões para ações (visualizar, adicionar, editar, excluir), habilitados conforme seleção */}
            <div className={styles.botoes_form}>
                {props.onViewButtonClicked !== undefined ?
                    <Button
                        disabled={selected.length === 1 ? false : true}
                        label="Visualizar"
                        onClick={() => props.onViewButtonClicked(selected)}
                        icon="pi pi-eye"
                        className="p-button-raised p-button-secondary"
                    /> : null}
                {props.onAddButtonClicked !== undefined ?
                    <Button
                        label="Adicionar"
                        onClick={props.onAddButtonClicked}
                        icon="pi pi-plus"
                        className="p-button-raised"
                    /> : null}
                {props.onEditButtonClicked !== undefined ?
                    <Button
                        disabled={selected.length === 1 ? false : true}
                        label="Atualizar"
                        onClick={() => props.onEditButtonClicked(selected)}
                        icon="pi pi-pencil"
                        className="p-button-raised"
                    /> : null}
                {props.onDeleteButtonClicked !== undefined ?
                    <Button
                        disabled={selected.length > 0 ? false : true}
                        label="Remover"
                        onClick={() => props.onDeleteButtonClicked(selected, search)}
                        icon="pi pi-minus"
                        className="p-button-raised"
                    /> : null}
            </div>

            {/* Tabela de dados com paginação e ordenação */}
            <div className="datatable-responsive-demo">
                <DataTable
                    header={props.title}
                    className="p-datatable-responsive-demo"
                    id="dt_01"
                    loading={loading}
                    selectionMode="multiple"
                    lazy={true} // para carregar dados sob demanda (via API)
                    resizableColumns={true}
                    selection={selected}
                    onSelectionChange={e => selectDataTable(e)}
                    columnResizeMode="fit"
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={(e) => orderDataTable(e)}
                    value={rows}
                >
                    {/* Renderiza colunas recebidas como filhos, adicionando o template responsivo se não houver body customizado */}
                    {props.children.map((child, index) =>
                        child.props.field !== undefined && child.props.body == undefined
                            ? <Column key={child.props.field + "_" + index} {...child.props} body={(rowData => responsiveBodyTemplate(rowData, child.props.field, child.props.header))}></Column>
                            : <Column key={child.props.field + "_" + index} {...child.props}></Column>
                    )}
                </DataTable>

                {/* Componente de paginação */}
                <Paginator
                    id="paginator"
                    first={first}
                    rows={rowsPerPage}
                    rowsPerPageOptions={[10, 20, 30]}
                    totalRecords={total}
                    onPageChange={(e) => pagDataTable(e)}
                />
            </div>
        </div>
    );
})

export default TableCrud;
