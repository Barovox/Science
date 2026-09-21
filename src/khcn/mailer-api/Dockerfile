FROM node:20-alpine
WORKDIR /app

# Copy package files trước
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 5174

CMD ["node", "app.js"]
