import { useCallback, useEffect, useState } from "react";
import { registroSchema } from "../../shemas/registroSchema";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import "../../styles/registro.css";
import { supabase } from "../../lib/supabase";
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

      navigate("https://qeventr.web.app/dashboard");
    } catch (error) {
      // return new Response(error, { status: 500 });
    } finally {
      setCargando(false);
    }
  }, [])

  const verificarUsuario = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data) return;

    navigate("https://qeventr.web.app/dashboard");
  }


  useEffect(() => {
    verificarUsuario();
  }, [])


  return (
    <main className="contenedor">
      <section className="seccion">
        <h1 className="titulo">Bienvenido de nuevo</h1>
        <p className="subtitulo">
          Inicia sesión para ver y gestionar los eventos de la Universidad Estatal de Sonora
        </p>
      </section>
      <form onSubmit={onSubmit} className="formulario">
        <p className="login-text">
          ¿Aún no tienes cuenta?{" "}
          <a className="login-link" href="/registro">
            Regístrate
          </a>
        </p>
        <h1 className="form-title">Iniciar sesión</h1>
        <label htmlFor="correo">Correo electrónico</label>
        <input type="email" name="correo" id="correo" placeholder="Ej. ejemplo@gmail.com" />
        {errores?.correo && <p className="error-text">{errores.correo}</p>}
        <label htmlFor="clave">Contraseña</label>
        <input type="password" name="clave" id="clave" />
        {errores?.clave && <p className="error-text">{errores.clave}</p>}
        <button disabled={cargando} type="submit" className="boton">
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </main>

  )
}

export default IniciarSesionView;
