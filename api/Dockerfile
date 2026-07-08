# ============================================================
# Stage 1: Builder — install deps, compile swetest, warm cache
# ============================================================
FROM php:8.3-fpm AS builder

ENV DEBIAN_FRONTEND=noninteractive
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/api

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
    git unzip g++ make \
    libzip-dev libicu-dev libonig-dev libpng-dev \
    libfreetype6-dev libjpeg62-turbo-dev \
    libxml2-dev libcurl4-openssl-dev && \
    rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install \
    pdo_mysql xml mbstring curl zip gd intl bcmath soap opcache

RUN curl -sS https://getcomposer.org/installer | \
    php -- --install-dir=/usr/local/bin --filename=composer

COPY composer.json composer.lock* ./
RUN composer install --no-dev --optimize-autoloader --no-interaction && \
    composer clear-cache

COPY . .

RUN test -f .env || cp .env.example .env

RUN cd swetest/src && make clean && make swetest && chmod +x swetest

RUN mkdir -p var/cache var/log && \
    chmod -R 777 var

RUN composer dump-autoload --no-dev --optimize && \
    APP_ENV=prod php bin/console assets:install --symlink && \
    APP_ENV=prod php bin/console cache:clear && \
    APP_ENV=prod php bin/console cache:warmup --no-optional-warmers

# ============================================================
# Stage 2: Runtime — minimal PHP-FPM + nginx, no build tools
# ============================================================
FROM php:8.3-fpm AS runtime

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /var/www/api

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
    nginx curl \
    libzip-dev libicu-dev libonig5 libpng16-16 \
    libfreetype6 libjpeg62-turbo libxml2 libcurl4 && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/
COPY --from=builder /var/www/api /var/www/api

RUN printf 'server {\n\
    listen 8080;\n\
    root /var/www/api/public;\n\
    index index.php index.html;\n\
    server_name _;\n\
\n\
    access_log /var/log/nginx/access.log;\n\
    error_log /var/log/nginx/error.log;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.php?$query_string;\n\
    }\n\
\n\
    location ~ \\.php$ {\n\
        fastcgi_pass 127.0.0.1:9000;\n\
        fastcgi_index index.php;\n\
        include fastcgi_params;\n\
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\n\
    }\n\
}\n' > /etc/nginx/sites-available/default

# Configure PHP-FPM: TCP socket on 9000, tune worker count
# pm.max_children is set to 40 based on expected peak concurrency and container memory limits;
# adjust this value if workload characteristics or memory constraints change.
RUN sed -i 's/listen = .*/listen = 127.0.0.1:9000/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/pm.max_children = .*/pm.max_children = 40/' /usr/local/etc/php-fpm.d/www.conf

RUN sed -i 's|;error_log = log/php-fpm.log|error_log = /var/log/php-fpm.log|' /usr/local/etc/php-fpm.conf

RUN mkdir -p /var/log/nginx && \
    touch /var/log/php-fpm.log && \
    chown -R www-data:www-data /var/log/nginx /var/log/php-fpm.log /var/www/api/var

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]