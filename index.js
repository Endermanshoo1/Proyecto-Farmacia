const express = require('express');  
const mongoose = require('mongoose');  
const dotenv = require('dotenv');  
const cookieParser = require('cookie-parser');  
const bodyParser = require('body-parser');  
const path = require('path');   
const jwt = require('jsonwebtoken');  
const multer = require('multer');  

require('dotenv').config();  
    
const app = express();  
const PORT = process.env.PORT || 3000;  

app.listen(PORT, () => {  
    console.log(`El servidor está corriendo en el puerto: ${PORT}`);  
});   

// Configurar Multer para guardar imágenes en una carpeta  
const storage = multer.diskStorage({  
    destination: (req, file, cb) => {  
      cb(null, './uploads/');  
    },  
    filename: (req, file, cb) => {  
      cb(null, Date.now() + path.extname(file.originalname));  
    }  
});  

const upload = multer({ storage: storage });  

// Middleware  
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
app.use(cookieParser());  
app.use(express.static(path.join(__dirname, 'views')));  
app.use('/public', express.static(path.join(__dirname, 'public')));  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  

// Conexión a MongoDB   
mongoose.connect(process.env.MONGO_URL)    
    .then(() => {  
        console.log('Te has conectado a MongoDB');      
    })   
    .catch(err => console.error('Error conectando a MongoDB:', err));  

// Controladores  
const userController = require('./controllers/userController');  
const adminController = require('./controllers/adminController');  
const authController = require('./controllers/autenticationController');  
const autentificationAdmin = require('./controllers/autentificationAdmin');    
const productoController = require('./controllers/productosControllers');   
const carritoController = require('./controllers/carritoController');
const PagoController = require('./controllers/pagosController'); 
const crearFactura = require('./controllers/facturasController');
const verifyRole = require('./middlewares/autentificationMiddleware');
const { Stream } = require('stream');

// Rutas de autenticación  
app.post('/api/auth/login', authController.login);  
app.post('/api/auth/register', authController.register); 
app.post('/api/logout', authController.logout) 
app.post('/api/admins', adminController.addAdmin);   

// Rutas de usuario  
app.get('/api/users', userController.getAllUsers);  
app.get('/api/users/:id', userController.getUser);  
app.put('/api/users/:id', userController.updateUser);   
app.delete('/api/users/:id', userController.deleteUser);    

// Rutas de administrador  
app.get('/api/admin', autentificationAdmin, adminController.getAdmin);   
app.put('/api/admin', autentificationAdmin, adminController.updateAdmin);   
app.delete('/api/admin', autentificationAdmin, adminController.deleteAdmin);   

// Rutas de productos  
app.post('/api/productos', upload.single('imagen'), productoController.crearProducto);  
app.get('/api/productos', productoController.obtenerProductos);  
app.get('/api/productos/primeros4', productoController.obtenerPrimerosProductos);  
app.get('/api/productos/:id', productoController.obtenerProductoPorId);  
app.put('/api/productos/:id', productoController.actualizarProducto);  
app.delete('/api/productos/:id', productoController.eliminarProducto);  
app.get('/api/productos/categoria/:categoria', productoController.obtenerProductosPorCategoria);  

// Rutas de carrito  
app.post('/api/carrito', carritoController.agregarAlCarrito);    
app.get('/api/carrito', carritoController.obtenerCarrito);    
app.get('/api/carrito/:id', carritoController.obtenerItemPorId);   
app.put('/api/carrito/:id', carritoController.actualizarItem);    
app.delete('/api/carrito/:id', carritoController.eliminarDelCarrito); 

// Rutas de pagos  
app.post('/api/pagos', PagoController.crearPago);  
app.get('/api/pagos', PagoController.obtenerPagos);  
app.get('/api/pagos/email', PagoController.obtenerPagosPorEmail);
app.get('/api/pagos/:id', PagoController.obtenerPagoPorId); 
app.put('/api/pagos/:id/aprobar', PagoController.aprobarPago);  
app.put('/api/pagos/:id/cancelar', PagoController.cancelarPago);  
app.put('/api/pagos/:id/rechazar', PagoController.rechazarPago); 
 
// Rutas de facturas
app.post('/api/facturas', crearFactura.crearFactura);  
app.get('/api/facturas', crearFactura.obtenerFacturas);  
app.get('/api/facturas/email', crearFactura.obtenerFacturasPorEmail);  
app.get('/api/facturas/:id', crearFactura.obtenerFacturaPorId); 
app.put('/api/facturas/:id/aprobar', crearFactura.aprobarFactura);  
app.put('/api/facturas/:id/rechazar', crearFactura.rechazarFactura);   

// Rutas de frontend  
app.get('/', (req, res) => {   
    res.sendFile(__dirname + '/view/register/index.html');    
});  
app.get('/user', verifyRole('user'), (req, res) => {   
    res.sendFile(path.join(__dirname, 'view/dahsboard/index.html'));    
});   

// Rutas para otros productos  
app.get('/user/bebes', (req, res) => {  
    res.sendFile(path.join(__dirname, 'view/productos/bebes/index.html'));     
});   
app.get('/user/belleza',verifyRole('user'), (req, res) => {  
    res.sendFile(path.join(__dirname, 'view/productos/belleza/index.html'));    
});   
app.get('/user/comestibles',verifyRole('user'), (req, res) => {  
    res.sendFile(path.join(__dirname, 'view/productos/comestibles/index.html'));    
});   
app.get('/user/cuidado-personal',verifyRole('user'), (req, res) => {  
    res.sendFile(path.join(__dirname, 'view/productos/cuidadopersonal/index.html'));    
});   
app.get('/user/farmacia',verifyRole('user'), (req, res) => {  
    res.sendFile(path.join(__dirname, 'view/productos/farmacia/index.html'));    
});   
app.get('/user/hogar',verifyRole('user'), (req, res) => {  
    res.sendFile(path.join(__dirname, 'view/productos/hogar/index.html'));    
});   
app.get('/user/Ofertas',verifyRole('user'), (req, res) => {  
    res.sendFile(path.join(__dirname, 'view/productos/ofertas/index.html'));    
});
app.get('/admin', verifyRole('admin'), (req, res) => {  
    res.sendFile(__dirname + '/view/admin/index.html');   
});  
app.get('/carrito', (req, res) => {  
    res.sendFile(__dirname + '/view/carrito/index.html');   
});  
app.get('/acceso-denegado', (req, res) => {  
    res.sendFile(__dirname + '/view/404/index.html');   
});

// Rutas de css y js   
app.use('/js', express.static(path.join(__dirname, 'js')));  
app.use('/css', express.static(path.join(__dirname, 'css')));   
app.use('/css', express.static(path.join(__dirname, 'css/Dashboard.css')));   
app.use('/js', express.static(path.join(__dirname, 'js/Dashboard.js')));   
app.use('/js', express.static(path.join(__dirname, 'js/cartService.js')));
