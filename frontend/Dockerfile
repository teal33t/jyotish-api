FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

COPY api/templates/app.html.twig /usr/share/nginx/html/index.html
COPY api/public/manifest.json    /usr/share/nginx/html/manifest.json
COPY api/public/sw.js            /usr/share/nginx/html/sw.js

EXPOSE 80
