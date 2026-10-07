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