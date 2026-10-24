# Gym Log – setup
1. Create a Google Sheet "Gym Log". Rename the first tab to `Sessions`.
2. File > Import > Upload `seed_sessions.csv` > "Replace current sheet" (keeps the 62 imported sessions + header).
3. Extensions > Apps Script. Paste `Code.gs`. Project Settings > Script properties > add `KEY` = a long random phrase.
4. Deploy > New deployment > type Web app. Execute as: Me. Who has access: Anyone. Deploy, authorise, copy the `/exec` URL.
5. Host the `app/` folder (index.html, manifest.webmanifest, sw.js, icon.svg, icon.png) over HTTPS, e.g. GitHub Pages or Vercel/Netlify drag-and-drop.
6. On each phone: open the URL, ⋯ tab > paste the /exec URL and the key > "Save & sync now". Then Share > Add to Home Screen.
Code changes later: Deploy > Manage deployments > edit > New version (keeps the same URL).
