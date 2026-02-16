import { useCallback, useState } from "react";
import { registroSchema } from "../../shemas/registroSchema";
interface ErroresI {
  correo?: string;
  clave?: string;
}

const IniciarSesionView: React.FC = () => {
  const [cargando, setCargando] = useState<boolean>(false);
  const [errores, setErrores] = useState<ErroresI>();

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setCargando(true);
      setErrores(undefined);

      const formData = Object.fromEntries(new FormData(e.currentTarget));
      const registro = await registroSchema.safeParse(formData);

      if (!registro.success) {
        const errores: ErroresI = {
          correo: registro.error.flatten().fieldErrors.correo?.[0],
          clave: registro.error.flatten().fieldErrors.clave?.[0],
        }
        setErrores(errores);
        return;
      }

      const payload = new FormData();
      payload.append("email", registro.data.correo);
      payload.append("password", registro.data.clave);

      const response = await fetch("/api/auth/iniciarSesion", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const message = await response.text();
        setErrores({ correo: message });
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      // return new Response(error, { status: 500 });
    } finally {
      setCargando(false);
    }
  }, [])


  return (
    <main>
      <h1>Iniciar Sesisón</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="correo">Correo electrónico</label>
        <input type="email" name="correo" id="correo" />
        <label htmlFor="clave">Contraseña</label>
        <input type="password" name="clave" id="clave" />
        <button disabled={cargando} type="submit">Iniciar sesión</button>
      </form>
    </main>

  )
}

export default IniciarSesionView;
