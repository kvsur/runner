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
        task: () => console.log(1),
        after: false,
        duration: 2
    },
    {
        task: () => console.log(2),
        after: true,
        duration: 2
    },
    {
        task: () => console.log(3),
        after: false,
        duration: 20
    },
    {
        task: () => console.log(4),
        after: true,
        duration: 2
    },
    {
        task: () => console.log(5),
        after: true,
        duration: 2
    }
];

const initialTask = () => Promise.resolve();

const compose = (list = []) => {
    if (!list.length) return _ => _;
    return list.reduceRight((pre, item, index) => {
        const { task, after, duration } = item;

        return () => new Promise((resolve, reject) => {
            emiter.on('over' + index, resolve); // 收到事件提前结束

            const runner = () => {
                setTimeout(resolve, duration * 1000);
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
