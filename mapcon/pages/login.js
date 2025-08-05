// import { getCsrfToken } from 'next-auth/react'
// import { useState } from 'react';
import { signIn } from "next-auth/react"; // Função para realizar login via next-auth
import { useState } from 'react';
import { InputText } from 'primereact/inputtext'; // Componente de input estilizado
import { Button } from 'primereact/button';       // Botão estilizado
import styles from  '../styles/login.module.css' // Importa estilos específicos
import ToolbarSite from '../components/toolbar_site'; // Barra superior do site

export default function SignIn({ csrfToken }) {
  // Estado local para usuário e senha
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Função executada ao submeter o formulário
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita reload da página

    // Tenta autenticar com credenciais via next-auth, sem redirecionar automaticamente
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    // Se erro, exibe alerta
    if (result?.error) {
      alert("Invalid credentials");
    } else {
      // Caso sucesso, registra no console e redireciona para página principal do app
      console.log('Success: ', result);
      window.location.href = "/mapcon/noticiasrastreadas"; 
    }
  };

  return (
    <div className={styles.login}>
      <ToolbarSite />
      <form onSubmit={handleSubmit}>
        {/* Token CSRF necessário para segurança da autenticação */}
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        {/* Layout do formulário usando primeflex */}
        <div className="p-grid p-formgrid p-align-center vertical-container p-fluid p-mx-auto" style={{ minHeight: "100vh" }}>
          <div className="p-md-offset-4 p-md-4 p-sm-offset-3 p-sm-6 p-col-12">
            <div className={styles.login_title}>Autenticação no Sistema</div>

            {/* Campo para usuário */}
            <div className="p-mb-2 p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText className="p-inputtext-lg" name="username" placeholder="Usuário" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            {/* Campo para senha */}
            <div className="p-mb-2 p-mt-2 p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-key"></i>
              </span>
              <InputText className="p-inputtext-lg p-d-block" value={password} name="password" type="password" placeholder="Senha" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} required/>
            </div>

            {/* Botão para submeter o formulário */}
            <Button type="submit" label="Autenticar" />
          </div>
        </div>
      </form>
    </div>
  );
}

// Função para obter o token CSRF via fetch direto (em getInitialProps, rodando no servidor)
SignIn.getInitialProps = async (context) => {
  // URL da API de autenticação para obter o token CSRF
  const url = `https://conflitoscuritiba.blog.br/api/auth/csrf`;
  // const url = `http://localhost:3000/api/auth/csrf`;
  
  // Requisição GET para obter token
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    },
  });
  const data = await response.json();

  // Retorna o token como prop para o componente usar no form
  return {
    csrfToken: data.csrfToken || ''
  };
}
