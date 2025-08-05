// Importa o botão estilizado do PrimeReact
import { Button } from 'primereact/button';
// Importa o campo de texto do PrimeReact
import { InputText } from 'primereact/inputtext';
// Importa funcionalidades do react-hook-form para manipulação de formulários
import { useForm, Controller } from "react-hook-form";
// Importa o componente de cartão (card) do PrimeReact
import { Card } from 'primereact/card';
// Biblioteca para fazer requisições HTTP
import axios from 'axios';
// Hook do Next.js para navegar entre páginas
import { useRouter } from 'next/router';
// Biblioteca para manipulação de datas
import moment from 'moment';
// Campo de entrada com máscara do PrimeReact (ex: para datas)
import { InputMask } from 'primereact/inputmask';
// Componente de toolbar personalizada para o site
import ToolbarSite from '../../../components/toolbar_site';
// Função do NextAuth para obter os dados da sessão do usuário logado
import { getSession } from 'next-auth/react'

// Componente principal que renderiza o formulário para adicionar um protesto
export default function ProtestoForm(props) {
    const router = useRouter(); // Usado para redirecionar após envio

    // useForm é usado para controlar o formulário
    // defaultValues define os valores iniciais, vindos de props
    const { control, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: props.form
    });

    // Função executada ao submeter o formulário
    const onSubmit = async data => {
        // Converte a data do formato brasileiro para o formato ISO (YYYY-MM-DD)
        data['data_protesto'] = moment(data['data_protesto'], 'DD/MM/YYYY').format('YYYY-MM-DD');

        // Obtém a sessão do usuário atual
        const session = await getSession();

        // Envia os dados via POST para a API
        axios.post('/api/mapcon/protesto', {
            ...data, // Dados do formulário
            user: {
                id: session.user.id,
                perfil: session.user.perfil
            }
        }).then(r =>
            // Redireciona para a página de edição, passando o ID retornado na URL
            router.push({
                pathname: '/mapcon/protesto/edit',
                query: { id: r.data[0]['num_seq_protesto'] },
            })
        );
    }

    // JSX retornado: estrutura visual da página
    return (
        <div>
            {/* Barra de navegação personalizada do site */}
            <ToolbarSite />

            {/* Layout da página com PrimeReact Grid */}
            <div className="p-grid p-formgrid p-fluid p-m-lg-1 p-m-1">
                {/* Espaço vazio para centralizar o conteúdo */}
                <div className="p-col-12 p-mb-2 p-lg-2 p-mb-lg-0"></div>

                {/* Coluna principal com o formulário */}
                <div className="p-col-12 p-mb-8 p-lg-8 p-mb-lg-0">
                    <Card title="Adicionar Protesto" className="form-card">
                        {/* Formulário com controle via react-hook-form */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="p-fluid p-formgrid p-grid p-mt-lg-4 p-mt-4">

                                {/* Campo para o tema do protesto */}
                                <div className="p-field p-col-12 p-md-9">
                                    <label htmlFor="tema_protesto">Tema*</label>
                                    <Controller
                                        name="tema_protesto"
                                        rules={{ required: true }} // Campo obrigatório
                                        control={control}
                                        render={({ field: { onChange, value = '' } }) =>
                                            <InputText
                                                disabled={props.view} // Desabilita se for modo visualização
                                                className={errors.tema_protesto ? "p-invalid" : ""}
                                                value={value}
                                                onChange={onChange}
                                            />
                                        }
                                    />
                                </div>

                                {/* Campo para data do protesto com máscara */}
                                <div className="p-field p-col-12 p-md-3">
                                    <label htmlFor="data_protesto">Data*</label>
                                    <Controller
                                        name="data_protesto"
                                        rules={{ required: true }} // Campo obrigatório
                                        control={control}
                                        render={({ field: { onChange, value = '' } }) =>
                                            <InputMask
                                                disabled={props.view}
                                                className={errors.data_protesto ? "p-invalid" : ""}
                                                unmask={false}
                                                mask="99/99/9999" // Máscara para data
                                                value={value}
                                                onChange={e => onChange(e.value)}
                                            />
                                        }
                                    />
                                </div>

                                {/* Botão de submissão (só aparece se não estiver em modo visualização) */}
                                <div className="p-field p-col-12 p-md-offset-9 p-md-3">
                                    {!props.view ? (
                                        <Button label="Adicionar" icon="pi pi-check" />
                                    ) : null}
                                </div>

                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
