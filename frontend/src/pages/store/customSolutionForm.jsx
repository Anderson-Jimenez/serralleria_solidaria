import React, { useState } from "react";
import { Upload, Send, X, UserPen, Loader2 } from "lucide-react";

function CustomSolutionForm() {
  const [form, setForm] = useState({
    user_id: 1,
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
    // Limpiar mensaje al editar
    if (message.text) setMessage({ text: "", type: "" });
  };

  const processFiles = (files) => {
    const fileArray = Array.from(files);
    setImages([...images, ...fileArray]);
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setPreview([...preview, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreview(preview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!form.user_email || !form.user_issue || !form.message) {
      setMessage({ text: "Si us plau, omple els camps obligatoris", type: "error" });
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
      //fetch para enviar el formulario de soluciones al backend
      const response = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        body: dades,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en l'enviament");
      }

      setMessage({ text: data.message || "Sol·licitud enviada correctament", type: "success" });
      
      setForm({
        user_id: 1,
        user_email: "",
        user_phone: "",
        user_issue: "",
        message: "",
      });
      // Eliminar la previsualiacion de las imagenes.
      preview.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setPreview([]);
      // Opcional: redirigir o limpiar después de 3 segundos
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: error.message || "Hi ha hagut un error. Torna-ho a provar.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backgroundForm">
      <div className="formContainerPrincipal">
        <div className="formHeader">
          <div className="iconWrapper">
            <UserPen size={32} className="iconoHeader" />
          </div>
          <div className="textosHeader">
            <h2 className="tituloPrincipal">SOLUCIÓ PERSONALITZADA</h2>
            <p className="subtituloForm">Explica'ns les teves necessitats i et respondrem a mida.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="formularioSolucion">
          <div className="columnaDatos">
            <div className="grupoInputsDoble">
              <div className="campoInput">
                <label>Correu electrònic</label>
                <input type="email" name="user_email" value={form.user_email} onChange={handleChange} required />
              </div>
              <div className="campoInput">
                <label>Telèfon</label>
                <input type="tel" name="user_phone" value={form.user_phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="campoInput">
              <label>Assumpte</label>
              <input type="text" name="user_issue" value={form.user_issue} onChange={handleChange} required />
            </div>

            <div className="campoInput">
              <label>Descripció detallada</label>
              <textarea name="message" value={form.message} onChange={handleChange} required />
            </div>
          </div>

          <div className="columnaMedia">
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
                <span><strong>Puja fotos</strong> o arrossega-les aquí</span>
                <small>Format suportat: JPG, PNG, GIF (màx. 5MB)</small>
              </label>
              <input type="file" id="images" multiple accept="image/*" onChange={(e) => processFiles(e.target.files)} style={{ display: "none" }} />
            </div>

            {preview.length > 0 && (
              <div className="contenedorPreviews">
                {preview.map((src, index) => (
                  <div key={index} className="miniaturaImagen">
                    <img src={src} alt="preview" />
                    <button type="button" onClick={() => removeImage(index)} className="btnEliminarImg">
                      <X size={14} />
                    </button>
                  </div>
                ))}
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
                  <span>ENVIAR SOL·LICITUD</span>
                  <Send size={18} />
                </>
              )}
            </button>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomSolutionForm;