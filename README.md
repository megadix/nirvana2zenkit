# Nirvana2Zenkit

Accompanying code for my articles about moving data from [Nirvana GTD](https://www.nirvanahq.com/) to [Zenkit](https://zenkit.com/).

- [Export Tasks from Nirvana to Zenkit - Part 1](https://www.megadix.it/blog/export-nirvana-to-zenkit-1/)
- [Export Tasks from Nirvana to Zenkit - Part 2](https://www.megadix.it/blog/export-nirvana-to-zenkit-2/)

# Requirements

- a recent version of [Node.js](https://nodejs.org/en/) and NPM
- a Nirvana GTD account
- a Zenkit account

# Quick Start

1) Install dependencies:

```
npm install
```

2) download a JSON export of your data from Nirvana GTD (see [Part 1](https://www.megadix.it/blog/export-nirvana-to-zenkit-1/) of the series) and save it locally, e.g. `C:\download\nirvana-export.json`

3) CD into project, then run the script:

```
node src/index.js C:\download\nirvana-export.json
```

Sample console output (Windows):

```
> node src/index.js C:\download\nirvana-export.json

Writing out/projects.csv...
Writing out/tasks.csv...
...Done
...Done
```

The script will create:

- an `out` folder
- `out/projects.csv`
- `out/tasks.csv`

See articles in the series for details.
