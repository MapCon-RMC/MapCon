import { Column } from "primereact/column";         // Coluna para DataTable do PrimeReact
import { Button } from "primereact/button"          // Botão do PrimeReact (não usado neste componente)
import { DataTable } from "primereact/datatable";   // Tabela para exibir dados
import { InputTextarea } from 'primereact/inputtextarea'; // Campo de texto multilinha (não usado aqui)
import { Dropdown } from "primereact/dropdown";     // Dropdown (não usado aqui)
import React from "react";                           // React principal
import { useState } from "react";                    // Hook para estado (não usado aqui)
import { useForm, Controller } from "react-hook-form"; // Form control (não usado aqui)
import axios from "axios";                           // HTTP client (não usado aqui)
import { useEffect } from "react";                   // Hook efeito colateral (não usado aqui)

export function ScreenshotTab({ screenshots }) {

    // Função para renderizar a coluna de ação, neste caso exibe a imagem em miniatura com link para abrir a imagem original
    function acoesTemplate(rowData) {
        // Monta o link da imagem com base no id recebido em rowData
        const img_link = `/api/news/${rowData.id}.jpeg`;
        // Retorna um link que abre a imagem em nova aba, com uma miniatura da imagem na tabela
        return <a target="blank" href={img_link}>
            <img src={img_link} alt={img_link} style={{ width: '100px', height: '200px' }}/>
        </a>;
    }

    return (
        <React.Fragment>
            {/* 
                DataTable exibe os screenshots passados no prop 'screenshots'.
                A coluna criada usa a função acoesTemplate para mostrar a imagem em miniatura.
            */}
            <DataTable value={screenshots}>
                <Column fheader="Ação" body={acoesTemplate}></Column>
            </DataTable>
        </React.Fragment>
    )
}
