import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

function Profile() {
/*
  useEffect(() => {
    
    fetch(`http://localhost:8000/api/characteristic-types`)
      .then(res => res.json())
      .then(data => setCharacteristicTypes(data))
      .catch(console.error);

    setChangedTitle(title || "Productes");

  }, []);
*/
  return (
    <section className="profileSection">
        Hello
    </section>
  );
}

export default Profile;