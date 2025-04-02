import { getCsrfToken } from 'next-auth/react'
// import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import styles from  '../styles/login.module.css'
import ToolbarSite from '../components/toolbar_site';


export default function SignIn({ csrfToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // Avoids full-page reload
    });

    if (result?.error) {
      alert("Invalid credentials");
    } else {
      console.log('Success: ', result);
      window.location.href = "/mapcon/noticiasrastreadas"; // Redirect on success
    }
  };

  return (
    <div className={styles.login}>
      <ToolbarSite />
      <form onSubmit={handleSubmit}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <div className="p-grid p-formgrid p-align-center vertical-container p-fluid p-mx-auto" style={{ minHeight: "100vh" }}>
          <div className="p-md-offset-4 p-md-4 p-sm-offset-3 p-sm-6 p-col-12">
            <div className={styles.login_title}>Autenticação no Sistema</div>

            <div className="p-mb-2 p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText className="p-inputtext-lg" name="username" placeholder="Usuário" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="p-mb-2 p-mt-2 p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-key"></i>
              </span>
              <InputText className="p-inputtext-lg p-d-block" value={password} name="password" type="password" placeholder="Senha" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} required/>
            </div>

            <Button type="submit" label="Autenticar" />
          </div>
        </div>
      </form>
    </div>
  );
}


SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context)
  }
}