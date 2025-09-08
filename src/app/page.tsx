// frontend/app/page.tsx
"use client";

import { useState, FormEvent } from "react";

interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  
  const TENANT_ID = "cliente_universidad_xyz"; 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setUploadMessage("Por favor, selecciona un archivo.");
      return;
    }
    setIsUploading(true);
    setUploadMessage(`Subiendo ${file.name}...`);

    const formData = new FormData();
    formData.append("tenant_id", TENANT_ID);
    formData.append("file", file);

    try {
      const response = await fetch("http://34.68.200.26:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Error al subir el archivo.");
      }
      setUploadMessage(`✅ Archivo ${file.name} subido con éxito!`);
    } catch (error) { // <-- INICIO DE LA CORRECCIÓN 1
      if (error instanceof Error) {
        setUploadMessage(`❌ Error: ${error.message}`);
      } else {
        setUploadMessage(`❌ Ocurrió un error desconocido.`);
      }
    } finally { // <-- FIN DE LA CORRECCIÓN 1
      setIsUploading(false);
      setFile(null);
    }
  };

  const handleQuerySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    try {
      const response = await fetch("http://34.68.200.26:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: TENANT_ID,
          query: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const agentMessage: Message = { text: data.answer, isUser: false };
      setMessages((prev) => [...prev, agentMessage]);

    } catch (error) { // <-- INICIO DE LA CORRECCIÓN 2
      console.error("Failed to fetch agent response:", error);
      let errorMessageText = "Lo siento, hubo un error al conectar con el agente.";
      if (error instanceof Error) {
        errorMessageText = `Error: ${error.message}`;
      }
      const errorMessage: Message = { text: errorMessageText, isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally { // <-- FIN DE LA CORRECCIÓN 2
      setIsLoading(false);
    }
  };

  // ... (el resto del código JSX no cambia)
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
      <div>
        <h2>Base de Conocimiento Privada</h2>
        <form onSubmit={handleUpload}>
          <h3>Subir Documento</h3>
          <input type="file" onChange={handleFileChange} accept=".pdf,.txt,.docx" />
          <button type="submit" disabled={isUploading || !file} style={{ marginTop: '10px', padding: '8px 16px' }}>
            {isUploading ? "Subiendo..." : "Subir Archivo"}
          </button>
          {uploadMessage && <p style={{ marginTop: '10px' }}>{uploadMessage}</p>}
        </form>
      </div>
      <div>
        <h1>Agente de Cumplimiento IES</h1>
        <div style={{ height: '600px', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ alignSelf: msg.isUser ? 'flex-end' : 'flex-start', background: msg.isUser ? '#dcf8c6' : '#f1f0f0', borderRadius: '10px', padding: '8px 12px', margin: '5px', maxWidth: '70%' }}>
              <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
            </div>
          ))}
         {isLoading && <div style={{ alignSelf: 'flex-start', fontStyle: 'italic', color: '#888' }}>El agente está pensando...</div>}
        </div>
        <form onSubmit={handleQuerySubmit} style={{ display: 'flex' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta aquí..."
            style={{ flexGrow: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', marginLeft: '10px', borderRadius: '8px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}