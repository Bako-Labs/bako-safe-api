#database instance for testing
bun run database:dev

#give a timeout and run migrations
sleep 5 && bun run migration:run
