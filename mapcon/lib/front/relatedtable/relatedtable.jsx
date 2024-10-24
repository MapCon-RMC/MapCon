import { Column } from "primereact/column";
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { getSession } from 'next-auth/react'

export default function RelatedTable({ protestId, options, selected, table, fields, children }) {

    const [selectedValue, setselectedValue] = useState(selected)
    const [comboOptions, setcomboOptions] = useState(options)
    const [loading, setloading] = useState(false)

    async function onValueSelected(e) {
        console.log(e.value)

        setcomboOptions(comboOptions.filter(v => v.id != e.value.id))
        setselectedValue(selected.push(e.value))
        // TODO: inserir na tabela table e depois inserir na datatable
        const session = await getSession();
        await axios.post(`/api/mapcon/${table}`, {
            ...data,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        })

    }

    async function removeValue() {

        // TODO: remover na tabela table e depois remover na datatable


    }

    function acoesTemplate(rowData) {
        return <Button style={{ float: 'right' }} icon="pi pi-times" className="p-button-rounded p-button-danger" />;
    }

    return (
        <React.Fragment>
            <Dropdown value={selectedValue} panelStyle={{ width: '100%' }} style={{ marginBottom: '10px' }} options={comboOptions} onChange={onValueSelected} optionLabel="name" filter filterBy="name" placeholder="Selecione um valor" />
            <DataTable loading={loading} value={selected}>
                {children}
                <Column fheader="Ação" body={acoesTemplate}></Column>
            </DataTable>
        </React.Fragment>
    )

}