import requests

# Dictionary of critical pairs based strictly on known medical rules (NOT LLM)
CRITICAL_PAIRS = {
    frozenset(["metformin", "ibuprofen"]): {
        "risk": "MODERATE",
        "details": "Concomitant use may increase risk of lactic acidosis or affect renal function.",
        "action": "Monitor renal function if used concurrently."
    },
    frozenset(["warfarin", "aspirin"]): {
        "risk": "HIGH",
        "details": "Combination significantly increases the risk of bleeding.",
        "action": "Avoid combination unless specifically indicated. Monitor INR closely."
    },
    frozenset(["sumatriptan", "ssri"]): {
        "risk": "HIGH",
        "details": "Sumatriptan combined with an SSRI can increase the risk of serotonin syndrome.",
        "action": "Monitor closely for symptoms of serotonin syndrome (agitation, hallucinations, tachycardia). Consider alternative."
    }
}

DISCLAIMER = "DISCLAIMER: This system assists clinical decision-making. The physician holds ultimate responsibility for prescribing decisions."

def check_openfda(drug: str):
    """Fetch warnings directly from OpenFDA API."""
    url = f"https://api.fda.gov/drug/label.json?search={drug}"
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            data = r.json()
            warnings = data.get("results", [{}])[0].get("warnings", [])
            # For brevity, return the first sentence of the warning if available
            return warnings[0].split(". ")[0] + "." if warnings else "No major warning found in OpenFDA label."
        else:
            return "Drug info unavailable from FDA API."
    except Exception as e:
        return f"FDA API Error: {str(e)}"

def check_drug_interactions(drugs: list):
    """
    Check list of drugs against critical pairs and fetch FDA warnings.
    Returns: overall_risk, interaction_details, recommended_actions, disclaimer, fda_data
    """
    drugs = [d.lower() for d in drugs]
    
    result = {
        "overall_risk": "NONE_DETECTED",
        "details": "No known critical interactions between the listed drugs.",
        "action": "Proceed with standard care.",
        "disclaimer": DISCLAIMER,
        "fda_warnings": []
    }
    
    # 1. Check known critical pairs
    for i in range(len(drugs)):
        for j in range(i + 1, len(drugs)):
            pair = frozenset([drugs[i], drugs[j]])
            # Generalize the check to partial matches for robustness (e.g. "Sertraline" -> "ssri" logically, but here we hardcode specific matches)
            # For the demo case (sumatriptan + ssri), handle the generic term check:
            is_ssri = "sertraline" in drugs[j] or "fluoxetine" in drugs[j] or "ssri" in drugs[j] or "sertraline" in drugs[i] or "fluoxetine" in drugs[i] or "ssri" in drugs[i]
            is_suma = "sumatriptan" in drugs[i] or "sumatriptan" in drugs[j]
            
            if is_ssri and is_suma:
                pair_data = CRITICAL_PAIRS[frozenset(["sumatriptan", "ssri"])]
                result["overall_risk"] = pair_data["risk"]
                result["details"] = pair_data["details"]
                result["action"] = pair_data["action"]
            elif pair in CRITICAL_PAIRS:
                pair_data = CRITICAL_PAIRS[pair]
                # Keep highest risk
                if pair_data["risk"] == "HIGH" or (result["overall_risk"] == "NONE_DETECTED" and pair_data["risk"] == "MODERATE"):
                    result["overall_risk"] = pair_data["risk"]
                    result["details"] = pair_data["details"]
                    result["action"] = pair_data["action"]

    # 2. Fetch OpenFDA data for each drug
    for d in drugs:
        fda_warn = check_openfda(d)
        result["fda_warnings"].append({"drug": d, "warning": fda_warn})

    return result
