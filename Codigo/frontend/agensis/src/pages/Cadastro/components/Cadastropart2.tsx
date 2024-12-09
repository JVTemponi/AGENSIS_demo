import { useTheme } from "@/components/theme-provider"; // Ajuste o caminho conforme necessário
import { FaUserTie } from "react-icons/fa6";
import { FaPaintBrush } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Cadastropart2Props {
  goToPart1: () => void;
  onSubmit: (userType: number) => void; // Alterado para number
}

const Cadastropart2: React.FC<Cadastropart2Props> = ({ goToPart1, onSubmit }) => {
  const { theme } = useTheme();
  const [typeuser, setTypeuser] = useState<number | null>(null);

  const trocarType = (Type: number) => {
    setTypeuser(Type);
    // Removido: onSubmit(Type); // Não deve ser chamado aqui
  };

  const handleFinalizarCadastro = () => {
    if (typeuser !== null) { // Verifica se typeuser não é null
      onSubmit(typeuser); // Passa o typeuser como número
    }
  };

  const getTextColor = (selectedType: number, invert: boolean = false) => {
    if (typeuser === selectedType) {
      return theme === "dark" ? "text-white" : "text-black";
    }
    return invert
      ? theme === "dark"
        ? "text-white"
        : "text-black"
      : theme === "dark"
        ? "text-black"
        : "text-white";
  };

  const getBackgroundColor = (selectedType: number, invert: boolean = false) => {
    if (typeuser === selectedType) {
      return "bg-primary";
    }
    return invert
      ? theme === "dark"
        ? "bg-black"
        : "bg-white"
      : theme === "dark"
        ? "bg-white"
        : "bg-black";
  };

  const getButtonStyles = (selectedType: number) => {
    const isSelected = typeuser === selectedType;
    const isDarkTheme = theme === "dark";

    if (selectedType === 1) {
      return isSelected
        ? "bg-primary text-white"
        : isDarkTheme
          ? "bg-transparent text-black hover:bg-gray-800"
          : "bg-transparent text-white hover:bg-gray-200";
    } else {
      return isSelected
        ? "bg-primary text-white"
        : isDarkTheme
          ? "bg-transparent text-white hover:bg-gray-800"
          : "bg-transparent text-black hover:bg-gray-200";
    }
  };

  return (
    <div className="cadastro-page flex justify-center items-center min-h-screen">
      <div className="cadastro-container flex flex-row w-full h-[80vh] rounded-xl border bg-card text-card-foreground shadow-lg">
        <a
          className={`typecadastro w-2/4 p-8 flex flex-col rounded-l-lg shadow-xl ${getBackgroundColor(1)}`}
          onClick={() => trocarType(1)}
        >
          <div className="w-full flex justify-start mb-4">
            <button onClick={goToPart1} className={`text-lg px-4 py-2 rounded hover:border-transparent ${getBackgroundColor(1)}`}>
              Voltar
            </button>
          </div>

          <div className="areaclient text-center flex-grow">
            <h1 className={`text-4xl font-bold mb-4 ${getTextColor(1)}`}>
              Sou um cliente
            </h1>
            <p className={`mb-6 text-lg ${getTextColor(1)}`}>
              Cadastrar-se como cliente
            </p>
            <div className="flex justify-center items-center mb-6">
              <div className={getTextColor(1)}>
                <FaUserTie size={150} />
              </div>
            </div>
            <div>
              <Button
                className={`text-lg px-8 py-4 ${getButtonStyles(1)}`}
                variant="ghost"
                onClick={() => trocarType(1)}
              >
                Sou cliente
              </Button>
            </div>
            {typeuser === 1 && (
              <button
                className="text-lg px-8 py-4 bg-transparent text-white hover:border-transparent"
                onClick={handleFinalizarCadastro} // Chama o onSubmit ao clicar
              >
                Finalizar Cadastro
              </button>
            )}
          </div>
        </a>

        <a
          onClick={() => trocarType(2)}
          className={`typecadastro w-2/4 p-8 flex flex-col justify-center items-center rounded-r-lg shadow-xl ${getBackgroundColor(2, true)}`}
        >
          <div className="areaclient text-center">
            <h1 className={`text-4xl font-bold mb-4 ${getTextColor(2, true)}`}>
              Sou um artista
            </h1>
            <p className={`mb-6 text-lg ${getTextColor(2, true)}`}>
              Cadastrar-se como artista
            </p>
            <div className="flex justify-center items-center mb-6">
              <div className={getTextColor(2, true)}>
                <FaPaintBrush size={150} />
              </div>
            </div>
            <Button
              className={`text-lg px-8 py-4 ${getButtonStyles(2)}`}
              variant="ghost"
              onClick={() => trocarType(2)}
            >
              Sou artista
            </Button>
          </div>
          {typeuser === 2 && (
            <button
              className="text-lg px-8 py-4 bg-transparent text-white hover:border-transparent"
              onClick={handleFinalizarCadastro} // Chama o onSubmit ao clicar
            >
              Finalizar Cadastro
            </button>
          )}
        </a>
      </div>
    </div>
  );
};

export default Cadastropart2;
