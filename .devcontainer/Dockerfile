FROM node:20-bullseye
# Instalar dependências
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
    fonts-powerline \
    && rm -rf /var/lib/apt/lists/*

# Angular CLI
RUN npm install -g @angular/cli

# Instalar Oh My Bash (modo não interativo)
RUN bash -c "$(curl -fsSL https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)" --unattended

# Configurar tema + prompt + alias
RUN echo 'OSH_THEME="font"' >> /root/.bashrc && \
    echo "alias cls='clear'" >> /root/.bashrc && \
    echo "PS1='\[\e[32m\]\u@\h:\[\e[34m\]\w\[\e[0m\]\$ '" >> /root/.bashrc

# (Opcional) aplicar para todos usuários
RUN echo 'OSH_THEME="font"' >> /etc/bash.bashrc && \
    echo "alias cls='clear'" >> /etc/bash.bashrc && \
    echo "PS1='\[\e[32m\]\u@\h:\[\e[34m\]\w\[\e[0m\]\$ '" >> /etc/bash.bashrc
