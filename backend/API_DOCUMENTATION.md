# 📚 Documentação da API REST

## 🚀 Visão Geral

Esta API implementa um sistema de gerenciamento de produtos e pedidos com autenticação JWT, seguindo os princípios REST e utilizando padrões de projeto.

**Base URL:** `http://localhost:3000/api`

---

## 🔐 Autenticação

### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "gustavomullerleonini@gmail.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `201` - Login realizado com sucesso
- `401` - Credenciais inválidas

---

## 👥 Usuários

### Criar Usuário
```http
POST /api/usuarios
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "senha": "senha123",
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "tipo": "usuario"
}
```

### Listar Usuários
```http
GET /api/usuarios
```

### Buscar Usuário por ID
```http
GET /api/usuarios/:id
```

### Atualizar Usuário
```http
PUT /api/usuarios/:id
Content-Type: application/json

{
  "nome": "João Silva Atualizado",
  "telefone": "(11) 88888-8888"
}
```

### Deletar Usuário
```http
DELETE /api/usuarios/:id
```

**Status Codes:**
- `201` - Criado com sucesso
- `200` - Operação realizada com sucesso
- `400` - Dados inválidos
- `404` - Usuário não encontrado
- `500` - Erro interno do servidor

---

## 📦 Produtos

*Todas as rotas de produtos requerem autenticação (header Token)*

### Criar Produto
```http
POST /api/produtos
Token: <jwt_token>
Content-Type: application/json

{
  "nome": "Smartphone XYZ",
  "preco": 1299.99,
  "categoria": {
    "id": 1
  },
  "descricao": "Smartphone de última geração",
  "imagemUrl": "http://localhost:3000/uploads/produto-123.jpg"
}
```

### Listar Produtos
```http
GET /api/produtos
Token: <jwt_token>
```

### Buscar Produto por ID
```http
GET /api/produtos/:id
Token: <jwt_token>
```

### Atualizar Produto
```http
PUT /api/produtos/:id
Token: <jwt_token>
Content-Type: application/json

{
  "nome": "Smartphone XYZ Atualizado",
  "preco": 1199.99,
  "descricao": "Descrição atualizada"
}
```

### Deletar Produto
```http
DELETE /api/produtos/:id
Token: <jwt_token>
```

**Status Codes:**
- `201` - Criado com sucesso
- `200` - Operação realizada com sucesso
- `400` - Dados inválidos
- `401` - Token não fornecido ou inválido
- `404` - Produto não encontrado
- `500` - Erro interno do servidor

---

## 🛒 Pedidos

*Todas as rotas de pedidos requerem autenticação (header Token)*

### Criar Pedido
```http
POST /api/pedidos
Token: <jwt_token>
Content-Type: application/json

{
  "usuarioId": 1,
  "produtoIds": [1, 2, 3],
  "observacoes": "Entregar no período da tarde"
}
```

### Listar Pedidos
```http
GET /api/pedidos
Token: <jwt_token>
```

### Buscar Pedido por ID
```http
GET /api/pedidos/:id
Token: <jwt_token>
```

### Buscar Pedidos por Usuário
```http
GET /api/pedidos/usuario/:usuarioId
Token: <jwt_token>
```

### Atualizar Status do Pedido
```http
PUT /api/pedidos/:id/status
Token: <jwt_token>
Content-Type: application/json

{
  "status": "aprovado"
}
```

**Status válidos:** `pendente`, `aprovado`, `cancelado`, `entregue`

### Cancelar Pedido
```http
DELETE /api/pedidos/:id
Token: <jwt_token>
```

**Status Codes:**
- `201` - Criado com sucesso
- `200` - Operação realizada com sucesso
- `400` - Dados inválidos ou regra de negócio violada
- `401` - Token não fornecido ou inválido
- `404` - Pedido não encontrado
- `500` - Erro interno do servidor

---

## 📂 Categorias

*Todas as rotas de categorias requerem autenticação (header Token ou Authorization)*

### Criar Categoria
```http
POST /api/categorias
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "nome": "Smartphones"
}
```

### Listar Categorias
```http
GET /api/categorias
Authorization: Bearer <jwt_token>
```

### Buscar Categoria por ID
```http
GET /api/categorias/:id
Authorization: Bearer <jwt_token>
```

### Atualizar Categoria
```http
PUT /api/categorias/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "nome": "Smartphones Atualizado"
}
```

### Deletar Categoria
```http
DELETE /api/categorias/:id
Authorization: Bearer <jwt_token>
```

**Status Codes:**
- `201` - Criado com sucesso
- `200` - Operação realizada com sucesso
- `400` - Dados inválidos
- `401` - Token não fornecido ou inválido
- `404` - Categoria não encontrada
- `500` - Erro interno do servidor

---

## 📸 Upload de Imagens

### Enviar Imagem
```http
POST /api/upload-imagem
Content-Type: multipart/form-data

Form Data:
- imagem: [arquivo de imagem]
```

**Resposta:**
```json
{
  "message": "Imagem enviada com sucesso",
  "imageUrl": "http://localhost:3000/uploads/imagem-123.jpg",
  "filename": "imagem-123.jpg"
}
```

**Limitações:**
- Apenas arquivos de imagem (JPEG, PNG, GIF, etc.)
- Tamanho máximo: 5MB
- Formatos aceitos: image/*

---

## 🔧 Padrões de Projeto Implementados

### 1. Singleton
- **DataSourceSingleton**: Garante conexão única com banco de dados

### 2. Strategy
- **ValidationStrategy**: Validação flexível para produtos e usuários
- **ProdutoValidationStrategy**: Validação específica de produtos
- **UsuarioValidationStrategy**: Validação específica de usuários

### 3. Observer
- **ProductSubject**: Gerencia observers de produtos
- **LoggingObserver**: Log das operações
- **NotificationObserver**: Simula notificações (email, SMS)

### 4. Adapter
- **ProdutoAdapter**: Converte DTOs para entidades

### 5. Facade
- **ProdutoFacade**: Simplifica operações de produtos

---

## 🧪 Testes

### Executar Testes
```bash
npm test
```

### Cobertura de Testes
- ✅ Testes unitários para padrões de projeto
- ✅ Testes de integração
- ✅ Testes de regras de negócio
- ✅ Testes de observers e strategy

---

## 📊 Relacionamentos de Banco

### Many-to-One
- **Produto → Categoria**: Um produto pertence a uma categoria

### One-to-Many
- **Usuario → Pedido**: Um usuário pode ter vários pedidos

### Many-to-Many
- **Pedido ↔ Produto**: Um pedido pode ter vários produtos e um produto pode estar em vários pedidos

---

## 🚀 Funcionalidades Específicas

### 1. Manipulação de Duas Entidades Simultaneamente
- **Criar Pedido**: Manipula Usuario e Produto simultaneamente
- **Calcular Valor Total**: Soma preços de múltiplos produtos

### 2. Recursos de Mídia
- **Upload de Imagens**: Suporte para imagens de produtos
- **Validação de Arquivos**: Apenas imagens, máximo 5MB

### 3. Autenticação e Segurança
- **JWT**: Tokens para autenticação
- **Middleware**: Validação automática de tokens
- **CORS**: Configuração de segurança

### 4. Tratamento de Erros
- **Status Codes Apropriados**: 200, 201, 400, 401, 404, 500
- **Mensagens de Erro**: Descrições claras dos problemas
- **Validação**: Regras de negócio implementadas

---

## 📝 Exemplos de Uso

### Fluxo Completo de Compra

1. **Login do Usuário**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "senha": "senha123"}'
```

2. **Criar Pedido**
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Token: <token_obtido>" \
  -d '{"usuarioId": 1, "produtoIds": [1, 2], "observacoes": "Entrega urgente"}'
```

3. **Atualizar Status**
```bash
curl -X PUT http://localhost:3000/api/pedidos/1/status \
  -H "Content-Type: application/json" \
  -H "Token: <token_obtido>" \
  -d '{"status": "aprovado"}'
```

---

## 🎯 Conceitos REST Implementados

### ✅ Métodos HTTP
- `GET`: Buscar recursos
- `POST`: Criar recursos
- `PUT`: Atualizar recursos
- `DELETE`: Remover recursos

### ✅ Status Codes
- `200`: Sucesso
- `201`: Criado
- `400`: Erro do cliente
- `401`: Não autorizado
- `404`: Não encontrado
- `500`: Erro do servidor

### ✅ Headers
- `Content-Type`: application/json
- `Token`: JWT para autenticação

### ✅ URLs Semânticas
- `/api/usuarios` - Gerenciar usuários
- `/api/produtos` - Gerenciar produtos
- `/api/pedidos` - Gerenciar pedidos
- `/api/login` - Autenticação 