const _ = require('lodash');

module.exports.processTags = processTags;
module.exports.filterItems = filterItems;

/**
 * @enum {string}
 */
const Type = {
    TASK: '0',
    PROJECT: '1'
};

/**
 * @enum {string}
 */
const States = {
    NEXT: '1',
    WAITING: '2',
    SOMEDAY: '4',
    TRASH: '6',
    LOGBOOK: '7',
    ACTIVE: '11'
};

/**
 * @enum {string}
 */
const StatesLabels = {
    [States.NEXT]: 'Next',
    [States.WAITING]: 'Waiting',
    [States.SOMEDAY]: 'Someday',
    [States.TRASH]: 'Trash',
    [States.LOGBOOK]: 'Logbook',
    [States.ACTIVE]: 'Active',
};

module.exports.Type = Type;
module.exports.States = States;
module.exports.StatesLabels = StatesLabels;

/**
 *
 * @param {String} input
 * @param {boolean} [keepModifiers]
 * @returns {{areas: Set<String>, contexts: Set<String>, tags: Set<String>}}
 */
function processTags(input, keepModifiers) {
    const result = {
        areas: new Set(),
        contexts: new Set(),
        tags: new Set()
    };

    if (input && input.trim().length > 0) {
        const groups = _(input)
            .split(',')
            .map(tag => tag.trim())
            .groupBy(tag => {
                if (tag.startsWith('*')) {
                    return 'areas';
                } else if (tag.startsWith('@')) {
                    return 'contexts';
                } else {
                    return 'tags';
                }
            })
            .toPairs()
            .map(pair => {
                let group = pair[0];
                let tags = _(pair[1])
                    .filter(tag => !!tag)
                    .map(tag => {
                        if (!keepModifiers && (tag.startsWith('*') || tag.startsWith('@'))) {
                            return tag.substring(1);
                        }
                        return tag;
                    });

                return [group, tags];
            })
            .fromPairs()
            .value();

        if (groups.areas) {
            groups.areas.forEach(area => result.areas.add(area));
        }
        if (groups.contexts) {
            groups.contexts.forEach(area => result.contexts.add(area));
        }
        if (groups.tags) {
            groups.tags.forEach(area => result.tags.add(area));
        }
    }

    return result;
}

/**
 *
 * @param {Array<any>} data
 * @param {Type} type
 * @param {boolean} [includeCompleted]
 * @param {boolean} [includeTrash]
 * @param {boolean} [includeLogbook]
 *
 * @returns {Array<any>}
 */
function filterItems(data, type, includeCompleted = false, includeTrash = false, includeLogbook = false) {
    return _(data)
        .filter(task => {
            if (task.type !== type) {
                return false;
            }
            if (!includeCompleted && (task.completed && task.completed !== '0')) {
                return false;
            }
            if (!includeLogbook && task.state === States.LOGBOOK) {
                return false;
            }
            if (!includeTrash && task.state === States.TRASH) {
                return false;
            }
            return true;
        })
        .value();
}
