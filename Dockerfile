FROM debian:buster-slim as prod

RUN set -x

ARG DEBIAN_FRONTEND=noninteractive
ENV PM2_OUT_FILE=/dev/stdout
ENV PM2_ERROR_FILE=/dev/stderr


RUN apt update && \
    apt install -y curl \
                   gnupg

RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null && \
    echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor | tee /usr/share/keyrings/nodesource.gpg >/dev/null && \
    echo 'deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x buster main' > /etc/apt/sources.list.d/nodesource.list && \
    unset http_proxy && unset https_proxy && \
    apt update && \
    apt install -y nodejs \
                   yarn \
                   git \
                   procps \
    && rm -rf /var/lib/apt/lists/* && rm -rf /etc/apt/apt.conf.d/proxy.conf

RUN npm install -g npm && \
    npm set progress=false && \
    npm install -g pm2 && \
    npm config rm proxy && npm config rm https-proxy && \
    echo "alias ll=\"ls -lahF --color\"" >> ~/.bashrc

RUN mkdir -p /var/www


RUN yarn global add node-gyp

RUN apt update && \
    apt install -y build-essential \
                   jq \
                   openssl \
                   python \
                   wget \
                   bc \
    && rm -rf /var/lib/apt/lists/* && rm -rf /etc/apt/apt.conf.d/proxy.conf

COPY ./back/ /var/www/app/
COPY ./docker/volumes/app/ /opt/scripts/

RUN /opt/scripts/install.sh

ENTRYPOINT ["pm2", "startOrRestart", "/opt/scripts/pm2/app.config.js", "--no-daemon"]
