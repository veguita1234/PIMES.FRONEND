import './Dashboard.css';
import React, { useState, useEffect } from 'react';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { TfiLayersAlt, TfiPackage } from "react-icons/tfi";
import { SlUser } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import Login from '../Login/Login';
import Cliente from '../Clientes/Clientes'
import Proveedores from '../Proveedores/Proveedores';
import VistaPrincipal from '../VistaPrincipal/VistaPrincipal';
import Productos from '../Productos/Productos';
import Boleta from '../Boleta/Boleta';
import Factura from '../Factura/Factura';
import DetalleCobrar from '../DetalleCabecera/DetalleCobrar';
import IngresoCompras from '../IngresoCompras/IngresoCompras';


const Dashboard: React.FC = () => {
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState<JSX.Element>(<VistaPrincipal />);

  const [expandedSubLink, setExpandedSubLink] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);


  const [openLoginModal, setOpenLoginModal] = useState(false);
  
  useEffect(() => {
  
    

    const storedUserName = localStorage.getItem('userName');
  if (storedUserName) {
    setUserName(storedUserName);
  }

  const storedPage = localStorage.getItem('currentPage');
  if (storedPage) {
    handleSubLinkClick(storedPage); 
  }

  }, []);



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
const handleLogout = () => {
  setUserName(null);
  localStorage.removeItem('token');
  localStorage.removeItem('userName');

  setDynamicContent(<VistaPrincipal />);
};



const handleLinkClick = (link: string) => {
  if (userName) {
    if (link === 'facturacion') {
      setExpandedLink(prev => (prev === 'facturacion' ? null : 'facturacion'));
      setExpandedSubLink(prev => (prev === 'comprobante' ? 'comprobante' : null));
    } else {
      setExpandedLink(prev => (prev === link ? null : link));
      setExpandedSubLink(null);
    }
  } else {
    handleOpenLoginModal();
  }
};

  const handleSubLinkClick = (page: string) => {
    localStorage.setItem('currentPage', page);
    switch (page) {
      case 'clientes':
        setDynamicContent(<Cliente />);
        break;
      case 'proveedores':
        setDynamicContent(<Proveedores />);
        break;
      case 'productos':
        setDynamicContent(<Productos />);
        break;
        case 'compras':
        setDynamicContent(<IngresoCompras />);
        break;
      case 'detallecomprobante':
        setDynamicContent(<DetalleCobrar />);
        break;
      case 'boleta':
        setDynamicContent(<Boleta />);  
        break;
      case 'factura':
        setDynamicContent(<Factura />); 
        break;
      default:
        setDynamicContent(<VistaPrincipal />);
        break;
    }
  };

  const handleImageClick = () => {
    setDynamicContent(<VistaPrincipal />); // Contenido por defecto
  };



  return (
    <div className="dashboardContainer">
      <div className='menu'>
        <Link to='/' onClick={handleImageClick}>
          <img style={{ width: "15vw", height: "19vh" }} src='PIMES.png' alt='Logo' />
        </Link>
        <Link style={{ textDecoration: "none" }} to='/' onClick={() => handleLinkClick('venta')}>
          <span className='viñeta'>
            <AiOutlineShoppingCart style={{ backgroundColor: "#4680FF" }} className='icono' />
            <span className='texto'>Punto de Venta</span>
            <IoIosArrowForward style={{ color: "gray", fontSize: "15px", marginLeft: "5vw" }} />
          </span>
        </Link>
        {expandedLink === 'venta' && (
          <div className="subviñetas">

          </div>
        )}

<Link style={{ textDecoration: "none" }} to='/' onClick={() => handleLinkClick('facturacion')}>
        <span className='viñeta'>
          <TfiLayersAlt style={{ backgroundColor: "#FC6180" }} className='icono' />
          <span className='texto'>Facturación</span>
          <IoIosArrowForward style={{ color: "gray", fontSize: "15px", marginLeft: "6.3vw" }} />
        </span>
      </Link>
      {expandedLink === 'facturacion' && (
        <div className="subviñetas">
          {/* <span onClick={() => handleSubLinkClick('detallecomprobante')} style={{ display: "flex", alignItems: "center", color: "black", cursor: "pointer" }}>
              <IoIosArrowForward style={{ color: "gray", fontSize: "15px" }} /> Detalles de Comprobantes 
            </span> */}
          <span onClick={() => setExpandedSubLink(prev => (prev === 'comprobante' ? null : 'comprobante'))} style={{ display: "flex", alignItems: "center", color: "black", cursor: "pointer" }}>
            <IoIosArrowForward style={{ color: "gray", fontSize: "15px" }} /> Nuevo Comprobante <IoIosArrowForward style={{ color: "gray", fontSize: "15px",marginLeft:"10px" }} />
          </span>
          {expandedSubLink === 'comprobante' && (
            <div className="subviñetas" style={{marginTop:"10px"}}>
              <span onClick={() => handleSubLinkClick('boleta')} style={{ display: "flex", alignItems: "center", color: "black", cursor: "pointer",marginLeft:"30px" }}>
                <IoIosArrowForward style={{ color: "gray", fontSize: "15px" }} /> Boleta
              </span>
              <span onClick={() => handleSubLinkClick('factura')} style={{ display: "flex", alignItems: "center", color: "black", cursor: "pointer",marginLeft:"30px" }}>
                <IoIosArrowForward style={{ color: "gray", fontSize: "15px" }} /> Factura
              </span>
            </div>
          )}
        </div>
      )}


        <Link style={{ textDecoration: "none" }} to='/' onClick={() => handleLinkClick('productos')}>
          <span className='viñeta'>
            <TfiPackage style={{ backgroundColor: "#93BE52" }} className='icono' />
            <span className='texto'>Productos y Stock</span>
            <IoIosArrowForward style={{ color: "gray", fontSize: "15px", marginLeft: "4vw" }} />
          </span>
        </Link>
        {expandedLink === 'productos' && (
          <div className="subviñetas">
            <span onClick={() => handleSubLinkClick('productos')} style={{ display: "flex", alignItems: "center", color: "black", cursor: "pointer" }}>
              <IoIosArrowForward style={{ color: "gray", fontSize: "15px" }} /> Productos
            </span>
            <span onClick={() => handleSubLinkClick('compras')} style={{ display: "flex", alignItems: "center", color: "black", cursor: "pointer" }}>
              <IoIosArrowForward style={{ color: "gray", fontSize: "15px" }} /> Compras
            </span>
          </div>
        )}

        <Link style={{ textDecoration: "none" }} to='/' onClick={() => handleLinkClick('clientes')}>
          <span className='viñeta'>
            <SlUser style={{ backgroundColor: "#FFB64D" }} className='icono' />
            <span className='texto'>Clientes y Proveedores</span>
            <IoIosArrowForward style={{ color: "gray", fontSize: "15px", marginLeft: "2.3vw" }} />
          </span>
        </Link>
        {expandedLink === 'clientes' && (
          <div className="subviñetas">
            <span onClick={() => handleSubLinkClick('clientes')} style={{ display: "flex", alignItems: "center", color: "black", cursor: "pointer" }}>
              <IoIosArrowForward style={{ color: "gray", fontSize: "15px" }} /> Clientes
            </span>
            <span onClick={() => handleSubLinkClick('proveedores')} style={{ display: "flex", alignItems: "center", color: "black", cursor: "pointer" }}>
              <IoIosArrowForward style={{ color: "gray", fontSize: "15px" }} /> Proveedores
            </span>
          </div>
        )}
      </div>

      <div className='cuerpo'>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "80vw", marginTop: "2vh", display: "flex", justifyContent: "end",  alignItems: "center", gap: "1em" }}>
  {userName ? (
    <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
      <span>Bienvenido, {userName}</span>
      <button
        style={{ display: "flex", alignItems: "center", gap: "1em", backgroundColor: "red", border: "none", cursor: "pointer" }}
        onClick={handleLogout}
      >
        Cerrar Sesión
      </button>
      <FaUser style={{ border: "1px solid", borderRadius: "50%", fontSize: "30px" }} />
    </div>
  ) : (
    <button
      style={{ display: "flex", alignItems: "center", gap: "1em", backgroundColor: "transparent", border: "none", cursor: "pointer" }}
      onClick={handleOpenLoginModal}
    >
      Iniciar Sesión
      <FaUser style={{ border: "1px solid", borderRadius: "50%", fontSize: "30px" }} />
    </button>
  )}
</div>

                <div style={{ width: "100%", backgroundColor: "#E9ECF3" }}>
                    {dynamicContent}
                </div>
            </div>

<Login open={openLoginModal} onClose={handleCloseLoginModal} onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default Dashboard;
