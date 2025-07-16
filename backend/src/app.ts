import express from 'express';
import { ProdutoService } from './service/ProdutoService';
import { ProdutoController } from './controller/ProdutoController';
import { Produto } from './model/Produto';
import { Usuario } from './model/Usuario';
import { UsuarioService } from './service/UsuarioService';
import { UsuarioController } from './controller/UsuarioController';
import { LoginService } from './service/LoginService';
import { LoginController } from './controller/LoginController';
import { PedidoService } from './service/PedidoService';
import { PedidoController } from './controller/PedidoController';
import { Pedido } from './model/Pedido';
import { CategoriaService } from './service/CategoriaService';
import { CategoriaController } from './controller/CategoriaController';
import { Categoria } from './model/Categoria';
import { DataSourceSingleton } from './database';
import { usuarioRotas } from './routers/UsuarioRouter';
import { produtoRotas } from './routers/ProdutoRouter';
import { pedidoRotas } from './routers/PedidoRouter';
import { categoriaRotas } from './routers/CategoriaRouter';
import { TokenMiddleware } from './middleware/TokenMiddleware';
import { LoggingObserver } from './observer/LoggingObserver';
import { NotificationObserver } from './observer/NotificationObserver';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Token', 'Authorization'], 
    credentials: true, 
};
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => { 
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Servir arquivos estáticos
app.use('/uploads', express.static('uploads'));

const dataSource = DataSourceSingleton.getInstance();
dataSource.initialize()
    .then(() => console.log("Banco conectado!"))
    .catch((err) => console.error("Erro ao conectar com banco:", err));

//Usuario
const usuarioRepository = DataSourceSingleton.getInstance().getRepository(Usuario);
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

//Login
const loginService = new LoginService(usuarioRepository);
const loginController = new LoginController(loginService);

//Produto
const produtoRepository = DataSourceSingleton.getInstance().getRepository(Produto);
const produtoService = new ProdutoService(produtoRepository);

// Configurando Observers para produtos (Observer Pattern)
const loggingObserver = new LoggingObserver();
const notificationObserver = new NotificationObserver();
produtoService.attachObserver(loggingObserver);
produtoService.attachObserver(notificationObserver);

const produtoController = new ProdutoController(produtoService, loginService);

//Pedido
const pedidoRepository = DataSourceSingleton.getInstance().getRepository(Pedido);
const pedidoService = new PedidoService(pedidoRepository, produtoRepository, usuarioRepository);
const pedidoController = new PedidoController(pedidoService);

//Categoria
const categoriaRepository = DataSourceSingleton.getInstance().getRepository(Categoria);
const categoriaService = new CategoriaService(categoriaRepository);
const categoriaController = new CategoriaController(categoriaService);

//Midleware TokenMiddleware
const tokenMiddleware = new TokenMiddleware(loginService)

app.use(cors(corsOptions));

// Routes
app.post('/api/login', loginController.realizarLogin);
app.use('/api/usuarios', usuarioRotas(usuarioController));

app.use(tokenMiddleware.verificarAcesso.bind(tokenMiddleware));
app.use('/api/produtos', produtoRotas(produtoController));
app.use('/api/pedidos', pedidoRotas(pedidoController));
app.use('/api/categorias', categoriaRotas(categoriaController));

// Rota para upload de imagem
app.post('/api/upload-imagem', upload.single('imagem'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
        }
        
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        res.status(200).json({ 
            message: 'Imagem enviada com sucesso',
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));