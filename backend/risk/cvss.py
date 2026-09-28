"""
CVSS v3.1 Risk Metric Engine & Severity Rating Calculator for SecureMonitor AI
"""

def calculate_cvss_score(
    av: str = "N",   # Attack Vector: Network (N), Adjacent (A), Local (L), Physical (P)
    ac: str = "L",   # Attack Complexity: Low (L), High (H)
    pr: str = "N",   # Privileges Required: None (N), Low (L), High (H)
    ui: str = "N",   # User Interaction: None (N), Required (R)
    s: str = "U",    # Scope: Unchanged (U), Changed (C)
    c: str = "H",    # Confidentiality: None (N), Low (L), High (H)
    i: str = "H",    # Integrity: None (N), Low (L), High (H)
    a: str = "N"     # Availability: None (N), Low (L), High (H)
) -> dict:
    
    # Weight maps according to FIRST CVSS v3.1 specification
    av_weights = {"N": 0.85, "A": 0.62, "L": 0.55, "P": 0.2}
    ac_weights = {"L": 0.77, "H": 0.44}
    pr_weights_u = {"N": 0.85, "L": 0.62, "H": 0.27}
    pr_weights_c = {"N": 0.85, "L": 0.68, "H": 0.50}
    ui_weights = {"N": 0.85, "R": 0.62}
    
    c_weights = {"N": 0.0, "L": 0.22, "H": 0.56}
    i_weights = {"N": 0.0, "L": 0.22, "H": 0.56}
    a_weights = {"N": 0.0, "L": 0.22, "H": 0.56}
    
    # Impact Sub-Score (ISS)
    iss = 1 - ((1 - c_weights.get(c, 0.56)) * (1 - i_weights.get(i, 0.56)) * (1 - a_weights.get(a, 0)))
    
    if s == "U":
        impact = 6.42 * iss
        pr_w = pr_weights_u.get(pr, 0.85)
    else:
        impact = 7.52 * (iss - 0.029) - 3.25 * ((iss - 0.02) ** 15)
        pr_w = pr_weights_c.get(pr, 0.85)
        
    exploitability = 8.22 * av_weights.get(av, 0.85) * ac_weights.get(ac, 0.77) * pr_w * ui_weights.get(ui, 0.85)
    
    if impact <= 0:
        base_score = 0.0
    else:
        if s == "U":
            base_score = min(round(impact + exploitability, 1), 10.0)
        else:
            base_score = min(round(1.08 * (impact + exploitability), 1), 10.0)
            
    if base_score >= 9.0:
        severity = "Critical"
    elif base_score >= 7.0:
        severity = "High"
    elif base_score >= 4.0:
        severity = "Medium"
    elif base_score > 0.0:
        severity = "Low"
    else:
        severity = "Informational"
        
    vector_string = f"CVSS:3.1/AV:{av}/AC:{ac}/PR:{pr}/UI:{ui}/S:{s}/C:{c}/I:{i}/A:{a}"
    
    return {
        "score": base_score,
        "severity": severity,
        "vector": vector_string,
        "metrics": {
            "attack_vector": av,
            "attack_complexity": ac,
            "privileges_required": pr,
            "user_interaction": ui,
            "scope": s,
            "confidentiality": c,
            "integrity": i,
            "availability": a
        }
    }
