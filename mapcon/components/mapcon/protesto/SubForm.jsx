import { useEffect } from 'react';                // Importa hook para efeitos colaterais
import { useFormContext } from './FormProvider';  // Importa hook customizado para acessar contexto de formulário global

function SubForm({ onSubmit, children }) {
  // Extrai a função registerForm do contexto do formulário global
  const { registerForm } = useFormContext();

  // Quando o componente monta, registra sua função onSubmit no contexto global para que o formulário pai possa controlar os envios
  useEffect(() => {
    registerForm(onSubmit);
  }, [registerForm]);

  // Renderiza um formulário que executa onSubmit ao ser enviado e exibe os filhos passados para este componente
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export default SubForm;  // Exporta o componente para ser usado em outros arquivos
