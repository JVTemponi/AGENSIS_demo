import { useState } from "react";
import axios from "axios";


interface Reuniao {
  id: string;
  nome: string;
  descricao: string;
  horarioInicio: string;
  horarioFim: string;
  local: string;
  status: string; // Agora representa o status da reunião
}

interface ReuniaoCadastroProps {
  onSave: (reuniao: Reuniao) => void;
  onCancel: () => void;
}

const ReuniaoCadastro = ({ onSave, onCancel }: ReuniaoCadastroProps) => {
  const [formData, setFormData] = useState<Reuniao>({
    id: "",
    nome: "",
    descricao: "",
    horarioInicio: "",
    horarioFim: "",
    local: "",
    status: "confirmado", // Status inicial como "Confirmado"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (isSubmitting) return; // Evita múltiplos envios
    setIsSubmitting(true);
 
    try {
      const usuario_id = sessionStorage.getItem("user_id");
      if (!usuario_id) {
        console.error("Usuário não encontrado no sessionStorage.");
        return;
      }
 
      const formattedHorarioInicio = new Date(`2024-11-19T${formData.horarioInicio}:00`).toISOString();
      const formattedHorarioFim = new Date(`2024-11-19T${formData.horarioFim}:00`).toISOString();
 
      const newReuniao = {
        ...formData,
        horarioInicio: formattedHorarioInicio,
        horarioFim: formattedHorarioFim,
        usuario_id,
      };
 
      const response = await axios.post("http://localhost:3002/api/reunioes", newReuniao);
      onSave(response.data);
    } catch (error) {
      console.error("Erro ao criar reunião:", error);
    } finally {
      setIsSubmitting(false); // Reabilita o botão após a conclusão
    }
  };

  return (
    <div className="inset-0 flex items-center justify-center bg-gray bg-opacity-50 z-50">
      <form onSubmit={handleSubmit} className="bg-gray rounded-lg shadow-lg w-full max-w-4xl">
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Descrição:</label>
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#eb5c0e] text-white rounded disabled:bg-gray-400 hover:bg-[#d24b07]"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReuniaoCadastro;
