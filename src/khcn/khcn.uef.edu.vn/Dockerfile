# ─── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files trước để tận dụng Docker cache
COPY package*.json ./

# Install dependencies (bao gồm devDependencies để build)
RUN npm ci --legacy-peer-deps

# Copy toàn bộ source
COPY . .

# Build production bundle
RUN npm run build

# ─── Stage 2: Serve với Nginx ──────────────────────────────────────────────────
FROM nginx:alpine AS runtime

# Copy file cấu hình Nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files đã build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
