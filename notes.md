# Nirvana to ZenKit migration

- Nirvana: export JSON
- process using `index.js`
- import `projects.csv` in ZenKit

## projects.csv - ZenKit

- Delimiter: Comma
- rename collection: "Projects"
- fix fields:
  - `Name`: make sure is set as primary
  - `State`:
    - convert to "Labels"
      - NO multi selection
      - NO inline creation of labels
    - wait for conversion to complete
    - use as kanban list header
    - switch to Kanban view
      - add missing lists if needed, or adjust ordering
      - my lists are "Someday - Active - Done"
  - switch back to Table view
  - `Tags`:
    - convert to "Labels"
      - Allow multi selection
      - Allow inline creation of labels
  - `Contexts`:
    - convert to "Labels"
      - Allow multi selection
      - Allow inline creation of labels
  - `Areas`:
    - convert to "Labels"
      - Allow multi selection
      - Allow inline creation of labels
  - `Completed`:
    - convert to "Checkbox"
  - `Focus`: convert to checkbox
- switch (again) to "Kanban" mode


## tasks.csv - ZenKit

- Delimiter: Comma
- rename collection: "Tasks"
- fix fields:
  - `Name`: make sure is set as primary
  - `Project`:
    - convert to "Refrences" -> "Projects"
      - NO allow creation
      - YES allow selection
  - `State`:
    - convert to "Labels"
      - NO multi selection
      - NO inline creation of labels
    - wait for conversion to complete
    - use as kanban list header
    - switch to Kanban view
      - add missing lists if needed, or adjust ordering
      - my lists are "Someday - Next - Waiting - Done"
  - switch back to Table view
  - `Tags`:
    - convert to "Labels"
      - Allow multi selection
      - Allow inline creation of labels
  - `Contexts`:
    - convert to "Labels"
      - Allow multi selection
      - Allow inline creation of labels
  - `Areas`:
    - convert to "Labels"
      - Allow multi selection
      - Allow inline creation of labels
  - `Completed`:
    - convert to "Checkbox"
  - `Focus`: convert to checkbox
- switch (again) to "Kanban" mode
