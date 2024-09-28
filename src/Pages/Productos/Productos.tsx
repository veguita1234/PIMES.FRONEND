import './Productos.css'
import { TbHexagons } from "react-icons/tb";
import React, { useState, useEffect } from 'react';
import { Grid, InputAdornment, TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Login from '../Login/Login';
import HttpModule from '../../Helper/Http.module';
import { FaBuyNLarge } from "react-icons/fa6";
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { AxiosError } from 'axios'; 

interface ProductoDTO {
    idProducto: number;
    nombre: string;
    marca: string;
    modelo: string;
    precio: string;
    stock: string;
    fechaRegistro: string;
    fechaActual: string;
  }

const Productos : React.FC = () => {
    const [openProducto, setOpenProducto] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        modelo: '',
        precio:'',
        stock:'',
    });

    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [productos, setProductos] = useState<ProductoDTO[]>([]);
    const initialFormData = {
        nombre: '',
        marca: '',
        modelo: '',
        precio:'',
        stock:'',
  };
  useEffect(() => {
    
    const fetchProductos = async () => {
      try {
        const response = await HttpModule.get('/MaestrosProducto', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
    
        const productodata = response.data;
        console.log('Datos producto:', productodata);
    
        const productosData = productodata.$values || [];
        setProductos(productosData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    const storedUserName = localStorage.getItem('userName');
  if (storedUserName) {
    setUserName(storedUserName);
  }

  fetchProductos();

  }, []);

  const handleOpenProducto = () => {
    setIsEditing(false); // No estamos editando, es una creación
    setFormData({
      nombre: '',
      marca: '',
      modelo: '',
      precio: '',
      stock: '',
  });
  setOpenProducto(true);
  };
  
  const handleCloseProducto = () => {
    setFormData(initialFormData);
  setOpenProducto(false);
  };
  
    const handleOpenLoginModal = () => {
      setOpenLoginModal(true);
    };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProducto = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
  
      // Verificar que userId y token estén presentes
      console.log("userId:", userId);
      console.log("token:", token);
  
      if (!userId || !token) {
        alert('Error: Inicia sesión nuevamente.');
        return;
      }
  
      if (isEditing) {
        // Modo edición - PUT
        console.log("editProductId:", editProductId);
        console.log("Datos para PUT:", {
          nombre: formData.nombre,
          marca: formData.marca,
          modelo: formData.modelo,
          precio: formData.precio,
          stock: formData.stock,
          // Asegúrate de que otros campos necesarios estén correctamente configurados
        });
  
        const updatedProducto = await HttpModule.put(`/MaestrosProducto/${editProductId}`, {
          nombre: formData.nombre,
          marca: formData.marca,
          modelo: formData.modelo,
          precio: formData.precio,
          stock: formData.stock,
          // Asegúrate de que otros campos necesarios estén correctamente configurados, si es necesario.
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
  
        // Log de la respuesta
        console.log("Respuesta PUT:", updatedProducto);
  
        alert("Producto actualizado correctamente");
        setProductos(prevProductos => prevProductos.map(p => p.idProducto === editProductId ? { ...p, ...formData } : p)); // Actualizamos el producto en la lista
      } else {
        // Modo creación - POST
        console.log("userId para POST:", userId);
        console.log("formData para POST:", formData);
  
        const response = await HttpModule.post(`/MaestrosProducto/${userId}`, {
          nombre: formData.nombre,
          marca: formData.marca,
          modelo: formData.modelo,
          precio: formData.precio,
          stock: formData.stock,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
  
        // Log de la respuesta
        console.log("Respuesta POST:", response);
  
        alert("Producto agregado correctamente");
        setProductos(prevProductos => [...prevProductos, response.data]); // Agregamos el nuevo producto a la lista
      }
  
      window.location.reload(); // Recarga la página (opcional)
      handleCloseProducto(); // Cierra el modal
  
    } catch (error) {
      // Asegúrate de que el error sea de tipo AxiosError
      const axiosError = error as AxiosError;
      console.error("Error al crear/actualizar producto:", axiosError.message);
      if (axiosError.response) {
        console.error("Detalles del error:", axiosError.response.data);
      }
    }
  };
  
  

  {/* Actualizar Productos */}
  const [isEditing, setIsEditing] = useState(false); // Saber si estamos en modo edición
  const [editProductId, setEditProductId] = useState<number | null>(null);
  
  const handleEditProducto = (producto: ProductoDTO) => {
    setIsEditing(true); // Estamos en modo edición
    setEditProductId(producto.idProducto); // Guardamos el ID del producto
    setFormData({
      nombre: producto.nombre,
      marca: producto.marca,
      modelo: producto.modelo,
      precio: producto.precio,
      stock: producto.stock,
    });
    setOpenProducto(true); // Abre el modal
  };

  {/*Estado inactivo */}

  const handleDeleteProducto = async (idProducto: number) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        alert('Error: Inicia sesión nuevamente.');
        return;
      }
  
      // Make sure you pass `idProducto` as a number in the URL
      const response = await HttpModule.delete(`/MaestrosProducto/${idProducto}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
  
      // Log the response
      console.log("Respuesta DELETE:", response);
  
      alert("Producto eliminado correctamente");
  
      // Update state by removing the deleted product from the list
      setProductos(prevProductos => prevProductos.filter(p => p.idProducto !== idProducto));
  
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error al eliminar producto:", axiosError.message);
      if (axiosError.response) {
        console.error("Detalles del error:", axiosError.response.data);
      }
    }
  };
  

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
          <div style={{ width: "92%", height: "5vh", display: "flex", alignItems: "center", padding: "40px", gap: "1em", backgroundColor: "white", borderRadius: "10px" }}>
            <FaBuyNLarge style={{ fontSize: "40px", borderRadius: "5px" }} />
            <span style={{ fontSize: "25px" }}>Gestión de productos</span>
          </div><br /><br />

          <div style={{ width: "95%", backgroundColor: "white", borderRadius: "10px", padding: "20px" }}>
            <div style={{ padding: "5px", display: "flex", justifyContent: "end", borderBottom: "1px solid" }}>
              <button onClick={handleOpenProducto} style={{ width: "15vw", height: "4vh", backgroundColor: "#A2C76A", border: "1px solid #A2C76A" }}>+ Añadir Producto</button>
            </div>
            <div style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", display: "grid", gridTemplateColumns: "10vw 10vw 10vw 8vw 5vw 5vw", gap: "1.5em", borderBottom: "1px solid", alignItems: "center" }}>
              <span className='productonormal' style={{ fontWeight: "bold", border:"1px transparent" }}>Descripción</span>
              <span className='productonormal' style={{ fontWeight: "bold", border:"1px transparent" }}>Marca</span>
              <span className='productonormal' style={{ fontWeight: "bold", border:"1px transparent" }}>Modelo</span>
              <span className='palabrasproducto' style={{ fontWeight: "bold", border:"1px transparent" }}>Precio</span>
              <span className='palabrasproducto' style={{ fontWeight: "bold", border:"1px transparent" }}>Stock</span>
              <span className='palabrasproducto' style={{ fontWeight: "bold", border:"1px transparent" }}>Acciones</span>
            </div>
            
            {productos.map(producto => {
  return (
    <div key={producto.idProducto } style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "5px", display: "grid", gridTemplateColumns: "10vw 10vw 10vw 8vw 5vw 5vw", gap: "1.5em", alignItems: "center" }}>
      <span className='productonormal' style={{ border:"1px solid" }}>{producto.nombre} </span>
      <span className='productonormal' style={{ border:"1px solid" }}>{producto.marca}</span>
      <span className='productonormal' style={{ border:"1px solid" }}>{producto.modelo}</span>
      <span className='palabrasproducto' style={{ border:"1px solid"  }}>S/. {producto.precio}</span>
      <span className='palabrasproducto' style={{ border:"1px solid" }}>{producto.stock}</span>
      <span className='palabrasproducto' style={{ border:"1px solid" ,gap:"1em"}}>
        <FaPencilAlt onClick={() => handleEditProducto(producto)}  title='Modificar' style={{ cursor: "pointer", color: "#007bff" }}  />
        <FaTrashAlt onClick={() => handleDeleteProducto(producto.idProducto)}  title='Borrar' style={{ cursor: "pointer", color: "#dc3545" }}  />
      </span>
    </div>
  );
})}
<Dialog open={openProducto} onClose={handleCloseProducto}>
  <DialogTitle>Crear Nuevo Producto</DialogTitle>
  <DialogContent>
    <form style={{ width: '500px' }}>
      <Grid container spacing={2}>

        <Grid item xs={6}>
          <TextField
            label="Producto"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            fullWidth
            required
          >
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Marca"
            name="marca"
            value= {formData.marca}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>

        {/* Segunda fila: Nombres y Apellidos */}
        <Grid item xs={6}>
          <TextField
            label="Modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Precio (soles)"
            name="precio"
            value={formData.precio}
            onChange={handleInputChange}
            type='number'
            InputProps={{
                startAdornment: <InputAdornment position="start">S/.</InputAdornment>, // Aquí agregamos el prefijo
              }}
            fullWidth
          />
        </Grid>

        {/* Tercera fila: Correo y Teléfono */}
        <Grid item xs={6}>
          <TextField
            label="Stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            type='number'
            fullWidth
          />
        </Grid>
        
      </Grid>
      
    </form>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseProducto} color="primary">Cancelar</Button>
    <Button onClick={handleSubmitProducto} color="secondary">
      {isEditing ? "Actualizar" : "Aceptar"}
    </Button>
  </DialogActions>
</Dialog>

          </div>
        </div>
    );
};

export default Productos;