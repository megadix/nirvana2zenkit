const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const functions = require('./functions');

if (process.argv.length < 3) {
    console.error(`Usage: node index.js <JSON file>`);
    process.exit(1);
}

const data = require(process.argv[2]);

if (!fs.existsSync('./out')) {
    fs.mkdirSync('./out');
}

const projectsMap = new Map();

const projects =
    functions.filterItems(data, functions.Type.PROJECT, false, false, false)
        .map(project => {
            const tags = functions.processTags(project.tags, true);
            const item = {
                id: project.id,
                name: project.name,
                areas: Array.from(tags.areas),
                contexts: Array.from(tags.contexts),
                tags: Array.from(tags.tags),
                state: functions.StatesLabels[project.state],
                completed: false,
                focus: project.seqt !== '0'
            };

            projectsMap.set(item.id, item);

            return item;
        });

const projectsCsvWriter = createCsvWriter({
    path: './out/projects.csv',
    header: [
        {id: 'name', title: 'Name'},
        {id: 'areas', title: 'Areas'},
        {id: 'contexts', title: 'Contexts'},
        {id: 'tags', title: 'Tags'},
        {id: 'state', title: 'State'},
        {id: 'completed', title: 'Completed'},
        {id: 'focus', title: 'Focus'}
    ]
});

console.log('Writing out/projects.csv...');

projectsCsvWriter.writeRecords(projects)
    .then(() => {
        console.log('...Done');
    });

const tasks =
    functions.filterItems(data, functions.Type.TASK, false, false, false)
        .map(task => {
            const tags = functions.processTags(task.tags, true);

            return {
                project: task.parentid ? projectsMap.get(task.parentid).name : null,
                name: task.name,
                areas: Array.from(tags.areas),
                contexts: Array.from(tags.contexts),
                tags: Array.from(tags.tags),
                state: functions.StatesLabels[task.state],
                completed: false,
                focus: task.seqt !== '0'
            };
        });

const tasksCsvWriter = createCsvWriter({
    path: './out/tasks.csv',
    header: [
        {id: 'project', title: 'Project'},
        {id: 'name', title: 'Name'},
        {id: 'areas', title: 'Areas'},
        {id: 'contexts', title: 'Contexts'},
        {id: 'tags', title: 'Tags'},
        {id: 'state', title: 'State'},
        {id: 'completed', title: 'Completed'},
        {id: 'focus', title: 'Focus'}
    ]
});

console.log('Writing out/tasks.csv...');

tasksCsvWriter.writeRecords(tasks)
    .then(() => {
        console.log('...Done');
    });
