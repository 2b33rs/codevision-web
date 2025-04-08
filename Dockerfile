# --- Build Stage ---
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# also ensure vite is installed
RUN npm install -g vite

COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:18

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 4173
CMD ["npx", "vite", "preview", "--port", "4173", "--host"]