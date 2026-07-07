# API - Rede Social de Livros

Backend em Spring Boot para gerenciamento de listas de livros e publicações sociais,
atendendo aos requisitos funcionais REQ001–REQ013 e não funcionais RNF001–RNF013.

## Stack

- Java 17
- Spring Boot 3.3.4
- Spring Web / Spring Data JPA
- Spring Security + JWT (jjwt 0.12.6)
- MySQL
- Lombok
- Bean Validation


## Configuração

1. Crie o banco (ou deixe o `createDatabaseIfNotExist=true` cuidar disso).
2. Ajuste usuário/senha do MySQL em `src/main/resources/application.yaml`.
3. Rode: `mvn spring-boot:run`

O Hibernate está com `ddl-auto: update`, então as tabelas (`users`, `books`, `posts`, `comments`)
são criadas automaticamente na primeira execução.

## Autenticação

Todas as rotas exceto `/api/auth/**` exigem o header:

```
Authorization: Bearer <token>
```

O token é obtido em `/api/auth/register` ou `/api/auth/login`.

## Endpoints

### Auth (REQ001, REQ002)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastro de usuário |
| POST | `/api/auth/login` | Login |

### Livros (REQ003–REQ007, RNF003, RNF006, RNF011)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/books?status=LENDO&page=0&size=10` | Lista livros do usuário logado, paginado, filtro opcional por status |
| POST | `/api/books` | Adiciona livro à lista |
| PUT | `/api/books/{id}` | Atualiza um livro (só o dono) |
| DELETE | `/api/books/{id}` | Remove um livro (só o dono) |

Status possíveis (REQ004): `LENDO`, `QUERO_LER`, `ABANDONEI`, `JA_LI`, `FAVORITO`.

### Publicações (REQ008, REQ009, REQ012)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/posts` | Feed geral, paginado |
| GET | `/api/posts/user/{userId}` | Publicações de um usuário (visita a perfil) |
| POST | `/api/posts` | Cria publicação |
| DELETE | `/api/posts/{id}` | Exclui publicação própria |

### Comentários (REQ010, REQ011, REQ013, RNF013)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/posts/{postId}/comments` | Lista comentários de uma publicação |
| POST | `/api/posts/{postId}/comments` | Comenta em uma publicação |
| DELETE | `/api/comments/{commentId}` | Exclui comentário (autor do comentário OU dono da publicação) |

### Usuários (REQ009)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/users/{id}` | Perfil público de um usuário |

## Requisitos não funcionais — onde foram tratados

- **RNF001** (senha criptografada): `BCryptPasswordEncoder` em `SecurityConfig`.
- **RNF002** (rotas protegidas): `SecurityConfig` + `JwtAuthenticationFilter`.
- **RNF003** (só dono edita/exclui livro): validado em `BookService.assertOwnership`.
- **RNF004** (SQL Injection/XSS): uso exclusivo de JPA/Hibernate com queries parametrizadas
  (sem SQL nativo concatenado); validação de entrada com Bean Validation.
- **RNF006** (paginação): `Pageable`/`Page` em todos os endpoints de listagem.
- **RNF009** (mensagens amigáveis): `GlobalExceptionHandler` padroniza os erros.
- **RNF011** (livro sempre vinculado a um usuário): `Book.user` é `nullable = false`
  e sempre preenchido a partir do usuário autenticado, nunca do payload do cliente.
- **RNF013** (regra de exclusão de comentários): `CommentService.deleteComment`.

Os requisitos de front-end (RNF007, RNF008, RNF012) e documentação (RNF010, este README
e os comentários no código) ficam a cargo da camada de frontend / desta documentação.
