# EoS Health — Publication Submission Checklist

**Status as of June 2026**  
All documents are written and ready. This checklist tracks submission to each platform.

---

## Academic Papers — 4 Papers Ready

| Paper | File | Target Journal | Preprint Server | Status |
|---|---|---|---|---|
| HEALTH-KEY ULTRA | `papers/HEALTH_KEY_ULTRA_IEEE_Paper.md` | IEEE TBME | Zenodo + TechRxiv | 📋 Ready to submit |
| HEALTH-BAND Neuro | `papers/HEALTH_BAND_NEURO_IEEE_Paper.md` | IEEE TNSRE | Zenodo + TechRxiv | 📋 Ready to submit |
| HEALTH-RING | `papers/HEALTH_RING_IEEE_Paper.md` | IEEE TBME | Zenodo + arXiv eess.SP | 📋 Ready to submit |
| HEALTH-LAB | `papers/HEALTH_LAB_IEEE_Paper.md` | ACS Nano / npj Digital Medicine | Zenodo + arXiv physics.med-ph | 📋 Ready to submit |

---

## White Papers — 2 Papers Ready

| Paper | File | Target Platforms | Status |
|---|---|---|---|
| EoS Health Ecosystem | `white-papers/EOS_HEALTH_ECOSYSTEM_White_Paper.md` | Rock Health, Digital Health Wire, HIMSS, LinkedIn | 📋 Ready to publish |
| Health Algorithms Deep-Dive | `white-papers/EOS_HEALTH_ALGORITHMS_Technical_White_Paper.md` | IEEE Spectrum, Hackster.io, Medium (TDS), LinkedIn | 📋 Ready to publish |

---

## Zenodo Upload Metadata

### Paper 1 — HEALTH-KEY ULTRA

```json
{
  "title": "HEALTH-KEY ULTRA: A USB-C Wearable Biosensor for ECG, SpO2, and Breath Alcohol Monitoring",
  "upload_type": "publication",
  "publication_type": "preprint",
  "description": "We present HEALTH-KEY ULTRA, a USB-C pendrive-form-factor wearable biosensor...",
  "creators": [{"name": "EmbeddedOS Research Group", "affiliation": "EmbeddedOS Organization"}],
  "keywords": ["ECG", "SpO2", "wearable biosensor", "USB-C", "AFib detection", "open source hardware"],
  "license": "cc-by-4.0",
  "access_right": "open",
  "related_identifiers": [
    {"identifier": "https://github.com/embeddedos-org/eos-health", "relation": "isSupplementTo", "scheme": "url"}
  ]
}
```

### Paper 2 — HEALTH-BAND Neuro

```json
{
  "title": "HEALTH-BAND Neuro: An 8-Channel sEMG Wristband with Integrated TENS Therapy for Neuromuscular Monitoring and Rehabilitation",
  "upload_type": "publication",
  "publication_type": "preprint",
  "keywords": ["sEMG", "TENS", "neuromuscular", "wristband", "gesture recognition", "EDA", "stress monitoring"],
  "license": "cc-by-4.0",
  "access_right": "open"
}
```

### Paper 3 — HEALTH-RING

```json
{
  "title": "HEALTH-RING: Non-Invasive HbA1c Estimation and Cuffless Blood Pressure Measurement via 5-Wavelength Near-Infrared Spectroscopy in a Titanium Smart Ring",
  "upload_type": "publication",
  "publication_type": "preprint",
  "keywords": ["non-invasive HbA1c", "cuffless blood pressure", "smart ring", "near-infrared spectroscopy", "PPG", "wearable diabetes monitoring"],
  "license": "cc-by-4.0",
  "access_right": "open"
}
```

### Paper 4 — HEALTH-LAB

```json
{
  "title": "HEALTH-LAB: A Flexible Biosensor Patch for Continuous Multi-Analyte Sweat Analysis with Self-Calibrating Electrochemical Sensing",
  "upload_type": "publication",
  "publication_type": "preprint",
  "keywords": ["sweat biosensor", "glucose", "cortisol", "lactate", "iontophoresis", "self-calibration", "flexible electronics"],
  "license": "cc-by-4.0",
  "access_right": "open"
}
```

---

## Step-by-Step Submission Guide

### Zenodo (preprints — do first, get DOI)

1. Go to https://zenodo.org → Log in with GitHub (embeddedos-org)
2. Click **New Upload**
3. Upload the Markdown file converted to PDF (use `manus-md-to-pdf`)
4. Fill in metadata from JSON above
5. Click **Publish** → Get DOI (e.g., `10.5281/zenodo.XXXXXXX`)
6. Add DOI to paper header and GitHub README

### TechRxiv (IEEE preprint server — for IEEE-targeted papers)

1. Go to https://www.techrxiv.org → Create account
2. Submit HEALTH-KEY ULTRA and HEALTH-BAND Neuro papers (IEEE TBME/TNSRE targets)
3. Select category: Biomedical Engineering
4. Upload PDF, fill metadata, submit

### arXiv (for HEALTH-RING and HEALTH-LAB)

1. Go to https://arxiv.org → Create account
2. HEALTH-RING → category: eess.SP (Signal Processing)
3. HEALTH-LAB → category: physics.med-ph (Medical Physics)
4. Upload LaTeX or PDF, fill metadata, submit

### ResearchGate

1. Go to https://www.researchgate.net → Create researcher profile
2. Upload all 4 papers after Zenodo DOIs are obtained
3. Link to GitHub repo in each paper

### LinkedIn Articles (white papers)

1. Go to LinkedIn → Write Article
2. Paste EoS Health Ecosystem white paper
3. Add 5 images: all_4_products.png, app_dashboard.png, simulation plots
4. Tag: #DigitalHealth #Wearables #HealthTech #OpenSource #MedTech
5. Repeat for Algorithms white paper

### Rock Health / Digital Health Wire

1. Email: submissions@rockhealth.com
2. Subject: "EoS Health Ecosystem: Open-Source Platform for Continuous Multimodal Health Monitoring"
3. Attach: EOS_HEALTH_ECOSYSTEM_White_Paper.pdf + all_4_products.png

---

## EB-1A Evidence Value

Each publication strengthens specific EB-1A criteria:

| Publication | EB-1A Criterion Strengthened |
|---|---|
| 4 IEEE papers | Original contributions of major significance in the field |
| Zenodo DOIs | Published material about the applicant's work in the field |
| White papers (Rock Health, HIMSS) | Evidence of recognition by experts in the field |
| Developer API + GitHub stars | Leading/critical role for distinguished organizations |
| 2 filed patents + 2 ready | Patents for inventions in the field |

---

## Documents Ready for PDF Conversion

Run the following commands to generate PDFs:

```bash
cd /home/ubuntu/eos-health

# Academic papers
manus-md-to-pdf academic/papers/HEALTH_KEY_ULTRA_IEEE_Paper.md academic/papers/HEALTH_KEY_ULTRA_IEEE_Paper.pdf
manus-md-to-pdf academic/papers/HEALTH_BAND_NEURO_IEEE_Paper.md academic/papers/HEALTH_BAND_NEURO_IEEE_Paper.pdf
manus-md-to-pdf academic/papers/HEALTH_RING_IEEE_Paper.md academic/papers/HEALTH_RING_IEEE_Paper.pdf
manus-md-to-pdf academic/papers/HEALTH_LAB_IEEE_Paper.md academic/papers/HEALTH_LAB_IEEE_Paper.pdf

# White papers
manus-md-to-pdf academic/white-papers/EOS_HEALTH_ECOSYSTEM_White_Paper.md academic/white-papers/EOS_HEALTH_ECOSYSTEM_White_Paper.pdf
manus-md-to-pdf academic/white-papers/EOS_HEALTH_ALGORITHMS_Technical_White_Paper.md academic/white-papers/EOS_HEALTH_ALGORITHMS_Technical_White_Paper.pdf

# Datasheets
manus-md-to-pdf docs/datasheets/HEALTH-KEY-ULTRA_Datasheet_v1.0.md docs/datasheets/HEALTH-KEY-ULTRA_Datasheet_v1.0.pdf
manus-md-to-pdf docs/datasheets/HEALTH-BAND-NEURO_Datasheet_v1.0.md docs/datasheets/HEALTH-BAND-NEURO_Datasheet_v1.0.pdf
manus-md-to-pdf docs/datasheets/HEALTH-RING_Datasheet_v1.0.md docs/datasheets/HEALTH-RING_Datasheet_v1.0.pdf
manus-md-to-pdf docs/datasheets/HEALTH-LAB_Datasheet_v1.0.md docs/datasheets/HEALTH-LAB_Datasheet_v1.0.pdf
```
