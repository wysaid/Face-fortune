#!/bin/bash

# Face-Fortune 服务启动脚本
# 获取脚本所在目录
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$PROJECT_DIR/dev.log"
PID_FILE="$PROJECT_DIR/.server.pid"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查服务是否在运行
check_service() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID >/dev/null 2>&1; then
            return 0 # 服务正在运行
        else
            # PID文件存在但进程不存在，删除过期的PID文件
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# 停止服务
stop_service() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        echo -e "${YELLOW}正在停止服务 (PID: $PID)...${NC}"
        kill $PID 2>/dev/null
        sleep 2
        # 如果进程还在，强制杀死
        if ps -p $PID >/dev/null 2>&1; then
            kill -9 $PID 2>/dev/null
        fi
        rm -f "$PID_FILE"
        echo -e "${GREEN}✓ 服务已停止${NC}"
    fi
}

# 启动服务
start_service() {
    cd "$PROJECT_DIR"

    # 加载环境变量
    if [ -f ".dev.local" ]; then
        source .dev.local
        export API_KEY=$GEMINI_API_KEY
    else
        echo -e "${RED}错误: 找不到 .dev.local 文件${NC}"
        exit 1
    fi

    echo -e "${GREEN}正在启动服务...${NC}"

    # 清空旧日志
    >"$LOG_FILE"

    # 后台启动服务
    nohup npm run dev >"$LOG_FILE" 2>&1 &

    # 保存进程ID
    echo $! >"$PID_FILE"

    echo -e "${GREEN}✓ 服务已启动！${NC}"
    echo ""
    sleep 3

    # 从日志中提取访问地址
    echo -e "${GREEN}访问地址:${NC}"
    grep -E "Local:|Network:" "$LOG_FILE" | head -2
    echo ""
    echo -e "${YELLOW}查看日志: tail -f $LOG_FILE${NC}"
    echo -e "${YELLOW}停止服务: ./stop.sh 或者 kill \$(cat $PID_FILE)${NC}"
}

# 主逻辑
echo "=========================================="
echo "  Face-Fortune 服务管理"
echo "=========================================="
echo ""

if check_service; then
    PID=$(cat "$PID_FILE")
    echo -e "${YELLOW}⚠ 服务已经在运行中 (PID: $PID)${NC}"
    echo ""
    read -p "是否重新启动服务？(y/n): " choice
    case "$choice" in
    y | Y | yes | YES)
        stop_service
        echo ""
        start_service
        ;;
    *)
        echo -e "${GREEN}保持当前服务继续运行${NC}"
        echo ""
        echo -e "${GREEN}当前访问地址:${NC}"
        grep -E "Local:|Network:" "$LOG_FILE" 2>/dev/null | head -2 || echo "请查看日志文件: $LOG_FILE"
        ;;
    esac
else
    start_service
fi
