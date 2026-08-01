@echo off
echo Opening WhatsApp Web exclusively in Brave Browser...
start "" "C:\Users\Dell\AppData\Local\BraveSoftware\Brave-Browser\Application\brave.exe" --remote-debugging-port=9222 --start-maximized "https://web.whatsapp.com/"
exit
