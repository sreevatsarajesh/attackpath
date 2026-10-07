from backend.database.database import get_connection
class AttackGraph:
    def __init__(self):
        self.nodes = []
        self.edges = []
    def add_node(self, node_id, node_type, data=None):
        self.nodes.append({
            "id": node_id,
            "type": node_type,
            "data": data or {}
        })
    def add_edge(self, source, target, relationship):
        self.edges.append({
            "source": source,
            "target": target,
            "relationship": relationship
        })
    def to_dict(self):
        return {
            "nodes": self.nodes,
            "edges": self.edges
        }


def build_graph():
    graph = AttackGraph()

    graph.add_node(
        "attacker",
        "attacker"
    )

    connection = get_connection()
    connection.row_factory = __import__("sqlite3").Row
    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            hosts.id,
            hosts.ip
        FROM hosts
    """)

    hosts = cursor.fetchall()

    for host in hosts:
        host_id = f"host_{host['id']}"

        graph.add_node(
            host_id,
            "host",
            {
                "ip": host["ip"]
            }
        )

        graph.add_edge(
            "attacker",
            host_id,
            "CAN_REACH"
        )

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
            WHERE host_id = ?
        """, (host["id"],))

        ports = cursor.fetchall()

        for port in ports:
            service_id = f"service_{port['id']}"

            graph.add_node(
                service_id,
                "service",
                {
                    "port": port["port"],
                    "protocol": port["protocol"],
                    "state": port["state"],
                    "service": port["service"],
                    "product": port["product"],
                    "version": port["version"]
                }
            )

            graph.add_edge(
                host_id,
                service_id,
                "RUNS"
            )

    connection.close()

    return graph