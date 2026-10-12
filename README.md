# Banco API Tests — Automação de Testes REST

Projeto de automação de testes da API REST do [Banco API](https://github.com/juliodelimas/banco-api), desenvolvido em **JavaScript** com **Mocha**, **Chai** e **Supertest**. A execução gera relatórios HTML e JSON com o **Mochawesome**.

> Este repositório contém **os testes automatizados**, não a implementação da API. Para executá-los, inicialize primeiro a API REST e seu banco de dados conforme as instruções do projeto original.

## Objetivo

Verificar comportamentos da API bancária por meio de testes automatizados de autenticação e transferências, contemplando respostas HTTP, conteúdo das respostas, regras de negócio e paginação.

## Stack

| Tecnologia | Utilização |
| --- | --- |
| JavaScript (CommonJS) e Node.js | Linguagem e ambiente de execução |
| Mocha | Organização e execução dos testes |
| Chai | Asserções e validações |
| Supertest | Requisições HTTP à API REST |
| dotenv | Leitura de variáveis do arquivo `.env` |
| Mochawesome | Relatórios de execução em HTML e JSON |
| npm | Instalação de dependências e execução de scripts |

As versões utilizadas constam em [`package.json`](./package.json) e [`package-lock.json`](./package-lock.json).

## Estrutura de diretórios

```text
banco-api-tests/
├── fixtures/
│   ├── postLogin.json                 # Modelo de payload de login, sem credenciais
│   └── postTransferencias.json        # Massa de dados para transferências
├── helpers/
│   └── autenticacao.js                # Função auxiliar para obtenção do token
├── test/
│   ├── login.test.js                  # Teste do endpoint de login
│   └── transferencia.test.js          # Testes de transferências e consultas
├── .env.example                       # Modelo de configuração versionado
├── .env                               # Configuração pessoal/local (não versionada)
├── .gitignore
├── package.json
├── package-lock.json
├── mochawesome-report/                # Gerado após execução; não versionado
└── README.md
```

Os itens `.env` e `mochawesome-report/` aparecem na árvore para **explicar seu uso**; não precisam existir imediatamente após clonar o repositório. O diretório `node_modules/` também é gerado localmente durante a instalação e não é versionado.

## Pré-requisitos

- Node.js e npm instalados.
- Git (para clonar o repositório).
- API REST do [Banco API](https://github.com/juliodelimas/banco-api) em execução, com seu banco de dados preparado.
- Usuário de teste válido e contas/dados apropriados aos cenários de transferência.

No repositório da API original estão as instruções para configurar o MySQL e inicializar o serviço REST. Em sua configuração padrão, a API REST utiliza `http://localhost:3000` e disponibiliza o Swagger em `http://localhost:3000/api-docs` (com o serviço em execução).

## Instalação

1. Clone este repositório e entre no diretório:

   ```bash
   git clone https://github.com/RoxaneNayara/banco-api-tests.git
   cd banco-api-tests
   ```

2. Instale as dependências:

   ```bash
   npm ci
   ```

   Como alternativa, utilize `npm install`.

3. Garanta que a API REST original esteja iniciada. No repositório **da API original**, o comando documentado para iniciar o serviço REST é `npm run rest-api` após configurar suas dependências e banco de dados.

## Configuração do ambiente (`.env`)

O arquivo **`.env` não é enviado ao GitHub**. Para configurar sua máquina, copie o modelo disponibilizado:

```bash
cp .env.example .env
```

Edite o `.env` com as informações do seu ambiente:

```dotenv
BASE_URL=http://localhost:3000
TEST_USERNAME=seu_usuario_de_teste
TEST_PASSWORD=sua_senha_de_teste
```

| Variável | Descrição |
| --- | --- |
| `BASE_URL` | Endereço base da API REST, sem `/` ao final |
| `TEST_USERNAME` | Usuário válido do ambiente de testes |
| `TEST_PASSWORD` | Senha correspondente ao usuário |

**Importante:** não publique credenciais reais nem inclua o `.env` em commits. O `.gitignore` impede o versionamento desse arquivo, enquanto `.env.example` contém apenas o formato de configuração.

### Fixtures e massas de dados

A pasta `fixtures/` agrupa modelos e massas de dados usados pelos cenários.

**`fixtures/postLogin.json`** é disponibilizado sem credenciais:

```json
{
  "username": "",
  "senha": ""
}
```

O arquivo pode ser preenchido localmente para experimentações, **mas a implementação atual de autenticação utiliza `TEST_USERNAME` e `TEST_PASSWORD` do `.env`**, e não precisa que a fixture de login seja preenchida. Por ser um arquivo versionado, **não coloque senhas reais nele**: um `git add .` pode incluir essas alterações no próximo commit.

**`fixtures/postTransferencias.json`** fornece os dados de uma transferência. Sua estrutura é:

```json
{
  "contaOrigem": 1,
  "contaDestino": 2,
  "valor": 11,
  "token": ""
}
```

Os números acima são **ilustrativos**. Ajuste os identificadores e valores conforme as contas e o estado do banco de dados do seu ambiente. Na API original, transferências acima de R$ 5.000,00 exigem um token adicional previsto na regra de negócio; ele não deve ser confundido com o token de autenticação utilizado no cabeçalho `Authorization`.

## Cenários automatizados

| Método | Rota | Cobertura |
| --- | --- | --- |
| `POST` | `/login` | Autenticação com credenciais válidas, status `200` e token retornado como string |
| `POST` | `/transferencias` | Transferência válida com status `201` (valor igual ou superior a R$ 10,00) |
| `POST` | `/transferencias` | Rejeição de transferência abaixo de R$ 10,00, com status `422` |
| `GET` | `/transferencias/{id}` | Consulta por ID existente, com status `200` e validação de campos retornados |
| `GET` | `/transferencias?page=1&limit=10` | Consulta paginada, com status `200` e limite de 10 registros |

**Atenção aos pré-requisitos dos testes:** cenários de consulta por ID e paginação podem depender de registros específicos já existentes no banco. Caso utilize uma base diferente, revise os dados esperados nos testes antes de executar. Os testes de transferência podem modificar o estado do banco de dados.

## Executando os testes

Execute todos os testes a partir da raiz do repositório:

```bash
npm test
```

O script definido em `package.json` é:

```bash
mocha ./test/**/*.test.js --timeout=200000 --reporter mochawesome
```

Para executar um único arquivo, sem precisar criar outros scripts npm:

```bash
# Apenas login
npx mocha test/login.test.js --timeout=200000 --reporter mochawesome

# Apenas transferências
npx mocha test/transferencia.test.js --timeout=200000 --reporter mochawesome
```

O parâmetro `--timeout=200000` define o limite de tempo por teste em milissegundos; `--reporter mochawesome` habilita o relatório.

## Relatórios com Mochawesome

Ao executar `npm test`, o Mochawesome gera, por padrão, os arquivos:

```text
mochawesome-report/
├── mochawesome.html
└── mochawesome.json
```

Abra `mochawesome-report/mochawesome.html` no navegador para consultar os resultados: testes aprovados/reprovados, tempo de execução, suítes e detalhes das falhas. O arquivo JSON disponibiliza os resultados em formato estruturado.

O diretório `mochawesome-report/` é **gerado localmente e ignorado pelo Git**. Por padrão, o projeto não publica automaticamente o relatório em um serviço externo.

## Documentação e referências

- [Banco API — repositório da aplicação testada](https://github.com/juliodelimas/banco-api)
- [Swagger da API REST (acesso local com o serviço ativo)](http://localhost:3000/api-docs)
- [Node.js](https://nodejs.org/docs/latest/api/)
- [npm](https://docs.npmjs.com/)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [Supertest](https://github.com/ladjs/supertest)
- [dotenv](https://github.com/motdotla/dotenv)
- [Mochawesome](https://github.com/adamgruber/mochawesome)

## Autoria

**Roxane Nayara** — projeto de prática em automação de testes de API REST e Quality Engineering.

- [GitHub](https://github.com/RoxaneNayara)
- [LinkedIn](https://www.linkedin.com/in/roxane-nayara/)
- [Portfólio](https://roxanenayara.github.io/)
