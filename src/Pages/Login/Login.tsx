import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography } from '@mui/material';
import HttpModule from "../../Helper/Http.module";

const Login: React.FC<{ open: boolean; onClose: () => void; onLogin: (nombres: string) => void }> = ({ open, onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentModal, setCurrentModal] = useState<'login' | 'register'>('login');
    const [registerFormData, setRegisterFormData] = useState({
        nombres: '',
        apellidos: '',
        estado: '',
        email: '',
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState<number | null>(null);

    const closeAllModals = () => {
        setCurrentModal('login');
        setUsername('');
        setPassword('');
        setRegisterFormData({
            nombres: '',
            apellidos: '',
            estado: '',
            email: '',
            username: '',
            password: '',
        });
        setErrorMessage('');
        setUserId(null);
        onClose();
    };


    const handleLogin = async () => {
        try {
            const response = await HttpModule.post('/SeguridadUsuarios/login', {
                UserName: username,
                Password: password,
            });
    
            const data = response.data;
    
            console.log("Response data:", data);
            console.log(localStorage.getItem('userId'));
    
            if (response.status === 200 && data.success) {
                console.log("Login successful:", data);
                localStorage.setItem('token', data.token); // Guarda el token en localStorage
                localStorage.setItem('userId', data.idUsuario); // Guarda el IdUsuario en localStorage
                console.log("Stored userId:", localStorage.getItem('userId'));
    
                alert(`Inicio de sesión exitoso, ${data.nombres}`);
                onLogin(data.nombres); // Llama a la función de login con los nombres del usuario
                closeAllModals(); // Cierra los modales si es necesario
            } else {
                setErrorMessage(data.message || 'Error en el inicio de sesión.');
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage('Error en el inicio de sesión.');
        }
    };

    

    const handleRegister = async () => {
        try {
            const response = await HttpModule.post('/SeguridadUsuarios/register', {
                Nombres: registerFormData.nombres,
                Apellidos: registerFormData.apellidos,
                Estado: registerFormData.estado,
                Email: registerFormData.email,
                UserName: registerFormData.username,
                Password: registerFormData.password,
            });
    
            const data = response.data;
    
            console.log("Response data:", data);
    
            if (response.status === 200 && data.success) {
                console.log("Register successful:", data);
                alert(`Registro exitoso, ${registerFormData.nombres}`);
                setUserId(data.idUsuario); // Almacena el id del usuario registrado
                closeAllModals(); // Cierra los modales, si corresponde
            } else {
                setErrorMessage(data.message || 'Error en el registro.');
            }
        } catch (error) {
            console.error("Register error:", error);
            setErrorMessage('Error en el registro.');
        }
    };

    const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterFormData(prev => ({ ...prev, [name]: value }));
    };

    const openRegisterModal = () => {
        setCurrentModal('register');
    };

    const openLoginModal = () => {
        setCurrentModal('login');
    };

    return (
        <>
            {/* Modal de Inicio de Sesión */}
            <Modal
                open={open && currentModal === 'login'}
                onClose={closeAllModals}
                aria-labelledby="modal-login"
                aria-describedby="modal-for-login"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Iniciar Sesión
                    </Typography>
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                        Login
                    </Button>
                    <br /><br />
                    <span>
                        No tienes una cuenta? <span onClick={openRegisterModal} style={{ color: 'blue', cursor: 'pointer' }}>Regístrate</span>
                    </span>
                </Box>
            </Modal>

            {/* Modal de Registro */}
            <Modal
                open={open && currentModal === 'register'}
                onClose={closeAllModals}
                aria-labelledby="modal-register"
                aria-describedby="modal-for-register"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Registro
                    </Typography>
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    <TextField
                        label="Nombres"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        name="nombres"
                        value={registerFormData.nombres}
                        onChange={handleRegisterInputChange}
                    />
                    <TextField
                        label="Apellidos"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        name="apellidos"
                        value={registerFormData.apellidos}
                        onChange={handleRegisterInputChange}
                    />
                    <TextField
                        label="Estado"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        name="estado"
                        value={registerFormData.estado}
                        onChange={handleRegisterInputChange}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        name="email"
                        value={registerFormData.email}
                        onChange={handleRegisterInputChange}
                    />
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        name="username"
                        value={registerFormData.username}
                        onChange={handleRegisterInputChange}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        sx={{ mb: 2 }}
                        name="password"
                        value={registerFormData.password}
                        onChange={handleRegisterInputChange}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                        Registrar
                    </Button>
                    <br /><br />
                    <span>
                        Ya tienes una cuenta? <span onClick={openLoginModal} style={{ color: 'blue', cursor: 'pointer' }}>Inicia sesión</span>
                    </span>
                </Box>
            </Modal>
        </>
    );
};

export default Login;
