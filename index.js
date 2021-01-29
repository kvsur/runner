class Emit {
    constructor() {
        this.events = {};
    }

    on(eventName, handler) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(handler);
    }

    emit(eventName, ...args) {
        const handles = this.events[eventName];
        handles.forEach(handle => handles(...args));
    }
}

const emiter = new Emit();

const tasks = [
    {
        task: _ => _,
        after: false,
        duration: 2
    },
    {
        task: _ => _,
        after: true,
        duration: 2
    },
    {
        task: _ => _,
        after: false,
        duration: 20
    },
    {
        task: _ => _,
        after: true,
        duration: 2
    },
    {
        task: _ => _,
        after: true,
        duration: 2
    }
];

const initialTask = () => Promise.resolve();

const compose = (list = []) => {
    if (!list.length) return initialTask;
    return list.reduce((pre, item, index) => {
        const { task, after, duration } = item;

        return () => new Promise((resolve, reject) => {
            emiter.on('over' + index, resolve); // 收到事件提前结束

            const runner = () => {
                setTimeout(() => {
                    resolve();
                    console.log('task' + index + 'end');
                }, duration * 1000);
                console.log('task' + index + 'start');
                task();
            };

            if (after) {
                pre().then(() => {
                    runner();
                })
            } else {
                pre();
                runner();
            }
        });
    }, initialTask);
}

const start = compose(tasks);

start();
