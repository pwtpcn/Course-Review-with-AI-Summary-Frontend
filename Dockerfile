# Base image
FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# 3. Production image, copy all the files and run
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy build artifacts
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Expose the port the app runs on
ENV PORT=5173
EXPOSE 5173

CMD ["npm", "run", "start"]