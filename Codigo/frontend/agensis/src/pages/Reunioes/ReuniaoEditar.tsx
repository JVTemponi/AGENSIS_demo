import { useState } from "react";

interface Reuniao {
  id: string;
  nome: string;
  descricao: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  status: string;
}

interface ReuniaoEditarProps {
  reuniao: Reuniao;
  onSave: (reuniao: Reuniao) => void;
  onCancel: () => void;
}

const ReuniaoEditar = ({ reuniao, onSave, onCancel }: ReuniaoEditarProps) => {
  const [formData, setFormData] = useState<Reuniao>({
    ...reuniao,
    horarioInicio: formatTime(reuniao.horarioInicio),
    horarioFim: formatTime(reuniao.horarioFim),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div>
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Horário de Início:</label>
        <input
          type="time"
          name="horarioInicio"
          value={formData.horarioInicio}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Horário de Fim:</label>
        <input
          type="time"
          name="horarioFim"
          value={formData.horarioFim}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Local:</label>
        <input
          type="text"
          name="local"
          value={formData.local}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Status:</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <div className="modal-buttons">
        <button type="submit"> Salvar </button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
      <style>{`
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }
        .modal-form label {
          font-weight: bold;
          
        }
        .modal-form input,
        .modal-form textarea,
        .modal-form select {
          width: 100%;
          padding: 1px;
          w-full p-2 border rounded
          
          border: 1px solid;
          border-radius: 4px;
        }
        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
        }
        .modal-buttons button {
          background-color: #eb5c0e;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .modal-buttons button:hover {
          background-color: #d24b07;
        }
        .modal-buttons button:last-child {
          background-color: #6b7280;
          
        }
        .modal-buttons button:last-child:hover {
          background-color: #4b5563;
        }
      `}</style>
    </form>
  );
};

// Função para converter data em formato "HH:mm"
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default ReuniaoEditar;
