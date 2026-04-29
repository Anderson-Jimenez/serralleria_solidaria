import { PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderDocument from '../../../components/pdfs/orderDocument';

const OrderPDF = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/orders/${id}`)
      .then(response => response.json())
      .then(data => setOrder(data))
      .catch(error => console.error(error));

    console.log(order);
  }, [id]);


  if (!order) return <p>Carregant...</p>;

  return (
    <PDFViewer style={{ width: '100vw', height: '100vh' }}>
      <OrderDocument order={order} />
    </PDFViewer>
  );
};

export default OrderPDF;