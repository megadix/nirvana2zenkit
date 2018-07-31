const _ = require('lodash');
const expect = require('chai').expect;

const functions = require('./functions');

describe('functions.js', function () {

    describe('processTags()', function () {

        function checkResults(expected, result) {
            expect(expected.areas.length).to.equal(result.areas.size);
            expect(expected.contexts.length).to.equal(result.contexts.size);
            expect(expected.tags.length).to.equal(result.tags.size);

            if (expected.areas.length > 0) {
                expect(result.areas, 'areas').to.have.all.keys(expected.areas);
            }
            if (expected.contexts.length > 0) {
                expect(result.contexts, 'contexts').to.have.all.keys(expected.contexts);
            }

            if (expected.tags.length > 0) {
                expect(result.tags, 'tags').to.have.all.keys(expected.tags);
            }
        }

        it('null', function () {
            let result = functions.processTags(null);
            let expected = {areas: [], contexts: [], tags: []};
            checkResults(expected, result);
        });
        it('undefined', function () {
            let result = functions.processTags(undefined);
            let expected = {areas: [], contexts: [], tags: []};
            checkResults(expected, result);
        });

        it('empty', function () {
            let result = functions.processTags('');
            let expected = {areas: [], contexts: [], tags: []};
            checkResults(expected, result);
        });
        it('whitespace 1', function () {
            let result = functions.processTags(' ');
            let expected = {areas: [], contexts: [], tags: []};
            checkResults(expected, result);
        });
        it('whitespace 2', function () {
            let result = functions.processTags(' \t ');
            let expected = {areas: [], contexts: [], tags: []};
            checkResults(expected, result);
        });
        it('whitespace 3', function () {
            let result = functions.processTags('\n');
            let expected = {areas: [], contexts: [], tags: []};
            checkResults(expected, result);
        });

        it('real case 1', function () {
            let result = functions.processTags('*Music,FabbricaDellUomo,musica,spartiti,testi\n');
            let expected = {
                areas: ['Music'],
                contexts: [],
                tags: ['FabbricaDellUomo', 'musica', 'spartiti', 'testi']
            };
            checkResults(expected, result);
        });

        it('real case 2', function () {
            let result = functions.processTags('*Music,FabbricaDellUomo,musica,spartiti,testi\n');
            let expected = {
                areas: ['Music'],
                contexts: [],
                tags: ['FabbricaDellUomo', 'musica', 'spartiti', 'testi']
            };
            checkResults(expected, result);
        });

        it('real case 3 - keep area (*) and context (@) modifiers', function () {
            let result = functions.processTags(',*Work-Personal,@Computer,hosting,hugo,jfcm,opensource,web,', true);
            let expected = {
                areas: ['*Work-Personal'],
                contexts: ['@Computer'],
                tags: ['hosting', 'hugo', 'jfcm', 'opensource', 'web']
            };
            checkResults(expected, result);
        });

        it('real case 4 - remove modifiers', function () {
            let result = functions.processTags('*Music,@In giro,chitarra,gear');
            let expected = {
                areas: ['Music'],
                contexts: ['In giro'],
                tags: ['chitarra', 'gear']
            };
            checkResults(expected, result);
        });

    });

    describe('filterItems()', function () {
        const data = [
            {id: 'project-completed', type: functions.Type.PROJECT, completed: "1487323195"},
            {id: 'project-trashed', type: functions.Type.PROJECT, completed: "0", state: functions.States.TRASH},
            {
                id: 'project-logbook',
                type: functions.Type.PROJECT,
                completed: "0",
                state: functions.States.LOGBOOK
            },
            {id: 'project-ok', type: functions.Type.PROJECT, completed: "0", state: functions.States.ACTIVE},

            {id: 'task-completed', type: functions.Type.TASK, completed: "1487323195"},
            {id: 'task-trashed', type: functions.Type.TASK, completed: "1487323195", state: functions.States.TRASH},
            {id: 'task-ok', type: functions.Type.TASK, completed: "0", state: functions.States.NEXT},
        ];

        describe('filter projects, not completed, no trash, no logbook', function () {

            it('default params', function () {
                const filtered = functions.filterItems(data, functions.Type.PROJECT);
                expect(filtered.length).to.equal(1);
                expect(filtered[0].id === 'project-ok');
            });

            it('explicit params', function () {
                const filtered = functions.filterItems(data, functions.Type.PROJECT, false, false, false);
                expect(filtered.length).to.equal(1);
                expect(filtered[0].id === 'project-ok');
            });
        });

        it('filter projects, completed, trash', function () {
            const filtered = functions.filterItems(data, functions.Type.PROJECT, true, true);
            expect(filtered.length).to.equals(3);
            expect(checkIds(filtered, new Set(['project-completed', 'project-trashed', 'project-ok'])));
        });

        it('filter projects, not completed, logbook', function () {
            const filtered = functions.filterItems(data, functions.Type.PROJECT, false, false, true);
            expect(filtered.length).to.equals(2);
            expect(checkIds(filtered, new Set(['project-logbook', 'project-ok'])));
        });

        it('tasks, not completed, no trash, no logbook', function () {
            const filtered = functions.filterItems(data, functions.Type.TASK);
            expect(filtered.length).to.equal(1);
            expect(filtered[0].id === 'task-ok');
        });

        it('tasks, completed, no trash, no logbook', function () {
            const filtered = functions.filterItems(data, functions.Type.TASK, true);
            expect(filtered.length).to.equal(2);
            expect(checkIds(filtered, new Set(['task-completed', 'project-ok'])));
        });

        it('tasks, completed, trash', function () {
            const filtered = functions.filterItems(data, functions.Type.TASK, true, true);
            expect(filtered.length).to.equal(3);
            expect(checkIds(filtered, new Set(['task-completed', 'task-trashed', 'task-ok'])));
        });
    });
});

function checkIds(data, ids) {
    return _(data)
        .map('id')
        .every(id => ids.has(id));
}
