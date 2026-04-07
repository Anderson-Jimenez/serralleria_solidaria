import React, { useState } from "react";
import { Upload, Send } from "lucide-react";

function CustomSolutionForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    // previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("message", form.message);

    images.forEach((img, index) => {
      formData.append(`images[${index}]`, img);
    });

    console.log("Enviando:", formData);

    // fetch ejemplo
    /*
    fetch("http://localhost:8000/api/contact", {
      method: "POST",
      body: formData,
    });
    */
  };

  return (
    <div className="customSolutionForm">    
      <h2>Solució Personalitzada</h2>
      <form onSubmit={handleSubmit}>

      </form>
    </div>
  );
}

export default CustomSolutionForm;