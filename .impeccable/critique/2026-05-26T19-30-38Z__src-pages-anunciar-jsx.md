---
target: src/pages/Anunciar.jsx
total_score: 23
p0_count: 2
p1_count: 2
timestamp: 2026-05-26T19-30-38Z
slug: src-pages-anunciar-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Sem progresso ou feedback de conclusao; upload nao sinaliza prioridade. |
| 2 | Match System / Real World | 3 | Campos fazem sentido, mas layout nao parece painel de gestao premium. |
| 3 | User Control and Freedom | 2 | Falta opcao de rascunho ou orientacao de passos. |
| 4 | Consistency and Standards | 2 | Cartao centralizado generico conflita com DESIGN.md. |
| 5 | Error Prevention | 2 | Validacao acontece tarde; falta guia antes de enviar. |
| 6 | Recognition Rather Than Recall | 3 | Labels OK, mas falta exemplo claro para valor/descricao. |
| 7 | Flexibility and Efficiency | 2 | Sem atalhos ou presets para categorias e fotos. |
| 8 | Aesthetic and Minimalist Design | 3 | Limpo, mas com card “SaaS” e gradiente de fundo. |
| 9 | Error Recovery | 3 | Erros aparecem, mas sem ajuda direta. |
| 10 | Help and Documentation | 1 | Sem ajuda para melhorar anuncio. |
| **Total** | | **23/40** | **Acceptable** |

#### Anti-Patterns Verdict

**LLM assessment**: O formulario em um grande cartao centralizado reforca o template SaaS. Isso conflita com o DESIGN.md (nao envolver tudo em cards) e deixa a experiencia pouco premium.

**Deterministic scan**: Detector indisponivel (bundled detector not found). Sem contagem automatica.

**Visual overlays**: Nao disponivel porque o detector falhou.

#### Overall Impression

O formulario e funcional, mas a estrutura e genérica. A maior oportunidade e remover o cartao centralizado e criar um layout de pagina inteira, com fotos como bloco principal e um painel lateral de dicas ou preview.

#### What's Working

- Inputs e labels consistentes.
- Upload tem instrucoes claras de formato.
- Paleta correta e tipografia coerente.

#### Priority Issues

- **P0 — Cartao centralizado generico**
  - **Why it matters**: Viola o DESIGN.md e transmite template comum, nao marketplace premium.
  - **Fix**: Layout de pagina inteira: coluna esquerda com form e upload dominante, coluna direita com dicas/preview.
  - **Suggested command**: `impeccable layout`.

- **P0 — Upload de fotos nao e o heroi**
  - **Why it matters**: Fotos sao prova principal; sem destaque, o anuncio perde qualidade.
  - **Fix**: Colocar upload no topo, maior e com destaque visual, seguido do resto dos campos.
  - **Suggested command**: `impeccable layout`.

- **P1 — CTA e hierarquia achatadas**
  - **Why it matters**: “Publicar anuncio” nao se destaca como acao principal.
  - **Fix**: CTA com mais peso e distancia das informacoes secundarias; opcional “Salvar rascunho”.
  - **Suggested command**: `impeccable polish`.

- **P1 — Falta de guias de qualidade**
  - **Why it matters**: Locadores nao sabem o que melhora a conversao.
  - **Fix**: Inserir dicas curtas ao lado (foto clara, descricao curta, categoria correta).
  - **Suggested command**: `impeccable layout`.

#### Persona Red Flags

**Jordan (locador rápido)**: Sem fluxo guiado, nao sabe o minimo para publicar.

**Casey (exigente)**: Falta de prova visual forte reduz confianca no anuncio.

#### Minor Observations

- Gradiente de fundo e card somado reforcam o efeito “SaaS”.
- Categoria sem “Outros” limita casos reais.
- Upload e preview poderiam ter hierarquia mais clara.

#### Questions to Consider

- Quer layout com painel lateral de dicas ou um preview da listagem?
- O CTA deve ficar fixo no fim da coluna para facilitar conclusao?
- Vale introduzir uma barra de progresso (ex: 3 passos) ou manter simples?
