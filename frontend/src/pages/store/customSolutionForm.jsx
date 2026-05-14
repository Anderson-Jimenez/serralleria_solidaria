import React, { useState } from "react";
import { Upload, Send, X, Loader2, ShieldCheck, PhoneCall, Zap, FileText } from "lucide-react";

function CustomSolutionForm() {
  const [form, setForm] = useState({
    user_email: "",
    user_phone: "",
    user_issue: "",
    message: "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: "", type: "" });
  };

  const processFiles = (files) => {
    const fileArray = Array.from(files);
    if (images.length + fileArray.length > 3) {
      setMessage({ text: "Només es permet pujar un màxim de 3 arxius.", type: "error" });
      return;
    }
    setImages([...images, ...fileArray]);
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setPreview([...preview, ...newPreviews]);
    if (message.type === "error") setMessage({ text: "", type: "" });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreview(preview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación: Ahora el teléfono también es obligatorio
    if (!form.user_email || !form.user_phone || !form.user_issue || !form.message) {
      setMessage({ text: "Si us plau, omple tots els camps obligatoris.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    const dades = new FormData();
    dades.append("user_email", form.user_email);
    dades.append("user_phone", form.user_phone);
    dades.append("user_issue", form.user_issue);
    dades.append("message", form.message);
    images.forEach((img) => {
      dades.append("images[]", img);
    });

    try {
      const response = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers:{
          "Accept": "application/json",
        },
        body: dades,
      });

      const data = await response.json();

      if (!response.ok) {
        // Log para el desarrollador, no para el cliente
        console.error("Error del servidor:", data);
        throw new Error("Validation or Server Error");
      }

      setMessage({ text: "Sol·licitud enviada correctament!", type: "success" });
      setForm({ user_email: "", user_phone: "", user_issue: "", message: "" });
      preview.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setPreview([]);
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      
    } catch (error) {
      // Mensaje genérico para el cliente, detalle técnico a la consola
      console.error("Detall tècnic de l'error:", error);
      setMessage({ 
        text: "Hi ha hagut un problema en procesar la teva sol·licitud. Torna-ho a provar més tard.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backgroundForm">
      <div className="formContainerPrincipal">
        
        {/* Panel Izquierdo - Información */}
        <div className="infoPanel">
          <div className="logoHeader">
            <ShieldCheck size={28} className="logoIcon" />
            <span>SupportHub</span>
          </div>
          
          <div className="textosHeader">
            <h1 className="tituloPrincipal">
              Solucions <br/><span className="highlight">Personalitzades</span>
            </h1>
            <p className="descripcionContexto">
              Estem aquí per ajudar-te. Completa el formulari i ens posarem en contacte amb tu ben aviat.
            </p>
          </div>

          <div className="featuresList">
            <div className="featureItem">
              <div className="iconWrapper"><PhoneCall size={20} /></div>
              <div className="featureText">
                <h4>Suport 24/7</h4>
                <p>Sempre disponibles</p>
              </div>
            </div>
            <div className="featureItem">
              <div className="iconWrapper"><Zap size={20} /></div>
              <div className="featureText">
                <h4>Resposta ràpida</h4>
                <p>Menys de 2 hores</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Formulario */}
        <div className="formPanel">
          <div className="formPanelHeader">
            <h2>Envia'ns el teu cas</h2>
            <p>Tots els camps són obligatoris.</p>
          </div>

          <form onSubmit={handleSubmit} className="formularioSolucion">
            <div className="grupoInputsDoble">
              <div className="campoInput">
                <label>Correu Electrònic *</label>
                <input type="email" name="user_email" value={form.user_email} onChange={handleChange} placeholder="tu@correu.com" required />
              </div>
              <div className="campoInput">
                <label>Telèfon *</label>
                <input type="tel" name="user_phone" value={form.user_phone} onChange={handleChange} placeholder="+34 600 000 000" required />
              </div>
            </div>

            <div className="campoInput">
              <label>Assumpte / Problema *</label>
              <input type="text" name="user_issue" value={form.user_issue} onChange={handleChange} placeholder="Ex. Problema de facturació" required />
            </div>

            <div className="campoInput">
              <label>Missatge Detallat *</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Explica'ns el teu cas..." required />
            </div>

            <div className="campoInput">
              <label>Adjuntar Arxius</label>
              <div 
                className={`zonaUpload ${isDragging ? "zonaUploadActiva" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  processFiles(e.dataTransfer.files);
                }}
              >
                <label htmlFor="images" className="labelUpload">
                  <Upload size={28} className="iconoUpload" />
                  <span><span className="orangeText">Puja un arxiu</span> o arrossega</span>
                  <small>PNG, JPG, PDF, DOC, CSV (Máx. 3 arxius)</small>
                </label>
                <input type="file" id="images" multiple accept="*" onChange={(e) => processFiles(e.target.files)} style={{ display: "none" }} />
              </div>
            </div>

            {preview.length > 0 && (
              <div className="contenedorPreviews">
                {preview.map((src, index) => (
                  <div key={index} className="miniaturaImagen">
                    {images[index]?.type.startsWith("image/") ? (
                      <img src={src} alt="preview" />
                    ) : (
                      <div className="archivoIconoContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px' }}>
                        <FileText size={28} color="#6b7280" />
                        <span style={{ fontSize: '10px', color: '#6b7280', maxWidth: '65px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {images[index]?.name}
                        </span>
                      </div>
                    )}
                    <button type="button" onClick={() => removeImage(index)} className="btnEliminarImg">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="btnEnviarForm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>ENVIANT...</span>
                </>
              ) : (
                <>
                  <span>Enviar Sol·licitud</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomSolutionForm;