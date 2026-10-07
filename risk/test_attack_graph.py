from attack_graph import AttackGraph
graph = AttackGraph()
graph.add_node[
    "attacker",
    "attacker"
]
graph.add_node[
    "host_1",
    "host",
    {
        "ip" :"localhost"
    }
]
graph.add_node[
    "service_1",
    "service",
    {
        "port":"3306"
        "protocol":"tcp"
        "service":"sqlite"
    }
]
graph.add_edge[
    "attacker",
    "host_1"
    "canreach"
]
graph.add_edge[
    "host_1",
    "service_1",
    "runs"
]
