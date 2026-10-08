import requests
NVD_CVE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"
def find_cves_by_cpe(cpe):
    if not cpe:
        return []
    response = requests.get(
        NVD_CVE_URL,
        params={
            "cpeName": cpe,
            "resultsPerPage": 20
        },
        timeout=15
    )
    response.raise_for_status()

    data = response.json()

    return data.get("vulnerabilities", [])