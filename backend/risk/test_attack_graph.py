from backend.risk.attack_graph import build_graph
graph = build_graph()
print(graph.to_dict())