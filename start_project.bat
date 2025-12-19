@echo off
echo Ichan Kala Projesi Baslatiliyor...

:: Backend Baslatiliyor
echo Backend aciliyor...
start "Ichan Kala Backend" cmd /k "cd /d d:\Hiva\ichan_kala_app\backend && venv\Scripts\activate && uvicorn app.main:app --reload"

:: Frontend Baslatiliyor
echo Frontend aciliyor...
start "Ichan Kala Frontend" cmd /k "cd /d d:\Hiva\ichan_kala_app\frontend && npm run dev"

echo Islem tamamlandi. Backend (8000) ve Frontend (3000) portlarinda calisacak.
