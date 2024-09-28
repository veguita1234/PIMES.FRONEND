import './Clientes.css'
import { TbHexagons } from "react-icons/tb";
import React, { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Login from '../Login/Login';
import HttpModule from '../../Helper/Http.module';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';

interface ClienteDTO {
    idCliente: number;
    nombres: string;
    apellidos: string;
    tipoDoc: string;
    numDoc: string;
    razonSocial: string;
    ubicacion: string;
    correo: string;
    email: string;
    tipoCliente: string;
    fechaRegistro: string;
    fechaActual: string;
    telefono: string;
  }

const Clientes : React.FC = () => {
    const [openModal, setOpenModal] = useState(false);

    const [userName, setUserName] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      tipoDoc: '',
      documento: '',
      nombres: '',
      apellidos:'',
      email: '',
      correo:'',
      telefono: '',
      direccion: '',
      razonSocial:'',
      tipo:'',
    });

    const [errors, setErrors] = useState({
      email: '',
      correo: '',
    });

    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const initialFormData = {
    tipoDoc: '',
    documento: '',
    nombres: '',
    apellidos: '',
    email: '',
    correo:'',
    telefono: '',
    razonSocial: '',
    tipo: '',
    direccion: ''
  };
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:5216/api/MaestrosCliente', {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Error al obtener clientes');
        }
    
        const data = await response.json();
        console.log('Datos obtenidos:', data); // Verifica la estructura de los datos
    
        // Extrae los datos de la propiedad $values
        const clientesData = data.$values || [];
        setClientes(clientesData);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };



    const storedUserName = localStorage.getItem('userName');
  if (storedUserName) {
    setUserName(storedUserName);
  }


    fetchClientes();


  }, []);
    
  const handleOpenModal = () => {
    setEditarCliente(false); // No estamos editando, es una creación
    setFormData({
      nombres: '',
    apellidos: '',
    tipoDoc: '',
    telefono:'',
    documento:'',
    razonSocial: '',
    direccion: '',
    correo: '',
    email: '',
    tipo: '',
  });
  setOpenModal(true);
  };

  // Manejar el cierre del modal
  const handleCloseModal = () => {
    setFormData(initialFormData);
    setOpenModal(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email' || name === 'correo') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Formato de correo electrónico no válido' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  // Lista de tipos de documentos para el menú desplegable
  const tipoDocOptions = [
    { value: 'DNI', label: 'DNI' },
    { value: 'RUC', label: 'RUC' },
    { value: 'Carnet Extranjeria', label: 'Carnet Extranjeria' },
    { value: 'Pasaporte', label: 'Pasaporte' },
    { value: 'CDI', label: 'CDI' },
    { value: 'Doc.Iden.Pais.Residencia.no.D', label: 'Doc.Iden.Pais.Residencia.no.D' },
    { value: 'Tax.Identif.Number.TIN.Doc.Trib.PP.NN', label: 'Tax.Identif.Number.TIN.Doc.Trib.PP.NN' },
    { value: 'Identification.Number.IN.Doc.Trib.PP.JJ', label: 'Identification.Number.IN.Doc.Trib.PP.JJ' },

  ];

  const tipoOptions = [
    { value: 'PersonaNatural', label: 'Persona Natural' },
    { value: 'Persona Juridica', label: 'Persona Jurídica' },
    { value: 'Persona Natural/Juridica', label: 'Persona Natural/Jurídica' },

];



const handleSubmit = async () => {
  if (errors.email || errors.correo) {
    alert('Por favor, corrige los errores antes de enviar el formulario.');
    return;
  }

  try {
    const userId = localStorage.getItem('userId'); // Obtén el userId desde el localStorage
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      alert('Error: Inicia sesión nuevamente.');
      return;
    }

    if (editarCliente) {
      // Modo edición - PUT
      console.log("editarClienteId:", editarClienteId);
      console.log("Datos para PUT:", {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        tipoDoc: formData.tipoDoc,
        razonSocial: formData.razonSocial,
        ubicacion: formData.direccion,
        correo: formData.correo,
        email: formData.email,
        tipoCliente: formData.tipo,
        numDoc: formData.documento,
      });

      // Intenta ejecutar la llamada PUT
      try {
        const updatedCliente = await HttpModule.put(`/MaestrosCliente/${editarClienteId}`, {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          tipoDoc: formData.tipoDoc,
          razonSocial: formData.razonSocial,
          ubicacion: formData.direccion,
          correo: formData.correo,
          email: formData.email,
          tipoCliente: formData.tipo,
          numDoc: formData.documento,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        // Log de la respuesta
        console.log("Respuesta PUT:", updatedCliente);
        alert("Cliente actualizado correctamente");
        setClientes(prevClientes => prevClientes.map(p => p.idCliente === editarClienteId ? { ...p, ...formData } : p)); 
      } catch (putError) {
        // Verificación de tipo para putError
        if (axios.isAxiosError(putError) && putError.response) {
          // Imprime los detalles de los errores de validación
          console.error("Errores de validación:", putError.response.data.errors);
          const errorMessage = putError.response.data.mensaje || 'Error desconocido al actualizar cliente.';
          alert(`Error: ${errorMessage}`);
        } else {
          console.error("Error inesperado:", putError);
          alert('Error inesperado al actualizar el cliente.');
        }
      }
    } else {
      // Modo creación - POST
      const response = await HttpModule.post(`/MaestrosCliente/${userId}`, {
        idUsuario: userId, // Agrega idUsuario al cuerpo de la solicitud
        tipoDoc: formData.tipoDoc,
        numDoc: formData.documento,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        email: formData.email,
        ubicacion: formData.direccion,
        razonSocial: formData.razonSocial,
        tipoCliente: formData.tipo,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status !== 200) {
        // Manejar errores que devuelve el servidor
        const errorMessage = response.data.mensaje || 'Error desconocido al agregar cliente.';
        alert(`Error: ${errorMessage}`);
        return;
      }

      const data = response.data;
      alert("Cliente agregado correctamente");
      setClientes(prevClientes => [...prevClientes, data]);
    }

    window.location.reload(); // Recarga la página después de agregar el cliente
    handleCloseModal(); // Cierra el modal después de enviar
  } catch (error) {
    console.error("Error al crear cliente:", error);
    alert('El correo o email no es una dirección de correo electrónico válido'); // Mensaje para errores inesperados
  }
};


{/* Actualizar Clientes */}
const [editarCliente, setEditarCliente] = useState(false); 
const [editarClienteId, setEditarClienteId] = useState<number | null>(null);

const handleEditCliente = (cliente: ClienteDTO) => {
  setEditarCliente(true); // Estamos en modo edición
  setEditarClienteId(cliente.idCliente); 
  setFormData({
    nombres: cliente.nombres,
    apellidos: cliente.apellidos,
    tipoDoc: cliente.tipoDoc,
    documento: cliente.numDoc,
    razonSocial: cliente.razonSocial,
    direccion: cliente.ubicacion,
    correo: cliente.correo,
    email: cliente.email,
    tipo: cliente.tipoCliente,
    telefono: cliente.telefono,
  });
  setOpenModal(true); // Abre el modal
};

{/*Estado inactivo */}

const handleDeleteCliente = async (idCliente: number) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Error: Inicia sesión nuevamente.');
      return;
    }

    const response = await HttpModule.delete(`/MaestrosCliente/${idCliente}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    // Log the response
    console.log("Respuesta DELETE:", response);

    alert("Cliente eliminado correctamente");

    // Update state by removing the deleted product from the list
    setClientes(prevClientes => prevClientes.filter(p => p.idCliente !== idCliente));

  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error al eliminar cliente:", axiosError.message);
    if (axiosError.response) {
      console.error("Detalles del error:", axiosError.response.data);
    }
  }
};

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
          <div style={{ width: "92%", height: "5vh", display: "flex", alignItems: "center", padding: "40px", gap: "1em", backgroundColor: "white", borderRadius: "10px" }}>
            <TbHexagons style={{ fontSize: "40px", borderRadius: "5px", backgroundColor: "#FFB64D" }} />
            <span style={{ fontSize: "25px" }}>Gestión de clientes</span>
          </div><br /><br />

          <div style={{ width: "95%", backgroundColor: "white", borderRadius: "10px", padding: "20px" }}>
            <div style={{ padding: "5px", display: "flex", justifyContent: "end", borderBottom: "1px solid" }}>
              <button onClick={handleOpenModal} style={{ width: "15vw", height: "4vh", backgroundColor: "#A2C76A", border: "1px solid #A2C76A" }}>+ Añadir Cliente</button>
            </div>
            <div style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", display: "grid", gridTemplateColumns: "5.5vw 10vw 7vw 6vw 13vw 10vw 10vw 4vw", gap: "1em", borderBottom: "1px solid", alignItems: "center" }}>
              <span className='palabrascliente' style={{ fontWeight: "bold", border:"1px transparent" }}>Tipo de Cliente</span>
              <span className='palabrascliente' style={{ fontWeight: "bold", border:"1px transparent" }}>Nombres y Apellidos</span>
              <span className='palabrascliente' style={{ fontWeight: "bold", border:"1px transparent" }}>Razón Social</span>
              <span className='palabrascliente' style={{ fontWeight: "bold", border:"1px transparent" }}>Documento</span>
              <span className='palabrascliente' style={{ fontWeight: "bold", border:"1px transparent" }}>Dirección</span>
              <span className='palabrascliente' style={{ fontWeight: "bold", border:"1px transparent" }}>Correo</span>
              <span className='palabrascliente' style={{ fontWeight: "bold", border:"1px transparent" }}>Email</span>
              <span className='palabrascliente' style={{ fontWeight: "bold", border:"1px transparent" }}>Acciones</span>
            </div>
            
            {clientes.map(cliente => {
  return (
    <div key={cliente.idCliente } style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", display: "grid", gridTemplateColumns: "5.5vw 10vw 7vw 6vw 13vw 10vw 10vw 4vw", gap: "1em", alignItems: "center" }}>
      <span className='palabrascliente' style={{ border:"1px solid", whiteSpace: "normal"  }}>{cliente.tipoCliente}</span>
      <span className='palabrascliente' style={{ border:"1px solid" }}>{cliente.nombres} {cliente.apellidos} </span>
      <span className='palabrascliente' style={{ border:"1px solid" }}>{cliente.razonSocial}</span>
      <span className='palabrascliente' style={{ border:"1px solid" }}>{cliente.numDoc}</span>
      <span className='palabrascliente' style={{ border:"1px solid"  }}>{cliente.ubicacion}</span>
      <span className='palabrascliente' style={{ border:"1px solid" }}>{cliente.correo}</span>
      <span className='palabrascliente' style={{ border:"1px solid" }}>{cliente.email}</span>
      <span className='palabrascliente' style={{ border:"1px solid" ,gap:"1em",textAlign:"center"}}>
        <FaPencilAlt onClick={() => handleEditCliente(cliente)}  title='Modificar' style={{ cursor: "pointer", color: "#007bff" }}  />
        <FaTrashAlt onClick={() => handleDeleteCliente(cliente.idCliente)}  title='Borrar' style={{ cursor: "pointer", color: "#dc3545" }}  />
      </span>
    </div>
  );
})}
<Dialog open={openModal} onClose={handleCloseModal}>
<DialogTitle>Crear Nuevo Cliente</DialogTitle>
<DialogContent>
  <form style={{ width: '500px' }}>
    <Grid container spacing={2}>
      {/* Primera fila: Tipo Doc y Documento */}
      <Grid item xs={6}>
        <TextField
          select
          label="Tipo Doc"
          name="tipoDoc"
          value={formData.tipoDoc}
          onChange={handleInputChange}
          fullWidth
        >
          {tipoDocOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Documento"
          name="documento"
          value={formData.documento}
          onChange={handleInputChange}
          fullWidth
          required
        />
      </Grid>

      {/* Segunda fila: Nombres y Apellidos */}
      <Grid item xs={6}>
        <TextField
          label="Nombres"
          name="nombres"
          value={formData.nombres}
          onChange={handleInputChange}
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Apellidos"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>

      {/* Tercera fila: Correo y Teléfono */}
      <Grid item xs={6}>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type='email'
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>

      {/* Cuarta fila: Razón Social y Tipo */}
      <Grid item xs={6}>
        <TextField
          label="Razón Social"
          name="razonSocial"
          value={formData.razonSocial}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          select
          label="Tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleInputChange}
          fullWidth
        >
          {tipoOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
          </TextField>
      </Grid>

      {/* Quinta fila: Ubicación */}
      <Grid item xs={6}>
        <TextField
          label="Direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Correo"
          name="correo"
          value={formData.correo}
          onChange={handleInputChange}
          type='email'
          error={!!errors.correo}
          helperText={errors.correo}
          fullWidth
        />
      </Grid>
    </Grid>
    
  </form>
</DialogContent>
<DialogActions>
  <Button onClick={handleCloseModal} color="primary">Cancelar</Button>
  <Button onClick={handleSubmit} color="secondary">Aceptar</Button>
</DialogActions>
</Dialog>
{/* Modal de Login */}
<Login open={openLoginModal} onClose={handleCloseLoginModal} onLogin={handleLogin} />
          </div>
        </div>


    );
};

export default Clientes;