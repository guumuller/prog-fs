# 🚀 Exemplos Práticos da API

## 📋 Como Testar as APIs

### 🔐 1. Login e Obter Token

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gustavomullerleonini@gmail.com",
    "senha": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 👥 2. Criar Usuário

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "senha": "senha123",
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "tipo": "usuario"
  }'
```

### 📦 3. Criar Produto (com autenticação)

```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Token: <token_obtido_no_login>" \
  -d '{
    "nome": "Smartphone XYZ",
    "preco": 1299.99,
    "categoria": {
      "id": 1
    },
    "descricao": "Smartphone de última geração",
    "imagemUrl": "http://localhost:3000/uploads/produto-123.jpg"
  }'
```

### 🛒 4. Criar Pedido (funcionalidade avançada)

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Token: <token_obtido_no_login>" \
  -d '{
    "usuarioId": 1,
    "produtoIds": [1, 2, 3],
    "observacoes": "Entregar no período da tarde"
  }'
```

### 📸 5. Upload de Imagem

```bash
curl -X POST http://localhost:3000/api/upload-imagem \
  -F "imagem=@/caminho/para/sua/imagem.jpg"
```

### 🔄 6. Atualizar Status do Pedido

```bash
curl -X PUT http://localhost:3000/api/pedidos/1/status \
  -H "Content-Type: application/json" \
  -H "Token: <token_obtido_no_login>" \
  -d '{
    "status": "aprovado"
  }'
```

---

## 🧪 Testando com Postman/Insomnia

### 1. Configurar Environment
Crie um environment com as seguintes variáveis:
- `baseUrl`: `http://localhost:3000/api`
- `token`: (será preenchido após login)

### 2. Collection de Testes

#### Login
- **Method**: POST
- **URL**: `{{baseUrl}}/login`
- **Body** (JSON):
```json
{
  "email": "gustavomullerleonini@gmail.com",
  "senha": "senha123"
}
```
- **Tests**:
```javascript
if (pm.response.code === 201) {
    pm.environment.set("token", pm.response.json().token);
}
```

#### Criar Usuário
- **Method**: POST
- **URL**: `{{baseUrl}}/usuarios`
- **Body** (JSON):
```json
{
  "email": "teste@exemplo.com",
  "senha": "senha123",
  "nome": "Usuário Teste",
  "telefone": "(11) 88888-8888",
  "tipo": "usuario"
}
```

#### Criar Produto
- **Method**: POST
- **URL**: `{{baseUrl}}/produtos`
- **Headers**:
  - `Token`: `{{token}}`
- **Body** (JSON):
```json
{
  "nome": "Produto Teste",
  "preco": 99.99,
  "categoria": {
    "id": 1
  },
  "descricao": "Descrição do produto teste"
}
```

#### Criar Pedido
- **Method**: POST
- **URL**: `{{baseUrl}}/pedidos`
- **Headers**:
  - `Token`: `{{token}}`
- **Body** (JSON):
```json
{
  "usuarioId": 1,
  "produtoIds": [1, 2],
  "observacoes": "Pedido de teste"
}
```

---

## 📊 Fluxo Completo de Teste

### 1. Preparação
```bash
# Iniciar servidor
npm run dev
```

### 2. Sequência de Testes

#### Passo 1: Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "gustavomullerleonini@gmail.com", "senha": "senha123"}'
```

#### Passo 2: Criar Usuário
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@exemplo.com",
    "senha": "senha123",
    "nome": "Cliente Teste",
    "telefone": "(11) 77777-7777"
  }'
```

#### Passo 3: Criar Produtos
```bash
# Produto 1
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Token: <token>" \
  -d '{
    "nome": "Smartphone",
    "preco": 1299.99,
    "categoria": {"id": 1},
    "descricao": "Smartphone de última geração"
  }'

# Produto 2
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Token: <token>" \
  -d '{
    "nome": "Notebook",
    "preco": 2999.99,
    "categoria": {"id": 1},
    "descricao": "Notebook para trabalho"
  }'
```

#### Passo 4: Criar Pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Token: <token>" \
  -d '{
    "usuarioId": 1,
    "produtoIds": [1, 2],
    "observacoes": "Entrega urgente"
  }'
```

#### Passo 5: Atualizar Status
```bash
curl -X PUT http://localhost:3000/api/pedidos/1/status \
  -H "Content-Type: application/json" \
  -H "Token: <token>" \
  -d '{"status": "aprovado"}'
```

#### Passo 6: Verificar Pedido
```bash
curl -X GET http://localhost:3000/api/pedidos/1 \
  -H "Token: <token>"
```

---

## 🎯 Status Codes Esperados

### ✅ Sucessos
- `200` - Operação realizada com sucesso
- `201` - Recurso criado com sucesso

### ❌ Erros
- `400` - Dados inválidos ou regra de negócio violada
- `401` - Token não fornecido ou inválido
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

---

## 🔍 Validações Implementadas

### Usuários
- ✅ Email deve ter formato válido
- ✅ Senha deve ter pelo menos 6 caracteres
- ✅ Nome é opcional
- ✅ Telefone é opcional
- ✅ Tipo padrão é "usuario"

### Produtos
- ✅ Nome é obrigatório
- ✅ Preço deve ser positivo
- ✅ Categoria é obrigatória
- ✅ Descrição é opcional
- ✅ Imagem é opcional

### Pedidos
- ✅ Usuário deve existir
- ✅ Produtos devem existir
- ✅ Valor total é calculado automaticamente
- ✅ Status padrão é "pendente"
- ✅ Não é possível cancelar pedidos entregues

---

## 🚀 Funcionalidades Especiais

### 🔄 Observer Pattern
- Logs automáticos de todas as operações de produtos
- Notificações simuladas (email, SMS) quando produtos são criados/atualizados

### 🔧 Strategy Pattern
- Validação flexível para diferentes tipos de dados
- Fácil extensão para novas regras de validação

### 🔐 Autenticação JWT
- Tokens seguros para autenticação
- Middleware automático para validação
- Rotas protegidas por padrão

### 📸 Upload de Imagens
- Suporte para imagens de produtos
- Validação de tipo e tamanho de arquivo
- URLs acessíveis para as imagens

### 🛒 Sistema de Pedidos
- Relacionamento Many-Many entre Pedido e Produto
- Cálculo automático de valor total
- Status de pedidos com regras de negócio 