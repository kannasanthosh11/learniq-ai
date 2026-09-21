# Multi-stage Dockerfile for LearnIQ (TENSORA 2026 EDU-01)
# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Node.js Backend & Runtime
FROM node:20-alpine
WORKDIR /app

# Copy backend dependencies and install
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

# Copy backend source code
COPY backend/ ./

# Copy built frontend dist into expected location
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose production port
ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
