# Use Node.js 22
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only backend package.json
COPY api/package.json api/package.json
COPY libs/validations/package.json libs/validations/package.json

WORKDIR /app/api
# Install backend dependencies only
RUN npm install --only=production

# Copy only the backend folder (ignoring frontend)
COPY api/. .
COPY libs/validations/. ../libs/validations/

# Expose the API port
EXPOSE 4321

# Start the API
CMD ["npm", "run", "start"]
