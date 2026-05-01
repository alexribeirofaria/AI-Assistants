FROM node:20-bullseye

EXPOSE 5000
EXPOSE 4200

# Instalar tudo que você precisa
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    git \
    curl \
    wget \
    build-essential \
    chromium \
    ca-certificates \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Angular CLI
RUN npm install -g @angular/cli
WORKDIR /workspace
