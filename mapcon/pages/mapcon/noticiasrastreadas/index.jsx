import React, { useEffect, useRef, useState } from 'react';
import TableCrud from '../../../lib/front/cruddatatable/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import axios from 'axios';
import ToolbarMapCon from '../../../components/toolbar_mapcon';
import Loading from '../../../components/loading/loading';
import { getSession } from 'next-auth/react';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { InputSwitch } from 'primereact/inputswitch';
import moment from 'moment';
import { Chip } from 'primereact/chip';

export default function NoticiasRastreadasPage(props) {
  const router = useRouter();

  const [showForm, setShowForm] = useState({ visible: false });
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      }
    };
    login();
  }, []);

  function closeFormDialog(update) {
    setShowForm(false);
    if (update) {
      childRef.current.updateDatatable();
    }
  }

  async function processNews(data) {
    const formated_date = moment(data.data).format("YYYY-MM-DD");
    const session = await getSession();
    const close_protests = await (
      await axios.get(`/api/mapcon/get_protestos_proximos?data=${formated_date}`, { params: {
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
      }})
    ).data;

    setShowForm({
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
              field="url"
              body={openURLBodyTemplate}
              header="URL"
            />
            {/*  */}
            <Column 
              header="Ações" 
              body={actionBodyTemplate}
            />
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
      termos: termos,
    },
  });

  const onSubmit = async (dados) => {
    setSending(true);
    dados.url = url;
    dados.data = moment(dados.data).format("yyyy-MM-DD");
    const session = await getSession();
    if (dados.is_protesto) {
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
    } else {
      await axios.put("/api/mapcon/crawling_news", { 
        url: url,
        tipo: false,
        user: {
            id: session.user.id,
            perfil: session.user.perfil
        },
      });
    }

    closeForm(true);
  };

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
      style={{ width: "60vw", maxWidth: "650px" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="">
          <div className="p-field p-col-12">
            <p>Título</p>
            <a href={url} target="blank">
              {titulo}
            </a>
          </div>
          <div className="p-field p-col-12 p-md-2">
            <p>Data</p>
            {moment(data).format("DD/MM/YYYY")}
          </div>
          <div className="p-field p-col-12">
            <b>Termos: </b>
            { termos ? termos.map((termo) => (
              <Chip label={termo} key={termo}
                style={{
                  backgroundColor: "rgba(255,200,60,0.6)",
                  margin: "0.15rem",
                }}/>
            )) : 
              <Chip label={"N/A"}/>
            }
          </div>
          <div className="p-field p-col-12 p-md-12">
            <label htmlFor="is_protesto">É um protesto? *</label>
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
          
          <Button
            disabled={sending}
            label={sending ? "Atualizando..." : "Atualizar"}
            icon="pi pi-check"
            style={{
              position: "relative",
              width: "auto",
              left: "100%",
              transform: "translateX(-100%)",
            }}
          />
        </div>
      </form>
    </Dialog>
  );
}
