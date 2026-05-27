# DropSales — Banner Digital

Landing page de apresentação do projeto **DropSales**, publicada via GitHub Pages.

## Estrutura

```
.
├── index.html          # Página única
├── css/main.css        # Estilos (design tokens, layout, componentes)
├── js/main.js          # Menu mobile, navbar scroll, link ativo, YT facade
└── assets/images/      # Logos e mídia
```

## Como publicar no GitHub Pages

1. Faça commit/push de todos os arquivos para a branch `main`.
2. Em **Settings → Pages**, escolha **Source: Deploy from branch** e selecione `main` + `/ (root)`.
3. Aguarde 1–2 minutos. O site ficará em `https://pehcorsi.github.io/DropSales/`.

## Como rodar localmente

Qualquer servidor estático funciona. Exemplo:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## O que ainda precisa ser preenchido

Procure por `{{ ... }}` no `index.html` — são os pontos onde o conteúdo
final deve substituir o placeholder:

- Subtítulo do hero
- Texto do problema
- Exemplo de dor concreto
- Frase de introdução da solução
- Stack real do projeto (lista de pills)
- Texto da arquitetura
- ODS aplicável (se mudar do 9)
- Instituição / Disciplina / Semestre no rodapé
- Screenshot real do MVP (substituir o mockup placeholder no hero)

## Equipe

- Ana Laura Biagio de Oliveira (248706) — Scrum Master
- Gabriel da Silva Miranda (240241) — Product Owner
- Miguel Zardetto Carrilho (251744) — Gerente de Projeto
- Pedro Laghi Corsi (240462) — Time de Desenvolvimento
- Thiago Xavier Campos (240108) — Time de Desenvolvimento
