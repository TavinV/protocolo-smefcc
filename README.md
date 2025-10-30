# 🧰 SMEFCC  
📌 **Sistema de Monitoramento e Empréstimo de Fiscalização da Construção Cívil**

O **SMEFCC** é um sistema de gerenciamento e rastreamento de ferramentas desenvolvido para o **SENAI** como trabalho de conclusão do curso técnico em mecatrônica, integrando tecnologia **RFID** e controle digital de usuários, itens e empréstimos.  
O objetivo é substituir o controle manual de ferramentas por um sistema automatizado, eficiente e seguro — reduzindo perdas, melhorando a organização e facilitando a rastreabilidade de cada item.

---

## 🚀 Tecnologias Utilizadas  

- **Node.js** (v22.3.0 recomendado)  
- **Express** — Framework para construção da API REST  
- **MongoDB** — Banco de dados NoSQL para armazenamento dos dados  
- **Mongoose** — ODM para modelagem de dados  
- **JWT (JSON Web Token)** — Autenticação e controle de acesso  
- **Joi** — Validação de dados e formulários  
- **Crypto** — Criptografia de senhas e dados sensíveis (SHA-256)  
- **Winston** — Sistema de logging e monitoramento  
- **Dotenv**, **Cors**, **Body-parser**, **Moment** — Utilitários diversos  

---

## ⚙️ Funcionalidades Principais  

✅ **Cadastro e autenticação de usuários**  
- Controle de cargos (`funcionario` e `admin`)  
- Associação de cartões **RFID** a usuários  
- Restrição para criação de **admins** via **MASTER_KEY**  

🔒 **Autenticação Segura**  
- Login via **CPF e senha criptografada**  
- Sessão autenticada com **JWT**  

🔧 **Gerenciamento de Itens e Ferramentas**  
- Cadastro de modelos de ferramentas  
- Controle de status (`disponível`, `emprestado`, `em manutenção`, etc.)  
- Identificação via **RFID** para cada item físico  

📦 **Controle de Empréstimos e Devoluções**  
- Registro de transações (quem pegou, quando e o que)  
- Atualização automática de status dos itens  
- Histórico completo de movimentações  

📡 **Integração com RFID**  
- Reconhecimento de cartões para autenticação  
- Associação e desassociação dinâmica de tags RFID  
- Monitoramento de leituras pendentes (`rfidPending`)  

📋 **Validação e Logs**  
- Validação completa com **Joi** e CPF verificado  
- Logs automáticos de erros e eventos com **Winston**  

---

## 📂 Estrutura do Projeto  

```
server/
│── api/
│   ├── controllers/       # Controladores (User, Item, Transaction, RFIDPending)
│   ├── services/          # Lógica de negócio e utilitários de CRUD
│   ├── models/            # Modelos Mongoose
│   ├── validation/        # Schemas Joi para validação de entrada
│   ├── middleware/        # Autenticação, logging, etc.
│   ├── routes/            # Rotas da API REST
│   ├── util/              # Respostas padronizadas, erros e helpers
│   └── server.js          # Ponto de entrada da API
|   └── app.js             # App do express
│
│── docs/
│   └── documentation.md   # Documentação detalhada da API
│
│── .env.example           # Exemplo de configuração de ambiente
│── package.json
│── README.md
```

---

## ⚙️ Configuração do Ambiente  

Crie um arquivo **.env** na raiz do projeto e configure conforme o exemplo abaixo  
(ou copie o conteúdo de `.env.example`):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smefcc
JWT_SECRET=sua_chave_jwt_secreta
PORT=3000
MASTER_KEY=sua_chave_secreta
```

> 🔑 **MASTER_KEY** — Chave secreta usada para criar usuários com cargo `admin`.

---

## 📌 Instalação e Uso  

1. **Clone o repositório:**
   ```
   git clone https://github.com/TavinV/smefcc.git
   ```

2. **Instale as dependências:**
   ```
   cd server
   npm install
   ```

3. **Configure o arquivo `.env`** conforme o modelo acima.

4. **Inicie o servidor:**
   ```
   npm run dev
   ```

5. O servidor será iniciado em:
   ```
   http://localhost:<Porta definida no .env>
   ```

---

## 🔑 Autenticação e Permissões  

A autenticação é feita via **CPF e senha**, retornando um **token JWT**.  
Envie o token no **header** para acessar as rotas protegidas:

```
Authorization: Bearer <seu_token_jwt>
```

### Papéis de Usuário

| Cargo | Descrição | Permissões |
|--------|------------|-------------|
| **funcionario** | Usuário comum | Pode autenticar-se e registrar empréstimos |
| **admin** | Administrador | Pode criar, editar e excluir usuários, itens e transações |

> ⚠️ Apenas quem possui a **MASTER_KEY** pode criar usuários com cargo `admin`.

---

## 📜 Documentação da API  

A documentação completa das rotas, parâmetros e respostas está disponível em:  
👉 [`server/docs/documentation.md`](server/docs/documentation.md)


---

## 🧠 Boas Práticas do Projeto  

- **Arquitetura baseada em serviços (Service Layer)** — clara separação entre regras de negócio e controle.  
- **Tratamento unificado de erros** — via `handleControllerError()` e `ApiResponse`.  
- **Validação consistente** — utilizando `Joi` e funções auxiliares personalizadas (como `validateCPF`).  
- **Mensagens padronizadas** — todos os retornos seguem um formato coerente com status HTTP.  

---

## 📞 Contato  

💬 Dúvidas, sugestões ou suporte?  
📧 **otavioviniciusads@gmail.com**
