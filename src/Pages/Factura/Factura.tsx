import { IoMdSearch } from "react-icons/io";
import './Factura.css'
import React, { useState, useEffect} from 'react';
import { Grid, TextField, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import HttpModule from '../../Helper/Http.module';
import axios, { AxiosError } from 'axios';
import { Modal, Box, Typography, Input, List, ListItem } from '@mui/material';
import { baseUrl } from "../../Constant/global.constanst";
import { HiOutlineArrowSmallRight, HiMiniArrowSmallLeft  } from "react-icons/hi2";


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
  }
  interface ProductoDTO {
    idProducto: number;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    stock: number;
    fechaRegistro: string;
    fechaActual: string;
  }


interface Cantidades {
  [idProducto: number]: number; 
}

const Factura : React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    // const [userName, setUserName] = useState<string | null>(null);
    const [productosAgregados, setProductosAgregados] = useState<ProductoDTO[]>([]);
    const [dni, setDni] = useState("");
    const itemsPerPage = 5; 
    const [currentPage, setCurrentPage] = useState(1);
    const [fechaActual, setFechaActual] = useState<string>('');
    const [tipo] = useState("Factura");
    const [clienteData, setClienteData] = useState<ClienteDTO | null>(null);
    //const [productos, setProductos] = useState<ProductoDTO[]>([]);
    const [formData, setFormData] = useState({
        tipoDoc: '',
        numDoc: '',
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
    //const [openLoginModal, setOpenLoginModal] = useState(false);
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const initialFormData = {
        tipoDoc: '',
        numDoc: '',
      nombres: '',
      apellidos:'',
      email: '',
      correo:'',
      telefono: '',
      direccion: '',
      razonSocial:'',
      tipo:'',
  };

  const fetchClientes = async (dni: string) => {
    try {
      const response = await HttpModule.get(`/MaestrosCliente/${dni}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data: ClienteDTO = response.data;
      console.log('Data:', data); 
  
      if (data) {
        setClienteData(data);
        setError(null); // Limpiar error si se encuentra el cliente
      } else {
        setError('Cliente no encontrado');
        setClienteData(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al obtener cliente:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      setError('Error al obtener cliente');
      setClienteData(null);
    }
  };

  const handleBuscarCliente = () => {
    if (formData.numDoc.length > 0) {
      fetchClientes(formData.numDoc); // Llama a la función con el valor de 'numDoc'
    } else {
      alert('Por favor, ingresa un número de documento.');
    }
  };

  useEffect(() => {
    if (dni.length === 8) {
      fetchClientes(dni);
    }
  }, [dni]);

  useEffect(() => {
    if (clienteData) {
      console.log('ClienteData:', clienteData);
      setFormData({
        ...formData,
        nombres: clienteData.nombres || '',
        apellidos: clienteData.apellidos || '',
        razonSocial: clienteData.razonSocial || '',
        direccion: clienteData.ubicacion || '',
        correo: clienteData.correo || '',
      });
      setError(null); // Limpiar error si se encuentra el cliente
    }
  }, [clienteData]);

    const handleOpenModal = () => {
        setOpenModal(true);
      };
    
      // Manejar el cierre del modal
      const handleCloseModal = () => {
        setFormData(initialFormData);
        setOpenModal(false);
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
    
        if (!userId) {
          alert('Error: IdUsuario no está disponible. Inicia sesión nuevamente.');
          return;
        }
    
        const response = await HttpModule.post(`/MaestrosCliente/${userId}`, {
          tipoDoc: formData.tipoDoc,
          numDoc: formData.numDoc,
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Asegúrate de que el token esté disponible
          }
        });
    
        if (response.status !== 200) {
          // Manejar errores que devuelve el servidor
          const errorMessage = response.data.mensaje || 'Error desconocido al agregar cliente.';
          alert(` ${errorMessage}`);
          return;
        }
    
        const data = response.data;
        alert("Cliente agregado correctamente");
    
        setClientes(prevClientes => [...prevClientes, data]); // Actualiza la lista de clientes sin recargar
        setFormData(initialFormData); // Limpia el formulario
        handleCloseModal(); // Cierra el modal después de enviar
      } catch (error) {
        console.error("Error al crear cliente:", error);
        alert('El correo o email no es una dirección de correo electrónico válido'); // Mensaje para errores inesperados
      }
    };
    
    useEffect(() => {
      // Obtener la fecha actual en formato YYYY-MM-DD
      const fecha = new Date().toISOString().split('T')[0];
      setFechaActual(fecha);
    }, []);
    const [total, setTotal] = useState<number | null>(null);
    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTotal(parseFloat(e.target.value));
    };

    const emitirComprobante = async () => {
      // Verifica si hay productos para enviar
      if (productosAgregados.length === 0) {
          alert('No hay productos para enviar en el detalle.');
          return;
      }
  
      const cobrarCabeceraDto = {
          NumDoc: formData.numDoc,
          Total: total,
          Tipo: tipo,
      };
  
      try {
          const userId = localStorage.getItem('userId');
          const token = localStorage.getItem('token');
  
          if (!userId || !token) {
              alert('Error: Usuario o token no disponible.');
              return;
          }
  
          // Crear la cabecera
          const responseCabecera = await HttpModule.post(`/MovimientosCtasCobrarCabecera/${userId}`, cobrarCabeceraDto, {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });
  
  
          const respuestaData = responseCabecera.data;
          const mensaje = respuestaData.mensaje;
          const idCabecera = respuestaData.idCtasCobrarCabecera;
  
          if (idCabecera) {
  
              // Preparar y enviar los detalles del comprobante
              for (const producto of productosAgregados) {
                const cantidad = cantidades[producto.idProducto] || 0;
                  const detalleDto = {
                      IdCtasCobrarCabecera: idCabecera, 
                      IdProducto: producto.idProducto,
                      Precio: parseFloat(producto.precio.toFixed(2)),
                      SubTotal: parseFloat((producto.precio * producto.stock - (producto.precio * (descuento / 100) * producto.stock)).toFixed(2)),
                      Descuento: parseFloat(descuento.toFixed(2)),
                      Cantidad: parseFloat(cantidad.toFixed(2)),
                  };
  
                  console.log('Enviando datos de detalle:', detalleDto);
  
                  const responseDetalle = await HttpModule.post(`/MovimientosCtasCobrarDetalle/${userId}`, detalleDto, {
                      headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json',
                      },
                  });
  
                  if (responseDetalle.status !== 201) {
                      console.error(`Error al crear detalle: Código de estado ${responseDetalle.status}`);
                      console.error('Respuesta de error:', responseDetalle.data);
                      alert(`Error al crear detalle: Código de estado ${responseDetalle.status}`);
                      return;
                  }
              }
  
              alert("Factura emitida correctamente");
          } else {
              console.error('ID de cabecera no recibido en la respuesta.');
              alert('Error al obtener el ID de la cabecera.');
          }
      } catch (error) {
          if (axios.isAxiosError(error)) {
              console.error('Error completo:', error);
              console.error('Respuesta de error:', error.response?.data);
              alert("Error al crear el comprobante: " + (error.response?.data?.mensaje || 'Error desconocido'));
          } else {
              console.error('Error desconocido:', error);
              alert("Error desconocido al crear el comprobante.");
          }
      }
  };
  
  

const handleReload = () => {
  window.location.reload();
};
const styles = {
    headerCell: {
        padding: '10px',
        border: '1px solid black',
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold' as 'bold',
        
    },
    cell: {
        padding: '10px',
        border: '1px solid black',
        textAlign: 'center' as 'center',
    },
    buttonCell: {
        padding: '10px',
        border: '1px solid black',
        textAlign: 'center' as 'center',
    },
    button: {
        padding: '5px 10px',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
};

const [cantidades, setCantidades] = useState<Cantidades>(() => {
  const saved = localStorage.getItem('cantidades');
  return saved ? JSON.parse(saved) : {};
});

const [descuento, setDescuento] = useState(() => {
  const savedDescuento = localStorage.getItem('descuento');
  return savedDescuento ? Number(savedDescuento) : 0;
});

const handleCantidadChange = (idProducto: number, value: number) => {
  setCantidades(prev => {
    const newCantidades: Cantidades = { ...prev, [idProducto]: value };
    localStorage.setItem('cantidades', JSON.stringify(newCantidades));
    console.log('Nueva cantidad guardada:', newCantidades);
    return newCantidades;
  });
};
  
useEffect(() => {
  console.log('Cantidad actualizada:', cantidades);
  localStorage.setItem('cantidades', JSON.stringify(cantidades));
}, [cantidades]);

useEffect(() => {
  console.log('Descuento actualizado:', descuento);
  localStorage.setItem('descuento', descuento.toString());
}, [descuento]);

  const handleRemove = (idProducto: number) => {
    setProductosAgregados(prevProductos =>
      prevProductos.filter(producto => producto.idProducto !== idProducto)
    );
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAñadirProductos, setOpenAñadirProductos] = useState(false);

  const handleOpenAñadirProducto = () => {
    setOpenAñadirProductos(true);
  };
  const handleInputChangeProducto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    console.log('Input value changed:', term);
    setSearchTerm(term);
  };

  // Función para manejar la búsqueda al hacer clic en el botón
  const handleSearch = async () => {
    console.log('Searching for term:', searchTerm);
  
    setLoading(true);
    setError(null);
  
    try {
      const url = `/MaestrosProducto/nombre`; // Usa la URL relativa
      console.log('Request URL:', `${baseUrl}${url}?producto=${encodeURIComponent(searchTerm)}`);
  
      // Usa HttpModule para hacer la solicitud
      const response = await HttpModule.get(url, {
        params: { producto: searchTerm } // Enviar el parámetro de búsqueda
      });
  
      console.log('Search results received:', response.data);
  
      setResults(response.data.productos.$values || []);
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
      setError('Error al realizar la búsqueda. Inténtalo de nuevo.');
      setResults([]);
    } finally {
      setLoading(false);
      console.log('Search request completed. Loading:', loading);
    }
  };
  

  const handleCloseAñadirProducto = () => {

  setOpenAñadirProductos(false);
};

  const handlePageChange = (direction: 'next' | 'prev') => {
    setCurrentPage((prevPage) => {
      if (direction === 'next') {
        return prevPage + 1;
      } else if (direction === 'prev' && prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  // Calcular los índices de los elementos a mostrar
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);

  const handleAgregarProducto = (producto: ProductoDTO) => {
    const productoExistente = productosAgregados.find(p => p.idProducto === producto.idProducto);
    
    if (!productoExistente) {
        console.log('Agregando producto:', producto);
        setProductosAgregados([...productosAgregados, { ...producto, stock: 1 }]);
    } else {
        console.log('El producto ya está en la lista:', producto);
        // Si deseas actualizar el stock en lugar de agregar
        setProductosAgregados(productosAgregados.map(p =>
            p.idProducto === producto.idProducto ? { ...p, stock: p.stock + 1 } : p
        ));
    }
};

const calculateTotal = () => {
  return productosAgregados.reduce((acc, producto) => {
    // Obtener la cantidad para el producto actual, o 0 si no está definido
    const cantidad = cantidades[producto.idProducto] || 0;
    
    // Calcular el subtotal para el producto actual
    const subtotal = cantidad * (producto.precio - (producto.precio * (descuento / 100)));
    
    // Sumar el subtotal al acumulador
    return acc + subtotal;
  }, 0);
};

useEffect(() => {
  setTotal(calculateTotal());
}, [productosAgregados, cantidades, descuento]);


    return (
        <div style={{display:"flex",justifyContent:"center",padding:"30px",alignItems:"center"}}>
            <div style={{width:"60vw",borderRadius:"20px",border:"1px solid #E9ECF3",boxShadow:"4px 4px 10px rgba(0, 0, 0, 0.5)",backgroundColor:"white",display:"flex",alignItems:"center",flexDirection:"column",padding:"30px",gap:"3em"}}>
                <span style={{fontWeight:"bold",fontSize:"30px"}}>Factura</span>
                
                <div style={{width:"45vw",padding:"20px",display:"flex",flexDirection:"column",gap:"2em",border:"1px solid #E9ECF3",borderRadius:"10px"}}>
                    <span style={{fontWeight:"bold",fontSize:"15px"}}>Datos del cliente</span>
                    <div style={{flexDirection:"column",gap:"1em",display:"flex"}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"2em"}}>
                        <div style={{display:"flex",flexDirection:"column",gap:"0.4em",width:"12vw"}}>
                            <label style={{fontFamily:"Segoe UI",fontSize:"12px"}}>Tipo de Documento</label>
                            <select id="miSelector" name="opciones" style={{padding:"3px",fontSize:"13px"}}>
                                <option value="opcion2">RUC</option>
                            </select>
                        </div>

                         <div style={{display:"flex",flexDirection:"row",gap:"1em"}}>

                        <div style={{flexDirection:"row",display:"flex"}}>  
                        <div style={{display:"flex",flexDirection:"column",gap:"0.4em",width:"12vw"}}>
                            <label style={{fontFamily:"Segoe UI",fontSize:"12px"}}>Número de Documento</label>
                            <input name="numDoc" value={formData.numDoc} onChange={handleInputChange} style={{padding:"3px",fontSize:"13px"}} />
                        </div>

                        <button onClick={handleBuscarCliente}  style={{marginTop:"2.5vh",height:"3.2vh"}}><IoMdSearch /></button>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:"0.4em",width:"8vw"}}>
                            <span style={{height:"1.5vh"}}></span>
                            <button onClick={handleOpenModal} style={{fontFamily:"Segoe UI",fontSize:"12px",backgroundColor:"#4680FF",border:"1px solid #4680FF",color:"white",padding:"3.6px"}}>Nuevo Cliente</button>
                        </div>
                        </div> 
                          
                    </div>

                        <div style={{display:"flex",flexDirection:"column",gap:"0.4em",width:"36.8vw"}}>
                            <label style={{fontFamily:"Segoe UI",fontSize:"12px"}}>Nombres y apellidos</label>
                            <input name="nombres" value={ clienteData?.nombres} onChange={handleInputChange} style={{padding:"3px",fontSize:"13px",width:"36.2vw"}} />
                        </div>

                        <div style={{display:"flex",flexDirection:"column",gap:"0.4em",width:"36.8vw"}}>
                            <label style={{fontFamily:"Segoe UI",fontSize:"12px"}}>Razón Social</label>
                            <input name="razonSocial" value={clienteData?.razonSocial} onChange={handleInputChange}  style={{padding:"3px",fontSize:"13px",width:"36.2vw"}} />
                        </div>

                        <div style={{display:"flex",flexDirection:"column",gap:"0.4em",width:"36.8vw"}}>
                            <label style={{fontFamily:"Segoe UI",fontSize:"12px"}}>Dirección</label>
                            <input name="direccion" value={clienteData?.ubicacion} onChange={handleInputChange}  style={{padding:"3px",fontSize:"13px",width:"36.2vw"}} />
                        </div>

                        <div style={{display:"flex",flexDirection:"column",gap:"0.4em",width:"36.8vw"}}>
                            <label style={{fontFamily:"Segoe UI",fontSize:"12px"}}>Correo Electrónico</label>
                            <input name="correo" value={clienteData?.correo} onChange={handleInputChange}  style={{padding:"3px",fontSize:"13px",width:"36.2vw"}} />
                        </div>

                        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
                            <div style={{display:"flex",flexDirection:"column",gap:"0.4em",width:"12vw"}}>
                                <label style={{fontFamily:"Segoe UI",fontSize:"12px"}}>Fecha de Emisión</label>
                                <input value={fechaActual} readOnly style={{padding:"3px",fontSize:"13px"}} />
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:"0.4em",width:"12vw"}}>
                                <label style={{fontFamily:"Segoe UI",fontSize:"12px",fontWeight:"bold"}}>TOTAL</label>
                                <input name="total" value={total ?? ""} type="number" onChange={handleTotalChange} readOnly style={{padding:"3px",fontSize:"13px"}} />
                            </div>

                        </div>
                    
                    
                </div>

                
                </div>

                <div style={{width:"45vw",padding:"20px",display:"flex",flexDirection:"column",gap:"2em",border:"1px solid #E9ECF3",borderRadius:"10px"}}>
                    <span style={{fontWeight:"bold",fontSize:"15px"}}>Detalles de ítems</span>
                    <div style={{flexDirection:"column",gap:"1em",display:"flex",alignItems:"end"}}>
                    
                    <button onClick={handleOpenAñadirProducto} style={{ width: "15vw", height: "4vh", backgroundColor: "#A2C76A", border: "1px solid #A2C76A" }}>+ Añadir Producto</button>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{position: "sticky", top: 0,  zIndex: 1,border:"1px solid black"}}>
                            <tr>
                                <th style={styles.headerCell}>Nombre</th>
                                <th style={styles.headerCell}>Cantidad</th>
                                <th style={styles.headerCell}>Precio</th>
                                <th style={styles.headerCell}>Descuento</th>
                                <th style={styles.headerCell}>Subtotal</th>
                                <th style={styles.headerCell}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody style={{backgroundColor:"white"}}>
                            {productosAgregados.map((producto) => (
                                <tr key={producto.idProducto}>
                                    <td style={styles.cell}>{producto.nombre}</td>
                                    <td style={styles.cell}>
                                    <input
                                      style={{border:"transparent",textAlign:"center",width:"5vw"}}
                                      type="number"
                                      value={cantidades[producto.idProducto] || 0}
                                      onChange={(e) => handleCantidadChange(producto.idProducto, Number(e.target.value))}
                                    />
                                    </td>
                                    <td style={styles.cell}>{producto.precio}</td>
                                    <td style={styles.cell}>
                                        <input 
                                            style={{border:"transparent",textAlign:"center",width:"4vw"}}
                                            type="number"
                                            value={descuento}
                                            onChange={(e) => setDescuento(Number(e.target.value))} 
                                        /><span>%</span>
                                    </td>
                                    <td style={styles.cell}>
                                      S/. {( (cantidades[producto.idProducto] || 0) * (producto.precio - (producto.precio * (descuento / 100)))).toFixed(2)}
                                    </td>
                                    <td style={styles.buttonCell}>
                                        <Button
                                            style={styles.button}
                                            onClick={() => handleRemove(producto.idProducto)}
                                        >
                                            Remover
                                        </Button>
                                    </td>
                                
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    
                </div>

                <div style={{display:"flex",flexDirection:"row",justifyContent:"end",gap:"3em"}}>
                    <button onClick={emitirComprobante} style={{height:"5vh",width:"6vw",fontSize:"14px",backgroundColor:"#9AC25E",border:"none",color:"white",cursor:"pointer",borderRadius:"20px"}}>Emitir</button>
                    <button onClick={handleReload} style={{height:"5vh",width:"6vw",fontSize:"14px",backgroundColor:"#C52929",border:"none",color:"white",cursor:"pointer",borderRadius:"20px"}}>Cancelar</button>
                </div>
                </div>

                <Dialog open={openModal} onClose={handleCloseModal}>
                  <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                  <DialogContent>
                    <form style={{ width: '500px' }}>
                      <Grid container spacing={2}>
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
                            name="numDoc"
                            value={formData.numDoc}
                            onChange={handleInputChange}
                            fullWidth
                            required
                          />
                        </Grid>

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

                  {/*Dialog de Añadir Producto*/}
                  <Modal
                    open={openAñadirProductos}
                    onClose={handleCloseAñadirProducto}
                    aria-labelledby="search-modal-title"
                    aria-describedby="search-modal-description"
                  >
                    <Box
                      sx={{
                        width: 600,
                        bgcolor: 'background.paper',
                        p: 4,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <Typography variant="h6" component="h2" id="search-modal-title">
                        Agrega Productos a tu Venta
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                          placeholder="Escribe aquí para buscar..."
                          onChange={handleInputChangeProducto}
                          value={searchTerm}
                          fullWidth
                          disabled={loading}
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            flexGrow: 1,
                          }}
                        />
                        <Button
                          onClick={handleSearch}
                          color="secondary"
                          disabled={loading}
                          sx={{ ml: 2 }}
                        >
                          Buscar
                        </Button>
                      </Box>

                      {loading && <p>Cargando...</p>}
                      {error && <p style={{ color: 'red' }}>{error}</p>}

                          <div style={{display:"flex",flexDirection:"row",gap:"5em",marginLeft:"3vw"}}>
                            <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                              Producto/Servicios
                            </Typography>

                            <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                              Stock Disponible
                            </Typography>
                          </div>
                      
                      
                      {paginatedResults.length > 0 && (
                        <List>
                          {paginatedResults.map((result, index) => (
                            <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography style={{border:"1px solid",width:"15vw",textAlign:"center",borderRadius:"10px",fontSize:"15px"}}>{result.nombre}</Typography>
                              <Typography style={{borderBottom: '1px solid',padding: '0 10px',textAlign: 'center',borderRadius: '10px',width: '5vw',}}>
                                {result.stock  || 'Sin Stock'}
                              </Typography>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAgregarProducto(result)}
                                disabled={productosAgregados.some(p => p.idProducto === result.idProducto)}
                              >
                                {productosAgregados.some(p => p.idProducto === result.idProducto) ? "Agregado" : "Agregar"}
                              </Button>
                            </ListItem>
                          ))}
                        </List>
                      )}

                      {/* Paginación */}
                      <Box sx={{ display: 'flex',  mt: 0 ,justifyContent:"center"}}>
                        <Button 
                          onClick={() => handlePageChange('prev')} 
                          disabled={currentPage === 1} 
                          color="primary"
                        >
                          <HiMiniArrowSmallLeft style={{fontSize:"20px"}} />
                        </Button>
                        <Typography style={{border:"1px solid",padding:"5px",alignContent:"center",fontSize:"12px",backgroundColor:"#1565C0",color:"white",fontWeight:"bold"}}>{`${currentPage}`}</Typography>
                        <Button 
                          onClick={() => handlePageChange('next')} 
                          disabled={endIndex >= results.length} 
                          color="primary"
                        >
                          <HiOutlineArrowSmallRight />
                        </Button>
                      </Box>

                      <Button onClick={handleCloseAñadirProducto}  color="secondary">
                        Cancelar
                      </Button>
                    </Box>
                  </Modal>


            </div>
        </div>
    );
};

export default Factura;