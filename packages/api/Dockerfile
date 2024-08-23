FROM arm64v8/node:18.18.2-alpine

# Install bun globally
RUN npm install -g bun

# Create the application directory
WORKDIR /api

# Add the application content to the working directory
ADD . /api

# Install the application dependencies using bun
RUN bun install

# Build the application
RUN bun build

# Expose the application port
EXPOSE 3333

# Start the application
ENTRYPOINT ["bun", "start"]
