Start-Process cmd.exe -ArgumentList "/k npm run dev"
Start-Process cmd.exe -ArgumentList "/k .\.venv\Scripts\activate && cd api && python app.py"