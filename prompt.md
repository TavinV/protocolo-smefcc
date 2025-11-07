# 🧭 Sistema de Empréstimo e Controle – Protocolo SMEFCC

Este documento descreve detalhadamente o funcionamento do sistema **Protocolo SMEFCC**, seus **endpoints**, **regras de uso**, **contexto de integração com dispositivos físicos** e as **especificações para desenvolvimento do frontend em React (JSX)**.  
Todo o conteúdo abaixo deve ser considerado como um único arquivo `README.md` do projeto.

---

## 🎯 Objetivo do Projeto

O sistema **Protocolo SMEFCC** foi desenvolvido para **gerenciar o empréstimo e devolução de itens** (como ferramentas, equipamentos e materiais) em um ambiente institucional, com controle de acesso via **RFID** e registro automatizado de transações.

O **backend** está hospedado em:

https://protocolo-smefcc.onrender.com

O **frontend** deve ser construído em **React (JSX)**, com interface moderna, segura e responsiva.

---

## ⚙️ Tecnologias e Requisitos Gerais do Frontend

- **React (JSX, sem TypeScript)**
- **React Router** para navegação entre páginas
- **Axios** para requisições HTTP
- **TailwindCSS** para estilização
- **Autenticação JWT** armazenada com segurança no `localStorage`
- **Proteção de rotas** para páginas internas
- **Feedback visual** para operações (loading, erro, sucesso)
- **Design institucional e limpo**, com menu lateral e cabeçalho fixo

---

## 🔐 Autenticação

O login é realizado via endpoint:

POST /api/auth/login


### Payload:
```json
{
  "cpf": "12345678900",
  "senha": "123456"
}
```

### Resposta:

```json
    {
        "success": true,
        "message": "Sucesso",
        "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDJhY2NiMzRjNjU2YTJhN2JiNzFhNiIsIm5vbWUiOiJQZWRybyBLYXRvIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYyNTMzNDgxLCJleHAiOjE3NjMxMzgyODF9.Axzx-NjrJ2yWGRb5nTCFjVON9SY1u5MGgCh0wyacsTQ"
        },
        "timestamp": "2025-11-07T16:38:01.473Z"
    }
```

O token JWT deve ser armazenado no localStorage e adicionado no cabeçalho das requisições protegidas:

Authorization: Bearer <token>
Caso o token seja inválido ou expirado, o usuário deve ser redirecionado para /login.

🧩 Contexto de Uso e Integrações Físicas

O sistema é usado por funcionários e gestores da instituição.
Alguns dados são enviados automaticamente por dispositivos externos, sem intervenção humana:

Leitores RFID: Registram cartões de usuários e enviam diretamente para:
POST /api/rfid-pending

Totens de Controle Físico: Registram retiradas e devoluções de itens via:
POST /api/transactions
usando X-API-KEY para autenticação.

O frontend não cria essas entradas, apenas exibe, gerencia e remove registros vindos desses dispositivos.

🧱 Estrutura Recomendada do Frontend

src/
 ├── api/
 │    └── axiosInstance.js
 ├── components/
 │    ├── forms/
 │    ├── tables/
 │    └── layout/
 ├── pages/
 │    ├── Login.jsx
 │    ├── Dashboard.jsx
 │    ├── Users.jsx
 │    ├── ItemModels.jsx
 │    ├── Items.jsx
 │    ├── Transactions.jsx
 │    └── RfidPendings.jsx
 ├── context/
 │    └── AuthContext.jsx
 ├── hooks/
 │    └── useAuth.js
 ├── App.jsx
 ├── main.jsx
 └── index.css

## 📊 Painéis e Módulos do Sistema

## 🔑 Login

### Rota: /login
### Campos: CPF e senha

Após login, redirecionar para /dashboard
Exibir mensagens de erro e feedback visual

## 📊 Dashboard

### Rota: /dashboard

## Exibe estatísticas gerais:
### Total de itens cadastrados
### Itens em uso
### Últimas transações
### RFIDs pendentes

Menu lateral com atalhos para:
Usuários
Modelos de Itens
Itens
Transações
RFID Pendentes
Logout

## 👥 Usuários

| **Método** | **Endpoint**           | **Descrição**                |
|-------------|------------------------|-------------------------------|
| `GET`       | `/api/users`           | Lista todos os usuários       |
| `GET`       | `/api/users/:id`       | Detalhes de um usuário        |
| `POST`      | `/api/users`           | Cria novo usuário             |
| `PATCH`     | `/api/users/:id`       | Atualiza dados do usuário     |
| `PATCH`     | `/api/users/:id/rfid`  | Vincula RFID                  |
| `DELETE`    | `/api/users/:id/rfid`  | Remove RFID vinculado         |
| `DELETE`    | `/api/users/:id`       | Exclui usuário                |

### Payload Exemplo (criação):
```json
    {
    "nome": "João Silva",
    "cpf": "12345678900",
    "senha": "123456",
    "role": "funcionario"
    }
```

## 🔩 Itens

| Método | Endpoint           | Descrição             |
|---------|--------------------|------------------------|
| GET     | `/api/items`       | Lista todos os itens   |
| GET     | `/api/items/:id`   | Detalhes de um item    |
| POST    | `/api/items`       | Cria novo item         |
| DELETE  | `/api/items/:id`   | Exclui item            |

### 🧾 Payload Exemplo

```json
{
  "modelo": "690d3b21e147468cfbdf1c47"
}

### 💡 Observação: Os modelos de itens são modelos genéricos (exemplo: Furadeira Bosch GLE-232), enquanto os itens representam as unidades físicas individuais de cada modelo.

## 🔁 Transações

| Método | Endpoint                              | Descrição                                         |
|---------|----------------------------------------|--------------------------------------------------|
| GET     | `/api/transactions`                   | Lista todas as transações                        |
| GET     | `/api/transactions/:id`               | Detalhes de uma transação                        |
| GET     | `/api/transactions/last/:itemId`      | Última transação de um item                      |
| GET     | `/api/transactions/borrowed`          | Itens atualmente retirados                       |
| POST    | `/api/transactions`                   | Cria nova transação *(somente por dispositivos externos via `X-API-KEY`)* |

### 🧾 Payload Exemplo

```json
{
  "usuario": "690d4fb489e3871f38df49ef",
  "item": "690d3c53698ef6c5c8e98daf",
  "tipo": "devolucao"
}

### Importante: O frontend deve apenas consultar e exibir as transações — não criar.

## 📡 RFIDs Pendentes

| Método | Endpoint                   | Descrição                                  |
|---------|-----------------------------|---------------------------------------------|
| GET     | `/api/rfid-pending`         | Lista RFIDs pendentes                       |
| POST    | `/api/rfid-pending`         | Cria novo registro *(via dispositivo físico)* |
| DELETE  | `/api/rfid-pending/:id`     | Remove registro pendente                    |

### 🧾 Payload Exemplo *(enviado por leitor RFID)*

```json
{
  "rfid": "ABC123XYZ",
  "sensorId": "READER_01"
}

### 💡 Observação: O frontend exibe e permite excluir registros pendentes.

## ⚠️ Observações Importantes

- Os endpoints **`POST /api/rfid-pending`** e **`POST /api/transactions`** são executados **exclusivamente por dispositivos externos** (leitores e totens).  
- O **frontend nunca cria** esses registros — apenas os **exibe e gerencia**.
- Todos os outros endpoints requerem **autenticação JWT**.  
- Se o token estiver **ausente ou inválido**, o usuário deve ser **redirecionado automaticamente** para `/login`.

---

## 🧠 Boas Práticas de Implementação

- Componentizar **formulários, tabelas, botões e modais**.  
- Utilizar **hooks** para lógica de autenticação e requisições (*fetchs*).  
- Exibir **mensagens de erro e sucesso** de forma clara e amigável.  
- Utilizar **ícones** (como *Lucide React* ou *React Icons*).  
- Garantir **responsividade** utilizando **Tailwind CSS**.  
- Manter o **código limpo**, bem estruturado e **sem duplicações**.

---

## ✅ Fluxo de Uso do Sistema

1. O **administrador faz login** no sistema.  
2. Acessa o **dashboard**, visualizando um **panorama geral**.  
3. Pode **criar e gerenciar** usuários, modelos de itens e itens físicos.  
4. **Visualiza e filtra transações** (retiradas e devoluções).  
5. **Visualiza RFIDs pendentes**, vindos automaticamente dos leitores.  
6. **Totens e leitores** continuam interagindo com a **API**, enquanto o sistema web **exibe e organiza os dados em tempo real**.

---

## 🌐 Base URL da API

## https://protocolo-smefcc.onrender.com


### 🔐 Autenticação JWT obrigatória em todas as rotas, exceto:

- `POST /api/auth/login`  
- `POST /api/rfid-pending` *(RFID externo)*  
- `POST /api/transactions` *(Totem externo via `X-API-KEY`)*

---

## 🧭 Conclusão

O **frontend React** deve ser **totalmente funcional**, com foco em **clareza, fluidez e segurança**.  
Seu papel é fornecer uma **interface administrativa e amigável** para o gerenciamento do sistema,  
enquanto os **dispositivos físicos** continuam alimentando os dados **em tempo real via API**.
