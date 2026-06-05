---
target: src/pages/Perfil.jsx
total_score: 20
p0_count: 1
p1_count: 2
timestamp: 2026-05-26T19-50-41Z
slug: src-pages-perfil-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Sem feedback sobre ultima atividade ou status da conta. |
| 2 | Match System / Real World | 2 | Perfil parece card de marketing, nao area de gestao. |
| 3 | User Control and Freedom | 2 | Logout compete com itens principais. |
| 4 | Consistency and Standards | 2 | Centralizacao e pills flutuantes quebram padrao premium. |
| 5 | Error Prevention | 2 | Acoes criticas sem separacao visual. |
| 6 | Recognition Rather Than Recall | 3 | Itens rotulados, mas sem agrupamento. |
| 7 | Flexibility and Efficiency | 2 | Sem atalhos ou agrupamentos por categoria. |
| 8 | Aesthetic and Minimalist Design | 2 | Cards e sombras geram “caixas soltas”. |
| 9 | Error Recovery | 2 | Sem contexto ou confirmaçao para sair. |
| 10 | Help and Documentation | 1 | Sem orientacao de uso. |
| **Total** | | **20/40** | **Acceptable** |

#### Anti-Patterns Verdict

**LLM assessment**: O perfil e um card centralizado com acoes em pills separadas. Isso cria um layout de “caixas soltas” e vai contra o DESIGN.md (nao envolver tudo em cards, nao centralizar tudo).

**Deterministic scan**: Detector indisponivel (bundled detector not found). Sem contagem automatica.

**Visual overlays**: Nao disponivel porque o detector falhou.

#### Overall Impression

A tela parece um cartao de perfil, nao uma area de gestao. A maior oportunidade e transformar em painel de duas colunas ou lista ancorada a esquerda, com hierarquia clara e logout separado.

#### What's Working

- Paleta quente consistente com o resto do produto.
- Tipografia limpa e legivel.
- Avatar e rating geram confianca inicial.

#### Priority Issues

- **P0 — Card centralizado e pills flutuantes**
  - **Why it matters**: Passa sensacao de template e nao de painel de gestao premium.
  - **Fix**: Criar layout ancorado a esquerda ou duas colunas com lista continua, sem cards separados.
  - **Suggested command**: `impeccable layout`.

- **P1 — Logout compete com itens principais**
  - **Why it matters**: Risco de clique acidental; reduz foco nos fluxos principais.
  - **Fix**: Separar logout no fim, com espaco e estilo mais discreto/aviso.
  - **Suggested command**: `impeccable polish`.

- **P1 — Hierarquia fraca entre perfil e menu**
  - **Why it matters**: Usuaria nao sabe onde focar; tudo parece igual.
  - **Fix**: Reduzir peso do header e estruturar a lista com divisores e espaco ritmado.
  - **Suggested command**: `impeccable layout`.

#### Persona Red Flags

**Jordan (task-focused)**: Nao encontra rapidamente o item desejado; precisa ler tudo.

**Casey (produtivo)**: Acoes sem agrupamento aumentam tempo de decisao.

#### Minor Observations

- Fundo termina em branco puro, contra as regras.
- Sombras fortes criam “cartao dentro de cartao”.
- Rating poderia ficar mais discreto para priorizar gestao.

#### Questions to Consider

- Prefere layout em duas colunas (menu a esquerda, detalhes a direita) ou lista vertical ancorada?
- O logout deve ter um bloco separado com estilo de alerta discreto?
- Quer manter o avatar/rating no topo ou mover para um painel lateral?
