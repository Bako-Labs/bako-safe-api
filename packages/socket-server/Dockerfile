FROM arm64v8/node:18.18.2-alpine

# Create app directory
WORKDIR /socket
ADD . .

# Install bun
RUN npm install -g bun

# Install app dependencies
RUN bun install

# Build the application
RUN bun build

# Expose application port
EXPOSE 3001

# Start the application
ENTRYPOINT ["bun", "start"]
