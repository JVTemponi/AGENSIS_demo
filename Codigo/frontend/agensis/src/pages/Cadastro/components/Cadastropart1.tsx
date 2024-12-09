import { InputForm } from "./../components/InputForm";
import { useTheme } from "@/components/theme-provider";

interface Cadastropart1Props {
  goToPart2: () => void;
  onSubmit: (data: any) => void; // Adiciona a prop onSubmit para receber os dados do InputForm
}

const Cadastropart1: React.FC<Cadastropart1Props> = ({ goToPart2, onSubmit }) => {
  const { theme } = useTheme();

  return (
    <div className="cadastro-page flex justify-center items-center min-h-screen">
      <div className="cadastro-container flex flex-row relative w-full h-[80vh] rounded-xl border bg-card text-card-foreground shadow">
        
        {/* Coluna Esquerda com o Formulário */}
        <div className={`w-2/3 p-8 flex flex-col justify-center rounded-lg shadow-xl z-10 ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}>
          {/* Passa a função onSubmit para o InputForm */}
          <InputForm goToPart2={goToPart2} onSubmit={onSubmit} />
        </div>

        {/* Coluna Direita com a Imagem de Fundo */}
        <div className="w-1/3 relative h-full">
          <img
            src="/src/pages/cadastro/assets/images/cadastro/Cadastroimg.jpg"
            alt="Descrição da imagem"
            className="absolute inset-0 object-cover w-full h-full rounded-xl"
            style={{ objectFit: 'cover' }} // Ajusta a imagem para cobrir a coluna
          />
        </div>
      </div>
    </div>
  );
};

export default Cadastropart1;
