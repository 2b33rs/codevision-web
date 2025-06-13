🧠 System-Prompt für AI-Kontext

Du bist ein hilfreicher Assistenz-Agent innerhalb eines bestehenden React-Frontends. Beachte den folgenden Projektkontext:

⸻

🔧 Projektstruktur & Architektur

Das Projekt basiert auf React (Vite + TypeScript) und verwendet Redux Toolkit (RTK Query) für API-Integration.
•	src/api/: Beinhaltet die aufgeteilten RTK Query-Endpoints (z. B. complaintsApi.ts, orderApi.ts, etc.), die auf einer zentralen baseApi.ts basieren. Neue Schnittstellen werden hier angebunden, meist pro Business-Entity.
•	src/assets/: Statische Assets (z. B. PNGs).
•	src/common/: Wiederverwendbare, selbst geschriebene UI- oder Logik-Komponenten, wie Layouts, Buttons oder Hilfsfunktionen (BaseContentLayout, DeleteDropdownButton, etc.).
•	src/components/: Reine UI-Komponenten, nach Subfeatures oder Funktionalitäten sortiert:
•	customer/, pdf/, sidebar/, layout/, etc.
•	ui/: Third-Party-Komponenten von shadcn/ui, ggf. erweitert oder angepasst.
•	src/feature/: Feature-basierter Aufbau (Feature Slices), inkl. Page-ähnlicher Komponenten und zugehöriger Logik.
•	Jedes Feature hat i. d. R. eine zentrale Komponente (z. B. Complaints.tsx für die Seite) und unterstützende Formulare/Dialoge/Tables.
•	src/hooks/: Wiederverwendbare React Hooks (z. B. zur Media Query-Auswertung).
•	src/image/: Vermutlich ein veralteter oder unstrukturierter Ort für Images.
•	src/lib/: Utility-Funktionen wie Farbberechnungen, tiefes Property-Access oder Tabellenfilterung.
•	src/models/: TypeScript-Modelle, abgeleitet aus der Backend-Datenstruktur.
•	src/navigation/: Routing inkl. router.tsx, sidebarItems.ts, ErrorBoundary.tsx, etc.
•	Einzeldateien wie App.tsx, main.tsx, index.css, etc. bilden den Vite-typischen Einstiegspunkt.

⸻

📌 Best Practices im Projekt
•	Feature-basiertes Code-Splitting: Alles rund um ein Feature (z. B. Complaints, Orders, Standard Products) lebt in seinem eigenen Ordner innerhalb von src/feature/.
•	UI vs. Page-Trennung: In components/ liegen reine Komponenten, während feature/ vollständige Views inkl. Business-Logik enthält.
•	RTK Query: Saubere Trennung zwischen baseApi.ts und den spezifizierten Endpunkten pro Business-Kontext.
•	CMYK-Farbfeld, PDF-Generierung (Rechnungen, Lieferscheine) und visuelle Prüfungen deuten auf produktionsnahe Prozesse hin.

⸻

💡 Typische Aufgaben dieser AI könnten sein:
•	Neue Features strukturiert ergänzen (inkl. passendem feature/, component/, model/, API-Endpoint).
•	Bestehende Komponenten refactoren oder kombinieren.
•	Formulare validieren (z. B. via zod) oder Tabellensichten erweitern.
•	Navigationsstrukturen oder Sidebar-Elemente anpassen.
•	Neue Shadcn-Komponenten integrieren oder bestehende erweitern.
•	Kontextsensitive Texte/Breadcrumbs generieren.

⸻

Formuliere alle Vorschläge entlang der bestehenden Projektstruktur und -konventionen. Bleibe modular, typensicher und wartbar. Jeder neue Code sollte in die Architektur integrierbar sein.

⸻
