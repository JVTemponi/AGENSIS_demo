// Código a ser despejado

import { useState } from "react";

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  duracao_media: number;
  unidade_duracao: string;
  preco_medio: number;
  disponibilidade: boolean;
}

interface ServicoFormProps {
  servico: Servico;
  onSave: (servico: Servico) => void;
}

const ServicoForm = ({ servico, onSave }: ServicoFormProps) => {
  const [formData, setFormData] = useState(servico);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "disponibilidade" ? value === "true" : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome:</label>
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
      </div>
      <div>
        <label>Descrição:</label>
        <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} />
      </div>
      <div>
        <label>Duração Média:</label>
        <input type="number" name="duracao_media" value={formData.duracao_media} onChange={handleChange} />
      </div>
      <div>
        <label>Unidade de Duração:</label>
        <input type="text" name="unidade_duracao" value={formData.unidade_duracao} onChange={handleChange} />
      </div>
      <div>
        <label>Preço Médio:</label>
        <input type="number" name="preco_medio" value={formData.preco_medio} onChange={handleChange} />
      </div>
      <div>
        <label>Disponibilidade:</label>
        <select name="disponibilidade" value={formData.disponibilidade ? "true" : "false"} onChange={handleChange}>
          <option value="true">Disponível</option>
          <option value="false">Indisponível</option>
        </select>
      </div>
      <button type="submit">Salvar</button>
    </form>
  );
};

export default ServicoForm;
