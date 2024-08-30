# To-do-Task-List

Descrição breve do projeto e seus objetivos.

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Rodando o Projeto](#rodando-o-projeto)
- [Infraestrutura](#infraestrutura)
- [Padrões de Código](#padrões-de-código)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Visão Geral

Este projeto é uma aplicação construída com [Nest.js](https://nestjs.com/), utilizando [MongoDB](https://www.mongodb.com/) como banco de dados, e seguindo princípios de arquitetura hexagonal, SOLID e Clean Code.

## Arquitetura

A aplicação segue a Arquitetura Hexagonal, onde a lógica de negócios é independente de detalhes externos, como frameworks, bancos de dados ou interfaces de usuário. Isso facilita a manutenção, teste e escalabilidade.

### Principais Componentes

- **Camada de Domínio**: Contém as regras de negócios e entidades.
- **Camada de Aplicação**: Orquestra o fluxo entre as camadas de domínio e infraestrutura.
- **Camada de Infraestrutura**: Contém implementações de detalhes, como repositórios (MongoDB), provedores de serviços externos, etc.
- **Camada de Interface (Controllers)**: Ponto de entrada da aplicação, onde as requisições são recebidas.

## Pré-requisitos

- [Node.js](https://nodejs.org/) v14.x ou superior
- [Nest.js CLI](https://docs.nestjs.com/cli/overview)
- [Docker](https://www.docker.com/) (para rodar o MongoDB via Docker)
- [Terraform](https://www.terraform.io/) v1.9.5
- Conta na AWS (para provisionamento de infraestrutura)

## Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

Instale as dependências:

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_URI=mongodb://localhost:27017/seu-banco-de-dados
JWT_ACCESS_SECRET=sua-chave-secreta
JWT_REFRESH_SECRET=sua-chave-secreta
AWS_ACCESS_KEY_ID=sua-access-key
AWS_SECRET_ACCESS_KEY=sua-secret-key
```

Para rodar o MongoDB localmente via Docker, execute:

```bash
docker-compose up -d
```

## Rodando o Projeto

Para rodar a aplicação em desenvolvimento:

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Infraestrutura

A infraestrutura é gerenciada utilizando Terraform. Os arquivos de configuração estão na pasta `infra`.

### Provisionando a Infraestrutura

1. Inicialize o Terraform:

   ```bash
   cd infra
   terraform init
   ```

2. Configure as variáveis no arquivo `terraform.tfvars`.

3. Aplique as configurações para provisionar os recursos na AWS:

   ```bash
   terraform apply
   ```

## Padrões de Código

Este projeto segue os princípios de SOLID e Clean Code para garantir legibilidade, reusabilidade e manutenção do código. Algumas práticas adotadas incluem:

- **Injeção de Dependências**: Utilizando o sistema de providers do Nest.js.
- **Interfaces e Abstrações**: Definição de contratos claros entre as camadas.
- **Separação de Responsabilidades**: Cada classe ou função tem uma única responsabilidade.

## Documentação

A documentação da API está disponível na URL padrão: `http://localhost:3000/docs`.

## Contribuição

Para contribuir com o projeto:

1. Crie um fork do repositório.
2. Crie uma branch para sua feature ou correção de bug: `git checkout -b minha-feature`.
3. Faça commit das suas alterações: `git commit -m 'Minha nova feature'`.
4. Envie suas alterações: `git push origin minha-feature`.
5. Abra um pull request.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
