# FreelanceHub

![Project Banner](.github/preview.jpeg)


## Sobre o Projeto

**FreelanceHub** é uma solução completa de gestão para freelancers e pequenos estúdios. O sistema permite gerenciar clientes, projetos e finanças em um único lugar, com foco em automação e experiência do usuário.

Diferente de planilhas simples, o FreelanceHub integra pagamentos reais via **Stripe**, comunicação em tempo real via **WebSockets** e geração automática de faturas.

## Funcionalidades Principais

- **Dashboard Financeira:** Métricas de receita real, valores a receber e distribuição de status de projetos.
- **Autenticação Robusta:** Login via Google, GitHub ou Credenciais (NextAuth v5) com proteção de rotas via Middleware.
- **Integração com Stripe:** Geração automática de faturas (Invoices), links de pagamento e Webhooks para conciliação bancária automática.
- **Chat em Tempo Real:** Comunicação contextual por projeto utilizando Pusher (WebSockets).
- **Gestão de Projetos:** Status pipeline (Planejamento, Em Progresso, Finalizado) e vinculação com clientes B2B.
- **Relatórios:** Exportação de dados e geração de documentos.

## Tech Stack

O projeto foi construído seguindo os princípios de *Clean Architecture* e *Server Actions* do Next.js 15.

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + Shadcn/ui
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Auth:** [NextAuth.js v5](https://authjs.dev/)
- **Pagamentos:** [Stripe SDK](https://stripe.com/)
- **Real-time:** [Pusher](https://pusher.com/)
- **Infra:** Docker (para banco de dados local)

## Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Docker (opcional, para rodar o Postgres)
- Conta no Stripe e Pusher (para variáveis de ambiente)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/freelancehub.git
   cd freelancehub
   ```

2. **Instale as dependências**
    ```bash
    npm install
    ```

3. **Configure as Variáveis de Ambiente**
    Renomeie o arquivo `.env.example` para `.env` e preencha as chaves:

    ```text
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/freelancehub"

    # Auth (NextAuth)
    AUTH_SECRET="sua_chave_secreta"
    AUTH_GITHUB_ID=""
    AUTH_GITHUB_SECRET=""
    AUTH_GOOGLE_ID=""
    AUTH_GOOGLE_SECRET=""

    # Stripe
    STRIPE_SECRET_KEY=""
    STRIPE_WEBHOOK_SECRET=""

    # Pusher (Realtime)
    PUSHER_APP_ID=""
    NEXT_PUBLIC_PUSHER_KEY=""
    PUSHER_SECRET=""
    ```

4. **Suba o Banco de Dados**
    ```bash
    # Se estiver usando Docker
    docker-compose up -d

    # Rode as migrações do Prisma
    npx prisma migrate dev
    ```

5. **Inicie o Servidor**
    ```bash
    npm run dev
    ```

    O projeto estará rodando em `http://localhost:3000`.

## Webhooks (Desenvolvimento)

Para testar os pagamentos do Stripe localmente, utilize a CLI do Stripe para encaminhar os eventos:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Roadmap Futuro

- **Link Público do Projeto:** Permitir que clientes visualizem o andamento do projeto através de um link seguro e expirável, sem necessidade de login.
- **Upload de Arquivos:** Integração com AWS S3 para anexos no chat.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está sob a licença MIT.