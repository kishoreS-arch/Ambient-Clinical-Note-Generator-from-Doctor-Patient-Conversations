import requests

def check_drug(drug):
    url = f"https://api.fda.gov/drug/label.json?search={drug}"
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            data = r.json()
            warnings = data.get("results", [{}])[0].get("warnings", ["No major warning found"])
            return warnings[0] if isinstance(warnings, list) else warnings
        else:
            return "Drug info unavailable"
    except Exception as e:
        return f"Error checking drug: {str(e)}"
