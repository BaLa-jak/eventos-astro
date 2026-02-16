import { useCallback, useState } from "react";
import { registroSchema } from "../../shemas/registroSchema";
import { supabase } from "../../lib/supabase";
import "../../styles/registro.css";
import { navigate } from "astro/virtual-modules/transitions-router.js";

interface ErroresI {
  correo?: string;
  clave?: string;
}

const RegistroView: React.FC = () => {
  const [cargando, setCargando] = useState<boolean>(false);
  const [errores, setErrores] = useState<ErroresI>();

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
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

      const { error } = await supabase.auth.signUp({
        email: registro.data.correo,
        password: registro.data.clave,
      });

      if (error) {
        setErrores({ correo: error.message });
        return;
      }

      navigate("/iniciar-sesion");

    } catch (error) {
      // return new Response(error, { status: 500 });
    } finally {
      setCargando(false);
    }
  }, [])


  return (
    <main className="contenedor">
      <section className="seccion">
        <h1 className="titulo">Crea tu cuenta gratis</h1>
        <p className="subtitulo">
          Explora los eventos mas relevantes de la Universidad Estatal de Sonora
        </p>
      </section>
      <form onSubmit={onSubmit} className="formulario">
        <p className="login-text">
          ¿Ya tienes una cuenta?{" "}
          <a className="login-link" href="/iniciar-sesion">
            Iniciar sesión
          </a>
        </p>
        <h1 className="form-title">Registrarse</h1>

        <label htmlFor="correo"><span className="requerido">*</span>Correo electrónico</label>
        <input id="correo" placeholder="Ej. ejemplo@gmail.com" name="correo" />
        {errores && errores.correo && (
          <p className="error-text">{errores.correo}</p>
        )}

        <label htmlFor="clave"><span className="requerido">*</span>Contraseña</label>
        <input id="clave" type="password" name="clave" />
        {errores && errores.clave && <p className="error-text">{errores.clave}</p>}

        <button disabled={cargando} type="submit" className="boton">
          {cargando ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </main>
  )
}

export default RegistroView;