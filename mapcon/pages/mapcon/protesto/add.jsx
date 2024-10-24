import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm, Controller } from "react-hook-form";
import { Card } from 'primereact/card';
import axios from 'axios';
import { useRouter } from 'next/router';
import moment from 'moment';
import { InputMask } from 'primereact/inputmask';
import ToolbarSite from '../../../components/toolbar_site';
import { getSession } from 'next-auth/react'



// TODO: Adicionar isSubmiting para evitar envio duplicado os dados
export default function ProtestoForm(props) {
    const router = useRouter()

    const { control, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: props.form
    });



    const onSubmit = async data => {
        data['data_protesto'] = moment(data['data_protesto'], 'DD/MM/YYYY').format('YYYY-MM-DD')

        const session = await getSession();
        axios.post('/api/mapcon/protesto', {
            ...data,
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        }).then(r => router.push({
            pathname: '/mapcon/protesto/edit',
            query: { id: r.data[0]['num_seq_protesto'] },
        }))

    }

    return (
        <div>
            <ToolbarSite/>
            <div className="p-grid p-formgrid p-fluid p-m-lg-1 p-m-1">
                <div className="p-col-12 p-mb-2 p-lg-2 p-mb-lg-0"></div>

                <div className="p-col-12 p-mb-8 p-lg-8 p-mb-lg-0">
                    <Card title="Adicionar Protesto" className="form-card">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-fluid p-formgrid p-grid p-mt-lg-4 p-mt-4">
                                <div className="p-field p-col-12 p-md-9">
                                    <label htmlFor="tema_protesto">Tema*</label>
                                    <Controller name="tema_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                                        <InputText disabled={props.view} className={errors.tema_protesto ? "p-invalid" : ""} value={value} onChange={onChange}></InputText>
                                    }/>
                                </div>
                                <div className="p-field p-col-12 p-md-3">
                                    <label htmlFor="data_protesto">Data*</label>
                                    <Controller name="data_protesto" rules={{ required: true }} control={control} render={({field: { onChange, value = '' }}) =>
                                        <InputMask disabled={props.view} className={errors.data_protesto ? "p-invalid" : ""} unmask={false} mask="99/99/9999" value={value} onChange={e => onChange(e.value)}></InputMask>
                                    }/>
                                </div>
                                <div className="p-field p-col-12 p-md-offset-9 p-md-3">
                                    {!props.view ? <Button label="Adicionar" icon="pi pi-check" /> : null}
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}

