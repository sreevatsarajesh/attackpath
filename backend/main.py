
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