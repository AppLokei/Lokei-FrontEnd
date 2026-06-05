---
target: src/pages/AnuncioDetalhe.jsx
total_score: 23
p0_count: 2
p1_count: 2
timestamp: 2026-05-26T18-32-10Z
slug: src-pages-anunciodetalhe-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Custo total so aparece apos selecionar datas; preco diario nao ancora a decisao. |
| 2 | Match System / Real World | 3 | Rotulos e fluxo sao familiares, mas falta enfase no valor por dia. |
| 3 | User Control and Freedom | 2 | Sem reset rapido de datas; chat compete com o fluxo principal. |
| 4 | Consistency and Standards | 3 | Padrao visual consistente, mas excesso de caixas separa a leitura. |
| 5 | Error Prevention | 2 | Regras (30 dias) aparecem tarde, sem antecipacao. |
| 6 | Recognition Rather Than Recall | 3 | Informacoes estao visiveis, mas custo total exige lembrar do preco diario. |
| 7 | Flexibility and Efficiency | 2 | Sem atalhos por periodo (fim de semana/semana). |
| 8 | Aesthetic and Minimalist Design | 3 | Limpo, mas com muitos blocos de mesmo peso. |
| 9 | Error Recovery | 2 | Erros aparecem, mas nao ha sugestoes curtas para resolver. |
| 10 | Help and Documentation | 1 | Sem politicas/limites no ponto de decisao. |
| **Total** | | **23/40** | **Acceptable** |

#### Anti-Patterns Verdict

**LLM assessment**: O layout esta limpo, mas sofre do antipadrao de caixas fragmentadas e peso igual em tudo. O preco diario nao lidera a decisao, e o calendario toma o foco cedo demais.

**Deterministic scan**: Detector indisponivel (bundled detector not found). Sem contagem automatica.

**Visual overlays**: Nao disponivel porque o detector falhou.

#### Overall Impression

Boa base visual, mas a estrutura quebra o fluxo de decisao. A maior oportunidade e unificar a informacao em uma coluna principal e um painel de reserva unico e pegajoso, com o preco diario como ancora.

#### What's Working

- Imagem e badges criam confianca inicial.
- Tipografia esta consistente e legivel.
- O painel unico ja evita cards aninhados, mas precisa de hierarquia interna.

#### Priority Issues

- **P0 — Preco diario nao e ancora visual**
  - **Why it matters**: Sem valor dominante, o usuario entra no calendario sem entender o custo base.
  - **Fix**: Promover o preco diario ao topo do painel de reserva, acima do calendario, com maior contraste e bloco unico.
  - **Suggested command**: `impeccable typeset`.

- **P0 — Fragmentacao por caixas e divisoes**
  - **Why it matters**: Quebra a leitura e dilui a hierarquia, parecendo “caixas soltas”.
  - **Fix**: Reestruturar em duas colunas: conteudo principal a esquerda, painel de reserva unificado e sticky a direita. Remover divisorias excessivas dentro do painel.
  - **Suggested command**: `impeccable layout`.

- **P1 — CTA de reserva compete com chat**
  - **Why it matters**: Reduz clareza do caminho principal.
  - **Fix**: Tornar chat secundario (link/terciario) e manter reserva dominante.
  - **Suggested command**: `impeccable polish`.

- **P1 — Fluxo de informacao sem ritmo**
  - **Why it matters**: Tudo tem o mesmo peso, cansando o usuario.
  - **Fix**: Agrupar titulo + preco + periodo como bloco principal, depois descricao/locador/reviews como suporte.
  - **Suggested command**: `impeccable layout`.

#### Persona Red Flags

**Jordan (First-Timer)**: Nao entende rapidamente “quanto por dia” antes de ver o calendario.

**Casey (Distracted Mobile User)**: CTA de reserva e chat lado a lado criam indecisao.

**Riley (Stress Tester)**: Limites (30 dias) aparecem tarde; falta aviso no topo do painel.

#### Minor Observations

- Precos semana/mes competem com a diaria em vez de apoiar.
- Reviews ficam longas sem resumo no topo.
- Localizacao fica visualmente secundarizada demais.

#### Questions to Consider

- Quer que o painel de reserva tenha apenas diaria + calendario, deixando semanal/mensal em um bloco “economize” abaixo?
- O chat deve virar link textual (secundario) para manter a reserva como unica CTA forte?
- O painel sticky deve conter politicas (limite 30 dias) como microcopy fixa?
