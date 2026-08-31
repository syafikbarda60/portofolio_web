"""Portfolio deck for freelance applications that ask for a portfolio file.

Run `python cv/portfolio.py` to write Syafik_Barda_Portfolio.docx in this
folder, then export it to PDF with Word the same way the CV is exported (see
the docstring in cv.py).

Positioning is frontend-first: projects are ordered by how much of the work
was interface work, and each one leads with what was built on the frontend.
Screenshots come from /public/work/<id>/, the same real captures the site
uses — nothing here is a mock-up.
"""

import os

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
SHOTS = os.path.join(REPO, "public", "work")

NAME = "Syafik Barda"
ROLE = "Frontend Developer"
CONTACT = "Semarang, Indonesia  ·  +62 838-6919-3470  ·  syafikbarda60@gmail.com"
LINKS = "portofolio-web-five-hazel.vercel.app  ·  github.com/syafikbarda60"

INTRO = (
    "I build interfaces that hold up in production: motion-heavy marketing sites, real-time "
    "dashboards, and cross-platform mobile apps. Most of my work is React and Next.js with "
    "TypeScript, and I am comfortable going down into the API and the database when the interface "
    "needs something the backend does not expose yet. The nine projects here are ordered by how "
    "much of the work was interface work. Every screenshot is a capture of the running system."
)

GH = "github.com/syafikbarda60/"


def project(key, title, subtitle, year, summary, frontend, stack, shots, repo=None):
    return {
        "title": title, "subtitle": subtitle, "year": year, "summary": summary,
        "frontend": frontend, "stack": stack, "repo": repo,
        "shots": [os.path.join(SHOTS, key, s) for s in shots],
    }


PROJECTS = [
    project(
        "drift", "Drift", "Web-Based Animation Template Platform", "2026 — Present",
        "A motion-template editor for people with no motion-design background. Pick a Lottie preset, "
        "drop in your own text and logo, arrange the scene on a canvas, and export a short showcase "
        "video — no keyframing anywhere in the flow.",
        [
            "Built the canvas editor over Lottie: scenes composed visually, layers arranged directly, "
            "and the result rendered out to video, so the export is the product rather than a snippet.",
            "Designed the preset browser and the marketing site around GSAP motion, with the animation "
            "itself as the sales argument.",
            "Wired the whole stack on the Next.js App Router — the API lives as Route Handlers in the "
            "same codebase, including registration, email OTP, and JWT sessions.",
        ],
        "Next.js · React · Tailwind CSS · GSAP · Lottie · PostgreSQL",
        ["01.jpg", "03.jpg"],
    ),
    project(
        "himaskom-profile", "HIMASKOM Official Web Portal", "Student Association Digital Hub", "2026",
        "The official site for the Computer Engineering Student Association at Diponegoro University, "
        "presenting the cabinet, division structure, work programmes, articles, and merchandise store "
        "to current and prospective members.",
        [
            "Layered GSAP and Lenis across the whole site so the scrolling and section transitions "
            "carry the organisation's identity instead of sitting on a stock template.",
            "Modelled the hierarchy, division catalogue, article index, and store as one typed data "
            "module, so internal staff keep the site current without touching layout code.",
        ],
        "Next.js · React · TypeScript · CSS Modules · GSAP · Lenis",
        ["01.jpg", "02.jpg"],
        repo="Company-Profile-of-Himaskom",
    ),
    project(
        "whs-portal", "PT WHS Maritime", "Corporate Portal & CMS  ·  Client work", "2025",
        "A full digital overhaul for PT WHS Maritime Investments, a maritime investment firm in South "
        "Jakarta. Delivered during a three-month engagement as their website developer.",
        [
            "Rebuilt the public site as responsive, high-performance pages aligned to the firm's brand, "
            "working with stakeholders to structure how services reach institutional clients.",
            "Built a CMS layer so the internal team publishes news, portfolio entries, and company "
            "information without a developer in the loop.",
        ],
        "Laravel · React · Vite · Material UI · Bootstrap",
        ["01.jpg", "02.jpg"],
        repo="WHS_Maritime-Project",
    ),
    project(
        "creation-exam", "CREATION 2026 Exam", "Online Examination Platform with Proctoring", "2026",
        "A secure examination platform built for the CREATION 2026 event, where proctors watch every "
        "participant live and the system flags suspicious behaviour as it happens.",
        [
            "Built the proctoring view on LiveKit, holding a live webcam feed of each participant for "
            "the full duration of the exam.",
            "Implemented focus-lockdown detection in the browser: every tab and window switch is logged "
            "and pushed to the proctor's violations feed over SSE.",
            "Joined three services — a Laravel portal, an Express API, and the Next.js exam client — "
            "behind single sign-on with HMAC-SHA256 signed tokens.",
        ],
        "Next.js · Laravel · Express.js · LiveKit · SSE · MySQL",
        ["01.png", "02.png"],
    ),
    project(
        "sitiga", "SITIGA", "RFID-Based Child Growth Monitoring", "2026",
        "A growth-monitoring platform for parents and health workers. A child taps an RFID card at the "
        "post, the measurement is recorded against WHO growth standards, and the history stays visible "
        "only to whoever is permitted to see it.",
        [
            "Built the charting layer on Recharts, plotting each child's measurements against WHO "
            "reference curves so a health worker reads the trend, not a table of numbers.",
            "Layered role-based views across user, admin, and super-admin, with an approvals queue for "
            "new accounts and bulk spreadsheet import for existing records.",
        ],
        "Next.js · Express.js · Recharts · Tailwind CSS · MySQL · RFID",
        ["01.jpg", "02.jpg"],
        repo="SITIGA",
    ),
    project(
        "expense-tracker", "ExpenseTracker", "Personal Finance Mobile App", "2025",
        "A cross-platform mobile app for tracking personal cash flow, built to make daily logging fast "
        "enough that people actually keep doing it.",
        [
            "Built the app on Expo Router and React Native, with transaction logging designed around "
            "as few taps as possible.",
            "Implemented monthly cash-flow and category charts, PDF export and sharing from the device, "
            "and on-device caching so the ledger stays readable with no connection.",
        ],
        "React Native · Expo · TypeScript · Chart Kit · Supabase · Express.js",
        ["01.jpg", "02.jpg"],
        repo="ExpenseTracker",
    ),
    project(
        "rat-pest-detection", "Gropyok", "Thermal Pest Detection Dashboard", "2026",
        "A field system that detects rat activity in rice paddies with thermal imaging and drives "
        "ultrasonic repellers against it. The dashboard is where the farm actually reads the system.",
        [
            "Built the operations dashboard: device health, detection trends over time, hot-spot "
            "ranking per plot, and event rules, polled live in the browser.",
            "Trained the detection model itself — a CNN over MLX90640 thermal captures, separating rat "
            "activity from background heat at night.",
        ],
        "Next.js · Recharts · PostgreSQL · Python · CNN · ESP32 · Raspberry Pi",
        ["02.png", "03.png"],
        repo="ArgoShield-Rodent-Detection",
    ),
    project(
        "swadaya-panen", "Swadaya Panen", "IoT Rice Field Monitoring", "2025",
        "Precision-farming telemetry: sensor nodes in the field log the microclimate, and the dashboard "
        "turns that stream into something a farmer can act on remotely.",
        [
            "Built the responsive dashboard over soil moisture, air temperature, humidity, and light "
            "intensity, with threshold alarms that surface critical conditions immediately.",
            "Engineered the field nodes behind it, logging every sensor on a single timestamped reading.",
        ],
        "React · Vite · Chakra UI · Laravel · MySQL · IoT sensors",
        ["01.jpg", "02.jpg"],
    ),
    project(
        "npk-monitoring", "NPK Precision Soil Analyzer", "Soil Nutrient Telemetry", "2025",
        "A solar-powered system that reads soil Nitrogen, Phosphorus, and Potassium continuously and "
        "drives automatic nutrient control, so fertiliser is matched to what the soil actually lacks.",
        [
            "Built the dashboard around hourly N-P-K averages, daily aggregates, and full sensor "
            "history, with harvest logging alongside so nutrient levels read against real yield.",
            "Integrated the industrial NPK probes with microcontroller firmware, running the node off a "
            "standalone solar array.",
        ],
        "React · Material UI · Laravel · MySQL · C++ / Embedded · Solar",
        ["01.jpg", "02.jpg"],
    ),
]

# ponytail: shrink to print width before embedding. The captures are 2160px
# wide; at 13.5cm nothing past ~1400px is visible, and it keeps the PDF small.
MAX_PX = 1400


def fit(path, cache):
    out = os.path.join(cache, os.path.basename(os.path.dirname(path)) + "_" + os.path.basename(path))
    out = os.path.splitext(out)[0] + ".jpg"
    if not os.path.exists(out):
        img = Image.open(path).convert("RGB")
        if img.width > MAX_PX:
            img = img.resize((MAX_PX, round(img.height * MAX_PX / img.width)), Image.LANCZOS)
        img.save(out, "JPEG", quality=82, optimize=True)
    return out


def build(path, cache):
    doc = Document()
    sec = doc.sections[0]
    sec.top_margin = sec.bottom_margin = Cm(1.5)
    sec.left_margin = sec.right_margin = Cm(1.5)
    width = sec.page_width - sec.left_margin - sec.right_margin

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    normal.paragraph_format.space_after = Pt(0)
    normal.paragraph_format.line_spacing = 1.08

    def para(after=0, before=0, align=None):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(after)
        p.paragraph_format.space_before = Pt(before)
        if align:
            p.alignment = align
        return p

    def run(p, text, bold=False, italic=False, size=10, grey=False, caps=False):
        r = p.add_run(text)
        r.bold, r.italic = bold, italic
        r.font.size = Pt(size)
        r.font.small_caps = caps
        if grey:
            r.font.color.rgb = RGBColor(0x66, 0x66, 0x66)
        return r

    def rule(p):
        pbdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        for k, v in (("w:val", "single"), ("w:sz", "8"), ("w:space", "4"), ("w:color", "1A1A1A")):
            bottom.set(qn(k), v)
        pbdr.append(bottom)
        p._p.get_or_add_pPr().append(pbdr)

    def tabbed(after=0):
        p = para(after=after)
        p.paragraph_format.tab_stops.add_tab_stop(width, WD_TAB_ALIGNMENT.RIGHT)
        return p

    def bullet(text):
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.left_indent = Cm(0.5)
        p.paragraph_format.first_line_indent = Cm(-0.3)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.08
        run(p, text)

    # ---- cover
    run(para(after=3), NAME, bold=True, size=26)
    run(para(after=10), ROLE, size=13, grey=True)
    rule(para(after=8))
    run(para(after=2), CONTACT, size=9, grey=True)
    run(para(after=14), LINKS, size=9, grey=True)
    run(para(after=18), INTRO, size=10.5)

    run(para(after=6), "Selected work", bold=True, size=10, caps=True)
    for i, pr in enumerate(PROJECTS, 1):
        p = tabbed(after=3)
        run(p, f"{i:02d}   ", size=9.5, grey=True)
        run(p, pr["title"], bold=True, size=9.5)
        run(p, "   " + pr["subtitle"], size=9.5, grey=True)
        run(p, "\t" + pr["year"], size=9.5, grey=True)
    doc.add_page_break()

    # ---- one page per project
    for i, pr in enumerate(PROJECTS, 1):
        p = tabbed()
        run(p, f"{i:02d}   ", size=15, grey=True)
        run(p, pr["title"], bold=True, size=15)
        run(p, "\t" + pr["year"], size=10, grey=True)
        run(para(after=8), pr["subtitle"], size=10.5, grey=True, italic=True)
        rule(para(after=8))

        run(para(after=8), pr["summary"], size=10)
        run(para(after=3), "Frontend work", bold=True, size=9, caps=True)
        for b in pr["frontend"]:
            bullet(b)

        p = para(before=6, after=2)
        run(p, "Stack   ", bold=True, size=9, grey=True)
        run(p, pr["stack"], size=9)
        if pr["repo"]:
            p = para(after=10)
            run(p, "Code   ", bold=True, size=9, grey=True)
            run(p, GH + pr["repo"], size=9)
        else:
            para(after=10)

        # One page per project is the whole layout rule, so shots are capped by
        # HEIGHT, not width: the captures run from 16:10 to 4:3, and a fixed
        # width silently makes the squarer ones a third taller.
        max_h = 6.8 if len(pr["frontend"]) >= 3 else 7.4
        for shot in pr["shots"]:
            s = fit(shot, cache)
            w, h = Image.open(s).size
            p = para(after=6, align=WD_ALIGN_PARAGRAPH.CENTER)
            p.add_run().add_picture(s, width=Cm(min(11.5, max_h * w / h)))

        if i < len(PROJECTS):
            doc.add_page_break()

    doc.save(path)


if __name__ == "__main__":
    cache = os.path.join(HERE, ".shotcache")
    os.makedirs(cache, exist_ok=True)
    out = os.path.join(HERE, "Syafik_Barda_Portfolio.docx")

    missing = [s for pr in PROJECTS for s in pr["shots"] if not os.path.exists(s)]
    assert not missing, "missing screenshots:\n  " + "\n  ".join(missing)

    build(out, cache)
    mb = os.path.getsize(out) / 1e6
    assert mb < 15, f"docx is {mb:.1f} MB, too heavy to upload"
    print(f"wrote {out}  ({mb:.1f} MB, {len(PROJECTS)} projects)")
