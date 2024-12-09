import { useState } from "react";
import Cadastropart1 from "./components/Cadastropart1";
import Cadastropart2 from "./components/Cadastropart2";

const Cadastro = () => {
  const [currentPart, setCurrentPart] = useState(1); // 1 para Cadastropart1, 2 para Cadastropart2
  const [formData, setFormData] = useState<any>({}); // Estado para armazenar dados do formulário

  // Função para receber os dados da parte 1 do formulário
  const handlePart1Submit = (data: any) => {
    setFormData((prevData: any) => ({ ...prevData, ...data }));
    goToPart2(); // Navega para a parte 2 do formulário
  };

  // Função para enviar os dados completos ao backend
  const handlePart2Submit = (userType: number) => {
    const completeData = {
      email: formData.email,
      senha: formData.senha,
      perfil: userType === 1 ? "cliente" : "artista",
    };

    console.log("Dados completos do formulário:", completeData);

    // Envia os dados ao backend
    fetch("http://localhost:3002/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completeData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao enviar os dados.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Resposta do servidor:", data);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  };

  const goToPart1 = () => {
    setCurrentPart(1);
  };

  const goToPart2 = () => {
    setCurrentPart(2);
  };

  return (
    <>
      {currentPart === 1 && (
        <Cadastropart1 goToPart2={goToPart2} onSubmit={handlePart1Submit} />
      )}
      {currentPart === 2 && (
        <Cadastropart2 goToPart1={goToPart1} onSubmit={handlePart2Submit} />
      )}
    </>
  );
};

export default Cadastro;