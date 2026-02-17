import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { navigate } from "astro/virtual-modules/transitions-router.js";

const DashboardView: React.FC = () => {
  const usuario = localStorage.getItem("correo")

  const verificarUsuario = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return;
    }

    if (!data.user) {
      return navigate("/registro");
    }

    localStorage.setItem("correo", data.user.email ?? "")
  }

  useEffect(() => {
    verificarUsuario()
  }, [])

  return <div><h1>Bienvenido {usuario}</h1></div>
}

export default DashboardView;