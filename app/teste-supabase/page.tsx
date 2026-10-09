
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TesteSupabase() {
  const [status, setStatus] = useState("Testando conexão...");

  useEffect(() => {
    async function testarConexao() {
      try {
        const { error } = await supabase.auth.getSession();

        if (error) {
          setStatus(`Erro na conexão: ${error.message}`);
          return;
        }

        setStatus("Conexão com o Supabase funcionando!");
      } catch {
        setStatus("Não foi possível conectar. Confira a URL e a chave.");
      }
    }

    testarConexao();
  }, []);

  return (
    <main style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <h1>Teste do Supabase</h1>
      <p>{status}</p>
    </main>
  );
}
