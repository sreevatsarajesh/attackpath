from fastapi import FastAPI
from scanner.nmap_scanner import scan

app = FastAPI(title="AttackPath API")

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