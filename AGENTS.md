# Contexto do projeto

Este repositório contém um PWA estático independente para leitura bíblica cronológica e estudos. Preserve literalmente o conteúdo editorial em `src/lib/readingPlanData.js`, `src/lib/studySessions.js`, `src/lib/studyTopicIds.js` e `src/lib/studyPubLinks.js`, salvo solicitação expressa.

## Desenvolvimento

- Node.js 20.19+ ou 22.12+ e npm.
- `npm install` para instalar; `npm run dev` para desenvolver.
- `npm run lint`, `npm run typecheck` e `npm run build` para validar.
- `dist/` é o diretório de publicação; o build gera a lista de precache offline.
- Use `HashRouter` e caminhos relativos (`base: './'`) para compatibilidade com GitHub Pages em subcaminho.
- Progresso e backup ficam no dispositivo. Não introduza serviço remoto obrigatório nem remova a exportação/restauração local.
- O Service Worker deve continuar restrito ao escopo do aplicativo e a recursos da mesma origem.
