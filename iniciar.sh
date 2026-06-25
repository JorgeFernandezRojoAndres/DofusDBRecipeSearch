#!/bin/bash
# ============================================
#   DofusDB Recipe Search - Script de inicio
#   Para Linux (servidor 24/7)
# ============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Obtener IP local
SERVER_IP=$(hostname -I | awk '{print $1}')

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no esta instalado.${NC}"
    echo "   Para instalarlo ejecuta:"
    echo "   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "   sudo apt-get install -y nodejs"
    exit 1
fi

show_menu() {
    echo ""
    echo -e "${YELLOW}============================================${NC}"
    echo -e "${YELLOW}   DofusDB Recipe Search - Panel de Control${NC}"
    echo -e "${YELLOW}============================================${NC}"
    echo ""
    echo "  [1] Instalar dependencias"
    echo "  [2] Iniciar servidor (PM2 - 24/7)"
    echo "  [3] Detener servidor"
    echo "  [4] Reiniciar servidor"
    echo "  [5] Ver logs en tiempo real"
    echo "  [6] Ver estado del servidor"
    echo "  [7] Abrir en navegador"
    echo "  [8] Hacer que inicie con el sistema"
    echo "  [9] Salir"
    echo ""
    read -p "Selecciona una opcion: " opcion
}

install_deps() {
    echo ""
    # Verificar si pnpm esta instalado
    if ! command -v pnpm &> /dev/null; then
        echo -e "${YELLOW}Instalando pnpm...${NC}"
        npm install -g pnpm
    fi
    echo -e "${YELLOW}Instalando dependencias con pnpm...${NC}"
    pnpm install
    echo ""
    echo -e "${YELLOW}Instalando PM2 globalmente...${NC}"
    sudo npm install -g pm2
    echo ""
    echo -e "${GREEN}✅ Instalacion completada.${NC}"
}

start_server() {
    echo ""
    # Verificar .env
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ No se encontro el archivo .env${NC}"
        echo "   Copia .env.example como .env y rellena los valores:"
        echo "   cp .env.example .env"
        echo ""
        return
    fi
    
    echo -e "${YELLOW}Iniciando servidor con PM2...${NC}"
    mkdir -p logs
    pm2 start ecosystem.config.js
    pm2 save
    echo ""
    echo -e "${GREEN}✅ Servidor iniciado. Se ejecutara 24/7.${NC}"
    echo "   Reinicio automatico a las 4:00 AM diario."
}

setup_autostart() {
    echo ""
    echo -e "${YELLOW}Configurando inicio automatico con el sistema...${NC}"
    sudo env PATH=$PATH:$(npm config get prefix)/bin pm2 startup systemd -u $USER --hp $HOME
    pm2 save
    echo ""
    echo -e "${GREEN}✅ Configurado. El servidor iniciara automaticamente al encender.${NC}"
}

# Menú principal
while true; do
    show_menu
    case $opcion in
        1) install_deps ;;
        2) start_server ;;
        3) pm2 stop dofusdb-recipes ;;
        4) pm2 restart dofusdb-recipes ;;
        5) pm2 logs dofusdb-recipes ;;
        6) pm2 status ;;
        7) echo "\n\tAbre en tu navegador: http://${SERVER_IP}:3000" ;;
        8) setup_autostart ;;
        9) echo "Saliendo..."; exit 0 ;;
        *) echo -e "${RED}Opcion no valida.${NC}" ;;
    esac
done
