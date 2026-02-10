# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including ts-node for seeding)
# In a strict production env, we'd compile everything, but for this "one-line" requirement,
# keeping it simple and functional is better.
RUN npm install

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
# Copy seed files and configurations
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/ormconfig.ts ./
# Wait, ts-node is needed for seeding if we run it as ts-node.
# Let's just install devDependencies in builder and keep them if needed, 
# or better: pre-build the seed script.
# For now, let's keep it simple and ensure ts-node is available if needed.

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 3001

# Run the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
