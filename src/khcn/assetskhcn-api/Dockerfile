# canvas cần thư viện native, dùng node:20-bookworm thay vì alpine
FROM node:20-bookworm-slim
WORKDIR /app

# Cài thư viện hệ thống cần thiết cho canvas + build tools cho native addons
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python3 \
    make \
    g++ \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy package files trước
COPY package*.json ./

# Install và REBUILD native addons (canvas) từ source bên trong container
# Tránh dùng binary từ host machine (khác CPU architecture arm64/amd64)
RUN npm ci --only=production --build-from-source

# Copy source code (node_modules đã được tạo ở bước trên, không bị ghi đè)
COPY --chown=node:node app.js build.js ./

# Tạo thư mục dữ liệu cần thiết
RUN mkdir -p uploads avatars certificates

EXPOSE 5174

CMD ["node", "app.js"]
