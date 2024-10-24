import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { getSession } from 'next-auth/react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
// import { useApolloClient, gql } from '@apollo/client';
import { Paginator } from 'primereact/paginator';
import axios from 'axios';
import styles from './datatable.module.css';
import { set } from 'react-hook-form';


/*
    Esse componente abstrai a criação de um datatable na API do município.
*/


const TableCrud = forwardRef((props, ref) => {
    // const client = useApolloClient();

    const [rows, setRows] = useState([])
    const [total, setTotal] = useState(0)
    const [field, setField] = useState(props.filters[0].value)
    const [typeFilter, setTypeFilter] = useState('contain')
    const [value, setValue] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [selected, setSelected] = useState([])
    const [sortField, setSortField] = useState(null)
    const [sortOrder, setsortOrder] = useState(null)
    const [first, setFirst] = useState(null)
    const [loading, setloading] = useState(false)


    useImperativeHandle(ref, () => ({
        updateDatatable() {
            search()
        }
    }));


    const options_splitbutton = [
        {
            label: 'Adicionar filtro',
            icon: 'pi pi-plus',
            command: (e) => {
                // this.toast.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
            }
        },
    ]


    const search = () => {
        searchDataTable().then(
            result => {
                setRows(result['data']['data'])
                setTotal(result['data']['total'])
            },
            error => {
                console.debug('error: ', error);
            }
        );
    }

    async function searchDataTable(sField, sOrder, p = null, rows = null) {
        setloading(true)
        try {
            const session = await getSession();
            const ret = await axios.get(props.url, {
                params: {
                    filters: JSON.stringify([{ "type": typeFilter, "field": field, "value": value }]),
                    // order: { "order": sOrder ? sOrder : sortOrder, "field": sField ? sField : sortField },
                    order: JSON.stringify({ "order": sOrder ? sOrder : sortOrder, "field": sField ? sField : sortField }),
                    limit: rows != null ? rows : rowsPerPage,
                    page: p != null ? p : page,
                    user: {
                        id: session.user.id,
                        perfil: session.user.perfil
                    }
                }
            })
            return ret;
        } catch (e) {
            console.error(e)
        } finally {
            setloading(false)
        }
    }


    function orderDataTable(e) {
        console.debug(e);
        searchDataTable(e.sortField, e.sortOrder).then(
            result => {
                setRows(result['data']['data'])
                setTotal(result['data']['total'])
                setSortField(e.sortField == null ? sortField : e.sortField)
                setsortOrder(e.sortOrder == null ? sortOrder : e.sortOrder)
            }
        );

    }

    function pagDataTable(e) {
        searchDataTable(null, null, e.page, e.rows).then(
            result => {
                setRows(result['data']['data'])
                setTotal(result['data']['total'])
                setRowsPerPage(e.rows == null ? rowsPerPage : e.rows)
                setPage(e.page == null ? page : e.page)
                setFirst(e.first)
            }
        )
    }

    function selectDataTable(e) {
        setSelected(e.value)
    }

    // Hit enter on the text field
    function keyPress(e) {
        if (e.keyCode === 13) {
            search();
        }
    }

    /*
        FILTER FUNCTIONS
    */

    function changedTheFilterField(value) {
        setField(value)
        setTypeFilter(props.filters[props.filters.findIndex(filter => filter.value === value)].types[0])
    }

    // function onAddFilterClicked(){}


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
            {/* <div className={styles.title_form}>{props.title}</div> */}
            <div className="p-fluid p-formgrid p-grid  p-align-end">
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="dd_field">Buscar em</label>
                    <Dropdown name="dd_field" value={field} options={props.filters} onChange={(e) => { changedTheFilterField(e.value) }} />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="dd_type">Tipo de Busca</label>
                    <Dropdown name="dd_type" value={typeFilter} options={props.filters[props.filters.findIndex(filter => filter.value === field)].types} onChange={(e) => { setTypeFilter(e.value) }} placeholder="Tipo de Busca" />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="input_value">Valor</label>
                    <InputText id="input_value" value={value} onKeyDown={(e) => keyPress(e)} onChange={(e) => setValue(e.target.value)} />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <Button id="split_filters" label="Buscar" onClick={() => search()} model={options_splitbutton} icon="pi pi-search"></Button>
                </div>
            </div>

            <div className={styles.botoes_form}>
                {props.onViewButtonClicked !== undefined ? <Button disabled={selected.length === 1 ? "" : "disabled"} label="Visualizar" onClick={() => props.onViewButtonClicked(selected)} icon="pi pi-eye" className="p-button-raised p-button-secondary" /> : null}
                {props.onAddButtonClicked !== undefined ? <Button label="Adicionar" onClick={props.onAddButtonClicked} icon="pi pi-plus" className="p-button-raised" /> : null}
                {props.onEditButtonClicked !== undefined ? <Button disabled={selected.length === 1 ? "" : "disabled"} label="Atualizar" onClick={() => props.onEditButtonClicked(selected)} icon="pi pi-pencil" className="p-button-raised" /> : null}
                {props.onDeleteButtonClicked !== undefined ? <Button disabled={selected.length > 0 ? "" : "disabled"} label="Remover" onClick={() => props.onDeleteButtonClicked(selected, search)} icon="pi pi-minus" className="p-button-raised" /> : null}
            </div>

            <div className="datatable-responsive-demo">
                <DataTable header={props.title} className="p-datatable-responsive-demo" id="dt_01" loading={loading} selectionMode="multiple" lazy={true} resizableColumns={true} selection={selected} onSelectionChange={e => selectDataTable(e)} columnResizeMode="fit" sortField={sortField} sortOrder={sortOrder} onSort={(e) => orderDataTable(e)} value={rows}>
                    {props.children.map((child, index) => 
                        child.props.field !== undefined && child.props.body == undefined
                        ? <Column key={child.props.field + "_" + index} {...child.props} body={(rowData => responsiveBodyTemplate(rowData, child.props.field, child.props.header))}></Column>
                        : <Column key={child.props.field + "_" + index} {...child.props}></Column>)}
                </DataTable>
                <Paginator id="paginator" first={first} rows={rowsPerPage} rowsPerPageOptions={[10, 20, 30]} totalRecords={total} onPageChange={(e) => pagDataTable(e)}></Paginator>
            </div>

        </div>
    ); // return
})


export default TableCrud;