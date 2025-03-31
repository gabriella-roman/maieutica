// src/types/custom.d.ts
declare global {
  interface Window {
    bootstrap: typeof import('bootstrap');  // Importa os tipos do Bootstrap diretamente
  }
}

export {};  // Isso ajuda a garantir que o arquivo seja tratado como um módulo