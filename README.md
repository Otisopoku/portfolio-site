# Otis Opoku — Portfolio

Static portfolio draft. Serve `dist/` using an HTTP server. No framework installation or build step is required.

`dist/index.html` contains the page narrative, `dist/styles.css` the responsive design, and `dist/app.js` the project data, filters, and accessible detail dialogs. Optimized WebP copies of the supplied photographs live in `dist/images/`; originals remain in the workspace's `assets/` folder.

The consolidated source material is `../content/portfolio.json`. It is editorial reference data, not a runtime dependency; when updating experiences, update the matching page copy as well. Project cover illustrations are decorative, not product screenshots. No project links or LinkedIn destination are fabricated.

The downloadable résumé is the supplied internship résumé. Google Fonts enhances the typography; local system fallbacks remain available. The website has email links rather than a contact form or backend.


## Edition 2

`v2.css` supplies the second edition's art direction and `motion.js` supplies native Web Animations and scroll effects. The Motion button disables optional animation, and the OS reduced-motion preference is honored. Native anchor scrolling remains intact. The photo stack has named previous/next buttons and a live counter. The project dialog supports Escape and restores focus.

Version one is frozen under `dist/v1/` and linked in edition two. Its exact source commit and original hosted version are recorded in `VERSION_HISTORY.md`. Do not edit the archived files during future changes.

### Windows Sites packaging

Use the bundled Node executable and the official Sites workflow helper. The process PATH needs Git Bash (`C:/Program Files/Git/bin`) and Node. Set `TAR_OPTIONS=--force-local` for Windows archive paths. Pass credentials only through the helper's hidden stdin, never in a file or command argument.

## Hero refinement (2.1)

`hero.css` restores edition one’s hero composition. `motion.js` measures character boundaries for a sequential typing reveal without changing the text layout. The animation runs once on load; reduced motion or Motion off displays the complete text immediately. The photo has a small desktop scroll offset, and project/section reveals remain progressive enhancements.

## Navigation and project stack (2.2)

refinements.css provides edge-to-edge glass navigation, name emphasis, and responsive project cards. project-stack.js adds subtle scroll depth and manages focus for covered cards. Native sticky positioning makes forward and reverse scrolling symmetrical. Motion off, reduced motion, and short screens use linear cards.
