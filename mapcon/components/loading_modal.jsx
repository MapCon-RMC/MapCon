// Importa o componente de modal (caixa de diálogo) do PrimeReact
import { Dialog } from 'primereact/dialog';

// Importa o componente de barra de progresso do PrimeReact
import { ProgressBar } from 'primereact/progressbar';

/*
  Componente simples que apresenta uma mensagem de carregamento na tela.
  Ideal para exibir durante requisições assíncronas (como POSTs).
  OBS: Evite usá-lo dentro de formulários que já estão em modais, 
  para não causar sobreposição ou conflitos visuais.
*/

export default function LoadingModal({ visible }) {
  return (
    // Componente de diálogo que aparece se 'visible' for true
    <Dialog closable={false} visible={visible}>
      {/* Mensagem de texto exibida dentro do modal */}
      <p style={{ marginBottom: '10px' }}>
        Carregando... Por favor, aguarde.
      </p>

      {/* Barra de progresso animada no modo indeterminado (sem tempo fixo) */}
      <ProgressBar mode="indeterminate" />
    </Dialog>
  );
}
