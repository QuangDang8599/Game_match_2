#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT_DIR/.server"
DEFAULT_TARGET="game"
DEFAULT_PORT="8080"

usage() {
  cat <<USAGE
Usage:
  ./mathadventure-server.sh <command> [target] [port]

Commands:
  start      Start the local web server
  stop       Stop the local web server
  restart    Stop, then start the local web server
  status     Show whether the server is running
  log        Print the server log
  logs       Same as log
  follow     Follow the server log
  url        Print the local URL

Targets:
  game       MathAdventure-Game source (default)
  docs       docs static copy

Examples:
  ./mathadventure-server.sh start
  ./mathadventure-server.sh restart game 8081
  ./mathadventure-server.sh status docs
  ./mathadventure-server.sh follow
USAGE
}

command_name="${1:-}"
target="${2:-$DEFAULT_TARGET}"
port="${3:-$DEFAULT_PORT}"

case "$target" in
  game)
    SERVE_DIR="$ROOT_DIR/MathAdventure-Game"
    ;;
  docs)
    SERVE_DIR="$ROOT_DIR/docs"
    ;;
  -h|--help|help|"")
    usage
    exit 0
    ;;
  *)
    echo "Unknown target: $target" >&2
    usage
    exit 1
    ;;
esac

mkdir -p "$RUN_DIR"
PID_FILE="$RUN_DIR/${target}-${port}.pid"
LOG_FILE="$RUN_DIR/${target}-${port}.log"
URL="http://localhost:${port}/"

find_python() {
  if command -v python3 >/dev/null 2>&1; then
    command -v python3
  elif command -v python >/dev/null 2>&1; then
    command -v python
  else
    echo "Python is required to run the local server." >&2
    exit 1
  fi
}

read_pid() {
  if [[ -f "$PID_FILE" ]]; then
    cat "$PID_FILE"
  fi
}

is_running() {
  local pid="${1:-}"
  [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1
}

start_server() {
  local pid
  pid="$(read_pid || true)"
  if is_running "$pid"; then
    echo "Already running: $target on $URL (pid $pid)"
    echo "Log: $LOG_FILE"
    return 0
  fi

  local python_bin
  python_bin="$(find_python)"
  : > "$LOG_FILE"
  (
    cd "$SERVE_DIR"
    exec "$python_bin" -m http.server "$port"
  ) >> "$LOG_FILE" 2>&1 &

  pid="$!"
  echo "$pid" > "$PID_FILE"
  sleep 0.3

  if is_running "$pid"; then
    echo "Started: $target on $URL (pid $pid)"
    echo "Serving: $SERVE_DIR"
    echo "Log: $LOG_FILE"
  else
    echo "Failed to start server. Log:" >&2
    cat "$LOG_FILE" >&2
    rm -f "$PID_FILE"
    exit 1
  fi
}

stop_server() {
  local pid
  pid="$(read_pid || true)"
  if ! is_running "$pid"; then
    echo "Not running: $target on port $port"
    rm -f "$PID_FILE"
    return 0
  fi

  kill "$pid"
  for _ in {1..20}; do
    if ! is_running "$pid"; then
      rm -f "$PID_FILE"
      echo "Stopped: $target on port $port"
      return 0
    fi
    sleep 0.1
  done

  kill -9 "$pid" >/dev/null 2>&1 || true
  rm -f "$PID_FILE"
  echo "Stopped forcefully: $target on port $port"
}

status_server() {
  local pid
  pid="$(read_pid || true)"
  if is_running "$pid"; then
    echo "Running: $target on $URL (pid $pid)"
    echo "Serving: $SERVE_DIR"
    echo "Log: $LOG_FILE"
  else
    echo "Stopped: $target on port $port"
    rm -f "$PID_FILE"
  fi
}

show_log() {
  if [[ -f "$LOG_FILE" ]]; then
    cat "$LOG_FILE"
  else
    echo "No log yet: $LOG_FILE"
  fi
}

case "$command_name" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    stop_server
    start_server
    ;;
  status)
    status_server
    ;;
  log|logs)
    show_log
    ;;
  follow)
    touch "$LOG_FILE"
    tail -f "$LOG_FILE"
    ;;
  url)
    echo "$URL"
    ;;
  -h|--help|help|"")
    usage
    ;;
  *)
    echo "Unknown command: $command_name" >&2
    usage
    exit 1
    ;;
esac
