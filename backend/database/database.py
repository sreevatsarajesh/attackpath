import sqlite3
DATABASE = "attackpath.db"
def get_connection():
    return sqlite3.connect(DATABASE)
def initialize_database():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            target TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS hosts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scan_id INTEGER NOT NULL,
            ip TEXT NOT NULL,
            FOREIGN KEY (scan_id) REFERENCES scans(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            host_id INTEGER NOT NULL,
            port INTEGER,
            protocol TEXT,
            state TEXT,
            service TEXT,
            product TEXT,
            version TEXT,
            FOREIGN KEY (host_id) REFERENCES hosts(id)
        )
    """)

    connection.commit()
    connection.close()