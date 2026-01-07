#!/bin/bash

# Face-Fortune 服务停止脚本
# 获取脚本所在目录
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$PROJECT_DIR/.server.pid"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  Face-Fortune 服务停止"
echo "=========================================="
echo ""

if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")

    if ps -p $PID >/dev/null 2>&1; then
        echo -e "${YELLOW}正在停止服务 (PID: $PID)...${NC}"
        kill $PID 2>/dev/null
        sleep 2

        # 如果进程还在，强制杀死
        if ps -p $PID >/dev/null 2>&1; then
            echo -e "${YELLOW}强制停止服务...${NC}"
            kill -9 $PID 2>/dev/null
        fi

        rm -f "$PID_FILE"
        echo -e "${GREEN}✓ 服务已停止${NC}"
    else
        echo -e "${YELLOW}服务未运行${NC}"
        rm -f "$PID_FILE"
    fi
else
    echo -e "${YELLOW}服务未运行（找不到 PID 文件）${NC}"
fi
