from fastapi import FastAPI
from backend.scanner.nmap_scanner import scan
from backend.database.database import initialize_database
app = FastAPI(title="AttackPath API")
initialize_database()
@app.get("/")
def root():
    return {
        "message": "AttackPath API is running"
    }
@app.post("/scan")
def run_scan(target: str):
    return {
        "target": target,
        "results": scan(target)
    }