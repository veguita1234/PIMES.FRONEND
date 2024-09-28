import './Proveedores.css'
import { TbHexagons } from "react-icons/tb";
import React, { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Login from '../Login/Login';
import HttpModule from '../../Helper/Http.module';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';

interface ProveedorDTO {
    idProveedor: number;
    nombres: string;
    apellidos: string;
    tipoDoc: string;
    numDoc: string;
    razonSocial: string;
    ubicacion: string;
    correo: string;
    email: string;
    tipoProveedor: string;
    fechaRegistro: string;
    fechaActual: string;
    telefono: string;
  }

const Proveedores : React.FC = () => {
    const [openProvee, setOpenProvee] = useState(false);
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
    const [proveedores, setProveedores] = useState<ProveedorDTO[]>([]);
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
    
    const fetchProveedores = async () => {
      try {
        const response = await HttpModule.get('/MaestrosProveedor', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
    
        const proveedordata = response.data;
        console.log('Datos proveedor:', proveedordata);
    
        const proveedoresData = proveedordata.$values || [];
        setProveedores(proveedoresData);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      }
    };

    const storedUserName = localStorage.getItem('userName');
  if (storedUserName) {
    setUserName(storedUserName);
  }

    fetchProveedores();

  }, []);
    

const handleOpenProvee = () => {
  setEditarProveedor(false); // No estamos editando, es una creación
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
  setOpenProvee(true);
};

const handleCloseProvee = () => {
  setFormData(initialFormData);
setOpenProvee(false);
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


const handleSubmitProveedor = async () => {
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

    if (editarProveedor) {
      // Modo edición - PUT
      console.log("editarProveedorId:", editarProveedorId);
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
        const updatedProveedor = await HttpModule.put(`/MaestrosProveedor/${editarProveedorId}`, {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          tipoDoc: formData.tipoDoc,
          razonSocial: formData.razonSocial,
          ubicacion: formData.direccion,
          correo: formData.correo,
          email: formData.email,
          tipoProveedor: formData.tipo,
          numDoc: formData.documento,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        // Log de la respuesta
        console.log("Respuesta PUT:", updatedProveedor);
        alert("Proveedor actualizado correctamente");
        setProveedores(prevProveedores => prevProveedores.map(p => p.idProveedor === editarProveedorId ? { ...p, ...formData } : p)); 
      } catch (putError) {
        // Verificación de tipo para putError
        if (axios.isAxiosError(putError) && putError.response) {
          // Imprime los detalles de los errores de validación
          console.error("Errores de validación:", putError.response.data.errors);
          const errorMessage = putError.response.data.mensaje || 'Error desconocido al actualizar proveedor.';
          alert(`Error: ${errorMessage}`);
        } else {
          console.error("Error inesperado:", putError);
          alert('Error inesperado al actualizar el proveedor.');
        }
      }
    } else {
    
    const response = await HttpModule.post(`/MaestrosProveedor/${userId}`, {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      tipoDoc: formData.tipoDoc,
      numDoc: formData.documento,
      razonSocial: formData.razonSocial,
      ubicacion: formData.direccion,
      correo: formData.correo,
      email: formData.email,
      tipoProveedor: formData.tipo,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    alert("Proveedor agregado correctamente");
    setProveedores(prevProveedores => [...prevProveedores, response.data]); // Maneja el nuevo proveedor
  }
    window.location.reload(); // Recarga la página (opcional)
    handleCloseProvee(); // Cierra el modal o formulario

  } catch (error) {
    console.error("Error al crear proveedor:", error);
    alert('El correo o email no es una dirección de correo electrónico válido'); // Mensaje para errores inesperados
  }
};

{/* Actualizar Clientes */}
const [editarProveedor, setEditarProveedor] = useState(false); 
const [editarProveedorId, setEditarProveedorId] = useState<number | null>(null);

const handleEditProveedor = (proveedor: ProveedorDTO) => {
  setEditarProveedor(true); // Estamos en modo edición
  setEditarProveedorId(proveedor.idProveedor); 
  setFormData({
    nombres: proveedor.nombres,
    apellidos: proveedor.apellidos,
    tipoDoc: proveedor.tipoDoc,
    documento: proveedor.numDoc,
    razonSocial: proveedor.razonSocial,
    direccion: proveedor.ubicacion,
    correo: proveedor.correo,
    email: proveedor.email,
    tipo: proveedor.tipoProveedor,
    telefono: proveedor.telefono
  });
  setOpenProvee(true); // Abre el modal
};

{/*Estado inactivo */}

const handleDeleteCliente = async (idProveedor: number) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Error: Inicia sesión nuevamente.');
      return;
    }

    const response = await HttpModule.delete(`/MaestrosProveedor/${idProveedor}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    // Log the response
    console.log("Respuesta DELETE:", response);

    alert("Proveedor eliminado correctamente");

    // Update state by removing the deleted product from the list
    setProveedores(prevProveedores => prevProveedores.filter(p => p.idProveedor !== idProveedor));

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
            <span style={{ fontSize: "25px" }}>Gestión de proveedores</span>
          </div><br /><br />

          <div style={{ width: "95%", backgroundColor: "white", borderRadius: "10px", padding: "20px" }}>
            <div style={{ padding: "5px", display: "flex", justifyContent: "end", borderBottom: "1px solid" }}>
              <button onClick={handleOpenProvee} style={{ width: "15vw", height: "4vh", backgroundColor: "#A2C76A", border: "1px solid #A2C76A" }}>+ Añadir Proveedor</button>
            </div>
            <div style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", display: "grid", gridTemplateColumns: "7vw 10vw 7vw 6vw 13vw 10vw 10vw 4vw", gap: "1em", borderBottom: "1px solid", alignItems: "center" }}>
              <span className='palabrasproveedor' style={{ fontWeight: "bold", border:"1px transparent" }}>Tipo de Proveedor</span>
              <span className='palabrasproveedor' style={{ fontWeight: "bold", border:"1px transparent" }}>Nombres y Apellidos</span>
              <span className='palabrasproveedor' style={{ fontWeight: "bold", border:"1px transparent" }}>Razón Social</span>
              <span className='palabrasproveedor' style={{ fontWeight: "bold", border:"1px transparent" }}>Documento</span>
              <span className='palabrasproveedor' style={{ fontWeight: "bold", border:"1px transparent" }}>Dirección</span>
              <span className='palabrasproveedor' style={{ fontWeight: "bold", border:"1px transparent" }}>Correo</span>
              <span className='palabrasproveedor' style={{ fontWeight: "bold", border:"1px transparent" }}>Email</span>
              <span className='palabrascliente' style={{ fontWeight: "bold", border:"1px transparent" }}>Acciones</span>
            </div>
            
            {proveedores.map(proveedor => {
  return (
    <div key={proveedor.idProveedor } style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", display: "grid", gridTemplateColumns: "7vw 10vw 7vw 6vw 13vw 10vw 10vw 4vw", gap: "1em", alignItems: "center" }}>
      <span className='palabrasproveedor' style={{ border:"1px solid", whiteSpace: "normal"  }}>{proveedor.tipoProveedor}</span>
      <span className='palabrasproveedor' style={{ border:"1px solid" }}>{proveedor.nombres} {proveedor.apellidos} </span>
      <span className='palabrasproveedor' style={{ border:"1px solid" }}>{proveedor.razonSocial}</span>
      <span className='palabrasproveedor' style={{ border:"1px solid" }}>{proveedor.numDoc}</span>
      <span className='palabrasproveedor' style={{ border:"1px solid"  }}>{proveedor.ubicacion}</span>
      <span className='palabrasproveedor' style={{ border:"1px solid" }}>{proveedor.correo}</span>
      <span className='palabrasproveedor' style={{ border:"1px solid" }}>{proveedor.email}</span>
      <span className='palabrascliente' style={{ border:"1px solid" ,gap:"1em",textAlign:"center"}}>
        <FaPencilAlt onClick={() => handleEditProveedor(proveedor)}  title='Modificar' style={{ cursor: "pointer", color: "#007bff" }}  />
        <FaTrashAlt onClick={() => handleDeleteCliente(proveedor.idProveedor)}  title='Borrar' style={{ cursor: "pointer", color: "#dc3545" }}  />
      </span>
    </div>
  );
})}
<Dialog open={openProvee} onClose={handleCloseProvee}>
  <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
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
    <Button onClick={handleCloseProvee} color="primary">Cancelar</Button>
    <Button onClick={handleSubmitProveedor} color="secondary">Aceptar</Button>
  </DialogActions>
</Dialog>

{/* Modal de Login */}
<Login open={openLoginModal} onClose={handleCloseLoginModal} onLogin={handleLogin} />
          </div>
        </div>


    );
};

export default Proveedores;