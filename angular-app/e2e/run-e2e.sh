#!/usr/bin/env bash

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_URL="http://localhost:4200"
BACKEND_URL="http://localhost:5000/health"

BACKEND_PATH="$SCRIPT_DIR/../../python-app"
FRONTEND_PATH="$SCRIPT_DIR/.."

BACKEND_PID=""
FRONTEND_PID=""
TEST_FAILED=0

wait_for_http() {
  local url=$1
  local timeout=${2:-120}
  local start=$(date +%s)

  echo "Aguardando: $url"

  while true; do
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -E "2[0-9]{2}|3[0-9]{2}|4[0-9]{2}" > /dev/null; then
      echo "Disponivel: $url"
      return 0
    fi

    now=$(date +%s)
    if (( now - start > timeout )); then
      echo "Timeout ao aguardar $url"
      return 1
    fi

    sleep 2
  done
}

stop_process_tree() {
  local pid=$1
  if [[ -n "$pid" && "$pid" != "0" ]]; then
    kill -9 "$pid" 2>/dev/null || true
    pkill -P "$pid" 2>/dev/null || true
  fi
}

stop_port_process() {
  local port=$1
  local current_pid=$$

  echo "Limpando porta $port..."

  local pids=""

  if command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -ti tcp:$port)
  else
    pids=$(netstat -tulpn 2>/dev/null | grep ":$port" | awk '{print $7}' | cut -d'/' -f1)
  fi

  for p in $pids; do
    # 🔒 filtros de segurança
    [[ -z "$p" ]] && continue
    [[ "$p" == "0" ]] && continue
    [[ "$p" == "$current_pid" ]] && continue

    # verifica se processo existe
    if ! kill -0 "$p" 2>/dev/null; then
      continue
    fi

    echo "Encerrando PID $p na porta $port"

    # mata árvore
    kill -9 "$p" 2>/dev/null || true
    pkill -P "$p" 2>/dev/null || true
  done
}

cleanup() {
  echo "Finalizando processos..."

  stop_process_tree "$BACKEND_PID"
  stop_process_tree "$FRONTEND_PID"

  # cleanup final por porta
  stop_port_process 4200
  stop_port_process 5000

  echo "Cleanup concluido"
}

trap cleanup EXIT

# 🔥 PRE-CLEANUP (ESSENCIAL)
echo "Pre-cleanup: liberando portas..."
stop_port_process 4200
stop_port_process 5000

sleep 2

echo "Iniciando E2E..."

# Backend
echo "Iniciando Backend..."
(
  cd "$BACKEND_PATH" || exit 1
  py main.py --app web
) &
BACKEND_PID=$!

# Frontend
echo "Iniciando Frontend..."
(
  cd "$FRONTEND_PATH" || exit 1
  npm run start:silent
) &
FRONTEND_PID=$!

# Espera serviços
wait_for_http "$BACKEND_URL" 120 || TEST_FAILED=1
wait_for_http "$FRONTEND_URL" 120 || TEST_FAILED=1

# Executa testes
echo "Executando testes E2E..."
if ! npx playwright test; then
  echo "Testes falharam"
  TEST_FAILED=1
else
  echo "Testes finalizados com sucesso"
fi

if [ "$TEST_FAILED" -ne 0 ]; then
  exit 1
else
  exit 0
fi