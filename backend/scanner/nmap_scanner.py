import subprocess
import xml.etree.ElementTree as ET
def scan(target):
    result = subprocess.run(
        ["nmap", "-sV","--v" "-oX", "-", target],
        capture_output=True,
        text=True,
        check=True
    )
    root = ET.fromstring(result.stdout)
    hosts = []
    for host in root.findall("host"):
        address = host.find("address")
        if address is None:
            continue
        ip = address.get("addr")
        ports = []
        ports_element = host.find("ports")
        if ports_element is not None:
            for port in ports_element.findall("port"):
                state = port.find("state")
                service = port.find("service")
                cpe = None
                if service is not None:
                    cpe_element = service.find("cpe")
                if cpe_element is not None:
                    cpe = cpe_element.text
                ports.append({
                    "port": int(port.get("portid")),
                    "protocol": port.get("protocol"),
                    "state": state.get("state") if state is not None else None,
                    "service": service.get("name") if service is not None else None,
                    "product": service.get("product") if service is not None else None,
                    "version": service.get("version") if service is not None else None,
                    "cpe": cpe
                })
        hosts.append({
            "ip": ip,
            "ports": ports
        })
    return hosts