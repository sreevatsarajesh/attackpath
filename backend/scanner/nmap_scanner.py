import subprocess 
import xml.etree.ElementTree as ET

def scan(target):
    result = subprocess.run(
        ["nmap","-sV","-oX","-",target],
        capture_output = True,
        text = True,
        check =True
    )
    root = ET.fromstring(result.stdout)
    hosts = []
    for host in root.findall("host"):
        address = host.find("address")
        if address is None:
            continue
        ip = address.get("addr")
        ports = []
    ports_elements = host.find("ports")