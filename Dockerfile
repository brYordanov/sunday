# Use Node.js 22
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only backend package.json
COPY api/package.json ./


# Install backend dependencies only
RUN npm install --only=production

# Copy only the backend folder (ignoring frontend)
COPY api/. .

# Expose the API port
EXPOSE 4321

# Start the API
CMD ["npm", "run", "start"]
