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
@app.post("/scan")
def run_scan(target: str):
    results = scan(target)
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO scans (target) VALUES (?)",
        (target,)
    )
    scan_id = cursor.lastrowid
    for host in results:
        cursor.execute(
            "INSERT INTO hosts (scan_id, ip) VALUES (?, ?)",
            (scan_id, host["ip"])
        )
        host_id = cursor.lastrowid
        for port in host["ports"]:
            cursor.execute(
                """
                INSERT INTO ports
                (host_id, port, protocol, state, service, product, version)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    host_id,
                    port["port"],
                    port["protocol"],
                    port["state"],
                    port["service"],
                    port["product"],
                    port["version"],
                    port["cpe"]
                )
            )
    connection.commit()
    connection.close()
    return {
        "scan_id": scan_id,
        "target": target,
        "results": results
    }
@app.get("/assets")
def get_assets():
    connection = get_connection()
    connection.row_factory = __import__("sqlite3").Row
    cursor = connection.cursor()
    cursor.execute("""
        SELECT
            hosts.id,
            hosts.ip,
            scans.target,
            scans.created_at
        FROM hosts
        JOIN scans ON hosts.scan_id = scans.id
        ORDER BY scans.created_at DESC
    """)
    assets = [dict(row) for row in cursor.fetchall()]
    connection.close()
    return {
        "assets": assets
    }
@app.get("/assets/{asset_id}/services")
def get_services(asset_id: int):
    connection = get_connection()
    connection.row_factory = __import__("sqlite3").Row
    cursor = connection.cursor()
    cursor.execute("""
        SELECT
            ports.id,
            ports.port,
            ports.protocol,
            ports.state,
            ports.service,
            ports.product,
            ports.version
        FROM ports
        JOIN hosts ON ports.host_id = hosts.id
        WHERE hosts.id = ?
    """, (asset_id,))
    services = [dict(row) for row in cursor.fetchall()]
    connection.close()
    return {
        "asset_id": asset_id,
        "services": services
    }