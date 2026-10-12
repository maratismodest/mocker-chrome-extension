// Fake chrome.storage for rendering the real popup outside the extension.
// The scene is chosen with ?scene=N in the popup URL.
(() => {
    const users = [
        {id: 1, name: 'John Doe', role: 'admin'},
        {id: 2, name: 'Jane Smith', role: 'editor'},
        {id: 3, name: 'Jane Austen', role: 'viewer'}
    ];
    const scenes = {
        1: {
            data: {
                isEnabled: true,
                'GET:/api/products': [{id: 1, name: 'Widget', price: 9.99}],
                'POST:/api/orders': {id: 1042, status: 'created'}
            },
            form: {method: 'GET', endpoint: '/api/users', response: JSON.stringify(users, null, 2)},
            click: 'Set Item'
        },
        2: {
            data: {isEnabled: true, 'GET:/api/users': users},
            form: {method: 'GET', endpoint: '/api/users', response: JSON.stringify(users, null, 2)}
        },
        3: {
            data: {
                isEnabled: true,
                'GET:/api/users': users,
                'GET:/api/users/*': {id: 42, name: 'Any user', role: 'viewer'},
                'POST:/api/orders': {id: 1042, status: 'created'},
                disabledMocks: ['POST:/api/orders']
            },
            editingKey: 'GET:/api/users/*',
            form: {method: 'GET', endpoint: '/api/users/*', response: '{\n  "id": 42,\n  "name": "Any user",\n  "role": "viewer"\n}'}
        }
    };
    const scene = scenes[new URLSearchParams(location.search).get('scene')] || scenes[1];
    const data = structuredClone(scene.data);

    localStorage.setItem('editingKey', JSON.stringify(scene.editingKey ?? null));
    for (const [key, value] of Object.entries(scene.form)) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    const listeners = [];
    const notify = () => listeners.forEach(listener => listener({}, 'local'));
    const pick = keys => {
        if (keys == null) return {...data};
        const list = typeof keys === 'string' ? [keys] : Array.isArray(keys) ? keys : Object.keys(keys);
        return Object.fromEntries(list.filter(k => k in data).map(k => [k, data[k]]));
    };

    window.chrome = {
        storage: {
            local: {
                get: async keys => pick(keys),
                set: async items => { Object.assign(data, items); notify(); },
                remove: async key => { delete data[key]; notify(); },
                clear: async () => { Object.keys(data).forEach(k => delete data[k]); notify(); }
            },
            onChanged: {
                addListener: listener => listeners.push(listener),
                removeListener: () => {}
            }
        }
    };

    // No transitions, so the screenshot never catches the toggle mid-animation
    document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = '*, *::after, *::before { transition: none !important; }';
        document.head.append(style);
    });

    if (scene.click) {
        window.addEventListener('load', () => setTimeout(() => {
            [...document.querySelectorAll('button')].find(b => b.textContent === scene.click)?.click();
        }, 300));
    }
})();
