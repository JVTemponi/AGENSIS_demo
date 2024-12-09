import React, { useEffect } from 'react';
import axios from 'axios';

interface InfoclienteProps {
  cliente_id: string;
}

export const Infocliente: React.FC<InfoclienteProps> = ({ cliente_id }) => {
  const [item, setItem] = React.useState<{ cliente_nome: string | null } | null>(null);

  useEffect(() => {
    // Fetch client information using cliente_id
    console.log("cliente_id", cliente_id);
    if (cliente_id) {
      axios
        .get(`http://localhost:3002/api/clientes/usuario/${cliente_id}`)
        .then((clientResponse) => {
          setItem(prev => prev ? {
            ...prev, 
            cliente_nome: clientResponse.data.nome
          } : { cliente_nome: clientResponse.data.nome });
        })
        .catch((err) => {
          console.error("Erro ao buscar informações do cliente:", err);
        });
    }
  }, [cliente_id]);

  return (
    <div>
      {item ? <p>Cliente Nome: {item.cliente_nome}</p> : <p>Loading...</p>}
    </div>
  );
};