import React, { useEffect, useRef, useState } from "react";
import TableCrud from "../../../lib/front/cruddatatable/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/router";
import axios from "axios";
import ToolbarMapCon from "../../../components/toolbar_mapcon";
import Loading from "../../../components/loading/loading";
import { getSession } from "next-auth/react";
import { Dialog } from "primereact/dialog";
import { RadioButton } from "primereact/radiobutton";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { InputSwitch } from "primereact/inputswitch";
import { Tag } from "primereact/tag";
import { Calendar } from "primereact/calendar";
import { Tooltip } from "primereact/tooltip";
import moment from "moment";

export default function NoticiasRastreadasPage(props) {
  const router = useRouter();

  const [showForm, setshowForm] = useState({ visible: false });
  const [loading, setloading] = useState(true);
  const [defaultDate, setDefaultDate] = useState(new Date());

  // Para conseguir atualizar datatable
  const childRef = useRef();

  useEffect(() => {
    setDefaultDate(new Date());
    const login = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/login");
      } else {
        setloading(false);
      }
    };
    login();
  }, []);

  async function deleteButtonClicked(e, search) {
    confirmDialog({
      message: e.length > 1 ? 'Tem certeza que deseja remover os dados selecionados?' : 'Tem certeza que deseja remover o dado selecionado?',
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle pi-red",
      accept: () => removeRows(e),
      acceptLabel: "Sim",
      rejectLabel: "Não",
      // reject: () => rejectFunc()
    });
  }

  async function removeRows(e) {
    for (const item of e) {
      await axios.delete("/api/mapcon/crawling_news", {
        data: { url: item.url },
      });
    }

    childRef.current.updateDatatable();
  }

  function closeFormDialog(update) {
    setshowForm(false);
    if (update) {
      childRef.current.updateDatatable();
    }
  }

  async function processNews(data) {
    const formated_date = moment(data.data).format("YYYY-MM-DD");

    const close_protests = await (
      await axios.get(
        `/api/mapcon/get_protestos_proximos?data=${formated_date}`
      )
    ).data;

    setshowForm({
      information: data,
      close_protests,
      visible: true,
    });
  }

  // Filtros
  const filters = [
    { label: "Título", value: "titulo", types: ["contain", "equal"] },
    { label: "URL", value: "url", types: ["contain", "equal"] },
    { label: "Data", value: "data", types: ["a partir de", "antes de"] },
  ];

  const dataBodyTemplate = (rowData) => {
    return (
      <div>
        <span className="p-column-title">Data</span>
        {rowData.data ? moment(rowData.data).format("DD/MM/YYYY") : ""}
      </div>
    );
  };

  const predictedTemplate = (rowData) => {
    return (
      <div>
        <span className="p-column-title">Tipo (Predição)</span>
        {rowData.tipo_predicted ? (
          rowData.tipo_predicted == 0 ? (
            <Tag className="p-mr-2" severity="success" value="Outra"></Tag>
          ) : (
            <Tag className="p-mr-2" severity="danger" value="Protesto"></Tag>
          )
        ) : (
          <Tag className="p-mr-2" value="Não processada"></Tag>
        )}
      </div>
    );
  };

  function actionBodyTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="p-column-title">Ações</span>
        <Button
          icon="pi pi-pencil"
          className="p-button-primary p-mr-2"
          onClick={() => processNews(rowData)}
        />
      </React.Fragment>
    );
  }
  
  function openURLBodyTemplate(rowData) {   
    return (
      <React.Fragment>
        <span className="p-column-title">URL</span>
        <Button
          tooltip="Clique com o botão direito do mouse para copiar"
          tooltipOptions={{showDelay: 800}}
          icon="pi pi-link"
          className="p-button-primary p-mr-2 urlBtn"
          onClick={() => window.open(rowData.url, "_blank")}
          onAuxClick={() => navigator.clipboard.writeText(rowData.url)}
          onContextMenu={(e) => {e.preventDefault()}}
        />
      </React.Fragment>
    );
  }

  return loading ? (
    <Loading></Loading>
  ) : (
    <div>
      <ToolbarMapCon/>
      <ConfirmDialog/>
      <div className="p-grid p-formgrid p-m-lg-3 p-m-2">
        <div className="p-col-12 p-mb-12 p-lg-12 p-mb-lg-0">
          <TableCrud
            ref={childRef}
            {...props}
            title="Notícias Rastreadas"
            filters={filters}
            // onAddButtonClicked={addButtonClicked}
            // onEditButtonClicked={editButtonClicked}
            // onDeleteButtonClicked={deleteButtonClicked}
            url="/api/mapcon/crawling_news"
          > 
            {/*  */}
            <Column 
              field="data"
              body={dataBodyTemplate}
              header="Data"
              sortable={true}
            />
            {/*  */}
            <Column 
              field="titulo" 
              header="Título" 
              sortable={true} 
            />
            {/*  */}
            <Column
              field="tipo_predicted"
              body={predictedTemplate}
              header="Tipo (Predição)"
              sortable={true}
            />
            {/*  */}
            <Column
              field="url"
              body={openURLBodyTemplate}
              header="URL"
            />
            <Column header="Ações" body={actionBodyTemplate}></Column>
          </TableCrud>
        </div>
      </div>
      {showForm.visible ? (
        <MigraNoticiaForm
          showForm={showForm}
          closeForm={(update) => closeFormDialog(update)}
          defaultDate={defaultDate}
        />
      ) : null}
    </div>
  );
}

/*
    Dialog para formulário de inclusão/edição do crud
*/
function MigraNoticiaForm({ showForm, closeForm }) {
  const { visible, information, close_protests } = showForm;

  const { url, cidades, content, data, termos, tipo, tipo_predicted, titulo } = information;

  const [sending, setSending] = useState(false);

  const { control, watch, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      is_protesto: false,
      existente: null,
      data: new Date(data),
      titulo: titulo,
    },
  });

  const onSubmit = async (dados) => {
    setSending(true);
    dados.url = url;
    dados.data = moment(dados.data).format("yyyy-MM-DD");
    const session = await getSession();
    await axios
      .post(`/api/mapcon/migra`, {
        ...dados,
        user: {
          id: session.user.id,
          perfil: session.user.perfil
        }
      })
      .then(() => setSending(false))
      .catch(() => setSending(false));
    closeForm(true);
  };

  async function removeEl(url) {
    await axios.delete("/api/mapcon/crawling_news", {
      data: { url: url },
    });

    closeForm(true);
  }

  const isProtesto = watch("is_protesto");
  const isExistenteSet = watch("existente");

  return (
    <Dialog
      header="Avaliar Notícia Rastreada"
      className="p-fluid"
      modal
      draggable={false}
      visible={showForm.visible}
      onHide={() => closeForm(false)}
      style={{ width: "60vw" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-fluid p-formgrid p-grid p-mt-lg-4 p-mt-4">
          <div className="p-field p-col-12 p-md-2">
            <label>Data</label>
            <br />
            {moment(data).format("DD/MM/YYYY")}
          </div>
          <div className="p-field p-col-12 p-md-8">
            <label>Título</label>
            <br />
            <a href={url} target="blank">
              {titulo}
            </a>
          </div>
          <div className="p-field p-col-12 p-md-12">
            <label htmlFor="is_protesto">É um protesto?*</label>
            <br />
            <Controller
              name="is_protesto"
              control={control}
              render={({field: { onChange, value = '' }}) => (
                <InputSwitch
                  checked={value}
                  onChange={(e) => onChange(e.value)}
                />
              )}
            />
          </div>
          {isProtesto ? (
            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="data">
                Vincular a um protesto já cadastrado*
              </label>
              <br />

              <Controller
                name="existente"
                rules={{ required: true }}
                control={control}
                render={({field: { onChange, value = '' }}) => (
                  <>
                    {close_protests?.map((protest) => (
                      <div className="p-field-radiobutton" key={protest.num_seq_protesto}>
                        <RadioButton
                          inputId="existente"
                          name="existente"
                          value={protest.num_seq_protesto}
                          onChange={(e) => onChange(e.value)}
                          checked={value === protest.num_seq_protesto}
                        />
                        <label htmlFor="existente">
                          {protest.data_protesto} - {protest.tema_protesto}
                        </label>
                      </div>
                    ))}

                    <div className="p-field-radiobutton">
                      <RadioButton
                        inputId="existente"
                        name="existente"
                        value="novo"
                        onChange={(e) => onChange(e.value)}
                        checked={value === "novo"}
                      />
                      <label htmlFor="existente">Novo Protesto</label>
                    </div>
                  </>
                )}
              />
            </div>
          ) : null}
          {/* {isProtesto && isExistenteSet === "novo" ? (
            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="data">Data*</label>
              <Controller
                name="data"
                rules={{ required: true }}
                control={control}
                render={({field: { onChange, value }}) => (
                  <Calendar
                    value={value}
                    onChange={(e) => onChange(e.value)}
                    dateFormat="dd/mm/yy"
                    mask="99/99/9999"
                    showIcon
                  />
                )}
              />
            </div>
          ) : null} */}
          {isProtesto && isExistenteSet === "novo" ? (
            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="titulo">Tema*</label>
              <Controller
                name="titulo"
                rules={{ required: true }}
                control={control}
                render={({field: { onChange, value = '' }}) => (
                  <InputText
                    disabled={!isProtesto}
                    className={errors.titulo ? "p-invalid" : ""}
                    value={value}
                    onChange={onChange}
                  ></InputText>
                )}
              />
            </div>
          ) : null}
          
          <div style={{
            position: "relative",
            display: "inline-flex",
            width: "100%",
          }}>
            <div className="p-col-12 p-md-6">
              <Button
                label="Remover Notícia"
                icon="pi pi-times"
                onClick={() => removeEl(url)}
                className="p-button-danger"
              />
            </div>
            <div className="p-col-12 p-md-6">
              <Button
                disabled={sending}
                label={sending ? "Atualizando..." : "Atualizar"}
                icon="pi pi-check"
              />
            </div>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
