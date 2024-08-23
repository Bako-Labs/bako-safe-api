FROM arm64v8/node:18.18.2-alpine

# Install dependencies necessary for node-gyp
RUN apk add --no-cache python3 make g++ \
    && npm install -g node-gyp

# Install bun
RUN npm install -g bun

# Create the application directory
WORKDIR /gateway
ADD . /gateway

# Install application dependencies
RUN bun install

# Build the application
RUN bun build

# Expose the application port
EXPOSE 4444

# Start the application
ENTRYPOINT ["bun", "start"]
