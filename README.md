# A Bíblia Cronológica — PWA independente

Aplicativo estático de leitura bíblica cronológica em 365 dias e caderno de estudos. Não requer Base44, servidor de aplicação, banco de dados ou login. O progresso é salvo no armazenamento local do navegador; há exportação e restauração de backup JSON.

## Requisitos

- Node.js 20.19+ ou 22.12+ (compatível com Vite 8)
- npm

## Executar localmente

```bash
npm install
npm run dev
```

Para validar o artefato de produção:

```bash
npm run build
npm run preview
```

O build fica em `dist/`. O processo cria `precache-manifest.json`, usado pelo Service Worker para armazenar o app e seus arquivos compilados para uso offline. O Service Worker só é instalado no build de produção e requer HTTP ou HTTPS; `localhost` serve para desenvolvimento.

## Publicar no GitHub Pages

1. Envie este repositório para o GitHub.
2. No repositório, abra **Settings → Pages → Build and deployment** e selecione **GitHub Actions**.
3. Faça push para `main` (ou execute manualmente o workflow **Publicar PWA no GitHub Pages** na aba Actions).
4. Após a primeira publicação, abra a URL HTTPS do Pages e aguarde o Service Worker instalar. Depois disso, o app shell, o plano e os estudos ficam disponíveis offline.

O workflow em `.github/workflows/deploy.yml` compila e publica `dist/`. A configuração de URLs relativas também permite servir a pasta `dist/` por outro host de arquivos estáticos (GitHub Pages, GitLab Pages, Netlify, Cloudflare Pages, servidor web estático etc.). Não publique abrindo `index.html` como `file://`: PWAs e Service Workers exigem um servidor HTTP(S).

## Funcionamento e limites

- **Leitura, progresso e estudos:** locais; funcionam depois que o app foi carregado uma primeira vez com conexão e o cache offline foi instalado.
- **Progresso:** permanece neste navegador/dispositivo. Limpar os dados do navegador ou trocar de dispositivo pode apagá-lo; faça backups regulares pelo perfil e restaure o JSON quando necessário.
- **Sem conta ou sincronização em nuvem:** autenticação, recuperação de senha e recursos dependentes de backend do Base44 foram retirados, pois não são compatíveis com um PWA puramente estático. Nenhum dado de leitura é enviado a um servidor.
- **Links externos:** links para JW.org/JW Library continuam no conteúdo e naturalmente precisam de internet para abrir o site ou aplicativo externo.
- **Atualizações:** ao publicar nova versão, o navegador instala o novo cache e descarta a versão anterior do app; os dados de progresso no `localStorage` não são apagados.

## Verificações

```bash
npm run lint
npm run typecheck
npm run build
```
