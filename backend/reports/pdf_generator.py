import os
from datetime import datetime

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except Exception as e:
    print(f"ReportLab import notice: {str(e)}")
    REPORTLAB_AVAILABLE = False

def generate_pdf_report(assessment_id: str, target_name: str, target_url: str, overall_score: int, findings: list, output_filename: str) -> str:
    if not REPORTLAB_AVAILABLE:
        # Serverless fallback HTML/PDF text report if ReportLab C libraries are omitted
        html_content = f"""
        SECUREMONITOR AI SECURITY ASSESSMENT REPORT
        Assessment ID: {assessment_id}
        Target: {target_name} ({target_url})
        Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')}
        Overall Score: {overall_score} / 100
        
        Total Findings: {len(findings)}
        """
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(html_content)
        return output_filename

    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#0F172A")
    c_accent = colors.HexColor("#0284C7")
    c_dark = colors.HexColor("#1E293B")
    c_light = colors.HexColor("#F8FAFC")
    c_critical = colors.HexColor("#DC2626")
    c_high = colors.HexColor("#EA580C")
    c_medium = colors.HexColor("#D97706")
    c_low = colors.HexColor("#16A34A")

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=c_accent,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#94A3B8"),
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_primary,
        spaceBefore=15,
        spaceAfter=10
    )

    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_accent,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=8
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#0F172A"),
        backColor=colors.HexColor("#F1F5F9"),
        borderPadding=6,
        spaceAfter=8
    )

    elements = []

    # 1. Cover Header
    elements.append(Paragraph("SECUREMONITOR AI", title_style))
    elements.append(Paragraph("Automated Security Assessment & Vulnerability Intelligence Platform", subtitle_style))
    elements.append(Paragraph("<b>SIH 2026 • Problem Statement 26163 • NTRO</b>", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=10, textColor=c_accent)))
    elements.append(Spacer(1, 15))
    elements.append(HRFlowable(width="100%", thickness=2, color=c_accent, spaceAfter=20))

    # 2. Metadata Box
    meta_data = [
        [Paragraph("<b>Assessment ID:</b>", body_style), Paragraph(assessment_id, body_style)],
        [Paragraph("<b>Target System:</b>", body_style), Paragraph(f"{target_name} ({target_url})", body_style)],
        [Paragraph("<b>Environment:</b>", body_style), Paragraph("Authorized Staging / Local Demo Target", body_style)],
        [Paragraph("<b>Assessment Date:</b>", body_style), Paragraph(datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"), body_style)],
        [Paragraph("<b>Overall Security Posture Score:</b>", body_style), Paragraph(f"<b>{overall_score} / 100</b>", body_style)],
        [Paragraph("<b>Methodology & Scope:</b>", body_style), Paragraph("Non-Destructive Automated Security Assessment Baseline", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[180, 350])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t_meta)
    elements.append(Spacer(1, 20))

    # 3. Executive Summary
    elements.append(Paragraph("Executive Security Summary", h1_style))
    elements.append(Paragraph(
        "This security assessment report summarizes the findings discovered during the non-destructive security evaluation of the configured target application. "
        "The assessment targeted key cybersecurity domains including Authentication, Session Management, Authorization, Input Validation, API Security, Client-Side Security, Secure Communication, and Static Source Code hygiene.",
        body_style
    ))
    elements.append(Spacer(1, 10))

    crit_count = sum(1 for f in findings if f.get("severity") == "Critical")
    high_count = sum(1 for f in findings if f.get("severity") == "High")
    med_count = sum(1 for f in findings if f.get("severity") == "Medium")
    low_count = sum(1 for f in findings if f.get("severity") == "Low")

    sev_table_data = [
        ["Severity", "Count", "Risk Level"],
        ["Critical (CVSS 9.0 - 10.0)", str(crit_count), "Immediate Action Required"],
        ["High (CVSS 7.0 - 8.9)", str(high_count), "High Priority Remediation"],
        ["Medium (CVSS 4.0 - 6.9)", str(med_count), "Moderate Risk"],
        ["Low (CVSS 0.1 - 3.9)", str(low_count), "Low / Informational Risk"]
    ]
    t_sev = Table(sev_table_data, colWidths=[200, 100, 230])
    t_sev.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ]))
    elements.append(t_sev)
    elements.append(Spacer(1, 20))

    # 4. Detailed Vulnerability Findings
    elements.append(Paragraph("Detailed Security Findings & Safe Proofs of Concept", h1_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=15))

    for idx, f in enumerate(findings, 1):
        sev = f.get("severity", "Medium")
        sev_color = c_high if sev == "High" else (c_critical if sev == "Critical" else (c_medium if sev == "Medium" else c_low))
        
        elements.append(Paragraph(f"{idx}. [{f.get('finding_id', 'SEC')}] {f.get('title')}", h2_style))
        
        finding_details = [
            [Paragraph("<b>Domain:</b>", body_style), Paragraph(f.get("domain", "N/A"), body_style),
             Paragraph("<b>Severity:</b>", body_style), Paragraph(f"<font color='{sev_color.hexval()}'><b>{sev} (CVSS {f.get('cvss', 0.0)})</b></font>", body_style)],
            [Paragraph("<b>Affected Component:</b>", body_style), Paragraph(f.get("affected_component", "N/A"), body_style),
             Paragraph("<b>Status:</b>", body_style), Paragraph(f.get("status", "Open"), body_style)]
        ]
        t_fdetail = Table(finding_details, colWidths=[110, 160, 80, 180])
        t_fdetail.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0,0), (-1,-1), 5),
        ]))
        elements.append(t_fdetail)
        elements.append(Spacer(1, 8))

        elements.append(Paragraph("<b>Description:</b>", body_style))
        elements.append(Paragraph(f.get("description", ""), body_style))

        elements.append(Paragraph("<b>Safe Proof of Concept (PoC) & Observed Evidence:</b>", body_style))
        elements.append(Paragraph(f.get("poc", f.get("evidence", "")).replace("\n", "<br/>"), code_style))

        elements.append(Paragraph("<b>Business & Technical Impact:</b>", body_style))
        elements.append(Paragraph(f.get("impact", ""), body_style))

        elements.append(Paragraph("<b>Developer Remediation Recommendation:</b>", body_style))
        elements.append(Paragraph(f.get("remediation", ""), body_style))

        elements.append(Spacer(1, 15))

    elements.append(HRFlowable(width="100%", thickness=1, color=c_accent, spaceAfter=10))
    elements.append(Paragraph("<b>Authorization & Compliance Notice:</b> This security assessment was conducted strictly against an authorized local target in accordance with NTRO SIH 2026 Problem Statement 26163 non-destructive testing guidelines.", ParagraphStyle('Foot', fontName='Helvetica-Oblique', fontSize=8, textColor=colors.HexColor("#64748B"))))

    doc.build(elements)
    return output_filename
