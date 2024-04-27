@echo off
SETLOCAL EnableDelayedExpansion

:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
    IF "%PROCESSOR_ARCHITECTURE%" EQU "amd64" (
>nul 2>&1 "%SYSTEMROOT%\SysWOW64\cacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
) ELSE (
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------   

REM Port forward WSL2 to all interfaces
if "%1" == "start" (
    wsl echo hostname -I ^> tempfile
    FOR /F %%i IN ('wsl hostname -I') DO (
        set WSL_IP=%%i
    )
    echo WSL IPs are !WSL_IP!

    netsh interface portproxy set v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=!WSL_IP!
    netsh interface portproxy set v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=!WSL_IP!

    wsl cd /opt/cityfarm ^&^& docker compose up -d
    exit
)

                                                                                
echo      _/_/_/  _/    _/                _/_/_/_/                                   
echo   _/            _/_/_/_/  _/    _/  _/        _/_/_/  _/  _/_/  _/_/_/  _/_/    
echo  _/        _/    _/      _/    _/  _/_/_/  _/    _/  _/_/      _/    _/    _/   
echo _/        _/    _/      _/    _/  _/      _/    _/  _/        _/    _/    _/    
echo  _/_/_/  _/      _/_/    _/_/_/  _/        _/_/_/  _/        _/    _/    _/     
echo                             _/                                                  
echo                        _/_/                                                     
echo =================================================================================

echo.
echo Hello, my name is C.H.I.P ^(CityFarm Helpful Installation Program^)! I'm here to help you install CityFarm on your computer :^)
echo.


:alreadyinstalled
reg query HKEY_LOCAL_MACHINE\SOFTWARE\CityFarm 2>nul 1>nul
if %ERRORLEVEL% EQU 0 (
    echo I can see that CityFarm is already installed on this computer.
    echo.
    echo Please select an option by number below:
    echo 1^) Uninstall CityFarm :^(
    echo 2^) Backup CityFarm data
    echo 3^) Load CityFarm data from backup
    echo 4^) Exit
) else (
    goto notinstalled
)

echo.
set /p "install=Enter your choice (1/2/3/4): "
if /i "%install%"=="1" (
    echo Uninstalling CityFarm...
    schtasks /delete /tn CityFarm /f
    REG DELETE HKEY_LOCAL_MACHINE\SOFTWARE\CityFarm /f
    wsl cd /opt/cityfarm ^&^& docker compose down
    echo Done! I hope to see you again...
    pause
    exit
)

if /i "%install%"=="2" (
    echo Backing up CityFarm data...
    wsl cd /opt/cityfarm ^&^& docker compose down
    wsl tar -czvf cityfarm-backup.tar.gz /opt/cityfarm/mongodb-data
    echo Backup complete!
    wsl mv cityfarm-backup.tar.gz /mnt/c/Users/%USERNAME%/Downloads
    echo Backup saved to Downloads folder!
    wsl cd /opt/cityfarm ^&^& docker compose up -d
    pause
    exit
)

if /i "%install%"=="3" (
    echo Loading CityFarm data from backup...
    wsl cd /opt/cityfarm && docker compose down -d
    wsl mv /mnt/c/Users/%USERNAME%/Downloads/cityfarm-backup.tar.gz .
    wsl mv /opt/cityfarm/mongodb-data /opt/cityfarm/mongodb-data-old
    wsl tar -xzvf cityfarm-backup.tar.gz
    wsl mv mongodb-data /opt/cityfarm/
    echo Data loaded!
    wsl cd /opt/cityfarm ^&^& docker compose up -d
    pause
    exit
)

if /i "%install%"=="4" (
    echo "Goodbye!"
    exit
)

:notinstalled

echo I can see you don't have CityFarm installed on this computer. Would you like me to install it for you?
set /p "install=Enter your choice (y/n): "

if /i "%install%"=="y"  (
    echo Great! Let's get started!
) else (
    echo Too bad! I'll be here if you change your mind :^)
    exit
)

echo Warning: tech jargon incoming!

echo Installing WSL2 (this may take a while)...

REM set wsl2 memory limit to 2GB
curl https://pastebin.com/raw/7fpiVnSs --output %USERPROFILE%\.wslconfig

wsl --install --no-launch | findstr /C:"installed" 1>nul
if %ERRORLEVEL% EQU 0 (
    echo Installed WSL2 - ATTENTION - Please restart your computer and run this script again to continue the installation process.
    pause
    exit
) else (
    echo WSL2 already installed.
)

echo Getting ready to install Docker...
wsl apt-get update -y
wsl apt-get install -y ca-certificates curl
wsl install -m 0755 -d /etc/apt/keyrings
wsl curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
wsl chmod a+r /etc/apt/keyrings/docker.asc

echo Adding Docker repository...
wsl echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" ^| tee /etc/apt/sources.list.d/docker.list > /dev/null
echo Updating package list...
wsl apt-get update -y
echo Installing Docker...
wsl apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo Creating CityFarm directory...
wsl mkdir -p /opt/cityfarm
wsl mkdir -p /opt/cityfarm/mongodb-data

echo Downloading Docker Compose file...
wsl curl https://pastebin.com/raw/JixaVXza --output /opt/cityfarm/docker-compose.yml

echo Starting Docker Compose...
wsl cd /opt/cityfarm/ ^&^& docker compose up -d

echo Creating scheduled task...
xcopy "%~f0" "%APPDATA%\CityFarm\cityfarm.bat" /Y
schtasks /create /tn CityFarm /sc ONSTART /DELAY 0000:30 /RL HIGHEST /tr "%APPDATA%\CityFarm\cityfarm.bat start" /ru SYSTEM
REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\CityFarm /v Installed /t REG_SZ /d "true" /f

echo Done!
pause