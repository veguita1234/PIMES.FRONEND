import HttpModule from '../../Helper/Http.module';
import { TbHexagons } from "react-icons/tb";
import React, { useState, useEffect } from 'react';
import { FcViewDetails } from "react-icons/fc";
import Login from '../Login/Login';

interface CobrarDetalleDTO {
  idCobrarDetalle: number;
  idCabeceraCobrar: number;
  precio: string;
  subTotal: string;
  descuento: string;
  tipo: string;
  fechaEmision: string;
  fechaRegistro: string;
  fechaActual: string;
}

interface ClienteDTO {
  idCliente: number;
  nombres: string;
  apellidos: string;
  numDoc: string;
  razonSocial: string;
  correo: string;
  ubicacion: string;
  email: string;
}

const DetalleCobrar: React.FC = () => {
  const [openCobrarDetalle, setOpenCobrarDetalle] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [cobrarDetalle, setCobrarDetalle] = useState<CobrarDetalleDTO[]>([]);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [formData, setFormData] = useState<CobrarDetalleDTO | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cobrarResponse, clientesResponse] = await Promise.all([
          HttpModule.get('/MaestrosProveedor', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          HttpModule.get('/Clientes', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          })
        ]);

        const cobrarDetallesData = cobrarResponse.data.$values || [];
        const clientesData = clientesResponse.data.$values || [];

        setCobrarDetalle(cobrarDetallesData);
        setClientes(clientesData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenProvee = () => {
    if (userName) {
      setOpenCobrarDetalle(true);
    } else {
      handleOpenLoginModal();
    }
  };

  const handleCloseCobrarDetalle = () => {
    setOpenCobrarDetalle(false);
    setFormData(null); // Resetear formData al cerrar
  };

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  const handleLogin = (userName: string) => {
    setUserName(userName);
    localStorage.setItem('userName', userName);
    handleCloseLoginModal();
  };

  const handleEdit = (detalle: CobrarDetalleDTO) => {
    setFormData(detalle); // Cargar los datos en el formulario
    setOpenCobrarDetalle(true); // Abrir el modal de edición
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (formData) {
      try {
        await HttpModule.put(`/MaestrosProveedor/${formData.idCobrarDetalle}`, formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Actualiza el estado local después de la edición
        setCobrarDetalle(prev => prev.map(detalle => detalle.idCobrarDetalle === formData.idCobrarDetalle ? formData : detalle));
        handleCloseCobrarDetalle(); // Cerrar el modal
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
      <div style={{ width: "92%", height: "5vh", display: "flex", alignItems: "center", padding: "40px", gap: "1em", backgroundColor: "white", borderRadius: "10px" }}>
        <FcViewDetails  style={{ fontSize: "40px", borderRadius: "5px"}} />
        <span style={{ fontSize: "25px" }}>Detalles de Comprobantes</span>
      </div><br /><br />

      <div style={{ width: "95%", backgroundColor: "white", borderRadius: "10px", padding: "20px" }}>
        
        <div style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", display: "grid", gridTemplateColumns: "7vw 10vw 7vw 6vw 13vw 10vw 10vw", gap: "1.5em", borderBottom: "1px solid", alignItems: "center" }}>
          <span className='palabrasproveedor' style={{ fontWeight: "bold" }}>Tipo de Proveedor</span>
          <span className='palabrasproveedor' style={{ fontWeight: "bold" }}>Nombres y Apellidos</span>
          <span className='palabrasproveedor' style={{ fontWeight: "bold" }}>Razón Social</span>
          <span className='palabrasproveedor' style={{ fontWeight: "bold" }}>Documento</span>
          <span className='palabrasproveedor' style={{ fontWeight: "bold" }}>Dirección</span>
          <span className='palabrasproveedor' style={{ fontWeight: "bold" }}>Correo</span>
          <span className='palabrasproveedor' style={{ fontWeight: "bold" }}>Email</span>
        </div>

        {cobrarDetalle.map(detalle => {
          const cliente = clientes.find(cliente => cliente.idCliente === detalle.idCabeceraCobrar);
          return (
            <div key={detalle.idCobrarDetalle} style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", display: "grid", gridTemplateColumns: "7vw 10vw 7vw 6vw 13vw 10vw 10vw", gap: "1.5em", alignItems: "center" }}>
              <span className='palabrasproveedor' style={{ border: "1px solid" }}>{detalle.tipo}</span>
              <span className='palabrasproveedor' style={{ border: "1px solid" }}>{cliente ? `${cliente.nombres} ${cliente.apellidos}` : ''}</span>
              <span className='palabrasproveedor' style={{ border: "1px solid" }}>{cliente ? cliente.razonSocial : ''}</span>
              <span className='palabrasproveedor' style={{ border: "1px solid" }}>{cliente ? cliente.numDoc : ''}</span>
              <span className='palabrasproveedor' style={{ border: "1px solid" }}>{cliente ? cliente.ubicacion : ''}</span>
              <span className='palabrasproveedor' style={{ border: "1px solid" }}>{cliente ? detalle.fechaEmision : ''}</span>
              <span className='palabrasproveedor' style={{ border: "1px solid" }}>{cliente ? detalle.precio : ''}</span>
              <button onClick={() => handleEdit(detalle)}>Editar</button> {/* Botón para editar */}
            </div>
          );
        })}

        {openCobrarDetalle && formData && (
          <div>
            <h3>Editar Detalle</h3>
            <input
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              placeholder="Precio"
            />
            <input
              name="subTotal"
              value={formData.subTotal}
              onChange={handleInputChange}
              placeholder="Sub Total"
            />
            <input
              name="descuento"
              value={formData.descuento}
              onChange={handleInputChange}
              placeholder="Descuento"
            />
            <button onClick={handleSubmit}>Actualizar</button>
          </div>
        )}
        
        <Login open={openLoginModal} onClose={handleCloseLoginModal} onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default DetalleCobrar;
