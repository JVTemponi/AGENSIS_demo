import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const handleprint = () => {
    window.location.href = '/';
  };

  return (
    <div 
      className="flex justify-center items-center w-full h-screen bg-[var(--background-primary)]"
    >
      <div className="flex space-x-8 items-center w-full max-w-5xl px-4">
        {/* Left Image */}
        <Card 
          className="flex-shrink-0 transform transition-all duration-300 hover:scale-105 shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] rounded-2xl overflow-hidden"
        >
          <CardContent className="p-0">
            <img 
              src="/src/pages/404/assets/404-1.png"
              width="325"
              height="325"
              alt="404"
              className="object-cover" 
            />
          </CardContent>
        </Card>
        
        {/* Text Content */}
        <div className="text-center flex-grow space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight" style={{color: 'var(--color-secondary)'}}>
            Não existe arte por aqui
          </h2>
          <h1 
            className="text-6xl font-extrabold tracking-tight text-destructive"
          >
            404
          </h1>
          <h3 className="text-xl font-semibold tracking-tight" style={{color: 'var(--color-secondary)'}}>
            Página não encontrada
          </h3>
          
          {/* New Button */}
          <div className="mt-6">
            <Button 
              onClick={handleprint} 
              variant="default" 
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para página principal
            </Button>
          </div>
        </div>
        
        {/* Right Image */}
        <Card 
          className="flex-shrink-0 transform transition-all duration-300 hover:scale-105 shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] rounded-2xl overflow-hidden"
        >
          <CardContent className="p-0">
            <img 
              src="/src/pages/404/assets/404-2.png"
              width="325"
              height="325"
              alt="404"
              className="object-cover" 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}