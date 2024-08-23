FROM oven/bun

WORKDIR /socket
ADD . .
RUN bun install

EXPOSE 3001
ENTRYPOINT ["bun", "start"]
