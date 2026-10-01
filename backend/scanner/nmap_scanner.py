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
hosts = 