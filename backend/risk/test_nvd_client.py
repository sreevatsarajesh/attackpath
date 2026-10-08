from nvd_client import find_cves_by_cpe
cpe = "cpe:2.3:a:apache:http_server:2.4.49:*:*:*:*:*:*:*"
results = find_cves_by_cpe(cpe)
print("CVEs found:", len(results))
for item in results[:5]:
    cve = item["cve"]
    print(
        cve["id"],
        cve.get("published"),
        cve.get("lastModified")
    )