#!/bin/bash

curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -
sudo apt-get install -y nodejs
curl -fsSL https://bun.sh/install | bash
source .bashrc

bun install
bun run build