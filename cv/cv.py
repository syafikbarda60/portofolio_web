"""Single source of truth for Syafik Barda's CV.

Run `python cv/cv.py` to regenerate the outputs in this folder:
  - Syafik_Barda_CV.tex           -> compile with pdflatex (works as-is on Overleaf)
  - Syafik_Barda_CV.docx          -> the matching Word version (full CV, served by the site)
  - Syafik_Barda_CV_Frontend.docx -> two-page cut for frontend / full-stack internships

Content mirrors src/data/portfolioData.ts so the CV and the portfolio site
never disagree. Edit the data below, rerun, both files update together.

The PDF the site serves at /Syafik_Barda_CV.pdf is the docx exported by Word.
After rerunning this, refresh it with (PowerShell, Word must be installed):

    $w = New-Object -ComObject Word.Application
    $d = $w.Documents.Open("<repo>\\cv\\Syafik_Barda_CV.docx")
    $d.SaveAs([ref]"<repo>\\public\\Syafik_Barda_CV.pdf", [ref]17)
    $d.Close($false); $w.Quit()
"""

import os

NAME = "Syafik Barda"
TAGLINE = "Computer Engineering Student | Full-Stack & IoT Developer"
CONTACT = ["Semarang, Indonesia", "+62 838-6919-3470", "syafikbarda60@gmail.com"]
LINKS = [
    ("github.com/syafikbarda60", "https://github.com/syafikbarda60"),
    ("linkedin.com/in/syafik-barda-7077573ab", "https://www.linkedin.com/in/syafik-barda-7077573ab/"),
    ("portofolio-web-five-hazel.vercel.app", "https://portofolio-web-five-hazel.vercel.app/"),
]

SUMMARY = (
    "Computer Engineering undergraduate at Diponegoro University (GPA 3.85/4.00) with a portfolio "
    "spanning full-stack web platforms, IoT telemetry systems, and applied machine learning. "
    "Experienced shipping production systems for both an industry client and university organizations, "
    "from Laravel and Next.js applications to solar-powered sensor nodes. Served a full term as Chief "
    "of the Organizational Management and Development Unit at HIMASKOM, responsible for overseeing and "
    "evaluating the performance of the entire student association. Combining technical depth with "
    "organizational leadership, I am committed to delivering impactful contributions in dynamic "
    "engineering environments."
)


# Entry shape: head=(left, right), subs=[(role, period)], bullets=[...], tech="..."
def entry(head, subs=(), bullets=(), tech=""):
    return {"head": head, "subs": list(subs), "bullets": list(bullets), "tech": tech}


EXPERIENCE = [
    entry(
        ("PT WHS Maritime Investments", "South Jakarta, Indonesia"),
        [("Web Developer Intern", "Jun 2025 - Jul 2025")],
        [
            "Revamped the company digital presence by building a modern, performant company profile "
            "website aligned with PT WHS Maritime Investments brand identity.",
            "Collaborated with stakeholders to structure the information architecture, ensuring core "
            "services and business values are communicated clearly to potential clients.",
            "Engineered a Content Management System so the internal team can publish news, portfolio "
            "entries, and company information without developer involvement.",
        ],
        "Laravel, PHP, React, Vite, Material UI, Bootstrap",
    ),
    entry(
        ("PT SidoAgung Farm", "Magelang, Indonesia"),
        [("IT Support", "Jan 2022 - Jun 2022")],
        [
            "Provided technical support to factory staff on network connectivity, hardware faults, and "
            "software configuration to keep daily operations running.",
            "Assisted in the installation and configuration of new network nodes and IT equipment during "
            "the expansion of factory operational areas.",
            "Monitored network traffic and performance, identifying and resolving bottlenecks to ensure "
            "fast and reliable data access across departments.",
        ],
    ),
]

ORGANIZATIONAL = [
    entry(
        ("HIMASKOM - Diponegoro University", "Semarang, Indonesia"),
        [
            ("Chief of Organizational Management and Development Unit", "Mar 2025 - Jun 2026"),
            ("Staff of Organizational Management and Development Unit", "Sep 2023 - Mar 2024"),
        ],
        [
            "Implemented a structural reform by establishing the Monitoring and Upgrading Division to "
            "oversee and raise the performance of all HIMASKOM 120+ members.",
            "Served as Head of the Evaluation and Achievement Division, assessing work programs across "
            "every field and unit within HIMASKOM 24.",
            "Supervised and improved the performance of MIKATAN HIMASKOM 24, mentoring division heads "
            "and streamlining cross-unit coordination.",
        ],
    ),
    entry(
        ("Computer Engineering Research Club (CERC) - Diponegoro University", "Semarang, Indonesia"),
        [("Junior Staff, Software Division", "Dec 2025 - Present")],
        [
            "Study emerging software architectures, web protocols, and modern development frameworks "
            "together with the division across a one-year research program.",
        ],
    ),
    entry(
        ("UNDIP Robotic Development Center (URDC)", "Semarang, Indonesia"),
        [("Staff, Andromeda Division", "Sep 2023 - Mar 2024")],
        [
            "Completed a mentorship program focused on Search and Rescue (SAR) robot research, covering "
            "autonomous sensor integration and hardware-software control loops.",
        ],
    ),
]

PROJECTS = [
    entry(
        ("Drift - Web-Based Animation Template Platform", "2026 - Present"),
        bullets=[
            "Building a motion-template editor for people with no motion-design background: pick a Lottie "
            "preset, drop in your own text and logo, arrange the scene on a canvas, and export a showcase "
            "video without writing any animation code.",
            "Built the full stack on the Next.js App Router with the API as Route Handlers in the same "
            "codebase, plus end-to-end account handling: registration, email OTP verification, JWT "
            "sessions, and hashed credentials against PostgreSQL.",
        ],
        tech="Next.js, React, PostgreSQL, JWT Auth, Lottie, GSAP, Tailwind CSS",
    ),
    entry(
        ("CREATION 2026 Exam - Online Examination Platform with Proctoring", "2026"),
        bullets=[
            "Developed a web-based examination platform for the CREATION 2026 event with continuous "
            "webcam proctoring over LiveKit, keeping a live view of every participant for the whole "
            "session.",
            "Implemented focus-lockdown detection that logs each tab and window switch to the database "
            "and surfaces it to proctors as a live violations feed, across a Laravel portal, an Express "
            "API, and a Next.js exam client joined by HMAC-SHA256 signed single sign-on.",
        ],
        tech="Laravel, Next.js, Express.js, LiveKit, SSE, MySQL",
    ),
    entry(
        ("SITIGA - RFID-Based Child Growth Monitoring Platform", "2026"),
        bullets=[
            "Built a growth-monitoring platform for parents and health workers: a child taps an RFID card "
            "at the post, the measurement is recorded against WHO growth standards, and the history stays "
            "visible only to those permitted to see it.",
            "Implemented the RFID pipeline end to end (tag assignment, device-facing scan endpoint, scan "
            "logs) with API-key device authentication and role-based access across user, admin, and "
            "super-admin, including an approvals queue and bulk spreadsheet import.",
        ],
        tech="Next.js, Express.js, MySQL, JWT Auth, RFID, Recharts, Tailwind CSS",
    ),
    entry(
        ("Rat Pest Detection - Thermal Imaging with Machine Learning", "2026"),
        bullets=[
            "Trained a Convolutional Neural Network on MLX90640 thermal captures to separate rat activity "
            "from background heat at night, driving ultrasonic repellers in rice paddies automatically.",
            "Built the field side on ESP32 and Raspberry Pi with PIR motion sensing, relay-driven emitters, "
            "and solar power, reporting telemetry to a dashboard covering device health, detection trends, "
            "and hot-spot ranking.",
        ],
        tech="Python, CNN, Thermal Vision, ESP32 / C++, Raspberry Pi, Next.js, PostgreSQL",
    ),
    entry(
        ("HIMASKOM Company Profile Website", "2026"),
        bullets=[
            "Designed and developed the official website for HIMASKOM UNDIP, presenting the association "
            "vision, work programs, division structure, and activities to prospective and current members.",
            "Modelled the organizational hierarchy, article index, and merchandise store as one typed data "
            "module so internal staff can keep the site current with minimal technical effort.",
        ],
        tech="Next.js, React, TypeScript, CSS Modules, GSAP, Lenis",
    ),
    entry(
        ("Swadaya Panen - IoT-Based Rice Field Monitoring System", "2025"),
        bullets=[
            "Designed an integrated IoT system for precision farming, engineering multi-sensor field nodes "
            "that log soil moisture, air temperature, humidity, and light intensity on a single timestamped "
            "reading and stream it to a central server.",
            "Built a responsive web dashboard with threshold alarms so farmers can monitor crop health "
            "remotely and be alerted the moment conditions turn critical.",
        ],
        tech="IoT Microcontroller, Sensors, Laravel, React, Vite, Chakra UI, MySQL",
    ),
    entry(
        ("NPK Monitoring - Precision Soil Nutrient Analyzer", "2025"),
        bullets=[
            "Developed an IoT system measuring soil Nitrogen, Phosphorus, and Potassium levels, integrating "
            "industrial NPK probes with microcontroller firmware on a standalone solar array.",
            "Built a dashboard over hourly and daily nutrient averages plus harvest logging, letting farmers "
            "determine precise fertilizer requirements and avoid soil degradation from over-fertilization.",
        ],
        tech="C++ / Embedded, NPK Probes, Solar / PLTS, Laravel, React, Material UI, MySQL",
    ),
    entry(
        ("ExpenseTracker - Personal Finance Management System", "2025"),
        bullets=[
            "Developed a cross-platform mobile app on Expo Router and React Native, backed by a separate "
            "Express API, to help users track and categorize personal cash flow.",
            "Implemented dynamic charting of monthly cash flow and category breakdowns with PDF export, "
            "plus on-device caching so the ledger stays readable offline.",
        ],
        tech="React Native, Expo, TypeScript, Supabase, Express.js, Chart Kit",
    ),
]

CERTIFICATIONS = [
    entry(("Latihan Keterampilan Manajemen Mahasiswa Pra-Dasar (LKMM-PD)", "2023"),
          [("Diponegoro University", "")]),
    entry(("Leadership Training Teknik Komputer", "2023"),
          [("Diponegoro University", "")]),
]

EDUCATION = [
    entry(("Diponegoro University", "Semarang, Indonesia"),
          [("Bachelor of Computer Engineering - GPA: 3.85 / 4.00", "Aug 2023 - Aug 2027 (expected)")]),
]

ADDITIONAL = [
    ("Languages & Frameworks",
     "JavaScript, TypeScript, PHP, Python, C++, React, Next.js, React Native, Node.js / Express, "
     "Laravel, Tailwind CSS"),
    ("Data & Infrastructure",
     "MySQL, PostgreSQL, Supabase, REST APIs, WebSockets / SSE, JWT authentication, Git"),
    ("IoT & Machine Learning",
     "ESP32 / microcontroller firmware, sensor integration (NPK, soil moisture, thermal), "
     "Raspberry Pi, CNN / computer vision"),
    ("Soft Skills",
     "Leadership, Communication, Initiative, Responsibility, Teamwork, Problem Solving, "
     "Critical Thinking"),
    ("Languages",
     "Bahasa Indonesia (Native), English (Fluent)"),
]

SECTIONS = [
    ("Experience", EXPERIENCE),
    ("Organizational Experience", ORGANIZATIONAL),
    ("Projects", PROJECTS),
    ("Leadership and Certification", CERTIFICATIONS),
    ("Education", EDUCATION),
    ("Additional", ADDITIONAL),
]

# Two pages for frontend / full-stack internships: education and skills up top,
# then the web work first and the hardware side folded into one dashboards entry.
FRONTEND_TAGLINE = "Computer Engineering Student | Frontend & Full-Stack Developer"
FRONTEND_SUMMARY = (
    "Computer Engineering student at Diponegoro University (GPA 3.85/4.00) seeking a frontend or "
    "full-stack internship. I build React and Next.js interfaces together with the Express and Laravel "
    "APIs behind them, and have shipped them for an industry client, the CREATION 2026 event, and field "
    "IoT systems. As Chief of HIMASKOM's Organizational Management and Development Unit, I oversaw the "
    "performance of a 120+ member student association."
)
FRONTEND_SECTIONS = [
    ("Education", EDUCATION),
    ("Skills", [
        ("Frontend",
         "React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Motion, GSAP, three.js, "
         "Material UI, Chakra UI"),
        ("Backend", "Node.js / Express, Laravel / PHP, REST APIs, SSE, JWT authentication, LiveKit"),
        ("Mobile", "React Native, Expo"),
        ("Data & Tools", "PostgreSQL, MySQL, Supabase, Git"),
        ("Other", "Python, C++, ESP32 firmware, Raspberry Pi, sensor integration"),
        ADDITIONAL[3],  # soft skills
        ADDITIONAL[4],  # languages
    ]),
    ("Experience", EXPERIENCE),
    ("Projects", [
        PROJECTS[0],  # Drift
        PROJECTS[1],  # CREATION 2026 Exam
        PROJECTS[2],  # SITIGA
        PROJECTS[4],  # HIMASKOM website
        entry(
            ("Portfolio Website - portofolio-web-five-hazel.vercel.app", "2026"),
            bullets=[
                "Built a scroll-driven portfolio where one three.js point cloud morphs from chapter to "
                "chapter, with a WebGL gallery of real project screenshots and a reduced-motion layout that "
                "keeps every section readable without animation.",
            ],
            tech="Next.js, React, TypeScript, Tailwind CSS, three.js, Motion, GSAP, Lenis",
        ),
        PROJECTS[7],  # ExpenseTracker
        entry(
            ("IoT Monitoring Dashboards - Swadaya Panen, NPK Monitoring, Rat Pest Detection", "2025 - 2026"),
            bullets=[
                "Built the web dashboards for three field IoT systems: live sensor telemetry with threshold "
                "alarms, nutrient aggregates with harvest logging, and device health with hot-spot ranking.",
            ],
            tech="React, Next.js, Vite, Chakra UI, Material UI, Recharts, Laravel, PostgreSQL, MySQL",
        ),
    ]),
    ("Organizational Experience", ORGANIZATIONAL),
    ("Leadership and Certification", CERTIFICATIONS),
]

# --------------------------------------------------------------------------- LaTeX

TEX_PREAMBLE = r"""%% Generated by cv/cv.py -- edit the data there and rerun.
%% Compile with pdflatex (works as-is on Overleaf).
\documentclass[a4paper,10pt]{article}
\usepackage[T1]{fontenc}
\usepackage[utf8]{inputenc}
\usepackage[margin=1.5cm,bottom=1.6cm]{geometry}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}
\usepackage[hidelinks]{hyperref}
\usepackage{microtype}

\definecolor{accent}{HTML}{1A1A1A}
\pagestyle{empty}
\setlength{\parindent}{0pt}

\titleformat{\section}{\normalsize\bfseries\scshape\color{accent}}{}{0em}{}[%
  \vspace{-0.7em}\color{accent}\rule{\linewidth}{0.8pt}]
\titlespacing*{\section}{0pt}{1.1em}{0.5em}

%% \entryhead{organisation or project}{right-aligned meta}
\newcommand{\entryhead}[2]{\textbf{#1}\hfill{#2}\par\vspace{0.15em}}
%% \role{title}{period}
\newcommand{\role}[2]{\textit{#1}\hfill{#2}\par}
%% \tech{comma separated stack}
\newcommand{\tech}[1]{\vspace{0.1em}{\small\textbf{Tech:} #1}\par}

\newenvironment{bullets}
  {\begin{itemize}[leftmargin=1.1em,topsep=0.25em,itemsep=0.15em,parsep=0pt,label=\textbullet]}
  {\end{itemize}\vspace{0.1em}}
"""

TEX_ESCAPES = {"&": r"\&", "%": r"\%", "$": r"\$", "#": r"\#",
               "_": r"\_", "{": r"\{", "}": r"\}", "~": r"\textasciitilde{}",
               "^": r"\textasciicircum{}"}


def tex(s):
    out = "".join(TEX_ESCAPES.get(c, c) for c in s)
    return out.replace(" - ", " -- ")


def build_tex(path, tagline=TAGLINE, summary=SUMMARY, sections=SECTIONS):
    L = [TEX_PREAMBLE, r"\begin{document}", ""]
    L.append(r"\begin{center}")
    L.append(r"{\LARGE\bfseries " + tex(NAME) + r"}\\[0.35em]")
    L.append(r"{\small " + tex(tagline) + r"}\\[0.25em]")
    L.append(r"{\small " + r" $\cdot$ ".join(tex(c) for c in CONTACT) + r"}\\[0.25em]")
    links = r" $\cdot$ ".join(r"\href{%s}{%s}" % (url, tex(label)) for label, url in LINKS)
    L.append(r"{\small " + links + "}")
    L.append(r"\end{center}")
    L.append("")
    L.append(r"\section{Summary}")
    L.append(tex(summary))
    L.append("")

    for title, entries in sections:
        L.append(r"\section{" + tex(title) + "}")
        if isinstance(entries[0], tuple):  # label: value lines (skills, languages)
            L.append(r"\begin{bullets}")
            L += [r"  \item \textbf{%s:} %s" % (tex(k), tex(v)) for k, v in entries]
            L.append(r"\end{bullets}")
            L.append("")
            continue
        for e in entries:
            L.append(r"\entryhead{%s}{%s}" % (tex(e["head"][0]), tex(e["head"][1])))
            for role, period in e["subs"]:
                L.append(r"\role{%s}{%s}" % (tex(role), tex(period)))
            if e["bullets"]:
                L.append(r"\begin{bullets}")
                L += [r"  \item " + tex(b) for b in e["bullets"]]
                L.append(r"\end{bullets}")
            if e["tech"]:
                L.append(r"\tech{%s}" % tex(e["tech"]))
            L.append(r"\vspace{0.55em}")
        L.append("")

    L.append(r"\end{document}")

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")


# --------------------------------------------------------------------------- DOCX

def build_docx(path, tagline=TAGLINE, summary=SUMMARY, sections=SECTIONS, compact=False):
    """compact: narrower margins and spacing, for the one-page cut. Type size stays 10pt."""
    from docx import Document
    from docx.shared import Pt, Cm
    from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    from docx.opc.constants import RELATIONSHIP_TYPE as RT

    def dash(s):
        return s.replace(" - ", " – ")

    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Cm(21), Cm(29.7)  # A4, like the .tex
    margin = Cm(1.27 if compact else 1.5)
    sec.top_margin = sec.bottom_margin = sec.left_margin = sec.right_margin = margin
    right_edge = sec.page_width - sec.left_margin - sec.right_margin

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    normal.paragraph_format.space_after = Pt(0)
    normal.paragraph_format.line_spacing = 1.0 if compact else 1.05

    def para(space_after=0, space_before=0):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.space_before = Pt(space_before)
        return p

    def run(p, text, bold=False, italic=False, size=10, caps=False):
        r = p.add_run(dash(text))
        r.bold, r.italic = bold, italic
        r.font.size = Pt(size)
        r.font.small_caps = caps
        return r

    def tabbed(left, right, bold=False, italic=False):
        """One line: left text, right text flush to the right margin."""
        p = para()
        p.paragraph_format.tab_stops.add_tab_stop(right_edge, WD_TAB_ALIGNMENT.RIGHT)
        run(p, left, bold=bold, italic=italic)
        if right:
            run(p, "\t" + right, italic=italic)
        return p

    def heading(text):
        p = para(space_after=3, space_before=7 if compact else 9)
        p.paragraph_format.keep_with_next = True
        run(p, text, bold=True, size=11, caps=True)
        pbdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        for k, v in (("w:val", "single"), ("w:sz", "8"), ("w:space", "1"), ("w:color", "1A1A1A")):
            bottom.set(qn(k), v)
        pbdr.append(bottom)
        p._p.get_or_add_pPr().append(pbdr)

    def bullet():
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.left_indent = Cm(0.5)
        p.paragraph_format.first_line_indent = Cm(-0.3)
        p.paragraph_format.space_after = Pt(0 if compact else 1)
        p.paragraph_format.line_spacing = normal.paragraph_format.line_spacing
        return p

    p = para(space_after=2)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run(p, NAME, bold=True, size=20)
    for line in (tagline, "  ·  ".join(CONTACT)):
        p = para(space_after=1)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run(p, line, size=9.5)

    # Links as real hyperlinks, so they stay clickable in the exported PDF.
    p = para(space_after=1)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for i, (label, url) in enumerate(LINKS):
        if i:
            run(p, "  ·  ", size=9.5)
        link = OxmlElement("w:hyperlink")
        link.set(qn("r:id"), p.part.relate_to(url, RT.HYPERLINK, is_external=True))
        link.append(run(p, label, size=9.5)._r)  # moves the run inside the link
        p._p.append(link)

    heading("Summary")
    run(para(space_after=2), summary)

    for title, entries in sections:
        heading(title)
        if isinstance(entries[0], tuple):  # label: value lines (skills, languages)
            for k, v in entries:
                p = bullet()
                run(p, k + ": ", bold=True)
                run(p, v)
            continue
        for e in entries:
            first = len(doc.paragraphs)
            tabbed(e["head"][0], e["head"][1], bold=True)
            for role, period in e["subs"]:
                tabbed(role, period, italic=True)
            for b in e["bullets"]:
                run(bullet(), b)
            if e["tech"]:
                p = para()
                run(p, "Tech: ", bold=True, size=9.5)
                run(p, e["tech"], size=9.5)
            for q in doc.paragraphs[first:]:  # an entry never splits across pages
                q.paragraph_format.keep_with_next = True
            gap = para(space_after=0 if compact else 5)
            if compact:  # a 5pt gap instead of a full blank line
                gap.paragraph_format.line_spacing = Pt(5)

    doc.save(path)


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    tex_path = os.path.join(here, "Syafik_Barda_CV.tex")
    docx_path = os.path.join(here, "Syafik_Barda_CV.docx")
    frontend_path = os.path.join(here, "Syafik_Barda_CV_Frontend.docx")
    build_tex(tex_path)
    build_docx(docx_path)
    build_docx(frontend_path, FRONTEND_TAGLINE, FRONTEND_SUMMARY, FRONTEND_SECTIONS, compact=True)

    # ponytail: one sanity check instead of a test suite -- unescaped LaTeX
    # specials and a dropped section are the only ways this breaks silently.
    body = open(tex_path, encoding="utf-8").read()
    assert body.count(r"\begin{document}") == 1
    assert "&" not in body.replace(r"\&", ""), "unescaped & in tex output"
    for title, entries in SECTIONS:
        assert entries, "empty section: " + title
        assert r"\section{" + tex(title) in body, "missing section: " + title
    assert os.path.getsize(docx_path) > 8000
    print("wrote", tex_path)
    print("wrote", docx_path)
    print("wrote", frontend_path)
