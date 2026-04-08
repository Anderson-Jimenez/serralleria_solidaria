import React, { useState } from "react";
import { Upload, Send, X, UserPen } from "lucide-react";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreview(preview.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    images.forEach((img, index) => formData.append(`images[${index}]`, img));

    console.log("ENVIANT DADES...", form);
    // fetch logic...
  };

  return (
    <div className="formContainerPrincipal">
      <div className="formHeader">
        <div className="title">
          <UserPen size={32} className="iconoHeader" />  
          <h2 className="tituloPrincipal">SOLUCIÓ PERSONALITZADA</h2>
        </div>

        <p className="subtituloForm">Explica'ns el teu projecte i et respondrem amb una proposta a mida.</p>
      </div>

      <form onSubmit={handleSubmit} className="formularioSolucion">
        <div className="grupoInputsSimple">
          <div className="grupoInputsDoble">
            <div className="campoInput">
              <label>Correu electrònic</label>
              <input type="email" name="user_email" placeholder="Ex: nom@empresa.com" value={form.user_email} onChange={handleChange} required />
            </div>
            <div className="campoInput">
              <label>Telèfon</label>
              <input type="tel" name="user_phone" placeholder="600 000 000" value={form.user_phone} onChange={handleChange} />
            </div>
          </div>

          <div className="campoInput">
            <label>Assumpte del problema</label>
            <input type="text" name="user_issue" placeholder="Resum de la teva consulta" value={form.user_issue} onChange={handleChange} required />
          </div>

          <div className="campoInput">
            <label>Descripció detallada</label>
            <textarea name="message" placeholder="Explica'ns com et podem ajudar..." value={form.message} onChange={handleChange} required />
          </div>
        </div>
        <div className="grupoInputsImages">
          <div 
            className={`zonaUpload ${isDragging ? "zonaUploadActiva" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              processFiles(Array.from(e.dataTransfer.files));
            }}
          >
            <label htmlFor="images" className="labelUpload">
              <Upload size={24} className="iconoUpload" />
              <span><strong>Fes clic per adjuntar</strong> o arrossega les imatges</span>
              <small>PNG, JPG o PDF (Màx. 5MB)</small>
            </label>
            <input type="file" id="images" multiple accept="image/*" onChange={handleImages} style={{ display: "none" }} />
          </div>

          {preview.length > 0 && (
            <div className="contenedorPreviews">
              {preview.map((src, index) => (
                <div key={index} className="miniaturaImagen">
                  <img src={src} alt={`Preview ${index}`} />
                  <button type="button" onClick={() => removeImage(index)} className="btnEliminarImg">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btnEnviarForm">
            ENVIAR SOL·LICITUD <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomSolutionForm;