# --- Build Stage ---
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# --- Production Stage ---
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

# entferne Default-Konfig
RUN rm -rf ./*

COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
