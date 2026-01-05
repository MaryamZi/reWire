# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage - using official unprivileged nginx image
FROM nginxinc/nginx-unprivileged:alpine

COPY --from=builder --chown=10001:0 /app/dist /usr/share/nginx/html
COPY --chown=10001:0 nginx.conf /etc/nginx/conf.d/default.conf

USER 10001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
