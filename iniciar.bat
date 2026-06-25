@echo off
chcp 65001 >nul
title DofusDB Recipe Search - Servidor

REM Verificar que existe .env
if not exist ".env" (
    echo.
    echo ❌ No se encontro el archivo .env
    echo    Copia .env.example como .env y rellena los valores:
    echo    copy .env.example .env
    echo.
    pause
    exit /b 1
)

:menu
echo.
echo ============================================
echo   DofusDB Recipe Search - Panel de Control
echo ============================================
echo.
echo  [1] Instalar dependencias
echo  [2] Iniciar servidor (PM2 - 24/7)
echo  [3] Detener servidor
echo  [4] Reiniciar servidor
echo  [5] Ver logs en tiempo real
echo  [6] Ver estado del servidor
echo  [7] Abrir en navegador
echo  [8] Salir
echo.
set /p opcion="Selecciona una opcion: "

if "%opcion%"=="1" goto install
if "%opcion%"=="2" goto start
if "%opcion%"=="3" goto stop
if "%opcion%"=="4" goto restart
if "%opcion%"=="5" goto logs
if "%opcion%"=="6" goto status
if "%opcion%"=="7" goto open
if "%opcion%"=="8" goto exit
echo Opcion no valida.
goto menu

:install
echo.
echo Instalando dependencias...
call npm install
echo.
echo Instalando PM2 globalmente...
call npm install -g pm2
echo.
echo Instalando pm2-windows-startup (auto-inicio con Windows)...
call npm install -g pm2-windows-startup
echo.
echo ✅ Instalacion completada.
echo.
pause
goto menu

:start
echo.
echo Iniciando servidor con PM2...
if not exist "logs" mkdir logs
pm2 start ecosystem.config.js
pm2 save
echo.
echo ✅ Servidor iniciado. Se ejecutara 24/7.
echo    Reinicio automatico a las 4:00 AM diario.
echo    Para que inicie con Windows, ejecuta como administrador:
echo    pm2-startup install
echo.
pause
goto menu

:stop
echo.
pm2 stop dofusdb-recipes
echo.
echo ✅ Servidor detenido.
pause
goto menu

:restart
echo.
pm2 restart dofusdb-recipes
echo.
echo ✅ Servidor reiniciado.
pause
goto menu

:logs
echo.
echo Mostrando logs en tiempo real (Ctrl+C para salir)...
pm2 logs dofusdb-recipes
goto menu

:status
echo.
pm2 status
echo.
pause
goto menu

:open
echo.
echo Abriendo en navegador...
start http://localhost:3000
goto menu

:exit
echo.
echo Saliendo...
exit
