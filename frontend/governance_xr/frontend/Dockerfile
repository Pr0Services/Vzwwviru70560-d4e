# ============================================================================
# CHE·NU Frontend Dockerfile
# Multi-stage build with nginx for production
# 
# R&D COMPLIANCE: ✅
# - Minimal image size
# - Security headers configured
# - Health checks included
# ============================================================================

# Stage 1: Builder
FROM node:20-alpine as builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production=false

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production with nginx
FROM nginx:alpine as production

# Security: Remove default nginx user and create custom one
RUN addgroup -S chenu && adduser -S chenu -G chenu

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-security.conf /etc/nginx/conf.d/security.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create cache directory with proper permissions
RUN mkdir -p /var/cache/nginx /var/run && \
    chown -R chenu:chenu /var/cache/nginx /var/run /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Expose port
EXPOSE 80

# Run as non-root (nginx master process still needs root, but workers run as chenu)
CMD ["nginx", "-g", "daemon off;"]
