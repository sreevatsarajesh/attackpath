from fastapi import FastAPI
from backend.scanner.nmap_scanner import scan
from backend.database.database import initialize_database
from backend.database.database import get_connection
app = FastAPI(title="AttackPath API")
initialize_database()
@app.get("/")
def root():
    return {
        "message": "AttackPath API is running"
    }
