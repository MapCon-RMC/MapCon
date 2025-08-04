// Importa hooks do React necessários para criar o contexto e gerenciar referências e funções
import { createContext, useContext, useCallback, useRef } from 'react';

// Cria o contexto que será usado para compartilhamento entre os formulários
const FormContext = createContext(null);

// Hook personalizado para acessar o contexto em qualquer componente
export function useFormContext() {
  return useContext(FormContext);
}

// Componente que provê o contexto para os formulários filhos
export function FormProvider({ children }) {
  // Armazena as funções de submit de cada formulário registrado
  const formRefs = useRef([]);

  // Função usada pelos formulários filhos para se registrarem no contexto
  const registerForm = useCallback((submitForm) => {
    formRefs.current.push(submitForm);
  }, []);

  // Função chamada para disparar o submit de todos os formulários registrados
  const submitForms = useCallback(() => {
    formRefs.current.forEach((submitForm) => submitForm());
  }, []);

  // O contexto fornece duas funções:
  // - registerForm: usada pelos formulários para se inscreverem
  // - submitForms: usada pelo componente pai para disparar todos os submits
  return (
    <FormContext.Provider value={{ registerForm, submitForms }}>
      {children}
    </FormContext.Provider>
  );
}
  
