# --- Build Stage ---
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:18

WORKDIR /app

RUN npm install -g vite

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/vite.config.* ./
COPY --from=builder /app/index.html ./
COPY --from=builder /app/package*.json ./

EXPOSE 4173
CMD ["vite", "preview", "--port", "4173", "--host"]