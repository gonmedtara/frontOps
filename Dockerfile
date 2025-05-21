# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm install --production

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"] 