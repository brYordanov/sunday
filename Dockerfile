# Use Node.js 22
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only backend package.json
COPY backend/package.json backend/package.json
COPY libs/validations/package.json libs/validations/package.json

WORKDIR /app/backend
# Install backend dependencies only
RUN npm install --only=production

# Copy only the backend folder (ignoring frontend)
COPY backend/. .
COPY libs/validations/. ../libs/validations/

# Expose the backend port
EXPOSE 4321
