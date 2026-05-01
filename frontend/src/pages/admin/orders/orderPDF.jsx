import { PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderDocument from '../../../components/pdfs/orderDocument';

const OrderPDF = () => {
  const { id } = useParams();
  const [order, setOrder] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/orders/${id}`)
      .then(response => response.json())
      .then(data => {
        setOrder(data);
        console.log(data);
      })
      .catch(error => console.error(error));
  }, [id]);

  return (
    <PDFViewer style={{ width: '100vw', height: '100vh' }}>
      <OrderDocument order={order} />
    </PDFViewer>
  );
};

export default OrderPDF;