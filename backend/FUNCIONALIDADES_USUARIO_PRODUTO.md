# Funcionalidades de Usuário e Produto

## Implementação de Vinculação de Produtos aos Usuários

### Mudanças Implementadas

#### 1. Modelo de Dados
- **Produto.ts**: Adicionada relação `ManyToOne` com `Usuario`
- **Usuario.ts**: Adicionada relação `OneToMany` com `Produto`

#### 2. Serviços
- **ProdutoService.ts**: 
  - Método `inserir` agora recebe `usuarioId` como parâmetro
  - Método `atualizar` verifica se o produto pertence ao usuário
  - Método `deletar` verifica se o produto pertence ao usuário
  - Novo método `listarPorUsuario(usuarioId)` para listar produtos de um usuário específico

#### 3. Controller
- **ProdutoController.ts**:
  - Adicionado `LoginService` para extrair dados do token
  - Método `getUsuarioIdFromToken()` para extrair ID do usuário do token
  - Todos os métodos agora verificam permissões do usuário
  - Novo endpoint `listarPorUsuario` para listar produtos do usuário logado

#### 4. Autenticação
- **LoginService.ts**: Modificado para retornar dados do token decodificado

### Novos Endpoints

#### 1. Listar Produtos do Usuário Logado
```
GET /api/produtos/meus-produtos
Headers: Token: <seu_token>
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Produto 1",
    "preco": 100.00,
    "descricao": "Descrição do produto",
    "imagemUrl": "http://localhost:3000/uploads/imagem.jpg",
    "categoria": {
      "id": 1,
      "nome": "Eletrônicos"
    },
    "usuario": {
      "id": 1,
      "email": "usuario@email.com",
      "nome": "Nome do Usuário"
    }
  }
]
```

#### 2. Criar Produto (Agora vincula ao usuário)
```
POST /api/produtos
Headers: Token: <seu_token>
Body: {
  "nome": "Novo Produto",
  "preco": 150.00,
  "categoria": {"id": 1},
  "descricao": "Descrição do produto",
  "imagemUrl": "http://localhost:3000/uploads/imagem.jpg"
}
```

#### 3. Atualizar Produto (Apenas se for do usuário)
```
PUT /api/produtos/:id
Headers: Token: <seu_token>
Body: {
  "nome": "Produto Atualizado",
  "preco": 200.00,
  "categoria": {"id": 1},
  "descricao": "Nova descrição",
  "imagemUrl": "http://localhost:3000/uploads/nova-imagem.jpg"
}
```

#### 4. Deletar Produto (Apenas se for do usuário)
```
DELETE /api/produtos/:id
Headers: Token: <seu_token>
```

### Segurança Implementada

1. **Verificação de Propriedade**: Usuários só podem editar/deletar seus próprios produtos
2. **Autenticação Obrigatória**: Todos os endpoints de produto requerem token válido
3. **Validação de Token**: Token é validado e decodificado para extrair ID do usuário

### Como Usar no Frontend

#### 1. Login e Obter Token
```javascript
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'usuario@email.com', senha: 'senha123' })
});
const { token } = await response.json();
```

#### 2. Listar Produtos do Usuário
```javascript
const response = await fetch('/api/produtos/meus-produtos', {
  headers: { 'Token': token }
});
const produtos = await response.json();
```

#### 3. Criar Produto
```javascript
const response = await fetch('/api/produtos', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Token': token 
  },
  body: JSON.stringify({
    nome: 'Meu Produto',
    preco: 100.00,
    categoria: { id: 1 },
    descricao: 'Descrição do produto'
  })
});
```

### Benefícios da Implementação

1. **Isolamento de Dados**: Cada usuário vê apenas seus próprios produtos
2. **Segurança**: Usuários não podem modificar produtos de outros usuários
3. **Organização**: Facilita a gestão de produtos por usuário
4. **Escalabilidade**: Permite implementar funcionalidades como marketplace no futuro 