# ------ First stage ------
FROM node:16.14.0

ENV SRC_DIR=/opt/frontend
WORKDIR $SRC_DIR

# Set npm mirror
RUN npm config set registry https://registry.npm.taobao.org/
RUN npm config get registry

# Set yarn mirror
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn config get registry

# Build
COPY . $SRC_DIR
RUN yarn
RUN yarn format
RUN yarn build
RUN ls ./dist

# ------ Second stage ------
FROM nginx:1.18.0

ENV APP_DIR=/opt/app
WORKDIR $APP_DIR

# Install packages
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak
RUN echo "deb http://mirrors.ustc.edu.cn/debian stable main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb http://mirrors.ustc.edu.cn/debian stable-updates main contrib non-free" >> /etc/apt/sources.list
RUN apt-get clean && apt-get update
RUN apt-get install vim -y
RUN apt-get install net-tools dnsutils iputils-ping -y
RUN apt-get install ssh locales-all tmate -y

COPY . ./src

# Set up nginx
RUN rm -r /etc/nginx/conf.d
RUN mkdir /usr/local/nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log
# RUN nginx -t

# Copy static files from the first stage
COPY --from=0 /opt/frontend/dist ./dist
RUN ls ./dist

EXPOSE 80
EXPOSE 443
