<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# watch mode
$ pnpm run start:dev
```

## Test

```bash
# unit tests
$ pnpm run test
```

## Observações

- **Na hora que o veiculo é cadastrado, como não tenho acesso aos rastreadores, optei por gerar valores aleatorios tanto para latitude e longitude quanto para o status do veiculo na hora do cadastro**.

## Recursos da API

### Recomendo acessar a documentação da API em

- [**Swagger Local**](http://localhost:3000/api)
- [**Swagger Produção**](ponto-track-teste-production.up.railway.app/api)

- Users (Controller)

  - Create (POST /users)
  - Read (GET /users/me)
  - Update (PATCH /users)
  - Delete (DELETE /users)

- Auth (Controller)

  - Login (POST /auth/login)
  - Logout (POST /auth/logout)

- Vehicles (Controller)

  - Create (POST /vehicles)
  - Read Vehicles By User (GET /vehicles)
  - Read (GET /vehicles/:vin)
  - Update (PATCH /vehicles/:vin)
  - Delete (DELETE /vehicles/:vin)

- Vehicle_Status (Controller)
  - Read (GET /vehicles_status)

## Com relação ao banco de dados

- O banco de dados utilizado foi o PostgreSQL. Subi uma instância no [**Supabase**](https://www.supabase.com//).

- O modelo relacional do banco de dados gerado pelas entidades do Typeorm que usei apenas para fazer o gereciamento do banco de dados foi o seguinte:

```sql
CREATE TABLE public.t_user (
    id SERIAL,
    ulid CHARACTER VARYING(36) NOT NULL,
    current_token CHARACTER VARYING NULL,
    email CHARACTER VARYING(255) NOT NULL,
    password CHARACTER VARYING(255) NOT NULL,
    first_name CHARACTER VARYING(100) NOT NULL,
    last_name CHARACTER VARYING(100) NOT NULL,
    created_at timestamp without time zone NOT NULL default now(),
    updated_at timestamp without time zone NOT NULL default now(),
    constraint PK_6a6708d647ac5da9ab8271cfede primary key (id),
    constraint UQ_1d0b42896fa20240f9ffcc8012a unique (email),
    constraint UQ_49226e242ebb80e213b4b1581ff unique (ulid),
    constraint UQ_79dd1fd7f5a23dd3eaf18c5b505 unique (current_token)
  ) tablespace pg_default;

CREATE TABLE
  public.t_vehicle (
    id SERIAL,
    make CHARACTER VARYING(50) NOT NULL,
    model CHARACTER VARYING(50) NOT NULL,
    year CHARACTER VARYING(4) NOT NULL,
    vin CHARACTER VARYING(17) NOT NULL,
    license_plate CHARACTER VARYING(10) NOT NULL,
    latitude TEXT NOT NULL,
    longitude TEXT NOT NULL,
    created_at timestamp without time zone NOT NULL default now(),
    updated_at timestamp without time zone NOT NULL default now(),
    "ownerId" integer null,
    "vehicleStatusId" integer null,
    constraint PK_a1a88a4692fc6c4e1f668673dd7 primary key (id),
    constraint UQ_748fa6fc6896d7ad5610cd8a230 unique (license_plate),
    constraint UQ_fa0de2c97d6dc184dacba44b6bc unique (vin),
    constraint FK_1ade9d1c997669842dddf57fd31 foreign key ("vehicleStatusId") references t_vehicle_status (id),
    constraint FK_dd33303c0db179ac89146debbf2 foreign key ("ownerId") references t_user (id)
  ) tablespace pg_default;

CREATE TABLE
  public.t_vehicle_status (
    id SERIAL,
    vehicle_status CHARACTER VARYING(50) NOT NULL,
    description CHARACTER VARYING(255) NOT NULL,
    constraint PK_129976bbd3f423c983d521a912c primary key (id),
    constraint UQ_2d5a239cd22c05b7d9cb804d973 unique (vehicle_status)
  ) tablespace pg_default;
```

## Services

- **Auth Service**: Responsável por gerenciar a autenticação do usuário.
- **User Service**: Responsável por gerenciar as operações de CRUD do usuário.
- **Vehicle Service**: Responsável por gerenciar as operações de CRUD do veículo.
- **Vehicle Status Service**: Responsável por gerenciar as operações de CRUD do status do veículo.

- ### Em todas os métodos de todas as services, utilizei as queries nativas como preferencialmente descrito pela oportunidade.

## Guards

- **AuthGuard**: Verifica se o usuário está autenticado e também se deve pular a parte de autorização dependendo da rota.

## Interceptors

- **ResponseInterceptor**: Intercepta a resposta da API e formata a resposta para o padrão da API.

## Filters

- **ExceptionsFilter**: Intercepta as exceções da API e formata a resposta para o padrão da API e quando NODE_ENV == development retorna uma explicação mais completa.

## Modules

- **Modulos**: Em cada módulo configuro o AuthGuard.

## Decorators

- **SkipAuth**: Decorator para pular a parte de autenticação e autorização.

## Deploy

- Foi realizado no Railway
