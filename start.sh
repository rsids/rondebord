#!/bin/bash

# Function to stop scripts on error or exit
function stopScripts {
    # Send SIGTERM to child processes
    pkill -P $$
    exit 1
}

# Trap ERR and EXIT signals, and run stopScripts function
trap stopScripts ERR EXIT

# Run server
bun run server/server.ts &

# Run shell script
./run.sh &