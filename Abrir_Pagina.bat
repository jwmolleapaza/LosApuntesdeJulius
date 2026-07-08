@echo off
title Iniciar Los Apuntes de Julius
echo =======================================================
echo    Iniciando el servidor de Los Apuntes de Julius...
echo =======================================================
echo.

:: Verificar si el servidor ya esta corriendo en el puerto 5173
netstat -ano | findstr :5173 > nul
if %errorlevel% equ 0 (
    echo El servidor ya esta corriendo en el puerto 5173.
    echo Abriendo la pagina directamente en el navegador...
    start http://localhost:5173
    exit
)

:: Iniciar el servidor local en una ventana minimizada en segundo plano
start /min cmd.exe /c "npm.cmd run dev -- --port 5173"

echo Esperando a que el servidor inicialice (3 segundos)...
timeout /t 3 /nobreak > nul

:: Abrir en el navegador predeterminado
start http://localhost:5173
echo.
echo Servidor iniciado en http://localhost:5173
echo ¡Listo! Ya puedes usar la aplicacion. Puedes cerrar esta ventana.
timeout /t 2 > nul
exit
