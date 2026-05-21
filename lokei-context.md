# Lokei - Guia de Desenvolvimento Frontend e Contexto (OpenCode)

## 1. Visão Geral do Projeto
O Lokei é um sistema web multicliente (Marketplace) que conecta pessoas que precisam de ferramentas temporariamente a proprietários com equipamentos ociosos. O foco é oferecer aluguel estruturado de forma prática e segura.

## 2. Stack Tecnológica Base
- **Frontend:** Desenvolvido exclusivamente com **React** e **JavaScript**.
- **Estilização:** CSS/Tailwind (a definir), priorizando a reutilização de componentes.
- **Backend (Contexto):** O backend é em Java/Spring Boot. O frontend consumirá uma API RESTful utilizando formato JSON.

## 3. Arquitetura do Frontend (Regra Estrita)
O projeto segue os princípios da *Clean Architecture* e separa o frontend nas seguintes camadas:
- `/pages` (ou `/views`): Componentes que representam rotas e telas completas do sistema (ex: Home, Login, Perfil).
- `/components`: Elementos visuais genéricos, "burros" e reutilizáveis (ex: botões, inputs, cards, modais).
- `/apiServices`: Camada isolada responsável **exclusivamente** pelas chamadas HTTP para o backend. Nenhum componente visual (`pages` ou `components`) deve fazer chamadas diretas (fetch/axios) sem passar por esta camada.

## 4. Diretrizes de Interface e Usabilidade
- **Responsividade e Desktop (RNF-003):** O sistema DEVE ser totalmente responsivo. As imagens de referência (mockups) estão em formato mobile, mas a aplicação deve adaptar seu layout elegantemente para telas Desktop e tablets. Não faça apenas telas "esticadas".
- **Fonte da Verdade:** As imagens fornecidas servem apenas como referência visual de estilo (cores, tipografia, espaçamentos). O que dita os campos exigidos, as validações e as regras de negócio são as instruções textuais passadas nos prompts. Se o prompt pedir algo que não está na imagem, siga o prompt.
- **Mensagens Claras (RNF-004):** O sistema deve exibir mensagens de erro e sucesso em linguagem clara para o usuário (ex: alertas de validação).

## 5. Principais Regras de Negócio e Validações Genéricas
Ao criar formulários e fluxos, respeite as seguintes regras do Documento de Requisitos:
- **Senhas:** Mínimo de 8 caracteres, incluindo letras e números (RN-006).
- **CPF:** Exige formato numérico de 11 dígitos na validação (RN-005). O CPF não pode ser editado após o cadastro (RN-010).
- **Upload de Imagens:** Limite de 5 fotos por anúncio (RN-018), máximo de 5MB por foto (RN-017), formatos aceitos: JPG, JPEG, PNG (RN-016).
- **Calendário/Aluguel:** Datas não podem ser retroativas (RN-024) e o limite máximo de aluguel é de 30 dias contínuos (RN-026).
- O valor da diária deve ser obrigatoriamente maior que R$ 0,00 (RN-015).