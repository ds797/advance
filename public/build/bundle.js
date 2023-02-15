
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$2() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$2;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$2;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop$2;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop$2;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop$2, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$2, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$2, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$2, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$2,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$2;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$2) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$2) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$2;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$2;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$2;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.49.0 */

    function create_fragment$B(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$B.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.49.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$6, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$A.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.49.0 */
    const file$x = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$z(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$x, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$z.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Go.svelte generated by Svelte v3.49.0 */
    const file$w = "src/Go.svelte";

    // (6:1) <Link to="/tasks">
    function create_default_slot$3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Go";
    			add_location(button, file$w, 6, 2, 89);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(6:1) <Link to=\\\"/tasks\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let main;
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/tasks",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(link.$$.fragment);
    			add_location(main, file$w, 4, 0, 60);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(link, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Go', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Go> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class Go extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Go",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    /* src/components/Home.svelte generated by Svelte v3.49.0 */
    const file$v = "src/components/Home.svelte";

    function create_fragment$x(ctx) {
    	let main;
    	let div;
    	let h1;
    	let t1;
    	let go;
    	let t2;
    	let p;
    	let current;
    	go = new Go({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Tasks";
    			t1 = space();
    			create_component(go.$$.fragment);
    			t2 = space();
    			p = element("p");
    			p.textContent = "Just clicked the magic link? There's currently a bug where once you click \"Go\", you'll be back at the login page. To fix this, just click \"Go\" and then reload the page. A solution is being implemented!";
    			add_location(h1, file$v, 6, 2, 68);
    			attr_dev(div, "class", "svelte-xowzl1");
    			add_location(div, file$v, 5, 1, 60);
    			attr_dev(p, "class", "svelte-xowzl1");
    			add_location(p, file$v, 9, 1, 101);
    			attr_dev(main, "class", "svelte-xowzl1");
    			add_location(main, file$v, 4, 0, 52);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			mount_component(go, div, null);
    			append_dev(main, t2);
    			append_dev(main, p);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(go.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(go.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(go);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Go });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    const version$6 = '1.35.3';

    // constants.ts
    const DEFAULT_HEADERS$4 = { 'X-Client-Info': `supabase-js/${version$6}` };
    const STORAGE_KEY$1 = 'supabase.auth.token';

    // helpers.ts
    function stripTrailingSlash(url) {
        return url.replace(/\/$/, '');
    }
    const isBrowser$1 = () => typeof window !== 'undefined';

    // generated by genversion
    const version$5 = '1.22.16';

    const GOTRUE_URL = 'http://localhost:9999';
    const DEFAULT_HEADERS$3 = { 'X-Client-Info': `gotrue-js/${version$5}` };
    const EXPIRY_MARGIN = 10; // in seconds
    const NETWORK_FAILURE = {
        ERROR_MESSAGE: 'Request Failed',
        MAX_RETRIES: 10,
        RETRY_INTERVAL: 2, // in deciseconds
    };
    const STORAGE_KEY = 'supabase.auth.token';
    const COOKIE_OPTIONS = {
        name: 'sb',
        lifetime: 60 * 60 * 8,
        domain: '',
        path: '/',
        sameSite: 'lax',
    };

    var __awaiter$a = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const _getErrorMessage$1 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    const handleError$1 = (error, reject) => {
        if (!(error === null || error === void 0 ? void 0 : error.status)) {
            return reject({ message: NETWORK_FAILURE.ERROR_MESSAGE });
        }
        if (typeof error.json !== 'function') {
            return reject(error);
        }
        error.json().then((err) => {
            return reject({
                message: _getErrorMessage$1(err),
                status: (error === null || error === void 0 ? void 0 : error.status) || 500,
            });
        });
    };
    const _getRequestParams$1 = (method, options, body) => {
        const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
        if (method === 'GET') {
            return params;
        }
        params.headers = Object.assign({ 'Content-Type': 'text/plain;charset=UTF-8' }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
        return params;
    };
    function _handleRequest$1(fetcher, method, url, options, body) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fetcher(url, _getRequestParams$1(method, options, body))
                    .then((result) => {
                    if (!result.ok)
                        throw result;
                    if (options === null || options === void 0 ? void 0 : options.noResolveJson)
                        return resolve;
                    return result.json();
                })
                    .then((data) => resolve(data))
                    .catch((error) => handleError$1(error, reject));
            });
        });
    }
    function get$1(fetcher, url, options) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return _handleRequest$1(fetcher, 'GET', url, options);
        });
    }
    function post$1(fetcher, url, body, options) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return _handleRequest$1(fetcher, 'POST', url, options, body);
        });
    }
    function put$1(fetcher, url, body, options) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return _handleRequest$1(fetcher, 'PUT', url, options, body);
        });
    }
    function remove$2(fetcher, url, body, options) {
        return __awaiter$a(this, void 0, void 0, function* () {
            return _handleRequest$1(fetcher, 'DELETE', url, options, body);
        });
    }

    /**
     * Serialize data into a cookie header.
     */
    function serialize(name, val, options) {
        const opt = options || {};
        const enc = encodeURIComponent;
        /* eslint-disable-next-line no-control-regex */
        const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        if (typeof enc !== 'function') {
            throw new TypeError('option encode is invalid');
        }
        if (!fieldContentRegExp.test(name)) {
            throw new TypeError('argument name is invalid');
        }
        const value = enc(val);
        if (value && !fieldContentRegExp.test(value)) {
            throw new TypeError('argument val is invalid');
        }
        let str = name + '=' + value;
        if (null != opt.maxAge) {
            const maxAge = opt.maxAge - 0;
            if (isNaN(maxAge) || !isFinite(maxAge)) {
                throw new TypeError('option maxAge is invalid');
            }
            str += '; Max-Age=' + Math.floor(maxAge);
        }
        if (opt.domain) {
            if (!fieldContentRegExp.test(opt.domain)) {
                throw new TypeError('option domain is invalid');
            }
            str += '; Domain=' + opt.domain;
        }
        if (opt.path) {
            if (!fieldContentRegExp.test(opt.path)) {
                throw new TypeError('option path is invalid');
            }
            str += '; Path=' + opt.path;
        }
        if (opt.expires) {
            if (typeof opt.expires.toUTCString !== 'function') {
                throw new TypeError('option expires is invalid');
            }
            str += '; Expires=' + opt.expires.toUTCString();
        }
        if (opt.httpOnly) {
            str += '; HttpOnly';
        }
        if (opt.secure) {
            str += '; Secure';
        }
        if (opt.sameSite) {
            const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;
            switch (sameSite) {
                case 'lax':
                    str += '; SameSite=Lax';
                    break;
                case 'strict':
                    str += '; SameSite=Strict';
                    break;
                case 'none':
                    str += '; SameSite=None';
                    break;
                default:
                    throw new TypeError('option sameSite is invalid');
            }
        }
        return str;
    }
    /**
     * Based on the environment and the request we know if a secure cookie can be set.
     */
    function isSecureEnvironment(req) {
        if (!req || !req.headers || !req.headers.host) {
            throw new Error('The "host" request header is not available');
        }
        const host = (req.headers.host.indexOf(':') > -1 && req.headers.host.split(':')[0]) || req.headers.host;
        if (['localhost', '127.0.0.1'].indexOf(host) > -1 || host.endsWith('.local')) {
            return false;
        }
        return true;
    }
    /**
     * Serialize a cookie to a string.
     */
    function serializeCookie(cookie, secure) {
        var _a, _b, _c;
        return serialize(cookie.name, cookie.value, {
            maxAge: cookie.maxAge,
            expires: new Date(Date.now() + cookie.maxAge * 1000),
            httpOnly: true,
            secure,
            path: (_a = cookie.path) !== null && _a !== void 0 ? _a : '/',
            domain: (_b = cookie.domain) !== null && _b !== void 0 ? _b : '',
            sameSite: (_c = cookie.sameSite) !== null && _c !== void 0 ? _c : 'lax',
        });
    }
    /**
     * Get Cookie Header strings.
     */
    function getCookieString(req, res, cookies) {
        const strCookies = cookies.map((c) => serializeCookie(c, isSecureEnvironment(req)));
        const previousCookies = res.getHeader('Set-Cookie');
        if (previousCookies) {
            if (previousCookies instanceof Array) {
                Array.prototype.push.apply(strCookies, previousCookies);
            }
            else if (typeof previousCookies === 'string') {
                strCookies.push(previousCookies);
            }
        }
        return strCookies;
    }
    /**
     * Set one or more cookies.
     */
    function setCookies(req, res, cookies) {
        res.setHeader('Set-Cookie', getCookieString(req, res, cookies));
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var browserPonyfill = createCommonjsModule(function (module, exports) {
    var global = typeof self !== 'undefined' ? self : commonjsGlobal;
    var __self__ = (function () {
    function F() {
    this.fetch = false;
    this.DOMException = global.DOMException;
    }
    F.prototype = global;
    return new F();
    })();
    (function(self) {

    ((function (exports) {

      var support = {
        searchParams: 'URLSearchParams' in self,
        iterable: 'Symbol' in self && 'iterator' in Symbol,
        blob:
          'FileReader' in self &&
          'Blob' in self &&
          (function() {
            try {
              new Blob();
              return true
            } catch (e) {
              return false
            }
          })(),
        formData: 'FormData' in self,
        arrayBuffer: 'ArrayBuffer' in self
      };

      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
      }

      if (support.arrayBuffer) {
        var viewClasses = [
          '[object Int8Array]',
          '[object Uint8Array]',
          '[object Uint8ClampedArray]',
          '[object Int16Array]',
          '[object Uint16Array]',
          '[object Int32Array]',
          '[object Uint32Array]',
          '[object Float32Array]',
          '[object Float64Array]'
        ];

        var isArrayBufferView =
          ArrayBuffer.isView ||
          function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
          };
      }

      function normalizeName(name) {
        if (typeof name !== 'string') {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
      }

      function normalizeValue(value) {
        if (typeof value !== 'string') {
          value = String(value);
        }
        return value
      }

      // Build a destructive iterator for the value list
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return {done: value === undefined, value: value}
          }
        };

        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator
          };
        }

        return iterator
      }

      function Headers(headers) {
        this.map = {};

        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }

      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ', ' + value : value;
      };

      Headers.prototype['delete'] = function(name) {
        delete this.map[normalizeName(name)];
      };

      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null
      };

      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name))
      };

      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };

      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };

      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items)
      };

      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items)
      };

      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items)
      };

      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }

      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true;
      }

      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        })
      }

      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise
      }

      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise
      }

      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);

        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join('')
      }

      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0)
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer
        }
      }

      function Body() {
        this.bodyUsed = false;

        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = '';
          } else if (typeof body === 'string') {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            // IE 10-11 can't handle a DataView body.
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }

          if (!this.headers.get('content-type')) {
            if (typeof body === 'string') {
              this.headers.set('content-type', 'text/plain;charset=UTF-8');
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set('content-type', this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
          }
        };

        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected
            }

            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob)
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]))
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as blob')
            } else {
              return Promise.resolve(new Blob([this._bodyText]))
            }
          };

          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
            } else {
              return this.blob().then(readBlobAsArrayBuffer)
            }
          };
        }

        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected
          }

          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text')
          } else {
            return Promise.resolve(this._bodyText)
          }
        };

        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode)
          };
        }

        this.json = function() {
          return this.text().then(JSON.parse)
        };

        return this
      }

      // HTTP methods whose capitalization should be normalized
      var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method
      }

      function Request(input, options) {
        options = options || {};
        var body = options.body;

        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError('Already read')
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }

        this.credentials = options.credentials || this.credentials || 'same-origin';
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || 'GET');
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
          throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body);
      }

      Request.prototype.clone = function() {
        return new Request(this, {body: this._bodyInit})
      };

      function decode(body) {
        var form = new FormData();
        body
          .trim()
          .split('&')
          .forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split('=');
              var name = split.shift().replace(/\+/g, ' ');
              var value = split.join('=').replace(/\+/g, ' ');
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
        return form
      }

      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(':');
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(':').trim();
            headers.append(key, value);
          }
        });
        return headers
      }

      Body.call(Request.prototype);

      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }

        this.type = 'default';
        this.status = options.status === undefined ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = 'statusText' in options ? options.statusText : 'OK';
        this.headers = new Headers(options.headers);
        this.url = options.url || '';
        this._initBody(bodyInit);
      }

      Body.call(Response.prototype);

      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        })
      };

      Response.error = function() {
        var response = new Response(null, {status: 0, statusText: ''});
        response.type = 'error';
        return response
      };

      var redirectStatuses = [301, 302, 303, 307, 308];

      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError('Invalid status code')
        }

        return new Response(null, {status: status, headers: {location: url}})
      };

      exports.DOMException = self.DOMException;
      try {
        new exports.DOMException();
      } catch (err) {
        exports.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports.DOMException.prototype = Object.create(Error.prototype);
        exports.DOMException.prototype.constructor = exports.DOMException;
      }

      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);

          if (request.signal && request.signal.aborted) {
            return reject(new exports.DOMException('Aborted', 'AbortError'))
          }

          var xhr = new XMLHttpRequest();

          function abortXhr() {
            xhr.abort();
          }

          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || '')
            };
            options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
            var body = 'response' in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };

          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.ontimeout = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.onabort = function() {
            reject(new exports.DOMException('Aborted', 'AbortError'));
          };

          xhr.open(request.method, request.url, true);

          if (request.credentials === 'include') {
            xhr.withCredentials = true;
          } else if (request.credentials === 'omit') {
            xhr.withCredentials = false;
          }

          if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob';
          }

          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });

          if (request.signal) {
            request.signal.addEventListener('abort', abortXhr);

            xhr.onreadystatechange = function() {
              // DONE (success or failure)
              if (xhr.readyState === 4) {
                request.signal.removeEventListener('abort', abortXhr);
              }
            };
          }

          xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
        })
      }

      fetch.polyfill = true;

      if (!self.fetch) {
        self.fetch = fetch;
        self.Headers = Headers;
        self.Request = Request;
        self.Response = Response;
      }

      exports.Headers = Headers;
      exports.Request = Request;
      exports.Response = Response;
      exports.fetch = fetch;

      Object.defineProperty(exports, '__esModule', { value: true });

      return exports;

    }))({});
    })(__self__);
    __self__.fetch.ponyfill = true;
    // Remove "polyfill" property added by whatwg-fetch
    delete __self__.fetch.polyfill;
    // Choose between native implementation (global) or custom implementation (__self__)
    // var ctx = global.fetch ? global : __self__;
    var ctx = __self__; // this line disable service worker support temporarily
    exports = ctx.fetch; // To enable: import fetch from 'cross-fetch'
    exports.default = ctx.fetch; // For TypeScript consumers without esModuleInterop.
    exports.fetch = ctx.fetch; // To enable: import {fetch} from 'cross-fetch'
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
    });

    var crossFetch = /*@__PURE__*/getDefaultExportFromCjs(browserPonyfill);

    var __awaiter$9 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    function expiresAt(expiresIn) {
        const timeNow = Math.round(Date.now() / 1000);
        return timeNow + expiresIn;
    }
    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    const isBrowser = () => typeof window !== 'undefined';
    function getParameterByName(name, url) {
        var _a;
        if (!url)
            url = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) || '';
        // eslint-disable-next-line no-useless-escape
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    const resolveFetch$2 = (customFetch) => {
        let _fetch;
        if (customFetch) {
            _fetch = customFetch;
        }
        else if (typeof fetch === 'undefined') {
            _fetch = crossFetch;
        }
        else {
            _fetch = fetch;
        }
        return (...args) => _fetch(...args);
    };
    // LocalStorage helpers
    const setItemAsync = (storage, key, data) => __awaiter$9(void 0, void 0, void 0, function* () {
        isBrowser() && (yield (storage === null || storage === void 0 ? void 0 : storage.setItem(key, JSON.stringify(data))));
    });
    const getItemAsync = (storage, key) => __awaiter$9(void 0, void 0, void 0, function* () {
        const value = isBrowser() && (yield (storage === null || storage === void 0 ? void 0 : storage.getItem(key)));
        if (!value)
            return null;
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return value;
        }
    });
    const getItemSynchronously = (storage, key) => {
        const value = isBrowser() && (storage === null || storage === void 0 ? void 0 : storage.getItem(key));
        if (!value || typeof value !== 'string') {
            return null;
        }
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return value;
        }
    };
    const removeItemAsync = (storage, key) => __awaiter$9(void 0, void 0, void 0, function* () {
        isBrowser() && (yield (storage === null || storage === void 0 ? void 0 : storage.removeItem(key)));
    });

    var __awaiter$8 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class GoTrueApi {
        constructor({ url = '', headers = {}, cookieOptions, fetch, }) {
            this.url = url;
            this.headers = headers;
            this.cookieOptions = Object.assign(Object.assign({}, COOKIE_OPTIONS), cookieOptions);
            this.fetch = resolveFetch$2(fetch);
        }
        /**
         * Create a temporary object with all configured headers and
         * adds the Authorization token to be used on request methods
         * @param jwt A valid, logged-in JWT.
         */
        _createRequestHeaders(jwt) {
            const headers = Object.assign({}, this.headers);
            headers['Authorization'] = `Bearer ${jwt}`;
            return headers;
        }
        cookieName() {
            var _a;
            return (_a = this.cookieOptions.name) !== null && _a !== void 0 ? _a : '';
        }
        /**
         * Generates the relevant login URL for a third-party provider.
         * @param provider One of the providers supported by GoTrue.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         * @param scopes A space-separated list of scopes granted to the OAuth application.
         */
        getUrlForProvider(provider, options) {
            const urlParams = [`provider=${encodeURIComponent(provider)}`];
            if (options === null || options === void 0 ? void 0 : options.redirectTo) {
                urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
            }
            if (options === null || options === void 0 ? void 0 : options.scopes) {
                urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
            }
            if (options === null || options === void 0 ? void 0 : options.queryParams) {
                const query = new URLSearchParams(options.queryParams);
                urlParams.push(`${query}`);
            }
            return `${this.url}/authorize?${urlParams.join('&')}`;
        }
        /**
         * Creates a new user using their email address.
         * @param email The email address of the user.
         * @param password The password of the user.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         * @param data Optional user metadata.
         *
         * @returns A logged-in session if the server has "autoconfirm" ON
         * @returns A user if the server has "autoconfirm" OFF
         */
        signUpWithEmail(email, password, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '';
                    if (options.redirectTo) {
                        queryString = '?redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const data = yield post$1(this.fetch, `${this.url}/signup${queryString}`, {
                        email,
                        password,
                        data: options.data,
                        gotrue_meta_security: { hcaptcha_token: options.captchaToken },
                    }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Logs in an existing user using their email address.
         * @param email The email address of the user.
         * @param password The password of the user.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        signInWithEmail(email, password, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '?grant_type=password';
                    if (options.redirectTo) {
                        queryString += '&redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const data = yield post$1(this.fetch, `${this.url}/token${queryString}`, { email, password }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Signs up a new user using their phone number and a password.
         * @param phone The phone number of the user.
         * @param password The password of the user.
         * @param data Optional user metadata.
         */
        signUpWithPhone(phone, password, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const data = yield post$1(this.fetch, `${this.url}/signup`, {
                        phone,
                        password,
                        data: options.data,
                        gotrue_meta_security: { hcaptcha_token: options.captchaToken },
                    }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Logs in an existing user using their phone number and password.
         * @param phone The phone number of the user.
         * @param password The password of the user.
         */
        signInWithPhone(phone, password) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const queryString = '?grant_type=password';
                    const data = yield post$1(this.fetch, `${this.url}/token${queryString}`, { phone, password }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Logs in an OpenID Connect user using their id_token.
         * @param id_token The IDToken of the user.
         * @param nonce The nonce of the user. The nonce is a random value generated by the developer (= yourself) before the initial grant is started. You should check the OpenID Connect specification for details. https://openid.net/developers/specs/
         * @param provider The provider of the user.
         * @param client_id The clientID of the user.
         * @param issuer The issuer of the user.
         */
        signInWithOpenIDConnect({ id_token, nonce, client_id, issuer, provider, }) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const queryString = '?grant_type=id_token';
                    const data = yield post$1(this.fetch, `${this.url}/token${queryString}`, { id_token, nonce, client_id, issuer, provider }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Sends a magic login link to an email address.
         * @param email The email address of the user.
         * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        sendMagicLinkEmail(email, options = {}) {
            var _a;
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '';
                    if (options.redirectTo) {
                        queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const shouldCreateUser = (_a = options.shouldCreateUser) !== null && _a !== void 0 ? _a : true;
                    const data = yield post$1(this.fetch, `${this.url}/otp${queryString}`, {
                        email,
                        create_user: shouldCreateUser,
                        gotrue_meta_security: { hcaptcha_token: options.captchaToken },
                    }, { headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Sends a mobile OTP via SMS. Will register the account if it doesn't already exist
         * @param phone The user's phone number WITH international prefix
         * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
         */
        sendMobileOTP(phone, options = {}) {
            var _a;
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const shouldCreateUser = (_a = options.shouldCreateUser) !== null && _a !== void 0 ? _a : true;
                    const headers = Object.assign({}, this.headers);
                    const data = yield post$1(this.fetch, `${this.url}/otp`, {
                        phone,
                        create_user: shouldCreateUser,
                        gotrue_meta_security: { hcaptcha_token: options.captchaToken },
                    }, { headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Removes a logged-in session.
         * @param jwt A valid, logged-in JWT.
         */
        signOut(jwt) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    yield post$1(this.fetch, `${this.url}/logout`, {}, { headers: this._createRequestHeaders(jwt), noResolveJson: true });
                    return { error: null };
                }
                catch (e) {
                    return { error: e };
                }
            });
        }
        /**
         * @deprecated Use `verifyOTP` instead!
         * @param phone The user's phone number WITH international prefix
         * @param token token that user was sent to their mobile phone
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        verifyMobileOTP(phone, token, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const data = yield post$1(this.fetch, `${this.url}/verify`, { phone, token, type: 'sms', redirect_to: options.redirectTo }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Send User supplied Email / Mobile OTP to be verified
         * @param email The user's email address
         * @param phone The user's phone number WITH international prefix
         * @param token token that user was sent to their mobile phone
         * @param type verification type that the otp is generated for
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        verifyOTP({ email, phone, token, type = 'sms' }, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    const data = yield post$1(this.fetch, `${this.url}/verify`, { email, phone, token, type, redirect_to: options.redirectTo }, { headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Sends an invite link to an email address.
         * @param email The email address of the user.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         * @param data Optional user metadata
         */
        inviteUserByEmail(email, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '';
                    if (options.redirectTo) {
                        queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const data = yield post$1(this.fetch, `${this.url}/invite${queryString}`, { email, data: options.data }, { headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Sends a reset request to an email address.
         * @param email The email address of the user.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        resetPasswordForEmail(email, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const headers = Object.assign({}, this.headers);
                    let queryString = '';
                    if (options.redirectTo) {
                        queryString += '?redirect_to=' + encodeURIComponent(options.redirectTo);
                    }
                    const data = yield post$1(this.fetch, `${this.url}/recover${queryString}`, { email, gotrue_meta_security: { hcaptcha_token: options.captchaToken } }, { headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Generates a new JWT.
         * @param refreshToken A valid refresh token that was returned on login.
         */
        refreshAccessToken(refreshToken) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield post$1(this.fetch, `${this.url}/token?grant_type=refresh_token`, { refresh_token: refreshToken }, { headers: this.headers });
                    const session = Object.assign({}, data);
                    if (session.expires_in)
                        session.expires_at = expiresAt(data.expires_in);
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Set/delete the auth cookie based on the AuthChangeEvent.
         * Works for Next.js & Express (requires cookie-parser middleware).
         * @param req The request object.
         * @param res The response object.
         */
        setAuthCookie(req, res) {
            if (req.method !== 'POST') {
                res.setHeader('Allow', 'POST');
                res.status(405).end('Method Not Allowed');
            }
            const { event, session } = req.body;
            if (!event)
                throw new Error('Auth event missing!');
            if (event === 'SIGNED_IN') {
                if (!session)
                    throw new Error('Auth session missing!');
                setCookies(req, res, [
                    { key: 'access-token', value: session.access_token },
                    { key: 'refresh-token', value: session.refresh_token },
                ].map((token) => {
                    var _a;
                    return ({
                        name: `${this.cookieName()}-${token.key}`,
                        value: token.value,
                        domain: this.cookieOptions.domain,
                        maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
                        path: this.cookieOptions.path,
                        sameSite: this.cookieOptions.sameSite,
                    });
                }));
            }
            if (event === 'SIGNED_OUT') {
                setCookies(req, res, ['access-token', 'refresh-token'].map((key) => ({
                    name: `${this.cookieName()}-${key}`,
                    value: '',
                    maxAge: -1,
                })));
            }
            res.status(200).json({});
        }
        /**
         * Deletes the Auth Cookies and redirects to the
         * @param req The request object.
         * @param res The response object.
         * @param options Optionally specify a `redirectTo` URL in the options.
         */
        deleteAuthCookie(req, res, { redirectTo = '/' }) {
            setCookies(req, res, ['access-token', 'refresh-token'].map((key) => ({
                name: `${this.cookieName()}-${key}`,
                value: '',
                maxAge: -1,
            })));
            return res.redirect(307, redirectTo);
        }
        /**
         * Helper method to generate the Auth Cookie string for you in case you can't use `setAuthCookie`.
         * @param req The request object.
         * @param res The response object.
         * @returns The Cookie string that needs to be set as the value for the `Set-Cookie` header.
         */
        getAuthCookieString(req, res) {
            if (req.method !== 'POST') {
                res.setHeader('Allow', 'POST');
                res.status(405).end('Method Not Allowed');
            }
            const { event, session } = req.body;
            if (!event)
                throw new Error('Auth event missing!');
            if (event === 'SIGNED_IN') {
                if (!session)
                    throw new Error('Auth session missing!');
                return getCookieString(req, res, [
                    { key: 'access-token', value: session.access_token },
                    { key: 'refresh-token', value: session.refresh_token },
                ].map((token) => {
                    var _a;
                    return ({
                        name: `${this.cookieName()}-${token.key}`,
                        value: token.value,
                        domain: this.cookieOptions.domain,
                        maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
                        path: this.cookieOptions.path,
                        sameSite: this.cookieOptions.sameSite,
                    });
                }));
            }
            if (event === 'SIGNED_OUT') {
                return getCookieString(req, res, ['access-token', 'refresh-token'].map((key) => ({
                    name: `${this.cookieName()}-${key}`,
                    value: '',
                    maxAge: -1,
                })));
            }
            return res.getHeader('Set-Cookie');
        }
        /**
         * Generates links to be sent via email or other.
         * @param type The link type ("signup" or "magiclink" or "recovery" or "invite").
         * @param email The user's email.
         * @param password User password. For signup only.
         * @param data Optional user metadata. For signup only.
         * @param redirectTo The link type ("signup" or "magiclink" or "recovery" or "invite").
         */
        generateLink(type, email, options = {}) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield post$1(this.fetch, `${this.url}/admin/generate_link`, {
                        type,
                        email,
                        password: options.password,
                        data: options.data,
                        redirect_to: options.redirectTo,
                    }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        // User Admin API
        /**
         * Creates a new user.
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         *
         * @param attributes The data you want to create the user with.
         */
        createUser(attributes) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield post$1(this.fetch, `${this.url}/admin/users`, attributes, {
                        headers: this.headers,
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
        /**
         * Get a list of users.
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         */
        listUsers() {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield get$1(this.fetch, `${this.url}/admin/users`, {
                        headers: this.headers,
                    });
                    return { data: data.users, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Get user by id.
         *
         * @param uid The user's unique identifier
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         */
        getUserById(uid) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield get$1(this.fetch, `${this.url}/admin/users/${uid}`, {
                        headers: this.headers,
                    });
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Get user by reading the cookie from the request.
         * Works for Next.js & Express (requires cookie-parser middleware).
         */
        getUserByCookie(req, res) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    if (!req.cookies) {
                        throw new Error('Not able to parse cookies! When using Express make sure the cookie-parser middleware is in use!');
                    }
                    const access_token = req.cookies[`${this.cookieName()}-access-token`];
                    const refresh_token = req.cookies[`${this.cookieName()}-refresh-token`];
                    if (!access_token) {
                        throw new Error('No cookie found!');
                    }
                    const { user, error: getUserError } = yield this.getUser(access_token);
                    if (getUserError) {
                        if (!refresh_token)
                            throw new Error('No refresh_token cookie found!');
                        if (!res)
                            throw new Error('You need to pass the res object to automatically refresh the session!');
                        const { data, error } = yield this.refreshAccessToken(refresh_token);
                        if (error) {
                            throw error;
                        }
                        else if (data) {
                            setCookies(req, res, [
                                { key: 'access-token', value: data.access_token },
                                { key: 'refresh-token', value: data.refresh_token },
                            ].map((token) => {
                                var _a;
                                return ({
                                    name: `${this.cookieName()}-${token.key}`,
                                    value: token.value,
                                    domain: this.cookieOptions.domain,
                                    maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
                                    path: this.cookieOptions.path,
                                    sameSite: this.cookieOptions.sameSite,
                                });
                            }));
                            return { token: data.access_token, user: data.user, data: data.user, error: null };
                        }
                    }
                    return { token: access_token, user: user, data: user, error: null };
                }
                catch (e) {
                    return { token: null, user: null, data: null, error: e };
                }
            });
        }
        /**
         * Updates the user data.
         *
         * @param attributes The data you want to update.
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         */
        updateUserById(uid, attributes) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    this; //
                    const data = yield put$1(this.fetch, `${this.url}/admin/users/${uid}`, attributes, {
                        headers: this.headers,
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
        /**
         * Delete a user. Requires a `service_role` key.
         *
         * This function should only be called on a server. Never expose your `service_role` key in the browser.
         *
         * @param uid The user uid you want to remove.
         */
        deleteUser(uid) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield remove$2(this.fetch, `${this.url}/admin/users/${uid}`, {}, {
                        headers: this.headers,
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
        /**
         * Gets the current user details.
         *
         * This method is called by the GoTrueClient `update` where
         * the jwt is set to this.currentSession.access_token
         * and therefore, acts like getting the currently authenticated used
         *
         * @param jwt A valid, logged-in JWT. Typically, the access_token for the currentSession
         */
        getUser(jwt) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield get$1(this.fetch, `${this.url}/user`, {
                        headers: this._createRequestHeaders(jwt),
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
        /**
         * Updates the user data.
         * @param jwt A valid, logged-in JWT.
         * @param attributes The data you want to update.
         */
        updateUser(jwt, attributes) {
            return __awaiter$8(this, void 0, void 0, function* () {
                try {
                    const data = yield put$1(this.fetch, `${this.url}/user`, attributes, {
                        headers: this._createRequestHeaders(jwt),
                    });
                    return { user: data, data, error: null };
                }
                catch (e) {
                    return { user: null, data: null, error: e };
                }
            });
        }
    }

    /**
     * https://mathiasbynens.be/notes/globalthis
     */
    function polyfillGlobalThis() {
        if (typeof globalThis === 'object')
            return;
        try {
            Object.defineProperty(Object.prototype, '__magic__', {
                get: function () {
                    return this;
                },
                configurable: true,
            });
            // @ts-expect-error 'Allow access to magic'
            __magic__.globalThis = __magic__;
            // @ts-expect-error 'Allow access to magic'
            delete Object.prototype.__magic__;
        }
        catch (e) {
            if (typeof self !== 'undefined') {
                // @ts-expect-error 'Allow access to globals'
                self.globalThis = self;
            }
        }
    }

    var __awaiter$7 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    polyfillGlobalThis(); // Make "globalThis" available
    const DEFAULT_OPTIONS$1 = {
        url: GOTRUE_URL,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        multiTab: true,
        headers: DEFAULT_HEADERS$3,
    };
    class GoTrueClient {
        /**
         * Create a new client for use in the browser.
         * @param options.url The URL of the GoTrue server.
         * @param options.headers Any additional headers to send to the GoTrue server.
         * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
         * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
         * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
         * @param options.localStorage Provide your own local storage implementation to use instead of the browser's local storage.
         * @param options.multiTab Set to "false" if you want to disable multi-tab/window events.
         * @param options.cookieOptions
         * @param options.fetch A custom fetch implementation.
         */
        constructor(options) {
            this.stateChangeEmitters = new Map();
            this.networkRetries = 0;
            const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS$1), options);
            this.currentUser = null;
            this.currentSession = null;
            this.autoRefreshToken = settings.autoRefreshToken;
            this.persistSession = settings.persistSession;
            this.multiTab = settings.multiTab;
            this.localStorage = settings.localStorage || globalThis.localStorage;
            this.api = new GoTrueApi({
                url: settings.url,
                headers: settings.headers,
                cookieOptions: settings.cookieOptions,
                fetch: settings.fetch,
            });
            this._recoverSession();
            this._recoverAndRefresh();
            this._listenForMultiTabEvents();
            this._handleVisibilityChange();
            if (settings.detectSessionInUrl && isBrowser() && !!getParameterByName('access_token')) {
                // Handle the OAuth redirect
                this.getSessionFromUrl({ storeSession: true }).then(({ error }) => {
                    if (error) {
                        console.error('Error getting session from URL.', error);
                    }
                });
            }
        }
        /**
         * Creates a new user.
         * @type UserCredentials
         * @param email The user's email address.
         * @param password The user's password.
         * @param phone The user's phone number.
         * @param redirectTo The redirect URL attached to the signup confirmation link. Does not redirect the user if it's a mobile signup.
         * @param data Optional user metadata.
         */
        signUp({ email, password, phone }, options = {}) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    this._removeSession();
                    const { data, error } = phone && password
                        ? yield this.api.signUpWithPhone(phone, password, {
                            data: options.data,
                            captchaToken: options.captchaToken,
                        })
                        : yield this.api.signUpWithEmail(email, password, {
                            redirectTo: options.redirectTo,
                            data: options.data,
                            captchaToken: options.captchaToken,
                        });
                    if (error) {
                        throw error;
                    }
                    if (!data) {
                        throw 'An error occurred on sign up.';
                    }
                    let session = null;
                    let user = null;
                    if (data.access_token) {
                        session = data;
                        user = session.user;
                        this._saveSession(session);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                    if (data.id) {
                        user = data;
                    }
                    return { user, session, error: null };
                }
                catch (e) {
                    return { user: null, session: null, error: e };
                }
            });
        }
        /**
         * Log in an existing user, or login via a third-party provider.
         * @type UserCredentials
         * @param email The user's email address.
         * @param phone The user's phone number.
         * @param password The user's password.
         * @param refreshToken A valid refresh token that was returned on login.
         * @param provider One of the providers supported by GoTrue.
         * @param redirectTo A URL to send the user to after they are confirmed (OAuth logins only).
         * @param shouldCreateUser A boolean flag to indicate whether to automatically create a user on magiclink / otp sign-ins if the user doesn't exist. Defaults to true.
         * @param scopes A space-separated list of scopes granted to the OAuth application.
         */
        signIn({ email, phone, password, refreshToken, provider, oidc }, options = {}) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    this._removeSession();
                    if (email && !password) {
                        const { error } = yield this.api.sendMagicLinkEmail(email, {
                            redirectTo: options.redirectTo,
                            shouldCreateUser: options.shouldCreateUser,
                            captchaToken: options.captchaToken,
                        });
                        return { user: null, session: null, error };
                    }
                    if (email && password) {
                        return this._handleEmailSignIn(email, password, {
                            redirectTo: options.redirectTo,
                        });
                    }
                    if (phone && !password) {
                        const { error } = yield this.api.sendMobileOTP(phone, {
                            shouldCreateUser: options.shouldCreateUser,
                            captchaToken: options.captchaToken,
                        });
                        return { user: null, session: null, error };
                    }
                    if (phone && password) {
                        return this._handlePhoneSignIn(phone, password);
                    }
                    if (refreshToken) {
                        // currentSession and currentUser will be updated to latest on _callRefreshToken using the passed refreshToken
                        const { error } = yield this._callRefreshToken(refreshToken);
                        if (error)
                            throw error;
                        return {
                            user: this.currentUser,
                            session: this.currentSession,
                            error: null,
                        };
                    }
                    if (provider) {
                        return this._handleProviderSignIn(provider, {
                            redirectTo: options.redirectTo,
                            scopes: options.scopes,
                            queryParams: options.queryParams,
                        });
                    }
                    if (oidc) {
                        return this._handleOpenIDConnectSignIn(oidc);
                    }
                    throw new Error(`You must provide either an email, phone number, a third-party provider or OpenID Connect.`);
                }
                catch (e) {
                    return { user: null, session: null, error: e };
                }
            });
        }
        /**
         * Log in a user given a User supplied OTP received via mobile.
         * @param email The user's email address.
         * @param phone The user's phone number.
         * @param token The user's password.
         * @param type The user's verification type.
         * @param redirectTo A URL or mobile address to send the user to after they are confirmed.
         */
        verifyOTP(params, options = {}) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    this._removeSession();
                    const { data, error } = yield this.api.verifyOTP(params, options);
                    if (error) {
                        throw error;
                    }
                    if (!data) {
                        throw 'An error occurred on token verification.';
                    }
                    let session = null;
                    let user = null;
                    if (data.access_token) {
                        session = data;
                        user = session.user;
                        this._saveSession(session);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                    if (data.id) {
                        user = data;
                    }
                    return { user, session, error: null };
                }
                catch (e) {
                    return { user: null, session: null, error: e };
                }
            });
        }
        /**
         * Inside a browser context, `user()` will return the user data, if there is a logged in user.
         *
         * For server-side management, you can get a user through `auth.api.getUserByCookie()`
         */
        user() {
            return this.currentUser;
        }
        /**
         * Returns the session data, if there is an active session.
         */
        session() {
            return this.currentSession;
        }
        /**
         * Force refreshes the session including the user data in case it was updated in a different session.
         */
        refreshSession() {
            var _a;
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
                        throw new Error('Not logged in.');
                    // currentSession and currentUser will be updated to latest on _callRefreshToken
                    const { error } = yield this._callRefreshToken();
                    if (error)
                        throw error;
                    return { data: this.currentSession, user: this.currentUser, error: null };
                }
                catch (e) {
                    return { data: null, user: null, error: e };
                }
            });
        }
        /**
         * Updates user data, if there is a logged in user.
         */
        update(attributes) {
            var _a;
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
                        throw new Error('Not logged in.');
                    const { user, error } = yield this.api.updateUser(this.currentSession.access_token, attributes);
                    if (error)
                        throw error;
                    if (!user)
                        throw Error('Invalid user data.');
                    const session = Object.assign(Object.assign({}, this.currentSession), { user });
                    this._saveSession(session);
                    this._notifyAllSubscribers('USER_UPDATED');
                    return { data: user, user, error: null };
                }
                catch (e) {
                    return { data: null, user: null, error: e };
                }
            });
        }
        /**
         * Sets the session data from refresh_token and returns current Session and Error
         * @param refresh_token a JWT token
         */
        setSession(refresh_token) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!refresh_token) {
                        throw new Error('No current session.');
                    }
                    const { data, error } = yield this.api.refreshAccessToken(refresh_token);
                    if (error) {
                        return { session: null, error: error };
                    }
                    this._saveSession(data);
                    this._notifyAllSubscribers('SIGNED_IN');
                    return { session: data, error: null };
                }
                catch (e) {
                    return { error: e, session: null };
                }
            });
        }
        /**
         * Overrides the JWT on the current client. The JWT will then be sent in all subsequent network requests.
         * @param access_token a jwt access token
         */
        setAuth(access_token) {
            this.currentSession = Object.assign(Object.assign({}, this.currentSession), { access_token, token_type: 'bearer', user: this.user() });
            this._notifyAllSubscribers('TOKEN_REFRESHED');
            return this.currentSession;
        }
        /**
         * Gets the session data from a URL string
         * @param options.storeSession Optionally store the session in the browser
         */
        getSessionFromUrl(options) {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!isBrowser())
                        throw new Error('No browser detected.');
                    const error_description = getParameterByName('error_description');
                    if (error_description)
                        throw new Error(error_description);
                    const provider_token = getParameterByName('provider_token');
                    const access_token = getParameterByName('access_token');
                    if (!access_token)
                        throw new Error('No access_token detected.');
                    const expires_in = getParameterByName('expires_in');
                    if (!expires_in)
                        throw new Error('No expires_in detected.');
                    const refresh_token = getParameterByName('refresh_token');
                    if (!refresh_token)
                        throw new Error('No refresh_token detected.');
                    const token_type = getParameterByName('token_type');
                    if (!token_type)
                        throw new Error('No token_type detected.');
                    const timeNow = Math.round(Date.now() / 1000);
                    const expires_at = timeNow + parseInt(expires_in);
                    const { user, error } = yield this.api.getUser(access_token);
                    if (error)
                        throw error;
                    const session = {
                        provider_token,
                        access_token,
                        expires_in: parseInt(expires_in),
                        expires_at,
                        refresh_token,
                        token_type,
                        user: user,
                    };
                    if (options === null || options === void 0 ? void 0 : options.storeSession) {
                        this._saveSession(session);
                        const recoveryMode = getParameterByName('type');
                        this._notifyAllSubscribers('SIGNED_IN');
                        if (recoveryMode === 'recovery') {
                            this._notifyAllSubscribers('PASSWORD_RECOVERY');
                        }
                    }
                    // Remove tokens from URL
                    window.location.hash = '';
                    return { data: session, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        /**
         * Inside a browser context, `signOut()` will remove the logged in user from the browser session
         * and log them out - removing all items from localstorage and then trigger a "SIGNED_OUT" event.
         *
         * For server-side management, you can disable sessions by passing a JWT through to `auth.api.signOut(JWT: string)`
         */
        signOut() {
            var _a;
            return __awaiter$7(this, void 0, void 0, function* () {
                const accessToken = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token;
                this._removeSession();
                this._notifyAllSubscribers('SIGNED_OUT');
                if (accessToken) {
                    const { error } = yield this.api.signOut(accessToken);
                    if (error)
                        return { error };
                }
                return { error: null };
            });
        }
        /**
         * Receive a notification every time an auth event happens.
         * @returns {Subscription} A subscription object which can be used to unsubscribe itself.
         */
        onAuthStateChange(callback) {
            try {
                const id = uuid();
                const subscription = {
                    id,
                    callback,
                    unsubscribe: () => {
                        this.stateChangeEmitters.delete(id);
                    },
                };
                this.stateChangeEmitters.set(id, subscription);
                return { data: subscription, error: null };
            }
            catch (e) {
                return { data: null, error: e };
            }
        }
        _handleEmailSignIn(email, password, options = {}) {
            var _a, _b;
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    const { data, error } = yield this.api.signInWithEmail(email, password, {
                        redirectTo: options.redirectTo,
                    });
                    if (error || !data)
                        return { data: null, user: null, session: null, error };
                    if (((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.confirmed_at) || ((_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.email_confirmed_at)) {
                        this._saveSession(data);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                    return { data, user: data.user, session: data, error: null };
                }
                catch (e) {
                    return { data: null, user: null, session: null, error: e };
                }
            });
        }
        _handlePhoneSignIn(phone, password) {
            var _a;
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    const { data, error } = yield this.api.signInWithPhone(phone, password);
                    if (error || !data)
                        return { data: null, user: null, session: null, error };
                    if ((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.phone_confirmed_at) {
                        this._saveSession(data);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                    return { data, user: data.user, session: data, error: null };
                }
                catch (e) {
                    return { data: null, user: null, session: null, error: e };
                }
            });
        }
        _handleProviderSignIn(provider, options = {}) {
            const url = this.api.getUrlForProvider(provider, {
                redirectTo: options.redirectTo,
                scopes: options.scopes,
                queryParams: options.queryParams,
            });
            try {
                // try to open on the browser
                if (isBrowser()) {
                    window.location.href = url;
                }
                return { provider, url, data: null, session: null, user: null, error: null };
            }
            catch (e) {
                // fallback to returning the URL
                if (url)
                    return { provider, url, data: null, session: null, user: null, error: null };
                return { data: null, user: null, session: null, error: e };
            }
        }
        _handleOpenIDConnectSignIn({ id_token, nonce, client_id, issuer, provider, }) {
            return __awaiter$7(this, void 0, void 0, function* () {
                if (id_token && nonce && ((client_id && issuer) || provider)) {
                    try {
                        const { data, error } = yield this.api.signInWithOpenIDConnect({
                            id_token,
                            nonce,
                            client_id,
                            issuer,
                            provider,
                        });
                        if (error || !data)
                            return { user: null, session: null, error };
                        this._saveSession(data);
                        this._notifyAllSubscribers('SIGNED_IN');
                        return { user: data.user, session: data, error: null };
                    }
                    catch (e) {
                        return { user: null, session: null, error: e };
                    }
                }
                throw new Error(`You must provide a OpenID Connect provider with your id token and nonce.`);
            });
        }
        /**
         * Attempts to get the session from LocalStorage
         * Note: this should never be async (even for React Native), as we need it to return immediately in the constructor.
         */
        _recoverSession() {
            try {
                const data = getItemSynchronously(this.localStorage, STORAGE_KEY);
                if (!data)
                    return null;
                const { currentSession, expiresAt } = data;
                const timeNow = Math.round(Date.now() / 1000);
                if (expiresAt >= timeNow + EXPIRY_MARGIN && (currentSession === null || currentSession === void 0 ? void 0 : currentSession.user)) {
                    this._saveSession(currentSession);
                    this._notifyAllSubscribers('SIGNED_IN');
                }
            }
            catch (error) {
                console.log('error', error);
            }
        }
        /**
         * Recovers the session from LocalStorage and refreshes
         * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
         */
        _recoverAndRefresh() {
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    const data = yield getItemAsync(this.localStorage, STORAGE_KEY);
                    if (!data)
                        return null;
                    const { currentSession, expiresAt } = data;
                    const timeNow = Math.round(Date.now() / 1000);
                    if (expiresAt < timeNow + EXPIRY_MARGIN) {
                        if (this.autoRefreshToken && currentSession.refresh_token) {
                            this.networkRetries++;
                            const { error } = yield this._callRefreshToken(currentSession.refresh_token);
                            if (error) {
                                console.log(error.message);
                                if (error.message === NETWORK_FAILURE.ERROR_MESSAGE &&
                                    this.networkRetries < NETWORK_FAILURE.MAX_RETRIES) {
                                    if (this.refreshTokenTimer)
                                        clearTimeout(this.refreshTokenTimer);
                                    this.refreshTokenTimer = setTimeout(() => this._recoverAndRefresh(), Math.pow(NETWORK_FAILURE.RETRY_INTERVAL, this.networkRetries) * 100 // exponential backoff
                                    );
                                    return;
                                }
                                yield this._removeSession();
                            }
                            this.networkRetries = 0;
                        }
                        else {
                            this._removeSession();
                        }
                    }
                    else if (!currentSession) {
                        console.log('Current session is missing data.');
                        this._removeSession();
                    }
                    else {
                        // should be handled on _recoverSession method already
                        // But we still need the code here to accommodate for AsyncStorage e.g. in React native
                        this._saveSession(currentSession);
                        this._notifyAllSubscribers('SIGNED_IN');
                    }
                }
                catch (err) {
                    console.error(err);
                    return null;
                }
            });
        }
        _callRefreshToken(refresh_token) {
            var _a;
            if (refresh_token === void 0) { refresh_token = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.refresh_token; }
            return __awaiter$7(this, void 0, void 0, function* () {
                try {
                    if (!refresh_token) {
                        throw new Error('No current session.');
                    }
                    const { data, error } = yield this.api.refreshAccessToken(refresh_token);
                    if (error)
                        throw error;
                    if (!data)
                        throw Error('Invalid session data.');
                    this._saveSession(data);
                    this._notifyAllSubscribers('TOKEN_REFRESHED');
                    this._notifyAllSubscribers('SIGNED_IN');
                    return { data, error: null };
                }
                catch (e) {
                    return { data: null, error: e };
                }
            });
        }
        _notifyAllSubscribers(event) {
            this.stateChangeEmitters.forEach((x) => x.callback(event, this.currentSession));
        }
        /**
         * set currentSession and currentUser
         * process to _startAutoRefreshToken if possible
         */
        _saveSession(session) {
            this.currentSession = session;
            this.currentUser = session.user;
            const expiresAt = session.expires_at;
            if (expiresAt) {
                const timeNow = Math.round(Date.now() / 1000);
                const expiresIn = expiresAt - timeNow;
                const refreshDurationBeforeExpires = expiresIn > EXPIRY_MARGIN ? EXPIRY_MARGIN : 0.5;
                this._startAutoRefreshToken((expiresIn - refreshDurationBeforeExpires) * 1000);
            }
            // Do we need any extra check before persist session
            // access_token or user ?
            if (this.persistSession && session.expires_at) {
                this._persistSession(this.currentSession);
            }
        }
        _persistSession(currentSession) {
            const data = { currentSession, expiresAt: currentSession.expires_at };
            setItemAsync(this.localStorage, STORAGE_KEY, data);
        }
        _removeSession() {
            return __awaiter$7(this, void 0, void 0, function* () {
                this.currentSession = null;
                this.currentUser = null;
                if (this.refreshTokenTimer)
                    clearTimeout(this.refreshTokenTimer);
                removeItemAsync(this.localStorage, STORAGE_KEY);
            });
        }
        /**
         * Clear and re-create refresh token timer
         * @param value time intervals in milliseconds
         */
        _startAutoRefreshToken(value) {
            if (this.refreshTokenTimer)
                clearTimeout(this.refreshTokenTimer);
            if (value <= 0 || !this.autoRefreshToken)
                return;
            this.refreshTokenTimer = setTimeout(() => __awaiter$7(this, void 0, void 0, function* () {
                this.networkRetries++;
                const { error } = yield this._callRefreshToken();
                if (!error)
                    this.networkRetries = 0;
                if ((error === null || error === void 0 ? void 0 : error.message) === NETWORK_FAILURE.ERROR_MESSAGE &&
                    this.networkRetries < NETWORK_FAILURE.MAX_RETRIES)
                    this._startAutoRefreshToken(Math.pow(NETWORK_FAILURE.RETRY_INTERVAL, this.networkRetries) * 100); // exponential backoff
            }), value);
            if (typeof this.refreshTokenTimer.unref === 'function')
                this.refreshTokenTimer.unref();
        }
        /**
         * Listens for changes to LocalStorage and updates the current session.
         */
        _listenForMultiTabEvents() {
            if (!this.multiTab || !isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
                return false;
            }
            try {
                window === null || window === void 0 ? void 0 : window.addEventListener('storage', (e) => {
                    var _a;
                    if (e.key === STORAGE_KEY) {
                        const newSession = JSON.parse(String(e.newValue));
                        if ((_a = newSession === null || newSession === void 0 ? void 0 : newSession.currentSession) === null || _a === void 0 ? void 0 : _a.access_token) {
                            this._saveSession(newSession.currentSession);
                            this._notifyAllSubscribers('SIGNED_IN');
                        }
                        else {
                            this._removeSession();
                            this._notifyAllSubscribers('SIGNED_OUT');
                        }
                    }
                });
            }
            catch (error) {
                console.error('_listenForMultiTabEvents', error);
            }
        }
        _handleVisibilityChange() {
            if (!this.multiTab || !isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
                return false;
            }
            try {
                window === null || window === void 0 ? void 0 : window.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') {
                        this._recoverAndRefresh();
                    }
                });
            }
            catch (error) {
                console.error('_handleVisibilityChange', error);
            }
        }
    }

    class SupabaseAuthClient extends GoTrueClient {
        constructor(options) {
            super(options);
        }
    }

    var __awaiter$6 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class PostgrestBuilder {
        constructor(builder) {
            Object.assign(this, builder);
            let _fetch;
            if (builder.fetch) {
                _fetch = builder.fetch;
            }
            else if (typeof fetch === 'undefined') {
                _fetch = crossFetch;
            }
            else {
                _fetch = fetch;
            }
            this.fetch = (...args) => _fetch(...args);
            this.shouldThrowOnError = builder.shouldThrowOnError || false;
            this.allowEmpty = builder.allowEmpty || false;
        }
        /**
         * If there's an error with the query, throwOnError will reject the promise by
         * throwing the error instead of returning it as part of a successful response.
         *
         * {@link https://github.com/supabase/supabase-js/issues/92}
         */
        throwOnError(throwOnError) {
            if (throwOnError === null || throwOnError === undefined) {
                throwOnError = true;
            }
            this.shouldThrowOnError = throwOnError;
            return this;
        }
        then(onfulfilled, onrejected) {
            // https://postgrest.org/en/stable/api.html#switching-schemas
            if (typeof this.schema === 'undefined') ;
            else if (['GET', 'HEAD'].includes(this.method)) {
                this.headers['Accept-Profile'] = this.schema;
            }
            else {
                this.headers['Content-Profile'] = this.schema;
            }
            if (this.method !== 'GET' && this.method !== 'HEAD') {
                this.headers['Content-Type'] = 'application/json';
            }
            let res = this.fetch(this.url.toString(), {
                method: this.method,
                headers: this.headers,
                body: JSON.stringify(this.body),
                signal: this.signal,
            }).then((res) => __awaiter$6(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                let error = null;
                let data = null;
                let count = null;
                let status = res.status;
                let statusText = res.statusText;
                if (res.ok) {
                    const isReturnMinimal = (_a = this.headers['Prefer']) === null || _a === void 0 ? void 0 : _a.split(',').includes('return=minimal');
                    if (this.method !== 'HEAD' && !isReturnMinimal) {
                        const text = yield res.text();
                        if (!text) ;
                        else if (this.headers['Accept'] === 'text/csv') {
                            data = text;
                        }
                        else {
                            data = JSON.parse(text);
                        }
                    }
                    const countHeader = (_b = this.headers['Prefer']) === null || _b === void 0 ? void 0 : _b.match(/count=(exact|planned|estimated)/);
                    const contentRange = (_c = res.headers.get('content-range')) === null || _c === void 0 ? void 0 : _c.split('/');
                    if (countHeader && contentRange && contentRange.length > 1) {
                        count = parseInt(contentRange[1]);
                    }
                }
                else {
                    const body = yield res.text();
                    try {
                        error = JSON.parse(body);
                    }
                    catch (_e) {
                        error = {
                            message: body,
                        };
                    }
                    if (error && this.allowEmpty && ((_d = error === null || error === void 0 ? void 0 : error.details) === null || _d === void 0 ? void 0 : _d.includes('Results contain 0 rows'))) {
                        error = null;
                        status = 200;
                        statusText = 'OK';
                    }
                    if (error && this.shouldThrowOnError) {
                        throw error;
                    }
                }
                const postgrestResponse = {
                    error,
                    data,
                    count,
                    status,
                    statusText,
                    body: data,
                };
                return postgrestResponse;
            }));
            if (!this.shouldThrowOnError) {
                res = res.catch((fetchError) => ({
                    error: {
                        message: `FetchError: ${fetchError.message}`,
                        details: '',
                        hint: '',
                        code: fetchError.code || '',
                    },
                    data: null,
                    body: null,
                    count: null,
                    status: 400,
                    statusText: 'Bad Request',
                }));
            }
            return res.then(onfulfilled, onrejected);
        }
    }

    /**
     * Post-filters (transforms)
     */
    class PostgrestTransformBuilder extends PostgrestBuilder {
        /**
         * Performs vertical filtering with SELECT.
         *
         * @param columns  The columns to retrieve, separated by commas.
         */
        select(columns = '*') {
            // Remove whitespaces except when quoted
            let quoted = false;
            const cleanedColumns = columns
                .split('')
                .map((c) => {
                if (/\s/.test(c) && !quoted) {
                    return '';
                }
                if (c === '"') {
                    quoted = !quoted;
                }
                return c;
            })
                .join('');
            this.url.searchParams.set('select', cleanedColumns);
            return this;
        }
        /**
         * Orders the result with the specified `column`.
         *
         * @param column  The column to order on.
         * @param ascending  If `true`, the result will be in ascending order.
         * @param nullsFirst  If `true`, `null`s appear first.
         * @param foreignTable  The foreign table to use (if `column` is a foreign column).
         */
        order(column, { ascending = true, nullsFirst = false, foreignTable, } = {}) {
            const key = typeof foreignTable === 'undefined' ? 'order' : `${foreignTable}.order`;
            const existingOrder = this.url.searchParams.get(key);
            this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ''}${column}.${ascending ? 'asc' : 'desc'}.${nullsFirst ? 'nullsfirst' : 'nullslast'}`);
            return this;
        }
        /**
         * Limits the result with the specified `count`.
         *
         * @param count  The maximum no. of rows to limit to.
         * @param foreignTable  The foreign table to use (for foreign columns).
         */
        limit(count, { foreignTable } = {}) {
            const key = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`;
            this.url.searchParams.set(key, `${count}`);
            return this;
        }
        /**
         * Limits the result to rows within the specified range, inclusive.
         *
         * @param from  The starting index from which to limit the result, inclusive.
         * @param to  The last index to which to limit the result, inclusive.
         * @param foreignTable  The foreign table to use (for foreign columns).
         */
        range(from, to, { foreignTable } = {}) {
            const keyOffset = typeof foreignTable === 'undefined' ? 'offset' : `${foreignTable}.offset`;
            const keyLimit = typeof foreignTable === 'undefined' ? 'limit' : `${foreignTable}.limit`;
            this.url.searchParams.set(keyOffset, `${from}`);
            // Range is inclusive, so add 1
            this.url.searchParams.set(keyLimit, `${to - from + 1}`);
            return this;
        }
        /**
         * Sets the AbortSignal for the fetch request.
         */
        abortSignal(signal) {
            this.signal = signal;
            return this;
        }
        /**
         * Retrieves only one row from the result. Result must be one row (e.g. using
         * `limit`), otherwise this will result in an error.
         */
        single() {
            this.headers['Accept'] = 'application/vnd.pgrst.object+json';
            return this;
        }
        /**
         * Retrieves at most one row from the result. Result must be at most one row
         * (e.g. using `eq` on a UNIQUE column), otherwise this will result in an
         * error.
         */
        maybeSingle() {
            this.headers['Accept'] = 'application/vnd.pgrst.object+json';
            this.allowEmpty = true;
            return this;
        }
        /**
         * Set the response type to CSV.
         */
        csv() {
            this.headers['Accept'] = 'text/csv';
            return this;
        }
    }

    class PostgrestFilterBuilder extends PostgrestTransformBuilder {
        constructor() {
            super(...arguments);
            /** @deprecated Use `contains()` instead. */
            this.cs = this.contains;
            /** @deprecated Use `containedBy()` instead. */
            this.cd = this.containedBy;
            /** @deprecated Use `rangeLt()` instead. */
            this.sl = this.rangeLt;
            /** @deprecated Use `rangeGt()` instead. */
            this.sr = this.rangeGt;
            /** @deprecated Use `rangeGte()` instead. */
            this.nxl = this.rangeGte;
            /** @deprecated Use `rangeLte()` instead. */
            this.nxr = this.rangeLte;
            /** @deprecated Use `rangeAdjacent()` instead. */
            this.adj = this.rangeAdjacent;
            /** @deprecated Use `overlaps()` instead. */
            this.ov = this.overlaps;
        }
        /**
         * Finds all rows which doesn't satisfy the filter.
         *
         * @param column  The column to filter on.
         * @param operator  The operator to filter with.
         * @param value  The value to filter with.
         */
        not(column, operator, value) {
            this.url.searchParams.append(`${column}`, `not.${operator}.${value}`);
            return this;
        }
        /**
         * Finds all rows satisfying at least one of the filters.
         *
         * @param filters  The filters to use, separated by commas.
         * @param foreignTable  The foreign table to use (if `column` is a foreign column).
         */
        or(filters, { foreignTable } = {}) {
            const key = typeof foreignTable === 'undefined' ? 'or' : `${foreignTable}.or`;
            this.url.searchParams.append(key, `(${filters})`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` exactly matches the
         * specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        eq(column, value) {
            this.url.searchParams.append(`${column}`, `eq.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` doesn't match the
         * specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        neq(column, value) {
            this.url.searchParams.append(`${column}`, `neq.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is greater than the
         * specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        gt(column, value) {
            this.url.searchParams.append(`${column}`, `gt.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is greater than or
         * equal to the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        gte(column, value) {
            this.url.searchParams.append(`${column}`, `gte.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is less than the
         * specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        lt(column, value) {
            this.url.searchParams.append(`${column}`, `lt.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is less than or equal
         * to the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        lte(column, value) {
            this.url.searchParams.append(`${column}`, `lte.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value in the stated `column` matches the supplied
         * `pattern` (case sensitive).
         *
         * @param column  The column to filter on.
         * @param pattern  The pattern to filter with.
         */
        like(column, pattern) {
            this.url.searchParams.append(`${column}`, `like.${pattern}`);
            return this;
        }
        /**
         * Finds all rows whose value in the stated `column` matches the supplied
         * `pattern` (case insensitive).
         *
         * @param column  The column to filter on.
         * @param pattern  The pattern to filter with.
         */
        ilike(column, pattern) {
            this.url.searchParams.append(`${column}`, `ilike.${pattern}`);
            return this;
        }
        /**
         * A check for exact equality (null, true, false), finds all rows whose
         * value on the stated `column` exactly match the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        is(column, value) {
            this.url.searchParams.append(`${column}`, `is.${value}`);
            return this;
        }
        /**
         * Finds all rows whose value on the stated `column` is found on the
         * specified `values`.
         *
         * @param column  The column to filter on.
         * @param values  The values to filter with.
         */
        in(column, values) {
            const cleanedValues = values
                .map((s) => {
                // handle postgrest reserved characters
                // https://postgrest.org/en/v7.0.0/api.html#reserved-characters
                if (typeof s === 'string' && new RegExp('[,()]').test(s))
                    return `"${s}"`;
                else
                    return `${s}`;
            })
                .join(',');
            this.url.searchParams.append(`${column}`, `in.(${cleanedValues})`);
            return this;
        }
        /**
         * Finds all rows whose json, array, or range value on the stated `column`
         * contains the values specified in `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        contains(column, value) {
            if (typeof value === 'string') {
                // range types can be inclusive '[', ']' or exclusive '(', ')' so just
                // keep it simple and accept a string
                this.url.searchParams.append(`${column}`, `cs.${value}`);
            }
            else if (Array.isArray(value)) {
                // array
                this.url.searchParams.append(`${column}`, `cs.{${value.join(',')}}`);
            }
            else {
                // json
                this.url.searchParams.append(`${column}`, `cs.${JSON.stringify(value)}`);
            }
            return this;
        }
        /**
         * Finds all rows whose json, array, or range value on the stated `column` is
         * contained by the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        containedBy(column, value) {
            if (typeof value === 'string') {
                // range
                this.url.searchParams.append(`${column}`, `cd.${value}`);
            }
            else if (Array.isArray(value)) {
                // array
                this.url.searchParams.append(`${column}`, `cd.{${value.join(',')}}`);
            }
            else {
                // json
                this.url.searchParams.append(`${column}`, `cd.${JSON.stringify(value)}`);
            }
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` is strictly to the
         * left of the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeLt(column, range) {
            this.url.searchParams.append(`${column}`, `sl.${range}`);
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` is strictly to
         * the right of the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeGt(column, range) {
            this.url.searchParams.append(`${column}`, `sr.${range}`);
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` does not extend
         * to the left of the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeGte(column, range) {
            this.url.searchParams.append(`${column}`, `nxl.${range}`);
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` does not extend
         * to the right of the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeLte(column, range) {
            this.url.searchParams.append(`${column}`, `nxr.${range}`);
            return this;
        }
        /**
         * Finds all rows whose range value on the stated `column` is adjacent to
         * the specified `range`.
         *
         * @param column  The column to filter on.
         * @param range  The range to filter with.
         */
        rangeAdjacent(column, range) {
            this.url.searchParams.append(`${column}`, `adj.${range}`);
            return this;
        }
        /**
         * Finds all rows whose array or range value on the stated `column` overlaps
         * (has a value in common) with the specified `value`.
         *
         * @param column  The column to filter on.
         * @param value  The value to filter with.
         */
        overlaps(column, value) {
            if (typeof value === 'string') {
                // range
                this.url.searchParams.append(`${column}`, `ov.${value}`);
            }
            else {
                // array
                this.url.searchParams.append(`${column}`, `ov.{${value.join(',')}}`);
            }
            return this;
        }
        /**
         * Finds all rows whose text or tsvector value on the stated `column` matches
         * the tsquery in `query`.
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         * @param type  The type of tsquery conversion to use on `query`.
         */
        textSearch(column, query, { config, type = null, } = {}) {
            let typePart = '';
            if (type === 'plain') {
                typePart = 'pl';
            }
            else if (type === 'phrase') {
                typePart = 'ph';
            }
            else if (type === 'websearch') {
                typePart = 'w';
            }
            const configPart = config === undefined ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `${typePart}fts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose tsvector value on the stated `column` matches
         * to_tsquery(`query`).
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         *
         * @deprecated Use `textSearch()` instead.
         */
        fts(column, query, { config } = {}) {
            const configPart = typeof config === 'undefined' ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `fts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose tsvector value on the stated `column` matches
         * plainto_tsquery(`query`).
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         *
         * @deprecated Use `textSearch()` with `type: 'plain'` instead.
         */
        plfts(column, query, { config } = {}) {
            const configPart = typeof config === 'undefined' ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `plfts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose tsvector value on the stated `column` matches
         * phraseto_tsquery(`query`).
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         *
         * @deprecated Use `textSearch()` with `type: 'phrase'` instead.
         */
        phfts(column, query, { config } = {}) {
            const configPart = typeof config === 'undefined' ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `phfts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose tsvector value on the stated `column` matches
         * websearch_to_tsquery(`query`).
         *
         * @param column  The column to filter on.
         * @param query  The Postgres tsquery string to filter with.
         * @param config  The text search configuration to use.
         *
         * @deprecated Use `textSearch()` with `type: 'websearch'` instead.
         */
        wfts(column, query, { config } = {}) {
            const configPart = typeof config === 'undefined' ? '' : `(${config})`;
            this.url.searchParams.append(`${column}`, `wfts${configPart}.${query}`);
            return this;
        }
        /**
         * Finds all rows whose `column` satisfies the filter.
         *
         * @param column  The column to filter on.
         * @param operator  The operator to filter with.
         * @param value  The value to filter with.
         */
        filter(column, operator, value) {
            this.url.searchParams.append(`${column}`, `${operator}.${value}`);
            return this;
        }
        /**
         * Finds all rows whose columns match the specified `query` object.
         *
         * @param query  The object to filter with, with column names as keys mapped
         *               to their filter values.
         */
        match(query) {
            Object.keys(query).forEach((key) => {
                this.url.searchParams.append(`${key}`, `eq.${query[key]}`);
            });
            return this;
        }
    }

    class PostgrestQueryBuilder extends PostgrestBuilder {
        constructor(url, { headers = {}, schema, fetch, shouldThrowOnError, } = {}) {
            super({ fetch, shouldThrowOnError });
            this.url = new URL(url);
            this.headers = Object.assign({}, headers);
            this.schema = schema;
        }
        /**
         * Performs vertical filtering with SELECT.
         *
         * @param columns  The columns to retrieve, separated by commas.
         * @param head  When set to true, select will void data.
         * @param count  Count algorithm to use to count rows in a table.
         */
        select(columns = '*', { head = false, count = null, } = {}) {
            this.method = 'GET';
            // Remove whitespaces except when quoted
            let quoted = false;
            const cleanedColumns = columns
                .split('')
                .map((c) => {
                if (/\s/.test(c) && !quoted) {
                    return '';
                }
                if (c === '"') {
                    quoted = !quoted;
                }
                return c;
            })
                .join('');
            this.url.searchParams.set('select', cleanedColumns);
            if (count) {
                this.headers['Prefer'] = `count=${count}`;
            }
            if (head) {
                this.method = 'HEAD';
            }
            return new PostgrestFilterBuilder(this);
        }
        insert(values, { upsert = false, onConflict, returning = 'representation', count = null, } = {}) {
            this.method = 'POST';
            const prefersHeaders = [`return=${returning}`];
            if (upsert)
                prefersHeaders.push('resolution=merge-duplicates');
            if (upsert && onConflict !== undefined)
                this.url.searchParams.set('on_conflict', onConflict);
            this.body = values;
            if (count) {
                prefersHeaders.push(`count=${count}`);
            }
            if (this.headers['Prefer']) {
                prefersHeaders.unshift(this.headers['Prefer']);
            }
            this.headers['Prefer'] = prefersHeaders.join(',');
            if (Array.isArray(values)) {
                const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
                if (columns.length > 0) {
                    const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
                    this.url.searchParams.set('columns', uniqueColumns.join(','));
                }
            }
            return new PostgrestFilterBuilder(this);
        }
        /**
         * Performs an UPSERT into the table.
         *
         * @param values  The values to insert.
         * @param onConflict  By specifying the `on_conflict` query parameter, you can make UPSERT work on a column(s) that has a UNIQUE constraint.
         * @param returning  By default the new record is returned. Set this to 'minimal' if you don't need this value.
         * @param count  Count algorithm to use to count rows in a table.
         * @param ignoreDuplicates  Specifies if duplicate rows should be ignored and not inserted.
         */
        upsert(values, { onConflict, returning = 'representation', count = null, ignoreDuplicates = false, } = {}) {
            this.method = 'POST';
            const prefersHeaders = [
                `resolution=${ignoreDuplicates ? 'ignore' : 'merge'}-duplicates`,
                `return=${returning}`,
            ];
            if (onConflict !== undefined)
                this.url.searchParams.set('on_conflict', onConflict);
            this.body = values;
            if (count) {
                prefersHeaders.push(`count=${count}`);
            }
            if (this.headers['Prefer']) {
                prefersHeaders.unshift(this.headers['Prefer']);
            }
            this.headers['Prefer'] = prefersHeaders.join(',');
            return new PostgrestFilterBuilder(this);
        }
        /**
         * Performs an UPDATE on the table.
         *
         * @param values  The values to update.
         * @param returning  By default the updated record is returned. Set this to 'minimal' if you don't need this value.
         * @param count  Count algorithm to use to count rows in a table.
         */
        update(values, { returning = 'representation', count = null, } = {}) {
            this.method = 'PATCH';
            const prefersHeaders = [`return=${returning}`];
            this.body = values;
            if (count) {
                prefersHeaders.push(`count=${count}`);
            }
            if (this.headers['Prefer']) {
                prefersHeaders.unshift(this.headers['Prefer']);
            }
            this.headers['Prefer'] = prefersHeaders.join(',');
            return new PostgrestFilterBuilder(this);
        }
        /**
         * Performs a DELETE on the table.
         *
         * @param returning  If `true`, return the deleted row(s) in the response.
         * @param count  Count algorithm to use to count rows in a table.
         */
        delete({ returning = 'representation', count = null, } = {}) {
            this.method = 'DELETE';
            const prefersHeaders = [`return=${returning}`];
            if (count) {
                prefersHeaders.push(`count=${count}`);
            }
            if (this.headers['Prefer']) {
                prefersHeaders.unshift(this.headers['Prefer']);
            }
            this.headers['Prefer'] = prefersHeaders.join(',');
            return new PostgrestFilterBuilder(this);
        }
    }

    class PostgrestRpcBuilder extends PostgrestBuilder {
        constructor(url, { headers = {}, schema, fetch, shouldThrowOnError, } = {}) {
            super({ fetch, shouldThrowOnError });
            this.url = new URL(url);
            this.headers = Object.assign({}, headers);
            this.schema = schema;
        }
        /**
         * Perform a function call.
         */
        rpc(params, { head = false, count = null, } = {}) {
            if (head) {
                this.method = 'HEAD';
                if (params) {
                    Object.entries(params).forEach(([name, value]) => {
                        this.url.searchParams.append(name, value);
                    });
                }
            }
            else {
                this.method = 'POST';
                this.body = params;
            }
            if (count) {
                if (this.headers['Prefer'] !== undefined)
                    this.headers['Prefer'] += `,count=${count}`;
                else
                    this.headers['Prefer'] = `count=${count}`;
            }
            return new PostgrestFilterBuilder(this);
        }
    }

    // generated by genversion
    const version$4 = '0.37.3';

    const DEFAULT_HEADERS$2 = { 'X-Client-Info': `postgrest-js/${version$4}` };

    class PostgrestClient {
        /**
         * Creates a PostgREST client.
         *
         * @param url  URL of the PostgREST endpoint.
         * @param headers  Custom headers.
         * @param schema  Postgres schema to switch to.
         */
        constructor(url, { headers = {}, schema, fetch, throwOnError, } = {}) {
            this.url = url;
            this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS$2), headers);
            this.schema = schema;
            this.fetch = fetch;
            this.shouldThrowOnError = throwOnError;
        }
        /**
         * Authenticates the request with JWT.
         *
         * @param token  The JWT token to use.
         */
        auth(token) {
            this.headers['Authorization'] = `Bearer ${token}`;
            return this;
        }
        /**
         * Perform a table operation.
         *
         * @param table  The table name to operate on.
         */
        from(table) {
            const url = `${this.url}/${table}`;
            return new PostgrestQueryBuilder(url, {
                headers: this.headers,
                schema: this.schema,
                fetch: this.fetch,
                shouldThrowOnError: this.shouldThrowOnError,
            });
        }
        /**
         * Perform a function call.
         *
         * @param fn  The function name to call.
         * @param params  The parameters to pass to the function call.
         * @param head  When set to true, no data will be returned.
         * @param count  Count algorithm to use to count rows in a table.
         */
        rpc(fn, params, { head = false, count = null, } = {}) {
            const url = `${this.url}/rpc/${fn}`;
            return new PostgrestRpcBuilder(url, {
                headers: this.headers,
                schema: this.schema,
                fetch: this.fetch,
                shouldThrowOnError: this.shouldThrowOnError,
            }).rpc(params, { head, count });
        }
    }

    /**
     * Helpers to convert the change Payload into native JS types.
     */
    // Adapted from epgsql (src/epgsql_binary.erl), this module licensed under
    // 3-clause BSD found here: https://raw.githubusercontent.com/epgsql/epgsql/devel/LICENSE
    var PostgresTypes;
    (function (PostgresTypes) {
        PostgresTypes["abstime"] = "abstime";
        PostgresTypes["bool"] = "bool";
        PostgresTypes["date"] = "date";
        PostgresTypes["daterange"] = "daterange";
        PostgresTypes["float4"] = "float4";
        PostgresTypes["float8"] = "float8";
        PostgresTypes["int2"] = "int2";
        PostgresTypes["int4"] = "int4";
        PostgresTypes["int4range"] = "int4range";
        PostgresTypes["int8"] = "int8";
        PostgresTypes["int8range"] = "int8range";
        PostgresTypes["json"] = "json";
        PostgresTypes["jsonb"] = "jsonb";
        PostgresTypes["money"] = "money";
        PostgresTypes["numeric"] = "numeric";
        PostgresTypes["oid"] = "oid";
        PostgresTypes["reltime"] = "reltime";
        PostgresTypes["text"] = "text";
        PostgresTypes["time"] = "time";
        PostgresTypes["timestamp"] = "timestamp";
        PostgresTypes["timestamptz"] = "timestamptz";
        PostgresTypes["timetz"] = "timetz";
        PostgresTypes["tsrange"] = "tsrange";
        PostgresTypes["tstzrange"] = "tstzrange";
    })(PostgresTypes || (PostgresTypes = {}));
    /**
     * Takes an array of columns and an object of string values then converts each string value
     * to its mapped type.
     *
     * @param {{name: String, type: String}[]} columns
     * @param {Object} record
     * @param {Object} options The map of various options that can be applied to the mapper
     * @param {Array} options.skipTypes The array of types that should not be converted
     *
     * @example convertChangeData([{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age:'33'}, {})
     * //=>{ first_name: 'Paul', age: 33 }
     */
    const convertChangeData = (columns, record, options = {}) => {
        var _a;
        const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
        return Object.keys(record).reduce((acc, rec_key) => {
            acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
            return acc;
        }, {});
    };
    /**
     * Converts the value of an individual column.
     *
     * @param {String} columnName The column that you want to convert
     * @param {{name: String, type: String}[]} columns All of the columns
     * @param {Object} record The map of string values
     * @param {Array} skipTypes An array of types that should not be converted
     * @return {object} Useless information
     *
     * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, [])
     * //=> 33
     * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, ['int4'])
     * //=> "33"
     */
    const convertColumn = (columnName, columns, record, skipTypes) => {
        const column = columns.find((x) => x.name === columnName);
        const colType = column === null || column === void 0 ? void 0 : column.type;
        const value = record[columnName];
        if (colType && !skipTypes.includes(colType)) {
            return convertCell(colType, value);
        }
        return noop$1(value);
    };
    /**
     * If the value of the cell is `null`, returns null.
     * Otherwise converts the string value to the correct type.
     * @param {String} type A postgres column type
     * @param {String} stringValue The cell value
     *
     * @example convertCell('bool', 't')
     * //=> true
     * @example convertCell('int8', '10')
     * //=> 10
     * @example convertCell('_int4', '{1,2,3,4}')
     * //=> [1,2,3,4]
     */
    const convertCell = (type, value) => {
        // if data type is an array
        if (type.charAt(0) === '_') {
            const dataType = type.slice(1, type.length);
            return toArray(value, dataType);
        }
        // If not null, convert to correct type.
        switch (type) {
            case PostgresTypes.bool:
                return toBoolean(value);
            case PostgresTypes.float4:
            case PostgresTypes.float8:
            case PostgresTypes.int2:
            case PostgresTypes.int4:
            case PostgresTypes.int8:
            case PostgresTypes.numeric:
            case PostgresTypes.oid:
                return toNumber(value);
            case PostgresTypes.json:
            case PostgresTypes.jsonb:
                return toJson(value);
            case PostgresTypes.timestamp:
                return toTimestampString(value); // Format to be consistent with PostgREST
            case PostgresTypes.abstime: // To allow users to cast it based on Timezone
            case PostgresTypes.date: // To allow users to cast it based on Timezone
            case PostgresTypes.daterange:
            case PostgresTypes.int4range:
            case PostgresTypes.int8range:
            case PostgresTypes.money:
            case PostgresTypes.reltime: // To allow users to cast it based on Timezone
            case PostgresTypes.text:
            case PostgresTypes.time: // To allow users to cast it based on Timezone
            case PostgresTypes.timestamptz: // To allow users to cast it based on Timezone
            case PostgresTypes.timetz: // To allow users to cast it based on Timezone
            case PostgresTypes.tsrange:
            case PostgresTypes.tstzrange:
                return noop$1(value);
            default:
                // Return the value for remaining types
                return noop$1(value);
        }
    };
    const noop$1 = (value) => {
        return value;
    };
    const toBoolean = (value) => {
        switch (value) {
            case 't':
                return true;
            case 'f':
                return false;
            default:
                return value;
        }
    };
    const toNumber = (value) => {
        if (typeof value === 'string') {
            const parsedValue = parseFloat(value);
            if (!Number.isNaN(parsedValue)) {
                return parsedValue;
            }
        }
        return value;
    };
    const toJson = (value) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch (error) {
                console.log(`JSON parse error: ${error}`);
                return value;
            }
        }
        return value;
    };
    /**
     * Converts a Postgres Array into a native JS array
     *
     * @example toArray('{}', 'int4')
     * //=> []
     * @example toArray('{"[2021-01-01,2021-12-31)","(2021-01-01,2021-12-32]"}', 'daterange')
     * //=> ['[2021-01-01,2021-12-31)', '(2021-01-01,2021-12-32]']
     * @example toArray([1,2,3,4], 'int4')
     * //=> [1,2,3,4]
     */
    const toArray = (value, type) => {
        if (typeof value !== 'string') {
            return value;
        }
        const lastIdx = value.length - 1;
        const closeBrace = value[lastIdx];
        const openBrace = value[0];
        // Confirm value is a Postgres array by checking curly brackets
        if (openBrace === '{' && closeBrace === '}') {
            let arr;
            const valTrim = value.slice(1, lastIdx);
            // TODO: find a better solution to separate Postgres array data
            try {
                arr = JSON.parse('[' + valTrim + ']');
            }
            catch (_) {
                // WARNING: splitting on comma does not cover all edge cases
                arr = valTrim ? valTrim.split(',') : [];
            }
            return arr.map((val) => convertCell(type, val));
        }
        return value;
    };
    /**
     * Fixes timestamp to be ISO-8601. Swaps the space between the date and time for a 'T'
     * See https://github.com/supabase/supabase/issues/18
     *
     * @example toTimestampString('2019-09-10 00:00:00')
     * //=> '2019-09-10T00:00:00'
     */
    const toTimestampString = (value) => {
        if (typeof value === 'string') {
            return value.replace(' ', 'T');
        }
        return value;
    };

    var naiveFallback = function () {
    	if (typeof self === "object" && self) return self;
    	if (typeof window === "object" && window) return window;
    	throw new Error("Unable to resolve global `this`");
    };

    var global$1 = (function () {
    	if (this) return this;

    	// Unexpected strict mode (may happen if e.g. bundled into ESM module)

    	// Fallback to standard globalThis if available
    	if (typeof globalThis === "object" && globalThis) return globalThis;

    	// Thanks @mathiasbynens -> https://mathiasbynens.be/notes/globalthis
    	// In all ES5+ engines global object inherits from Object.prototype
    	// (if you approached one that doesn't please report)
    	try {
    		Object.defineProperty(Object.prototype, "__global__", {
    			get: function () { return this; },
    			configurable: true
    		});
    	} catch (error) {
    		// Unfortunate case of updates to Object.prototype being restricted
    		// via preventExtensions, seal or freeze
    		return naiveFallback();
    	}
    	try {
    		// Safari case (window.__global__ works, but __global__ does not)
    		if (!__global__) return naiveFallback();
    		return __global__;
    	} finally {
    		delete Object.prototype.__global__;
    	}
    })();

    var name = "websocket";
    var description = "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.";
    var keywords = [
    	"websocket",
    	"websockets",
    	"socket",
    	"networking",
    	"comet",
    	"push",
    	"RFC-6455",
    	"realtime",
    	"server",
    	"client"
    ];
    var author = "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)";
    var contributors = [
    	"Iñaki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
    ];
    var version$3 = "1.0.34";
    var repository = {
    	type: "git",
    	url: "https://github.com/theturtle32/WebSocket-Node.git"
    };
    var homepage = "https://github.com/theturtle32/WebSocket-Node";
    var engines = {
    	node: ">=4.0.0"
    };
    var dependencies = {
    	bufferutil: "^4.0.1",
    	debug: "^2.2.0",
    	"es5-ext": "^0.10.50",
    	"typedarray-to-buffer": "^3.1.5",
    	"utf-8-validate": "^5.0.2",
    	yaeti: "^0.0.6"
    };
    var devDependencies = {
    	"buffer-equal": "^1.0.0",
    	gulp: "^4.0.2",
    	"gulp-jshint": "^2.0.4",
    	"jshint-stylish": "^2.2.1",
    	jshint: "^2.0.0",
    	tape: "^4.9.1"
    };
    var config = {
    	verbose: false
    };
    var scripts = {
    	test: "tape test/unit/*.js",
    	gulp: "gulp"
    };
    var main = "index";
    var directories = {
    	lib: "./lib"
    };
    var browser$1 = "lib/browser.js";
    var license = "Apache-2.0";
    var require$$0 = {
    	name: name,
    	description: description,
    	keywords: keywords,
    	author: author,
    	contributors: contributors,
    	version: version$3,
    	repository: repository,
    	homepage: homepage,
    	engines: engines,
    	dependencies: dependencies,
    	devDependencies: devDependencies,
    	config: config,
    	scripts: scripts,
    	main: main,
    	directories: directories,
    	browser: browser$1,
    	license: license
    };

    var version$2 = require$$0.version;

    var _globalThis;
    if (typeof globalThis === 'object') {
    	_globalThis = globalThis;
    } else {
    	try {
    		_globalThis = global$1;
    	} catch (error) {
    	} finally {
    		if (!_globalThis && typeof window !== 'undefined') { _globalThis = window; }
    		if (!_globalThis) { throw new Error('Could not determine global this'); }
    	}
    }

    var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;



    /**
     * Expose a W3C WebSocket class with just one or two arguments.
     */
    function W3CWebSocket(uri, protocols) {
    	var native_instance;

    	if (protocols) {
    		native_instance = new NativeWebSocket(uri, protocols);
    	}
    	else {
    		native_instance = new NativeWebSocket(uri);
    	}

    	/**
    	 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
    	 * class). Since it is an Object it will be returned as it is when creating an
    	 * instance of W3CWebSocket via 'new W3CWebSocket()'.
    	 *
    	 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
    	 */
    	return native_instance;
    }
    if (NativeWebSocket) {
    	['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function(prop) {
    		Object.defineProperty(W3CWebSocket, prop, {
    			get: function() { return NativeWebSocket[prop]; }
    		});
    	});
    }

    /**
     * Module exports.
     */
    var browser = {
        'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
        'version'      : version$2
    };

    const version$1 = '1.7.2';

    const DEFAULT_HEADERS$1 = { 'X-Client-Info': `realtime-js/${version$1}` };
    const VSN = '1.0.0';
    const DEFAULT_TIMEOUT = 10000;
    const WS_CLOSE_NORMAL = 1000;
    var SOCKET_STATES;
    (function (SOCKET_STATES) {
        SOCKET_STATES[SOCKET_STATES["connecting"] = 0] = "connecting";
        SOCKET_STATES[SOCKET_STATES["open"] = 1] = "open";
        SOCKET_STATES[SOCKET_STATES["closing"] = 2] = "closing";
        SOCKET_STATES[SOCKET_STATES["closed"] = 3] = "closed";
    })(SOCKET_STATES || (SOCKET_STATES = {}));
    var CHANNEL_STATES;
    (function (CHANNEL_STATES) {
        CHANNEL_STATES["closed"] = "closed";
        CHANNEL_STATES["errored"] = "errored";
        CHANNEL_STATES["joined"] = "joined";
        CHANNEL_STATES["joining"] = "joining";
        CHANNEL_STATES["leaving"] = "leaving";
    })(CHANNEL_STATES || (CHANNEL_STATES = {}));
    var CHANNEL_EVENTS;
    (function (CHANNEL_EVENTS) {
        CHANNEL_EVENTS["close"] = "phx_close";
        CHANNEL_EVENTS["error"] = "phx_error";
        CHANNEL_EVENTS["join"] = "phx_join";
        CHANNEL_EVENTS["reply"] = "phx_reply";
        CHANNEL_EVENTS["leave"] = "phx_leave";
        CHANNEL_EVENTS["access_token"] = "access_token";
    })(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
    var TRANSPORTS;
    (function (TRANSPORTS) {
        TRANSPORTS["websocket"] = "websocket";
    })(TRANSPORTS || (TRANSPORTS = {}));
    var CONNECTION_STATE;
    (function (CONNECTION_STATE) {
        CONNECTION_STATE["Connecting"] = "connecting";
        CONNECTION_STATE["Open"] = "open";
        CONNECTION_STATE["Closing"] = "closing";
        CONNECTION_STATE["Closed"] = "closed";
    })(CONNECTION_STATE || (CONNECTION_STATE = {}));

    /**
     * Creates a timer that accepts a `timerCalc` function to perform calculated timeout retries, such as exponential backoff.
     *
     * @example
     *    let reconnectTimer = new Timer(() => this.connect(), function(tries){
     *      return [1000, 5000, 10000][tries - 1] || 10000
     *    })
     *    reconnectTimer.scheduleTimeout() // fires after 1000
     *    reconnectTimer.scheduleTimeout() // fires after 5000
     *    reconnectTimer.reset()
     *    reconnectTimer.scheduleTimeout() // fires after 1000
     */
    class Timer {
        constructor(callback, timerCalc) {
            this.callback = callback;
            this.timerCalc = timerCalc;
            this.timer = undefined;
            this.tries = 0;
            this.callback = callback;
            this.timerCalc = timerCalc;
        }
        reset() {
            this.tries = 0;
            clearTimeout(this.timer);
        }
        // Cancels any previous scheduleTimeout and schedules callback
        scheduleTimeout() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.tries = this.tries + 1;
                this.callback();
            }, this.timerCalc(this.tries + 1));
        }
    }

    // This file draws heavily from https://github.com/phoenixframework/phoenix/commit/cf098e9cf7a44ee6479d31d911a97d3c7430c6fe
    // License: https://github.com/phoenixframework/phoenix/blob/master/LICENSE.md
    class Serializer {
        constructor() {
            this.HEADER_LENGTH = 1;
        }
        decode(rawPayload, callback) {
            if (rawPayload.constructor === ArrayBuffer) {
                return callback(this._binaryDecode(rawPayload));
            }
            if (typeof rawPayload === 'string') {
                return callback(JSON.parse(rawPayload));
            }
            return callback({});
        }
        _binaryDecode(buffer) {
            const view = new DataView(buffer);
            const decoder = new TextDecoder();
            return this._decodeBroadcast(buffer, view, decoder);
        }
        _decodeBroadcast(buffer, view, decoder) {
            const topicSize = view.getUint8(1);
            const eventSize = view.getUint8(2);
            let offset = this.HEADER_LENGTH + 2;
            const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
            offset = offset + topicSize;
            const event = decoder.decode(buffer.slice(offset, offset + eventSize));
            offset = offset + eventSize;
            const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
            return { ref: null, topic: topic, event: event, payload: data };
        }
    }

    class Push {
        /**
         * Initializes the Push
         *
         * @param channel The Channel
         * @param event The event, for example `"phx_join"`
         * @param payload The payload, for example `{user_id: 123}`
         * @param timeout The push timeout in milliseconds
         */
        constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
            this.channel = channel;
            this.event = event;
            this.payload = payload;
            this.timeout = timeout;
            this.sent = false;
            this.timeoutTimer = undefined;
            this.ref = '';
            this.receivedResp = null;
            this.recHooks = [];
            this.refEvent = null;
        }
        resend(timeout) {
            this.timeout = timeout;
            this._cancelRefEvent();
            this.ref = '';
            this.refEvent = null;
            this.receivedResp = null;
            this.sent = false;
            this.send();
        }
        send() {
            if (this._hasReceived('timeout')) {
                return;
            }
            this.startTimeout();
            this.sent = true;
            this.channel.socket.push({
                topic: this.channel.topic,
                event: this.event,
                payload: this.payload,
                ref: this.ref,
            });
        }
        updatePayload(payload) {
            this.payload = Object.assign(Object.assign({}, this.payload), payload);
        }
        receive(status, callback) {
            var _a;
            if (this._hasReceived(status)) {
                callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
            }
            this.recHooks.push({ status, callback });
            return this;
        }
        startTimeout() {
            if (this.timeoutTimer) {
                return;
            }
            this.ref = this.channel.socket.makeRef();
            this.refEvent = this.channel.replyEventName(this.ref);
            const callback = (payload) => {
                this._cancelRefEvent();
                this._cancelTimeout();
                this.receivedResp = payload;
                this._matchReceive(payload);
            };
            if (this.channel instanceof RealtimeSubscription) {
                this.channel.on(this.refEvent, callback);
            }
            else {
                this.channel.on(this.refEvent, {}, callback);
            }
            this.timeoutTimer = setTimeout(() => {
                this.trigger('timeout', {});
            }, this.timeout);
        }
        trigger(status, response) {
            if (this.refEvent)
                this.channel.trigger(this.refEvent, { status, response });
        }
        destroy() {
            this._cancelRefEvent();
            this._cancelTimeout();
        }
        _cancelRefEvent() {
            if (!this.refEvent) {
                return;
            }
            if (this.channel instanceof RealtimeSubscription) {
                this.channel.off(this.refEvent);
            }
            else {
                this.channel.off(this.refEvent, {});
            }
        }
        _cancelTimeout() {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = undefined;
        }
        _matchReceive({ status, response, }) {
            this.recHooks
                .filter((h) => h.status === status)
                .forEach((h) => h.callback(response));
        }
        _hasReceived(status) {
            return this.receivedResp && this.receivedResp.status === status;
        }
    }

    class RealtimeSubscription {
        constructor(topic, params = {}, socket) {
            this.topic = topic;
            this.params = params;
            this.socket = socket;
            this.bindings = [];
            this.state = CHANNEL_STATES.closed;
            this.joinedOnce = false;
            this.pushBuffer = [];
            this.timeout = this.socket.timeout;
            this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
            this.rejoinTimer = new Timer(() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
            this.joinPush.receive('ok', () => {
                this.state = CHANNEL_STATES.joined;
                this.rejoinTimer.reset();
                this.pushBuffer.forEach((pushEvent) => pushEvent.send());
                this.pushBuffer = [];
            });
            this.onClose(() => {
                this.rejoinTimer.reset();
                this.socket.log('channel', `close ${this.topic} ${this.joinRef()}`);
                this.state = CHANNEL_STATES.closed;
                this.socket.remove(this);
            });
            this.onError((reason) => {
                if (this.isLeaving() || this.isClosed()) {
                    return;
                }
                this.socket.log('channel', `error ${this.topic}`, reason);
                this.state = CHANNEL_STATES.errored;
                this.rejoinTimer.scheduleTimeout();
            });
            this.joinPush.receive('timeout', () => {
                if (!this.isJoining()) {
                    return;
                }
                this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout);
                this.state = CHANNEL_STATES.errored;
                this.rejoinTimer.scheduleTimeout();
            });
            this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
                this.trigger(this.replyEventName(ref), payload);
            });
        }
        rejoinUntilConnected() {
            this.rejoinTimer.scheduleTimeout();
            if (this.socket.isConnected()) {
                this.rejoin();
            }
        }
        subscribe(timeout = this.timeout) {
            if (this.joinedOnce) {
                throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
            }
            else {
                this.joinedOnce = true;
                this.rejoin(timeout);
                return this.joinPush;
            }
        }
        onClose(callback) {
            this.on(CHANNEL_EVENTS.close, callback);
        }
        onError(callback) {
            this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
        }
        on(event, callback) {
            this.bindings.push({ event, callback });
        }
        off(event) {
            this.bindings = this.bindings.filter((bind) => bind.event !== event);
        }
        canPush() {
            return this.socket.isConnected() && this.isJoined();
        }
        push(event, payload, timeout = this.timeout) {
            if (!this.joinedOnce) {
                throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
            }
            let pushEvent = new Push(this, event, payload, timeout);
            if (this.canPush()) {
                pushEvent.send();
            }
            else {
                pushEvent.startTimeout();
                this.pushBuffer.push(pushEvent);
            }
            return pushEvent;
        }
        updateJoinPayload(payload) {
            this.joinPush.updatePayload(payload);
        }
        /**
         * Leaves the channel
         *
         * Unsubscribes from server events, and instructs channel to terminate on server.
         * Triggers onClose() hooks.
         *
         * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
         * channel.unsubscribe().receive("ok", () => alert("left!") )
         */
        unsubscribe(timeout = this.timeout) {
            this.state = CHANNEL_STATES.leaving;
            let onClose = () => {
                this.socket.log('channel', `leave ${this.topic}`);
                this.trigger(CHANNEL_EVENTS.close, 'leave', this.joinRef());
            };
            // Destroy joinPush to avoid connection timeouts during unscription phase
            this.joinPush.destroy();
            let leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
            leavePush.receive('ok', () => onClose()).receive('timeout', () => onClose());
            leavePush.send();
            if (!this.canPush()) {
                leavePush.trigger('ok', {});
            }
            return leavePush;
        }
        /**
         * Overridable message hook
         *
         * Receives all events for specialized message handling before dispatching to the channel callbacks.
         * Must return the payload, modified or unmodified.
         */
        onMessage(event, payload, ref) {
            return payload;
        }
        isMember(topic) {
            return this.topic === topic;
        }
        joinRef() {
            return this.joinPush.ref;
        }
        rejoin(timeout = this.timeout) {
            if (this.isLeaving()) {
                return;
            }
            this.socket.leaveOpenTopic(this.topic);
            this.state = CHANNEL_STATES.joining;
            this.joinPush.resend(timeout);
        }
        trigger(event, payload, ref) {
            let { close, error, leave, join } = CHANNEL_EVENTS;
            let events = [close, error, leave, join];
            if (ref && events.indexOf(event) >= 0 && ref !== this.joinRef()) {
                return;
            }
            let handledPayload = this.onMessage(event, payload, ref);
            if (payload && !handledPayload) {
                throw 'channel onMessage callbacks must return the payload, modified or unmodified';
            }
            this.bindings
                .filter((bind) => {
                // Bind all events if the user specifies a wildcard.
                if (bind.event === '*') {
                    return event === (payload === null || payload === void 0 ? void 0 : payload.type);
                }
                else {
                    return bind.event === event;
                }
            })
                .map((bind) => bind.callback(handledPayload, ref));
        }
        replyEventName(ref) {
            return `chan_reply_${ref}`;
        }
        isClosed() {
            return this.state === CHANNEL_STATES.closed;
        }
        isErrored() {
            return this.state === CHANNEL_STATES.errored;
        }
        isJoined() {
            return this.state === CHANNEL_STATES.joined;
        }
        isJoining() {
            return this.state === CHANNEL_STATES.joining;
        }
        isLeaving() {
            return this.state === CHANNEL_STATES.leaving;
        }
    }

    /*
      This file draws heavily from https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/assets/js/phoenix/presence.js
      License: https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/LICENSE.md
    */
    class RealtimePresence {
        /**
         * Initializes the Presence.
         *
         * @param channel - The RealtimeSubscription
         * @param opts - The options,
         *        for example `{events: {state: 'state', diff: 'diff'}}`
         */
        constructor(channel, opts) {
            this.channel = channel;
            this.state = {};
            this.pendingDiffs = [];
            this.joinRef = null;
            this.caller = {
                onJoin: () => { },
                onLeave: () => { },
                onSync: () => { },
            };
            const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
                state: 'presence_state',
                diff: 'presence_diff',
            };
            this.channel.on(events.state, {}, (newState) => {
                const { onJoin, onLeave, onSync } = this.caller;
                this.joinRef = this.channel.joinRef();
                this.state = RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
                this.pendingDiffs.forEach((diff) => {
                    this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
                });
                this.pendingDiffs = [];
                onSync();
            });
            this.channel.on(events.diff, {}, (diff) => {
                const { onJoin, onLeave, onSync } = this.caller;
                if (this.inPendingSyncState()) {
                    this.pendingDiffs.push(diff);
                }
                else {
                    this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
                    onSync();
                }
            });
        }
        /**
         * Used to sync the list of presences on the server with the
         * client's state.
         *
         * An optional `onJoin` and `onLeave` callback can be provided to
         * react to changes in the client's local presences across
         * disconnects and reconnects with the server.
         */
        static syncState(currentState, newState, onJoin, onLeave) {
            const state = this.cloneDeep(currentState);
            const transformedState = this.transformState(newState);
            const joins = {};
            const leaves = {};
            this.map(state, (key, presences) => {
                if (!transformedState[key]) {
                    leaves[key] = presences;
                }
            });
            this.map(transformedState, (key, newPresences) => {
                const currentPresences = state[key];
                if (currentPresences) {
                    const newPresenceIds = newPresences.map((m) => m.presence_id);
                    const curPresenceIds = currentPresences.map((m) => m.presence_id);
                    const joinedPresences = newPresences.filter((m) => curPresenceIds.indexOf(m.presence_id) < 0);
                    const leftPresences = currentPresences.filter((m) => newPresenceIds.indexOf(m.presence_id) < 0);
                    if (joinedPresences.length > 0) {
                        joins[key] = joinedPresences;
                    }
                    if (leftPresences.length > 0) {
                        leaves[key] = leftPresences;
                    }
                }
                else {
                    joins[key] = newPresences;
                }
            });
            return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
        }
        /**
         * Used to sync a diff of presence join and leave events from the
         * server, as they happen.
         *
         * Like `syncState`, `syncDiff` accepts optional `onJoin` and
         * `onLeave` callbacks to react to a user joining or leaving from a
         * device.
         */
        static syncDiff(state, diff, onJoin, onLeave) {
            const { joins, leaves } = {
                joins: this.transformState(diff.joins),
                leaves: this.transformState(diff.leaves),
            };
            if (!onJoin) {
                onJoin = () => { };
            }
            if (!onLeave) {
                onLeave = () => { };
            }
            this.map(joins, (key, newPresences) => {
                const currentPresences = state[key];
                state[key] = this.cloneDeep(newPresences);
                if (currentPresences) {
                    const joinedPresenceIds = state[key].map((m) => m.presence_id);
                    const curPresences = currentPresences.filter((m) => joinedPresenceIds.indexOf(m.presence_id) < 0);
                    state[key].unshift(...curPresences);
                }
                onJoin(key, currentPresences, newPresences);
            });
            this.map(leaves, (key, leftPresences) => {
                let currentPresences = state[key];
                if (!currentPresences)
                    return;
                const presenceIdsToRemove = leftPresences.map((m) => m.presence_id);
                currentPresences = currentPresences.filter((m) => presenceIdsToRemove.indexOf(m.presence_id) < 0);
                state[key] = currentPresences;
                onLeave(key, currentPresences, leftPresences);
                if (currentPresences.length === 0)
                    delete state[key];
            });
            return state;
        }
        /**
         * Returns the array of presences, with selected metadata.
         */
        static list(presences, chooser) {
            if (!chooser) {
                chooser = (_key, pres) => pres;
            }
            return this.map(presences, (key, presences) => chooser(key, presences));
        }
        static map(obj, func) {
            return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
        }
        /**
         * Remove 'metas' key
         * Change 'phx_ref' to 'presence_id'
         * Remove 'phx_ref' and 'phx_ref_prev'
         *
         * @example
         * // returns {
         *  abc123: [
         *    { presence_id: '2', user_id: 1 },
         *    { presence_id: '3', user_id: 2 }
         *  ]
         * }
         * RealtimePresence.transformState({
         *  abc123: {
         *    metas: [
         *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
         *      { phx_ref: '3', user_id: 2 }
         *    ]
         *  }
         * })
         */
        static transformState(state) {
            state = this.cloneDeep(state);
            return Object.getOwnPropertyNames(state).reduce((newState, key) => {
                const presences = state[key];
                if ('metas' in presences) {
                    newState[key] = presences.metas.map((presence) => {
                        presence['presence_id'] = presence['phx_ref'];
                        delete presence['phx_ref'];
                        delete presence['phx_ref_prev'];
                        return presence;
                    });
                }
                else {
                    newState[key] = presences;
                }
                return newState;
            }, {});
        }
        static cloneDeep(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        onJoin(callback) {
            this.caller.onJoin = callback;
        }
        onLeave(callback) {
            this.caller.onLeave = callback;
        }
        onSync(callback) {
            this.caller.onSync = callback;
        }
        list(by) {
            return RealtimePresence.list(this.state, by);
        }
        inPendingSyncState() {
            return !this.joinRef || this.joinRef !== this.channel.joinRef();
        }
    }

    class RealtimeChannel {
        constructor(topic, params = {}, socket) {
            this.topic = topic;
            this.params = params;
            this.socket = socket;
            this.bindings = [];
            this.state = CHANNEL_STATES.closed;
            this.joinedOnce = false;
            this.pushBuffer = [];
            this.timeout = this.socket.timeout;
            this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
            this.rejoinTimer = new Timer(() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
            this.joinPush.receive('ok', () => {
                this.state = CHANNEL_STATES.joined;
                this.rejoinTimer.reset();
                this.pushBuffer.forEach((pushEvent) => pushEvent.send());
                this.pushBuffer = [];
            });
            this.onClose(() => {
                this.rejoinTimer.reset();
                this.socket.log('channel', `close ${this.topic} ${this.joinRef()}`);
                this.state = CHANNEL_STATES.closed;
                this.socket.remove(this);
            });
            this.onError((reason) => {
                if (this.isLeaving() || this.isClosed()) {
                    return;
                }
                this.socket.log('channel', `error ${this.topic}`, reason);
                this.state = CHANNEL_STATES.errored;
                this.rejoinTimer.scheduleTimeout();
            });
            this.joinPush.receive('timeout', () => {
                if (!this.isJoining()) {
                    return;
                }
                this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout);
                this.state = CHANNEL_STATES.errored;
                this.rejoinTimer.scheduleTimeout();
            });
            this.on(CHANNEL_EVENTS.reply, {}, (payload, ref) => {
                this.trigger(this.replyEventName(ref), payload);
            });
            this.presence = new RealtimePresence(this);
        }
        list() {
            return this.presence.list();
        }
        rejoinUntilConnected() {
            this.rejoinTimer.scheduleTimeout();
            if (this.socket.isConnected()) {
                this.rejoin();
            }
        }
        subscribe(timeout = this.timeout) {
            if (this.joinedOnce) {
                throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
            }
            else {
                const configs = this.bindings.reduce((acc, binding) => {
                    const { type } = binding;
                    if (![
                        'phx_close',
                        'phx_error',
                        'phx_reply',
                        'presence_diff',
                        'presence_state',
                    ].includes(type)) {
                        acc[type] = binding;
                    }
                    return acc;
                }, {});
                if (Object.keys(configs).length) {
                    this.updateJoinPayload({ configs });
                }
                this.joinedOnce = true;
                this.rejoin(timeout);
                return this.joinPush;
            }
        }
        /**
         * Registers a callback that will be executed when the channel closes.
         */
        onClose(callback) {
            this.on(CHANNEL_EVENTS.close, {}, callback);
        }
        /**
         * Registers a callback that will be executed when the channel encounteres an error.
         */
        onError(callback) {
            this.on(CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
        }
        on(type, filter, callback) {
            this.bindings.push({
                type,
                filter: filter !== null && filter !== void 0 ? filter : {},
                callback: callback !== null && callback !== void 0 ? callback : (() => { }),
            });
        }
        off(type, filter) {
            this.bindings = this.bindings.filter((bind) => {
                return !(bind.type === type && RealtimeChannel.isEqual(bind.filter, filter));
            });
        }
        /**
         * Returns `true` if the socket is connected and the channel has been joined.
         */
        canPush() {
            return this.socket.isConnected() && this.isJoined();
        }
        push(event, payload, timeout = this.timeout) {
            if (!this.joinedOnce) {
                throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
            }
            let pushEvent = new Push(this, event, payload, timeout);
            if (this.canPush()) {
                pushEvent.send();
            }
            else {
                pushEvent.startTimeout();
                this.pushBuffer.push(pushEvent);
            }
            return pushEvent;
        }
        updateJoinPayload(payload) {
            this.joinPush.updatePayload(payload);
        }
        /**
         * Leaves the channel.
         *
         * Unsubscribes from server events, and instructs channel to terminate on server.
         * Triggers onClose() hooks.
         *
         * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
         * channel.unsubscribe().receive("ok", () => alert("left!") )
         */
        unsubscribe(timeout = this.timeout) {
            this.state = CHANNEL_STATES.leaving;
            const onClose = () => {
                this.socket.log('channel', `leave ${this.topic}`);
                this.trigger(CHANNEL_EVENTS.close, 'leave', this.joinRef());
            };
            // Destroy joinPush to avoid connection timeouts during unscription phase
            this.joinPush.destroy();
            const leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
            leavePush.receive('ok', () => onClose()).receive('timeout', () => onClose());
            leavePush.send();
            if (!this.canPush()) {
                leavePush.trigger('ok', {});
            }
            return leavePush;
        }
        /**
         * Overridable message hook
         *
         * Receives all events for specialized message handling before dispatching to the channel callbacks.
         * Must return the payload, modified or unmodified.
         */
        onMessage(event, payload, ref) {
            return payload;
        }
        isMember(topic) {
            return this.topic === topic;
        }
        joinRef() {
            return this.joinPush.ref;
        }
        rejoin(timeout = this.timeout) {
            if (this.isLeaving()) {
                return;
            }
            this.socket.leaveOpenTopic(this.topic);
            this.state = CHANNEL_STATES.joining;
            this.joinPush.resend(timeout);
        }
        trigger(type, payload, ref) {
            const { close, error, leave, join } = CHANNEL_EVENTS;
            const events = [close, error, leave, join];
            if (ref && events.indexOf(type) >= 0 && ref !== this.joinRef()) {
                return;
            }
            const handledPayload = this.onMessage(type, payload, ref);
            if (payload && !handledPayload) {
                throw 'channel onMessage callbacks must return the payload, modified or unmodified';
            }
            this.bindings
                .filter((bind) => {
                var _a, _b;
                return ((bind === null || bind === void 0 ? void 0 : bind.type) === type &&
                    (((_a = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _a === void 0 ? void 0 : _a.event) === '*' ||
                        ((_b = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _b === void 0 ? void 0 : _b.event) === (payload === null || payload === void 0 ? void 0 : payload.event)));
            })
                .map((bind) => bind.callback(handledPayload, ref));
        }
        send(payload) {
            const push = this.push(payload.type, payload);
            return new Promise((resolve, reject) => {
                push.receive('ok', () => resolve('ok'));
                push.receive('timeout', () => reject('timeout'));
            });
        }
        replyEventName(ref) {
            return `chan_reply_${ref}`;
        }
        isClosed() {
            return this.state === CHANNEL_STATES.closed;
        }
        isErrored() {
            return this.state === CHANNEL_STATES.errored;
        }
        isJoined() {
            return this.state === CHANNEL_STATES.joined;
        }
        isJoining() {
            return this.state === CHANNEL_STATES.joining;
        }
        isLeaving() {
            return this.state === CHANNEL_STATES.leaving;
        }
        static isEqual(obj1, obj2) {
            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                return false;
            }
            for (const k in obj1) {
                if (obj1[k] !== obj2[k]) {
                    return false;
                }
            }
            return true;
        }
    }

    var __awaiter$5 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __rest$1 = (undefined && undefined.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
    const noop = () => { };
    class RealtimeClient {
        /**
         * Initializes the Socket.
         *
         * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
         * @param options.transport The Websocket Transport, for example WebSocket.
         * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
         * @param options.params The optional params to pass when connecting.
         * @param options.headers The optional headers to pass when connecting.
         * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
         * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
         * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
         * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
         * @param options.longpollerTimeout The maximum timeout of a long poll AJAX request. Defaults to 20s (double the server long poll timer).
         * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
         */
        constructor(endPoint, options) {
            this.accessToken = null;
            this.channels = [];
            this.endPoint = '';
            this.headers = DEFAULT_HEADERS$1;
            this.params = {};
            this.timeout = DEFAULT_TIMEOUT;
            this.transport = browser.w3cwebsocket;
            this.heartbeatIntervalMs = 30000;
            this.longpollerTimeout = 20000;
            this.heartbeatTimer = undefined;
            this.pendingHeartbeatRef = null;
            this.ref = 0;
            this.logger = noop;
            this.conn = null;
            this.sendBuffer = [];
            this.serializer = new Serializer();
            this.stateChangeCallbacks = {
                open: [],
                close: [],
                error: [],
                message: [],
            };
            this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
            if (options === null || options === void 0 ? void 0 : options.params)
                this.params = options.params;
            if (options === null || options === void 0 ? void 0 : options.headers)
                this.headers = Object.assign(Object.assign({}, this.headers), options.headers);
            if (options === null || options === void 0 ? void 0 : options.timeout)
                this.timeout = options.timeout;
            if (options === null || options === void 0 ? void 0 : options.logger)
                this.logger = options.logger;
            if (options === null || options === void 0 ? void 0 : options.transport)
                this.transport = options.transport;
            if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs)
                this.heartbeatIntervalMs = options.heartbeatIntervalMs;
            if (options === null || options === void 0 ? void 0 : options.longpollerTimeout)
                this.longpollerTimeout = options.longpollerTimeout;
            this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs) ? options.reconnectAfterMs
                : (tries) => {
                    return [1000, 2000, 5000, 10000][tries - 1] || 10000;
                };
            this.encode = (options === null || options === void 0 ? void 0 : options.encode) ? options.encode
                : (payload, callback) => {
                    return callback(JSON.stringify(payload));
                };
            this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode
                : this.serializer.decode.bind(this.serializer);
            this.reconnectTimer = new Timer(() => __awaiter$5(this, void 0, void 0, function* () {
                yield this.disconnect();
                this.connect();
            }), this.reconnectAfterMs);
        }
        /**
         * Connects the socket, unless already connected.
         */
        connect() {
            if (this.conn) {
                return;
            }
            this.conn = new this.transport(this.endPointURL(), [], null, this.headers);
            if (this.conn) {
                // this.conn.timeout = this.longpollerTimeout // TYPE ERROR
                this.conn.binaryType = 'arraybuffer';
                this.conn.onopen = () => this._onConnOpen();
                this.conn.onerror = (error) => this._onConnError(error);
                this.conn.onmessage = (event) => this.onConnMessage(event);
                this.conn.onclose = (event) => this._onConnClose(event);
            }
        }
        /**
         * Disconnects the socket.
         *
         * @param code A numeric status code to send on disconnect.
         * @param reason A custom reason for the disconnect.
         */
        disconnect(code, reason) {
            return new Promise((resolve, _reject) => {
                try {
                    if (this.conn) {
                        this.conn.onclose = function () { }; // noop
                        if (code) {
                            this.conn.close(code, reason || '');
                        }
                        else {
                            this.conn.close();
                        }
                        this.conn = null;
                        // remove open handles
                        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
                        this.reconnectTimer.reset();
                    }
                    resolve({ error: null, data: true });
                }
                catch (error) {
                    resolve({ error: error, data: false });
                }
            });
        }
        /**
         * Logs the message.
         *
         * For customized logging, `this.logger` can be overriden.
         */
        log(kind, msg, data) {
            this.logger(kind, msg, data);
        }
        /**
         * Registers a callback for connection state change event.
         *
         * @param callback A function to be called when the event occurs.
         *
         * @example
         *    socket.onOpen(() => console.log("Socket opened."))
         */
        onOpen(callback) {
            this.stateChangeCallbacks.open.push(callback);
        }
        /**
         * Registers a callback for connection state change events.
         *
         * @param callback A function to be called when the event occurs.
         *
         * @example
         *    socket.onOpen(() => console.log("Socket closed."))
         */
        onClose(callback) {
            this.stateChangeCallbacks.close.push(callback);
        }
        /**
         * Registers a callback for connection state change events.
         *
         * @param callback A function to be called when the event occurs.
         *
         * @example
         *    socket.onOpen((error) => console.log("An error occurred"))
         */
        onError(callback) {
            this.stateChangeCallbacks.error.push(callback);
        }
        /**
         * Calls a function any time a message is received.
         *
         * @param callback A function to be called when the event occurs.
         *
         * @example
         *    socket.onMessage((message) => console.log(message))
         */
        onMessage(callback) {
            this.stateChangeCallbacks.message.push(callback);
        }
        /**
         * Returns the current state of the socket.
         */
        connectionState() {
            switch (this.conn && this.conn.readyState) {
                case SOCKET_STATES.connecting:
                    return CONNECTION_STATE.Connecting;
                case SOCKET_STATES.open:
                    return CONNECTION_STATE.Open;
                case SOCKET_STATES.closing:
                    return CONNECTION_STATE.Closing;
                default:
                    return CONNECTION_STATE.Closed;
            }
        }
        /**
         * Retuns `true` is the connection is open.
         */
        isConnected() {
            return this.connectionState() === CONNECTION_STATE.Open;
        }
        /**
         * Removes a subscription from the socket.
         *
         * @param channel An open subscription.
         */
        remove(channel) {
            this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
        }
        channel(topic, chanParams = {}) {
            var _a;
            const { selfBroadcast } = chanParams, params = __rest$1(chanParams, ["selfBroadcast"]);
            if (selfBroadcast) {
                params.self_broadcast = selfBroadcast;
            }
            const chan = ((_a = this.params) === null || _a === void 0 ? void 0 : _a.vsndate) ? new RealtimeChannel(topic, params, this)
                : new RealtimeSubscription(topic, params, this);
            if (chan instanceof RealtimeChannel) {
                chan.presence.onJoin((key, currentPresences, newPresences) => {
                    chan.trigger('presence', {
                        event: 'JOIN',
                        key,
                        currentPresences,
                        newPresences,
                    });
                });
                chan.presence.onLeave((key, currentPresences, leftPresences) => {
                    chan.trigger('presence', {
                        event: 'LEAVE',
                        key,
                        currentPresences,
                        leftPresences,
                    });
                });
                chan.presence.onSync(() => {
                    chan.trigger('presence', { event: 'SYNC' });
                });
            }
            this.channels.push(chan);
            return chan;
        }
        /**
         * Push out a message if the socket is connected.
         *
         * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
         */
        push(data) {
            const { topic, event, payload, ref } = data;
            let callback = () => {
                this.encode(data, (result) => {
                    var _a;
                    (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
                });
            };
            this.log('push', `${topic} ${event} (${ref})`, payload);
            if (this.isConnected()) {
                callback();
            }
            else {
                this.sendBuffer.push(callback);
            }
        }
        onConnMessage(rawMessage) {
            this.decode(rawMessage.data, (msg) => {
                let { topic, event, payload, ref } = msg;
                if ((ref && ref === this.pendingHeartbeatRef) ||
                    event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
                    this.pendingHeartbeatRef = null;
                }
                this.log('receive', `${payload.status || ''} ${topic} ${event} ${(ref && '(' + ref + ')') || ''}`, payload);
                this.channels
                    .filter((channel) => channel.isMember(topic))
                    .forEach((channel) => channel.trigger(event, payload, ref));
                this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
            });
        }
        /**
         * Returns the URL of the websocket.
         */
        endPointURL() {
            return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }));
        }
        /**
         * Return the next message ref, accounting for overflows
         */
        makeRef() {
            let newRef = this.ref + 1;
            if (newRef === this.ref) {
                this.ref = 0;
            }
            else {
                this.ref = newRef;
            }
            return this.ref.toString();
        }
        /**
         * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
         *
         * @param token A JWT string.
         */
        setAuth(token) {
            this.accessToken = token;
            this.channels.forEach((channel) => {
                token && channel.updateJoinPayload({ user_token: token });
                if (channel.joinedOnce && channel.isJoined()) {
                    channel.push(CHANNEL_EVENTS.access_token, { access_token: token });
                }
            });
        }
        /**
         * Unsubscribe from channels with the specified topic.
         */
        leaveOpenTopic(topic) {
            let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
            if (dupChannel) {
                this.log('transport', `leaving duplicate topic "${topic}"`);
                dupChannel.unsubscribe();
            }
        }
        _onConnOpen() {
            this.log('transport', `connected to ${this.endPointURL()}`);
            this._flushSendBuffer();
            this.reconnectTimer.reset();
            this.heartbeatTimer && clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs);
            this.stateChangeCallbacks.open.forEach((callback) => callback());
        }
        _onConnClose(event) {
            this.log('transport', 'close', event);
            this._triggerChanError();
            this.heartbeatTimer && clearInterval(this.heartbeatTimer);
            this.reconnectTimer.scheduleTimeout();
            this.stateChangeCallbacks.close.forEach((callback) => callback(event));
        }
        _onConnError(error) {
            this.log('transport', error.message);
            this._triggerChanError();
            this.stateChangeCallbacks.error.forEach((callback) => callback(error));
        }
        _triggerChanError() {
            this.channels.forEach((channel) => channel.trigger(CHANNEL_EVENTS.error));
        }
        _appendParams(url, params) {
            if (Object.keys(params).length === 0) {
                return url;
            }
            const prefix = url.match(/\?/) ? '&' : '?';
            const query = new URLSearchParams(params);
            return `${url}${prefix}${query}`;
        }
        _flushSendBuffer() {
            if (this.isConnected() && this.sendBuffer.length > 0) {
                this.sendBuffer.forEach((callback) => callback());
                this.sendBuffer = [];
            }
        }
        _sendHeartbeat() {
            var _a;
            if (!this.isConnected()) {
                return;
            }
            if (this.pendingHeartbeatRef) {
                this.pendingHeartbeatRef = null;
                this.log('transport', 'heartbeat timeout. Attempting to re-establish connection');
                (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, 'hearbeat timeout');
                return;
            }
            this.pendingHeartbeatRef = this.makeRef();
            this.push({
                topic: 'phoenix',
                event: 'heartbeat',
                payload: {},
                ref: this.pendingHeartbeatRef,
            });
            this.setAuth(this.accessToken);
        }
    }

    class SupabaseRealtimeClient {
        constructor(socket, headers, schema, tableName) {
            const chanParams = {};
            const topic = tableName === '*' ? `realtime:${schema}` : `realtime:${schema}:${tableName}`;
            const userToken = headers['Authorization'].split(' ')[1];
            if (userToken) {
                chanParams['user_token'] = userToken;
            }
            this.subscription = socket.channel(topic, chanParams);
        }
        getPayloadRecords(payload) {
            const records = {
                new: {},
                old: {},
            };
            if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
                records.new = convertChangeData(payload.columns, payload.record);
            }
            if (payload.type === 'UPDATE' || payload.type === 'DELETE') {
                records.old = convertChangeData(payload.columns, payload.old_record);
            }
            return records;
        }
        /**
         * The event you want to listen to.
         *
         * @param event The event
         * @param callback A callback function that is called whenever the event occurs.
         */
        on(event, callback) {
            this.subscription.on(event, (payload) => {
                let enrichedPayload = {
                    schema: payload.schema,
                    table: payload.table,
                    commit_timestamp: payload.commit_timestamp,
                    eventType: payload.type,
                    new: {},
                    old: {},
                    errors: payload.errors,
                };
                enrichedPayload = Object.assign(Object.assign({}, enrichedPayload), this.getPayloadRecords(payload));
                callback(enrichedPayload);
            });
            return this;
        }
        /**
         * Enables the subscription.
         */
        subscribe(callback = () => { }) {
            this.subscription.onError((e) => callback('SUBSCRIPTION_ERROR', e));
            this.subscription.onClose(() => callback('CLOSED'));
            this.subscription
                .subscribe()
                .receive('ok', () => callback('SUBSCRIBED'))
                .receive('error', (e) => callback('SUBSCRIPTION_ERROR', e))
                .receive('timeout', () => callback('RETRYING_AFTER_TIMEOUT'));
            return this.subscription;
        }
    }

    class SupabaseQueryBuilder extends PostgrestQueryBuilder {
        constructor(url, { headers = {}, schema, realtime, table, fetch, shouldThrowOnError, }) {
            super(url, { headers, schema, fetch, shouldThrowOnError });
            this._subscription = null;
            this._realtime = realtime;
            this._headers = headers;
            this._schema = schema;
            this._table = table;
        }
        /**
         * Subscribe to realtime changes in your database.
         * @param event The database event which you would like to receive updates for, or you can use the special wildcard `*` to listen to all changes.
         * @param callback A callback that will handle the payload that is sent whenever your database changes.
         */
        on(event, callback) {
            if (!this._realtime.isConnected()) {
                this._realtime.connect();
            }
            if (!this._subscription) {
                this._subscription = new SupabaseRealtimeClient(this._realtime, this._headers, this._schema, this._table);
            }
            return this._subscription.on(event, callback);
        }
    }

    // generated by genversion
    const version = '0.0.0';

    const DEFAULT_HEADERS = { 'X-Client-Info': `storage-js/${version}` };

    var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    const handleError = (error, reject) => {
        if (typeof error.json !== 'function') {
            return reject(error);
        }
        error.json().then((err) => {
            return reject({
                message: _getErrorMessage(err),
                status: (error === null || error === void 0 ? void 0 : error.status) || 500,
            });
        });
    };
    const _getRequestParams = (method, options, parameters, body) => {
        const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
        if (method === 'GET') {
            return params;
        }
        params.headers = Object.assign({ 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
        return Object.assign(Object.assign({}, params), parameters);
    };
    function _handleRequest(fetcher, method, url, options, parameters, body) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fetcher(url, _getRequestParams(method, options, parameters, body))
                    .then((result) => {
                    if (!result.ok)
                        throw result;
                    if (options === null || options === void 0 ? void 0 : options.noResolveJson)
                        return resolve(result);
                    return result.json();
                })
                    .then((data) => resolve(data))
                    .catch((error) => handleError(error, reject));
            });
        });
    }
    function get(fetcher, url, options, parameters) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return _handleRequest(fetcher, 'GET', url, options, parameters);
        });
    }
    function post(fetcher, url, body, options, parameters) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return _handleRequest(fetcher, 'POST', url, options, parameters, body);
        });
    }
    function put(fetcher, url, body, options, parameters) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return _handleRequest(fetcher, 'PUT', url, options, parameters, body);
        });
    }
    function remove$1(fetcher, url, body, options, parameters) {
        return __awaiter$4(this, void 0, void 0, function* () {
            return _handleRequest(fetcher, 'DELETE', url, options, parameters, body);
        });
    }

    const resolveFetch$1 = (customFetch) => {
        let _fetch;
        if (customFetch) {
            _fetch = customFetch;
        }
        else if (typeof fetch === 'undefined') {
            _fetch = crossFetch;
        }
        else {
            _fetch = fetch;
        }
        return (...args) => _fetch(...args);
    };

    var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class StorageBucketApi {
        constructor(url, headers = {}, fetch) {
            this.url = url;
            this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS), headers);
            this.fetch = resolveFetch$1(fetch);
        }
        /**
         * Retrieves the details of all Storage buckets within an existing product.
         */
        listBuckets() {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield get(this.fetch, `${this.url}/bucket`, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Retrieves the details of an existing Storage bucket.
         *
         * @param id The unique identifier of the bucket you would like to retrieve.
         */
        getBucket(id) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield get(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Creates a new Storage bucket
         *
         * @param id A unique identifier for the bucket you are creating.
         * @returns newly created bucket id
         */
        createBucket(id, options = { public: false }) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/bucket`, { id, name: id, public: options.public }, { headers: this.headers });
                    return { data: data.name, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Updates a new Storage bucket
         *
         * @param id A unique identifier for the bucket you are creating.
         */
        updateBucket(id, options) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield put(this.fetch, `${this.url}/bucket/${id}`, { id, name: id, public: options.public }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Removes all objects inside a single bucket.
         *
         * @param id The unique identifier of the bucket you would like to empty.
         */
        emptyBucket(id) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
         * You must first `empty()` the bucket.
         *
         * @param id The unique identifier of the bucket you would like to delete.
         */
        deleteBucket(id) {
            return __awaiter$3(this, void 0, void 0, function* () {
                try {
                    const data = yield remove$1(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
    }

    var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const DEFAULT_SEARCH_OPTIONS = {
        limit: 100,
        offset: 0,
        sortBy: {
            column: 'name',
            order: 'asc',
        },
    };
    const DEFAULT_FILE_OPTIONS = {
        cacheControl: '3600',
        contentType: 'text/plain;charset=UTF-8',
        upsert: false,
    };
    class StorageFileApi {
        constructor(url, headers = {}, bucketId, fetch) {
            this.url = url;
            this.headers = headers;
            this.bucketId = bucketId;
            this.fetch = resolveFetch$1(fetch);
        }
        /**
         * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
         *
         * @param method HTTP method.
         * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
         * @param fileBody The body of the file to be stored in the bucket.
         * @param fileOptions HTTP headers.
         * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
         * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
         * `upsert`: boolean, whether to perform an upsert.
         */
        uploadOrUpdate(method, path, fileBody, fileOptions) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    let body;
                    const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
                    const headers = Object.assign(Object.assign({}, this.headers), (method === 'POST' && { 'x-upsert': String(options.upsert) }));
                    if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
                        body = new FormData();
                        body.append('cacheControl', options.cacheControl);
                        body.append('', fileBody);
                    }
                    else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
                        body = fileBody;
                        body.append('cacheControl', options.cacheControl);
                    }
                    else {
                        body = fileBody;
                        headers['cache-control'] = `max-age=${options.cacheControl}`;
                        headers['content-type'] = options.contentType;
                    }
                    const cleanPath = this._removeEmptyFolders(path);
                    const _path = this._getFinalPath(cleanPath);
                    const res = yield this.fetch(`${this.url}/object/${_path}`, {
                        method,
                        body: body,
                        headers,
                    });
                    if (res.ok) {
                        // const data = await res.json()
                        // temporary fix till backend is updated to the latest storage-api version
                        return { data: { Key: _path }, error: null };
                    }
                    else {
                        const error = yield res.json();
                        return { data: null, error };
                    }
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Uploads a file to an existing bucket.
         *
         * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
         * @param fileBody The body of the file to be stored in the bucket.
         * @param fileOptions HTTP headers.
         * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
         * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
         * `upsert`: boolean, whether to perform an upsert.
         */
        upload(path, fileBody, fileOptions) {
            return __awaiter$2(this, void 0, void 0, function* () {
                return this.uploadOrUpdate('POST', path, fileBody, fileOptions);
            });
        }
        /**
         * Replaces an existing file at the specified path with a new one.
         *
         * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
         * @param fileBody The body of the file to be stored in the bucket.
         * @param fileOptions HTTP headers.
         * `cacheControl`: string, the `Cache-Control: max-age=<seconds>` seconds value.
         * `contentType`: string, the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
         * `upsert`: boolean, whether to perform an upsert.
         */
        update(path, fileBody, fileOptions) {
            return __awaiter$2(this, void 0, void 0, function* () {
                return this.uploadOrUpdate('PUT', path, fileBody, fileOptions);
            });
        }
        /**
         * Moves an existing file.
         *
         * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
         * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
         */
        move(fromPath, toPath) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Copies an existing file.
         *
         * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
         * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
         */
        copy(fromPath, toPath) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Create signed URL to download file without requiring permissions. This URL can be valid for a set number of seconds.
         *
         * @param path The file path to be downloaded, including the current file name. For example `folder/image.png`.
         * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
         */
        createSignedUrl(path, expiresIn) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const _path = this._getFinalPath(path);
                    let data = yield post(this.fetch, `${this.url}/object/sign/${_path}`, { expiresIn }, { headers: this.headers });
                    const signedURL = `${this.url}${data.signedURL}`;
                    data = { signedURL };
                    return { data, error: null, signedURL };
                }
                catch (error) {
                    return { data: null, error, signedURL: null };
                }
            });
        }
        /**
         * Create signed URLs to download files without requiring permissions. These URLs can be valid for a set number of seconds.
         *
         * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
         * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
         */
        createSignedUrls(paths, expiresIn) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const data = yield post(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
                    return {
                        data: data.map((datum) => (Object.assign(Object.assign({}, datum), { signedURL: datum.signedURL ? `${this.url}${datum.signedURL}` : null }))),
                        error: null,
                    };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Downloads a file.
         *
         * @param path The file path to be downloaded, including the path and file name. For example `folder/image.png`.
         */
        download(path) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const _path = this._getFinalPath(path);
                    const res = yield get(this.fetch, `${this.url}/object/${_path}`, {
                        headers: this.headers,
                        noResolveJson: true,
                    });
                    const data = yield res.blob();
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Retrieve URLs for assets in public buckets
         *
         * @param path The file path to be downloaded, including the path and file name. For example `folder/image.png`.
         */
        getPublicUrl(path) {
            try {
                const _path = this._getFinalPath(path);
                const publicURL = `${this.url}/object/public/${_path}`;
                const data = { publicURL };
                return { data, error: null, publicURL };
            }
            catch (error) {
                return { data: null, error, publicURL: null };
            }
        }
        /**
         * Deletes files within the same bucket
         *
         * @param paths An array of files to be deleted, including the path and file name. For example [`folder/image.png`].
         */
        remove(paths) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const data = yield remove$1(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        /**
         * Get file metadata
         * @param id the file id to retrieve metadata
         */
        // async getMetadata(id: string): Promise<{ data: Metadata | null; error: Error | null }> {
        //   try {
        //     const data = await get(`${this.url}/metadata/${id}`, { headers: this.headers })
        //     return { data, error: null }
        //   } catch (error) {
        //     return { data: null, error }
        //   }
        // }
        /**
         * Update file metadata
         * @param id the file id to update metadata
         * @param meta the new file metadata
         */
        // async updateMetadata(
        //   id: string,
        //   meta: Metadata
        // ): Promise<{ data: Metadata | null; error: Error | null }> {
        //   try {
        //     const data = await post(`${this.url}/metadata/${id}`, { ...meta }, { headers: this.headers })
        //     return { data, error: null }
        //   } catch (error) {
        //     return { data: null, error }
        //   }
        // }
        /**
         * Lists all the files within a bucket.
         * @param path The folder path.
         * @param options Search options, including `limit`, `offset`, and `sortBy`.
         * @param parameters Fetch parameters, currently only supports `signal`, which is an AbortController's signal
         */
        list(path, options, parameters) {
            return __awaiter$2(this, void 0, void 0, function* () {
                try {
                    const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || '' });
                    const data = yield post(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
        _getFinalPath(path) {
            return `${this.bucketId}/${path}`;
        }
        _removeEmptyFolders(path) {
            return path.replace(/^\/|\/$/g, '').replace(/\/+/g, '/');
        }
    }

    class StorageClient extends StorageBucketApi {
        constructor(url, headers = {}, fetch) {
            super(url, headers, fetch);
        }
        /**
         * Perform file operation in a bucket.
         *
         * @param id The bucket id to operate on.
         */
        from(id) {
            return new StorageFileApi(this.url, this.headers, id, this.fetch);
        }
    }

    const resolveFetch = (customFetch) => {
        let _fetch;
        if (customFetch) {
            _fetch = customFetch;
        }
        else if (typeof fetch === 'undefined') {
            _fetch = crossFetch;
        }
        else {
            _fetch = fetch;
        }
        return (...args) => _fetch(...args);
    };

    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class FunctionsClient {
        constructor(url, { headers = {}, customFetch, } = {}) {
            this.url = url;
            this.headers = headers;
            this.fetch = resolveFetch(customFetch);
        }
        /**
         * Updates the authorization header
         * @params token - the new jwt token sent in the authorisation header
         */
        setAuth(token) {
            this.headers.Authorization = `Bearer ${token}`;
        }
        /**
         * Invokes a function
         * @param functionName - the name of the function to invoke
         * @param invokeOptions - object with the following properties
         * `headers`: object representing the headers to send with the request
         * `body`: the body of the request
         * `responseType`: how the response should be parsed. The default is `json`
         */
        invoke(functionName, invokeOptions) {
            return __awaiter$1(this, void 0, void 0, function* () {
                try {
                    const { headers, body } = invokeOptions !== null && invokeOptions !== void 0 ? invokeOptions : {};
                    const response = yield this.fetch(`${this.url}/${functionName}`, {
                        method: 'POST',
                        headers: Object.assign({}, this.headers, headers),
                        body,
                    });
                    const isRelayError = response.headers.get('x-relay-error');
                    if (isRelayError && isRelayError === 'true') {
                        return { data: null, error: new Error(yield response.text()) };
                    }
                    let data;
                    const { responseType } = invokeOptions !== null && invokeOptions !== void 0 ? invokeOptions : {};
                    if (!responseType || responseType === 'json') {
                        data = yield response.json();
                    }
                    else if (responseType === 'arrayBuffer') {
                        data = yield response.arrayBuffer();
                    }
                    else if (responseType === 'blob') {
                        data = yield response.blob();
                    }
                    else {
                        data = yield response.text();
                    }
                    return { data, error: null };
                }
                catch (error) {
                    return { data: null, error };
                }
            });
        }
    }

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const DEFAULT_OPTIONS = {
        schema: 'public',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        multiTab: true,
        headers: DEFAULT_HEADERS$4,
    };
    /**
     * Supabase Client.
     *
     * An isomorphic Javascript client for interacting with Postgres.
     */
    class SupabaseClient {
        /**
         * Create a new client for use in the browser.
         * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
         * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
         * @param options.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
         * @param options.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
         * @param options.persistSession Set to "true" if you want to automatically save the user session into local storage.
         * @param options.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
         * @param options.headers Any additional headers to send with each network request.
         * @param options.realtime Options passed along to realtime-js constructor.
         * @param options.multiTab Set to "false" if you want to disable multi-tab/window events.
         * @param options.fetch A custom fetch implementation.
         */
        constructor(supabaseUrl, supabaseKey, options) {
            this.supabaseUrl = supabaseUrl;
            this.supabaseKey = supabaseKey;
            if (!supabaseUrl)
                throw new Error('supabaseUrl is required.');
            if (!supabaseKey)
                throw new Error('supabaseKey is required.');
            const _supabaseUrl = stripTrailingSlash(supabaseUrl);
            const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
            this.restUrl = `${_supabaseUrl}/rest/v1`;
            this.realtimeUrl = `${_supabaseUrl}/realtime/v1`.replace('http', 'ws');
            this.authUrl = `${_supabaseUrl}/auth/v1`;
            this.storageUrl = `${_supabaseUrl}/storage/v1`;
            const isPlatform = _supabaseUrl.match(/(supabase\.co)|(supabase\.in)/);
            if (isPlatform) {
                const urlParts = _supabaseUrl.split('.');
                this.functionsUrl = `${urlParts[0]}.functions.${urlParts[1]}.${urlParts[2]}`;
            }
            else {
                this.functionsUrl = `${_supabaseUrl}/functions/v1`;
            }
            this.schema = settings.schema;
            this.multiTab = settings.multiTab;
            this.fetch = settings.fetch;
            this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS$4), options === null || options === void 0 ? void 0 : options.headers);
            this.shouldThrowOnError = settings.shouldThrowOnError || false;
            this.auth = this._initSupabaseAuthClient(settings);
            this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers }, settings.realtime));
            this._listenForAuthEvents();
            this._listenForMultiTabEvents();
            // In the future we might allow the user to pass in a logger to receive these events.
            // this.realtime.onOpen(() => console.log('OPEN'))
            // this.realtime.onClose(() => console.log('CLOSED'))
            // this.realtime.onError((e: Error) => console.log('Socket error', e))
        }
        /**
         * Supabase Functions allows you to deploy and invoke edge functions.
         */
        get functions() {
            return new FunctionsClient(this.functionsUrl, {
                headers: this._getAuthHeaders(),
                customFetch: this.fetch,
            });
        }
        /**
         * Supabase Storage allows you to manage user-generated content, such as photos or videos.
         */
        get storage() {
            return new StorageClient(this.storageUrl, this._getAuthHeaders(), this.fetch);
        }
        /**
         * Perform a table operation.
         *
         * @param table The table name to operate on.
         */
        from(table) {
            const url = `${this.restUrl}/${table}`;
            return new SupabaseQueryBuilder(url, {
                headers: this._getAuthHeaders(),
                schema: this.schema,
                realtime: this.realtime,
                table,
                fetch: this.fetch,
                shouldThrowOnError: this.shouldThrowOnError,
            });
        }
        /**
         * Perform a function call.
         *
         * @param fn  The function name to call.
         * @param params  The parameters to pass to the function call.
         * @param head   When set to true, no data will be returned.
         * @param count  Count algorithm to use to count rows in a table.
         *
         */
        rpc(fn, params, { head = false, count = null, } = {}) {
            const rest = this._initPostgRESTClient();
            return rest.rpc(fn, params, { head, count });
        }
        /**
         * Creates a channel with Broadcast and Presence.
         * Activated when vsndate query param is present in the WebSocket URL.
         */
        channel(name, opts) {
            var _a, _b;
            const userToken = (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
            if (!this.realtime.isConnected()) {
                this.realtime.connect();
            }
            return this.realtime.channel(name, Object.assign(Object.assign({}, opts), { user_token: userToken }));
        }
        /**
         * Closes and removes all subscriptions and returns a list of removed
         * subscriptions and their errors.
         */
        removeAllSubscriptions() {
            return __awaiter(this, void 0, void 0, function* () {
                const allSubs = this.getSubscriptions().slice();
                const allSubPromises = allSubs.map((sub) => this.removeSubscription(sub));
                const allRemovedSubs = yield Promise.all(allSubPromises);
                return allRemovedSubs.map(({ error }, i) => {
                    return {
                        data: { subscription: allSubs[i] },
                        error,
                    };
                });
            });
        }
        /**
         * Closes and removes a channel and returns the number of open channels.
         *
         * @param channel The channel you want to close and remove.
         */
        removeChannel(channel) {
            return __awaiter(this, void 0, void 0, function* () {
                const { error } = yield this._closeSubscription(channel);
                const allChans = this.getSubscriptions();
                const openChanCount = allChans.filter((chan) => chan.isJoined()).length;
                if (allChans.length === 0)
                    yield this.realtime.disconnect();
                return { data: { openChannels: openChanCount }, error };
            });
        }
        /**
         * Closes and removes a subscription and returns the number of open subscriptions.
         *
         * @param subscription The subscription you want to close and remove.
         */
        removeSubscription(subscription) {
            return __awaiter(this, void 0, void 0, function* () {
                const { error } = yield this._closeSubscription(subscription);
                const allSubs = this.getSubscriptions();
                const openSubCount = allSubs.filter((chan) => chan.isJoined()).length;
                if (allSubs.length === 0)
                    yield this.realtime.disconnect();
                return { data: { openSubscriptions: openSubCount }, error };
            });
        }
        _closeSubscription(subscription) {
            return __awaiter(this, void 0, void 0, function* () {
                let error = null;
                if (!subscription.isClosed()) {
                    const { error: unsubError } = yield this._unsubscribeSubscription(subscription);
                    error = unsubError;
                }
                this.realtime.remove(subscription);
                return { error };
            });
        }
        _unsubscribeSubscription(subscription) {
            return new Promise((resolve) => {
                subscription
                    .unsubscribe()
                    .receive('ok', () => resolve({ error: null }))
                    .receive('error', (error) => resolve({ error }))
                    .receive('timeout', () => resolve({ error: new Error('timed out') }));
            });
        }
        /**
         * Returns an array of all your subscriptions.
         */
        getSubscriptions() {
            return this.realtime.channels;
        }
        _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, localStorage, headers, fetch, cookieOptions, multiTab, }) {
            const authHeaders = {
                Authorization: `Bearer ${this.supabaseKey}`,
                apikey: `${this.supabaseKey}`,
            };
            return new SupabaseAuthClient({
                url: this.authUrl,
                headers: Object.assign(Object.assign({}, headers), authHeaders),
                autoRefreshToken,
                persistSession,
                detectSessionInUrl,
                localStorage,
                fetch,
                cookieOptions,
                multiTab,
            });
        }
        _initRealtimeClient(options) {
            return new RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), { params: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.params), { apikey: this.supabaseKey }) }));
        }
        _initPostgRESTClient() {
            return new PostgrestClient(this.restUrl, {
                headers: this._getAuthHeaders(),
                schema: this.schema,
                fetch: this.fetch,
                throwOnError: this.shouldThrowOnError,
            });
        }
        _getAuthHeaders() {
            var _a, _b;
            const headers = Object.assign({}, this.headers);
            const authBearer = (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
            headers['apikey'] = this.supabaseKey;
            headers['Authorization'] = headers['Authorization'] || `Bearer ${authBearer}`;
            return headers;
        }
        _listenForMultiTabEvents() {
            if (!this.multiTab || !isBrowser$1() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
                return null;
            }
            try {
                return window === null || window === void 0 ? void 0 : window.addEventListener('storage', (e) => {
                    var _a, _b, _c;
                    if (e.key === STORAGE_KEY$1) {
                        const newSession = JSON.parse(String(e.newValue));
                        const accessToken = (_b = (_a = newSession === null || newSession === void 0 ? void 0 : newSession.currentSession) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : undefined;
                        const previousAccessToken = (_c = this.auth.session()) === null || _c === void 0 ? void 0 : _c.access_token;
                        if (!accessToken) {
                            this._handleTokenChanged('SIGNED_OUT', accessToken, 'STORAGE');
                        }
                        else if (!previousAccessToken && accessToken) {
                            this._handleTokenChanged('SIGNED_IN', accessToken, 'STORAGE');
                        }
                        else if (previousAccessToken !== accessToken) {
                            this._handleTokenChanged('TOKEN_REFRESHED', accessToken, 'STORAGE');
                        }
                    }
                });
            }
            catch (error) {
                console.error('_listenForMultiTabEvents', error);
                return null;
            }
        }
        _listenForAuthEvents() {
            let { data } = this.auth.onAuthStateChange((event, session) => {
                this._handleTokenChanged(event, session === null || session === void 0 ? void 0 : session.access_token, 'CLIENT');
            });
            return data;
        }
        _handleTokenChanged(event, token, source) {
            if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') &&
                this.changedAccessToken !== token) {
                // Token has changed
                this.realtime.setAuth(token);
                // Ideally we should call this.auth.recoverSession() - need to make public
                // to trigger a "SIGNED_IN" event on this client.
                if (source == 'STORAGE')
                    this.auth.setAuth(token);
                this.changedAccessToken = token;
            }
            else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
                // Token is removed
                this.realtime.setAuth(this.supabaseKey);
                if (source == 'STORAGE')
                    this.auth.signOut();
            }
        }
    }

    /**
     * Creates a new Supabase Client.
     */
    const createClient = (supabaseUrl, supabaseKey, options) => {
        return new SupabaseClient(supabaseUrl, supabaseKey, options);
    };

    const url = 'https://vjjrqcikqjrfhzgboilx.supabase.co';
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqanJxY2lrcWpyZmh6Z2JvaWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMwMDUwNzIsImV4cCI6MTk2ODU4MTA3Mn0.Oylk_toXSMsF4sXO4hOr--mj8Wce30Rp7i_uTdlFjKU';

    const supabase = createClient(url, key);

    const date$1 = ({ year = 0, month = 0, date = 1, hour = 0, minute = 0, second = 0, milli = 0 }) => {
    	return new Date(year, month, date, hour, minute, second, milli);
    };

    class Timestamp {
    	set({ years, months, date, hours, minutes, seconds, millis }) {
    		let d = date$1(this);

    		if (years !== undefined)	 d.setFullYear(years);
    		if (months !== undefined)	d.setMonth(months);
    		if (date !== undefined)		d.setDate(date);
    		if (hours !== undefined)	 d.setHours(hours);
    		if (minutes !== undefined) d.setMinutes(minutes);
    		if (seconds !== undefined) d.setFullYear(seconds);
    		if (millis !== undefined)	d.setMilliseconds(millis);

    		this.year = d.getFullYear();
    		this.month = d.getMonth();
    		this.date = d.getDate();
    		this.hour = d.getHours();
    		this.minute = d.getMinutes();
    		this.second = d.getSeconds();
    		this.milli = d.getMilliseconds();

    		return this;
    	}

    	add({ years, months, date, hours, minutes, seconds, millis }) {
    		let d = date$1(this);

    		if (years !== undefined)	 d.setFullYear(this.year + years);
    		if (months !== undefined)	d.setMonth(this.month + months);
    		if (date !== undefined)		d.setDate(this.date + date);
    		if (hours !== undefined)	 d.setHours(this.hour + hours);
    		if (minutes !== undefined) d.setMinutes(this.minute + minutes);
    		if (seconds !== undefined) d.setFullYear(this.second + seconds);
    		if (millis !== undefined)	d.setMilliseconds(this.milli + millis);

    		this.year = d.getFullYear();
    		this.month = d.getMonth();
    		this.date = d.getDate();
    		this.hour = d.getHours();
    		this.minute = d.getMinutes();
    		this.second = d.getSeconds();
    		this.milli = d.getMilliseconds();

    		return this;
    	}

    	clone(which) {
    		which ??= { milli: true };

    		let ts = new Timestamp(this);

    		if (!which.milli) ts.milli = undefined; else return ts;
    		if (!which.second) ts.second = undefined; else return ts;
    		if (!which.minute) ts.minute = undefined; else return ts;
    		if (!which.hour) ts.hour = undefined; else return ts;
    		if (!which.date) ts.date = undefined; else return ts;
    		if (!which.month) ts.month = undefined; else return ts;
    		if (!which.year) ts.year = undefined; else return ts;

    		return ts;
    	}

    	toLongMonth(month) {
    		return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month ?? this.month]
    	}

    	weekday() {
    		return date$1(this).getDay();
    	}

    	toLongWeekday() {
    		return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.weekday()];
    	}

    	string() {
    		return date$1(this).toLocaleDateString();
    	}

    	constructor(date = new Date(Date.now())) {
    		if (date instanceof Date) { // Construct from Date object
    			this.year = date.getFullYear();
    			this.month = date.getMonth();
    			this.date = date.getDate();
    			this.hour = date.getHours();
    			this.minute = date.getMinutes();
    			this.second = date.getSeconds();
    			this.milli = date.getMilliseconds();
    		} else { // Construct from Timestamp object or classless object
    			this.year = date.year;
    			this.month = date.month;
    			this.date = date.date;
    			this.hour = date.hour;
    			this.minute = date.minute;
    			this.second = date.second;
    			this.milli = date.milli;
    		}
    	}
    }

    const read$1 = async () => {
    	let items = [];

    	const { data, error, status } = await supabase
    		.from('items')
    		.select('*');

    	if (error || status === 406) console.error(error);

    	if (data) {
    		for (let item of data) {
    			items.push({
    				title: item.title,
    				description: item.description,
    				start: item.start ? new Timestamp(new Date(item.start)) : undefined,
    				finish: item.finish ? new Timestamp(new Date(item.finish)) : undefined,
    				completed: item.completed,
    				color: { h: item.h, s: item.s, v: item.v },
    				cal: item.cal,
    				id: item.id
    			});
    		}
    	}

    	console.log({ items });

    	return items;
    };

    writable(new Timestamp());

    const mouse = writable({
    	x: null,
    	y: null,
    	down: {
    		x: null,
    		y: null,
    		target:null
    	},
    	buttons: 0,
    	target: null
    });

    const stack = writable([]);

    const loading = writable(false);

    const route = writable({});

    const populate = async () => {
    	loading.set(true);
    	const data = await read$1();
    	loading.set(false);

    	items.set(data);
    };

    const items = writable([]);

    populate();

    const user = writable();

    const preferences = writable({
    	colors: [],
    	theme: { dark: true },
    	hour24: false
    });

    const compare = (ts1, ts2, depth = { milli: true }) => {
    	if (!(ts1 instanceof Timestamp) || !(ts2 instanceof Timestamp)) return {};

    	if (depth.milli) depth.second = true;
    	if (depth.second) depth.minute = true;
    	if (depth.minute) depth.hour = true;
    	if (depth.hour) depth.date = true;
    	if (depth.date) depth.month = true;
    	if (depth.month) depth.year = true;

    	if (depth.year) {
    		if (ts1.year < ts2.year && depth.year) {
    			return { less: true };
    		} else if (ts1.year > ts2.year && depth.year) {
    			return { greater: true };
    		}
    	}

    	if (depth.month) {
    		if (ts1.month < ts2.month && depth.month) {
    			return { less: true };
    		} else if (ts1.month > ts2.month && depth.month) {
    			return { greater: true };
    		}
    	}

    	if (depth.date) {
    		if (ts1.date < ts2.date && depth.date) {
    			return { less: true };
    		} else if (ts1.date > ts2.date && depth.date) {
    			return { greater: true };
    		}
    	}

    	if (depth.hour) {
    		if (ts1.hour < ts2.hour) {
    			return { less: true };
    		} else if (ts1.hour > ts2.hour) {
    			return { greater: true };
    		}
    	}

    	if (depth.minute) {
    		if (ts1.minute < ts2.minute) {
    			return { less: true };
    		} else if (ts1.minute > ts2.minute) {
    			return { greater: true };
    		}
    	}

    	if (depth.second) {
    		if (ts1.second < ts2.second) {
    			return { less: true };
    		} else if (ts1.second > ts2.second) {
    			return { greater: true };
    		}
    	}

    	if (depth.milli) {
    		if (ts1.milli < ts2.milli) {
    			return { less: true };
    		} else if (ts1.milli > ts2.milli) {
    			return { greater: true };
    		}
    	}

    	return { equals: true };
    };

    const hour = v => {
    	if (get_store_value(preferences).hour24) return String(v).padStart(2, '0');
    	else return v % 12 === 0 ? 12 : v % 12;
    };

    const minute = v => {
    	return String(v).padStart(2, '0');
    };

    const ampm = v => {
    	if (get_store_value(preferences).hour24) return '';
    	else return v < 12 ? 'AM' : 'PM';
    };

    let date = date$1;

    const add = (store, item) => {
    	console.log(item);
    	let array = get_store_value(store);

    	const time = item.start ?? item.end;
    	if (!time) {
    		store.set([item, ...array]);
    	} else {
    		let index = 0;

    		for (; index < array.length; index++) {
    			if (!array[index].start && !array[index].end) continue;
    			if (compare(time, array[index].start ?? array[index].end).less) continue;
    	
    			store.set(array.insert(index, item));
    			console.log(get_store_value(store));
    			return;
    		}
    	}

    	store.set([item, ...array]); // TODO?: Fallback
    };

    const save$1 = async item => {
    	item.title ||= 'Untitled item';

    	// if (item.id) {
    	// 	items.set(get(items)); // Trigger Svelte reactivity
    	// 	console.log(get(items))
    	// 	// const index = get(items).findIndex(v => v.id === item.id);
    	// 	// console.log(index, get(items)[index], item)
    	// }

    	item.id || add(items, item);

    	console.log(get_store_value(items));

    	loading.set(true);
    	const { data, error: e } = await supabase.from('items').upsert({
    		title: item.title,
    		description: item.description,
    		start: item.start ? date(item.start) : undefined,
    		finish: item.finish ? date(item.finish) : undefined,
    		completed: item.completed ? date(item.completed) : undefined,
    		h: item.color.h,
    		s: item.color.s,
    		v: item.color.v,
    		cal: item.cal,
    		id: item.id,
    		user_id: get_store_value(user) && get_store_value(user).id // TODO: unsafe???
    	});
    	loading.set(false);

    	if (e) error(e);

    	item.id = data[0].id; // Update object by reference
    	items.set(get_store_value(items)); // Trigger Svelte reactivity
    };

    const read = async () => {
    	let { data, error, status } = await supabase
    		.from('users')
    		.select('preferences');

    	if (error || status === 406) console.error(error ?? status);

    	data = data[0].preferences;

    	if (data) return JSON.parse(data);
    	else return {
    		colors: [],
    		theme: { dark: true },
    		hour24: false
    	};
    };

    const save = async (id, preferences) => {
    	const { error } = await supabase
    		.from('users')
    		.upsert({
    			user_id: id,
    			preferences: JSON.stringify(preferences)
    		});

    	if (error) console.error(error);

    	const { data } = await supabase.from('users').select('preferences');
    	return JSON.parse(data[0].preferences)
    };

    const error$1 = e => {
    	stack.set([...get_store_value(stack), { type: 'error', message: e }]);
    };

    const signin = async (email, password) => {
    	const { user, error: e } = await supabase.auth.signIn({ email, password });

    	console.log(user, e);

    	if (!user && !e) stack.set([...get_store_value(stack), { type: 'success', message: 'Check your email to log in!' }]);

    	if (e) error$1(e.message);

    	return user;
    };

    const signout = async () => {
    	localStorage.clear();
    	supabase.auth.signOut();
    	// try {
    	// 	let { error } = await supabase.auth.signOut();
    	// 	if (error) throw error;
    	// } catch (error) {
    	// 	console.error(error.error_description || error.message);
    	// }
    };

    /* src/svg/Refresh.svelte generated by Svelte v3.49.0 */

    const file$u = "src/svg/Refresh.svelte";

    function create_fragment$w(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15");
    			add_location(path, file$u, 5, 111, 303);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$u, 5, 1, 193);
    			set_style(div, "width", /*size*/ ctx[0]);
    			set_style(div, "height", /*size*/ ctx[0]);
    			set_style(div, "fill", /*fill*/ ctx[1]);
    			set_style(div, "stroke", /*stroke*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[3]);
    			attr_dev(div, "class", "svelte-av9kyx");
    			add_location(div, file$u, 4, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(div, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(div, "stroke", /*stroke*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div, "color", /*color*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Refresh', slots, []);
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Refresh> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, fill, stroke, color];
    }

    class Refresh extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { size: 0, fill: 1, stroke: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Refresh",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get size() {
    		throw new Error("<Refresh>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Refresh>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Refresh>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Refresh>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Refresh>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Refresh>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Refresh>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Refresh>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Sync.svelte generated by Svelte v3.49.0 */
    const file$t = "src/components/Sync.svelte";

    // (6:0) { #if $loading }
    function create_if_block$b(ctx) {
    	let main;
    	let div;
    	let refresh;
    	let current;

    	refresh = new Refresh({
    			props: { color: "var(--secondary)" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			create_component(refresh.$$.fragment);
    			attr_dev(div, "class", "svelte-1yygb4v");
    			add_location(div, file$t, 7, 2, 134);
    			attr_dev(main, "class", "svelte-1yygb4v");
    			add_location(main, file$t, 6, 1, 125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(refresh, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(refresh.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(refresh.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(refresh);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(6:0) { #if $loading }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$loading*/ ctx[0] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$loading*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*$loading*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let $loading;
    	validate_store(loading, 'loading');
    	component_subscribe($$self, loading, $$value => $$invalidate(0, $loading = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sync', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sync> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ loading, Refresh, $loading });
    	return [$loading];
    }

    class Sync extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sync",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    const plural = (number, word) => number === 1 ? word : `${word}s`;

    /* src/components/Stats.svelte generated by Svelte v3.49.0 */
    const file$s = "src/components/Stats.svelte";

    // (13:1) { :else }
    function create_else_block$4(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "You've completed everything on your list!";
    			add_location(p, file$s, 13, 2, 326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(13:1) { :else }",
    		ctx
    	});

    	return block;
    }

    // (11:1) { #if uncompleted.length }
    function create_if_block$a(ctx) {
    	let p;
    	let t0_value = /*uncompleted*/ ctx[0].length + "";
    	let t0;
    	let t1;
    	let t2_value = plural(/*uncompleted*/ ctx[0].length, 'item') + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(" remaining");
    			add_location(p, file$s, 11, 2, 238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*uncompleted*/ 1 && t0_value !== (t0_value = /*uncompleted*/ ctx[0].length + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*uncompleted*/ 1 && t2_value !== (t2_value = plural(/*uncompleted*/ ctx[0].length, 'item') + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(11:1) { #if uncompleted.length }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let main;

    	function select_block_type(ctx, dirty) {
    		if (/*uncompleted*/ ctx[0].length) return create_if_block$a;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			add_location(main, file$s, 9, 0, 201);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_block.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(main, null);
    				}
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $items;
    	validate_store(items, 'items');
    	component_subscribe($$self, items, $$value => $$invalidate(1, $items = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stats', slots, []);
    	let uncompleted = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Stats> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ items, plural, uncompleted, $items });

    	$$self.$inject_state = $$props => {
    		if ('uncompleted' in $$props) $$invalidate(0, uncompleted = $$props.uncompleted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$items*/ 2) {
    			$$invalidate(0, uncompleted = $items.filter(item => !item.completed));
    		}
    	};

    	return [uncompleted, $items];
    }

    class Stats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stats",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide$1(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    const slide = (
    	node,
    	{ axis = 'height', delay = 0, duration = 300, easing = cubicOut, fade = false }
    ) => {
    	const style = getComputedStyle(node);
    	const height = parseFloat(style[axis]);
    	const padding = { top: parseFloat(style.paddingTop), right: parseFloat(style.paddingRight), bottom: parseFloat(style.paddingBottom), left: parseFloat(style.paddingLeft) };
    	const opacity = +style.opacity;

    	if (axis === 'both') {
    		const width = parseFloat(style.width);
    		const height = parseFloat(style.height);
    		if (fade) {
    			return {
    				delay,
    				duration,
    				easing,
    				css: t => `
					overflow: hidden;
					width: ${t * width}px;
					height: ${t * height}px;
					padding-top: ${t * padding.top}px;
					padding-bottom: ${t * padding.bottom}px;
					padding-left: ${t * padding.left}px;
					padding-right: ${t * padding.right}px;
				`
    			};
    		} else {
    			return {
    				delay,
    				duration,
    				easing,
    				css: t => `
					overflow: hidden;
					width: ${t * width}px;
					height: ${t * height}px;
					padding-top: ${t * padding.top}px;
					padding-bottom: ${t * padding.bottom}px;
					padding-left: ${t * padding.left}px;
					padding-right: ${t * padding.right}px;
					opacity: ${t * opacity};
				`
    			};
    		}
    	}

    	if (fade) {
    		if (axis === 'height') {
    			return {
    				delay,
    				duration,
    				easing,
    				css: t => `
					overflow: hidden;
					height: ${t * height}px;
					padding-top: ${t * padding.top}px;
					padding-bottom: ${t * padding.bottom}px;
					opacity: ${t * opacity};
				`
    			};
    		} else if (axis === 'width') {
    			return {
    				delay,
    				duration,
    				easing,
    				css: t => `
					overflow: hidden;
					width: ${t * height}px;
					padding-left: ${t * padding.left}px;
					padding-right: ${t * padding.right}px;
					opacity: ${t * opacity};
				`
    			};
    		}
    	} else {
    		if (axis === 'height') {
    			return {
    				delay,
    				duration,
    				easing,
    				css: t => `
					overflow: hidden;
					height: ${t * height}px;
					padding-top: ${t * padding.top}px;
					padding-bottom: ${t * padding.bottom}px;
				`
    			};
    		} else if (axis === 'width') {
    			return {
    				delay,
    				duration,
    				easing,
    				css: t => `
					overflow: hidden;
					width: ${t * height}px;
					padding-left: ${t * padding.left}px;
					padding-right: ${t * padding.right}px;
				`
    			};
    		}
    	}
    };

    /* src/components/Modal.svelte generated by Svelte v3.49.0 */
    const file$r = "src/components/Modal.svelte";
    const get_tip_slot_changes = dirty => ({});
    const get_tip_slot_context = ctx => ({});

    function create_fragment$t(ctx) {
    	let main;
    	let div0;
    	let main_transition;
    	let t;
    	let div1;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	const tip_slot_template = /*#slots*/ ctx[3].tip;
    	const tip_slot = create_slot(tip_slot_template, ctx, /*$$scope*/ ctx[2], get_tip_slot_context);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			div1 = element("div");
    			if (tip_slot) tip_slot.c();
    			attr_dev(div0, "class", "focus svelte-5cox1s");
    			add_location(div0, file$r, 13, 1, 416);
    			attr_dev(main, "class", "svelte-5cox1s");
    			add_location(main, file$r, 12, 0, 317);
    			attr_dev(div1, "class", "tip svelte-5cox1s");
    			add_location(div1, file$r, 17, 0, 463);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*main_binding*/ ctx[4](main);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);

    			if (tip_slot) {
    				tip_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(main, "click", /*click*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (tip_slot) {
    				if (tip_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						tip_slot,
    						tip_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(tip_slot_template, /*$$scope*/ ctx[2], dirty, get_tip_slot_changes),
    						get_tip_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!main_transition) main_transition = create_bidirectional_transition(main, fade, { duration: 300, easing: cubicOut }, true);
    				main_transition.run(1);
    			});

    			transition_in(tip_slot, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, slide, { duration: 300, fade: true }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!main_transition) main_transition = create_bidirectional_transition(main, fade, { duration: 300, easing: cubicOut }, false);
    			main_transition.run(0);
    			transition_out(tip_slot, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, slide, { duration: 300, fade: true }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (default_slot) default_slot.d(detaching);
    			/*main_binding*/ ctx[4](null);
    			if (detaching && main_transition) main_transition.end();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			if (tip_slot) tip_slot.d(detaching);
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default','tip']);
    	let overlay;
    	let dispatch = createEventDispatcher();
    	const click = e => e.target === overlay && dispatch('close');
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function main_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			overlay = $$value;
    			$$invalidate(0, overlay);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		cubicOut,
    		fade,
    		slide,
    		overlay,
    		dispatch,
    		click
    	});

    	$$self.$inject_state = $$props => {
    		if ('overlay' in $$props) $$invalidate(0, overlay = $$props.overlay);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [overlay, click, $$scope, slots, main_binding];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src/svg/Chevron.svelte generated by Svelte v3.49.0 */

    const file$q = "src/svg/Chevron.svelte";

    // (18:0) { :else }
    function create_else_block$3(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M5 15l7-7 7 7");
    			add_location(path, file$q, 19, 112, 1386);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$q, 19, 2, 1276);
    			set_style(div, "width", /*size*/ ctx[1]);
    			set_style(div, "height", /*size*/ ctx[1]);
    			set_style(div, "fill", /*fill*/ ctx[2]);
    			set_style(div, "stroke", /*stroke*/ ctx[3]);
    			set_style(div, "color", /*color*/ ctx[4]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$q, 18, 1, 1181);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				set_style(div, "width", /*size*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(div, "height", /*size*/ ctx[1]);
    			}

    			if (dirty & /*fill*/ 4) {
    				set_style(div, "fill", /*fill*/ ctx[2]);
    			}

    			if (dirty & /*stroke*/ 8) {
    				set_style(div, "stroke", /*stroke*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 16) {
    				set_style(div, "color", /*color*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(18:0) { :else }",
    		ctx
    	});

    	return block;
    }

    // (14:33) 
    function create_if_block_2$3(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M19 9l-7 7-7-7");
    			add_location(path, file$q, 15, 112, 1059);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$q, 15, 2, 949);
    			set_style(div, "width", /*size*/ ctx[1]);
    			set_style(div, "height", /*size*/ ctx[1]);
    			set_style(div, "fill", /*fill*/ ctx[2]);
    			set_style(div, "stroke", /*stroke*/ ctx[3]);
    			set_style(div, "color", /*color*/ ctx[4]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$q, 14, 1, 854);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				set_style(div, "width", /*size*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(div, "height", /*size*/ ctx[1]);
    			}

    			if (dirty & /*fill*/ 4) {
    				set_style(div, "fill", /*fill*/ ctx[2]);
    			}

    			if (dirty & /*stroke*/ 8) {
    				set_style(div, "stroke", /*stroke*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 16) {
    				set_style(div, "color", /*color*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(14:33) ",
    		ctx
    	});

    	return block;
    }

    // (10:34) 
    function create_if_block_1$5(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M9 5l7 7-7 7");
    			add_location(path, file$q, 11, 112, 710);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$q, 11, 2, 600);
    			set_style(div, "width", /*size*/ ctx[1]);
    			set_style(div, "height", /*size*/ ctx[1]);
    			set_style(div, "fill", /*fill*/ ctx[2]);
    			set_style(div, "stroke", /*stroke*/ ctx[3]);
    			set_style(div, "color", /*color*/ ctx[4]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$q, 10, 1, 505);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				set_style(div, "width", /*size*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(div, "height", /*size*/ ctx[1]);
    			}

    			if (dirty & /*fill*/ 4) {
    				set_style(div, "fill", /*fill*/ ctx[2]);
    			}

    			if (dirty & /*stroke*/ 8) {
    				set_style(div, "stroke", /*stroke*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 16) {
    				set_style(div, "color", /*color*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(10:34) ",
    		ctx
    	});

    	return block;
    }

    // (6:0) { #if direction === 'left' }
    function create_if_block$9(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M15 19l-7-7 7-7");
    			add_location(path, file$q, 7, 112, 357);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$q, 7, 2, 247);
    			set_style(div, "width", /*size*/ ctx[1]);
    			set_style(div, "height", /*size*/ ctx[1]);
    			set_style(div, "fill", /*fill*/ ctx[2]);
    			set_style(div, "stroke", /*stroke*/ ctx[3]);
    			set_style(div, "color", /*color*/ ctx[4]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$q, 6, 1, 152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size*/ 2) {
    				set_style(div, "width", /*size*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(div, "height", /*size*/ ctx[1]);
    			}

    			if (dirty & /*fill*/ 4) {
    				set_style(div, "fill", /*fill*/ ctx[2]);
    			}

    			if (dirty & /*stroke*/ 8) {
    				set_style(div, "stroke", /*stroke*/ ctx[3]);
    			}

    			if (dirty & /*color*/ 16) {
    				set_style(div, "color", /*color*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(6:0) { #if direction === 'left' }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*direction*/ ctx[0] === 'left') return create_if_block$9;
    		if (/*direction*/ ctx[0] === 'right') return create_if_block_1$5;
    		if (/*direction*/ ctx[0] === 'down') return create_if_block_2$3;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chevron', slots, []);
    	let { direction } = $$props;
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['direction', 'size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chevron> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(2, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(3, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(4, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ direction, size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('direction' in $$props) $$invalidate(0, direction = $$props.direction);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(2, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(3, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(4, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [direction, size, fill, stroke, color];
    }

    class Chevron extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			direction: 0,
    			size: 1,
    			fill: 2,
    			stroke: 3,
    			color: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chevron",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*direction*/ ctx[0] === undefined && !('direction' in props)) {
    			console.warn("<Chevron> was created without expected prop 'direction'");
    		}
    	}

    	get direction() {
    		throw new Error("<Chevron>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Chevron>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Chevron>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Chevron>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Chevron>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Chevron>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Chevron>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Chevron>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Chevron>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Chevron>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/element/Input.svelte generated by Svelte v3.49.0 */

    const file$p = "src/components/element/Input.svelte";

    // (28:33) 
    function create_if_block_4$1(ctx) {
    	let h4;
    	let t0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			input = element("input");
    			attr_dev(h4, "class", "svelte-16sd50q");
    			add_location(h4, file$p, 28, 2, 759);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			attr_dev(input, "style", /*style*/ ctx[3]);
    			add_location(input, file$p, 29, 2, 777);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*internal*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[11]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) set_data_dev(t0, /*name*/ ctx[1]);

    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*style*/ 8) {
    				attr_dev(input, "style", /*style*/ ctx[3]);
    			}

    			if (dirty & /*internal*/ 16 && input.value !== /*internal*/ ctx[4]) {
    				set_input_value(input, /*internal*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(28:33) ",
    		ctx
    	});

    	return block;
    }

    // (25:30) 
    function create_if_block_3$1(ctx) {
    	let h4;
    	let t0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			input = element("input");
    			attr_dev(h4, "class", "svelte-16sd50q");
    			add_location(h4, file$p, 25, 2, 638);
    			attr_dev(input, "type", "email");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			attr_dev(input, "style", /*style*/ ctx[3]);
    			add_location(input, file$p, 26, 2, 656);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*internal*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[10]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) set_data_dev(t0, /*name*/ ctx[1]);

    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*style*/ 8) {
    				attr_dev(input, "style", /*style*/ ctx[3]);
    			}

    			if (dirty & /*internal*/ 16 && input.value !== /*internal*/ ctx[4]) {
    				set_input_value(input, /*internal*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(25:30) ",
    		ctx
    	});

    	return block;
    }

    // (20:31) 
    function create_if_block_2$2(ctx) {
    	let label;
    	let t0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$p, 22, 3, 544);
    			attr_dev(label, "class", "svelte-16sd50q");
    			add_location(label, file$p, 20, 2, 523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, input);
    			input.checked = /*internal*/ ctx[4];

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[9]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) set_data_dev(t0, /*name*/ ctx[1]);

    			if (dirty & /*internal*/ 16) {
    				input.checked = /*internal*/ ctx[4];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(20:31) ",
    		ctx
    	});

    	return block;
    }

    // (17:33) 
    function create_if_block_1$4(ctx) {
    	let h4;
    	let t0;
    	let t1;
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			textarea = element("textarea");
    			attr_dev(h4, "class", "svelte-16sd50q");
    			add_location(h4, file$p, 17, 2, 402);
    			attr_dev(textarea, "type", "text");
    			attr_dev(textarea, "placeholder", /*placeholder*/ ctx[2]);
    			attr_dev(textarea, "style", /*style*/ ctx[3]);
    			add_location(textarea, file$p, 18, 2, 420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*internal*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) set_data_dev(t0, /*name*/ ctx[1]);

    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(textarea, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*style*/ 8) {
    				attr_dev(textarea, "style", /*style*/ ctx[3]);
    			}

    			if (dirty & /*internal*/ 16) {
    				set_input_value(textarea, /*internal*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(17:33) ",
    		ctx
    	});

    	return block;
    }

    // (14:1) { #if type === 'text' }
    function create_if_block$8(ctx) {
    	let h4;
    	let t0;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t0 = text(/*name*/ ctx[1]);
    			t1 = space();
    			input = element("input");
    			attr_dev(h4, "class", "svelte-16sd50q");
    			add_location(h4, file$p, 14, 2, 282);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			attr_dev(input, "style", /*style*/ ctx[3]);
    			add_location(input, file$p, 15, 2, 300);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*internal*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) set_data_dev(t0, /*name*/ ctx[1]);

    			if (dirty & /*placeholder*/ 4) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
    			}

    			if (dirty & /*style*/ 8) {
    				attr_dev(input, "style", /*style*/ ctx[3]);
    			}

    			if (dirty & /*internal*/ 16 && input.value !== /*internal*/ ctx[4]) {
    				set_input_value(input, /*internal*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(14:1) { #if type === 'text' }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let main;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[0] === 'text') return create_if_block$8;
    		if (/*type*/ ctx[0] === 'textarea') return create_if_block_1$4;
    		if (/*type*/ ctx[0] === 'toggle') return create_if_block_2$2;
    		if (/*type*/ ctx[0] === 'email') return create_if_block_3$1;
    		if (/*type*/ ctx[0] === 'password') return create_if_block_4$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			attr_dev(main, "class", "svelte-16sd50q");
    			add_location(main, file$p, 12, 0, 248);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(main, null);
    				}
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let internal;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { type = 'text' } = $$props;
    	let { value = '' } = $$props;
    	let { name = '' } = $$props;
    	let { placeholder = '' } = $$props;
    	let { set = v => v } = $$props;
    	let { style = '' } = $$props;
    	const writable_props = ['type', 'value', 'name', 'placeholder', 'set', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		internal = this.value;
    		($$invalidate(4, internal), $$invalidate(5, value));
    	}

    	function textarea_input_handler() {
    		internal = this.value;
    		($$invalidate(4, internal), $$invalidate(5, value));
    	}

    	function input_change_handler() {
    		internal = this.checked;
    		($$invalidate(4, internal), $$invalidate(5, value));
    	}

    	function input_input_handler_1() {
    		internal = this.value;
    		($$invalidate(4, internal), $$invalidate(5, value));
    	}

    	function input_input_handler_2() {
    		internal = this.value;
    		($$invalidate(4, internal), $$invalidate(5, value));
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('value' in $$props) $$invalidate(5, value = $$props.value);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('set' in $$props) $$invalidate(6, set = $$props.set);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    	};

    	$$self.$capture_state = () => ({
    		type,
    		value,
    		name,
    		placeholder,
    		set,
    		style,
    		internal
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('value' in $$props) $$invalidate(5, value = $$props.value);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
    		if ('set' in $$props) $$invalidate(6, set = $$props.set);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('internal' in $$props) $$invalidate(4, internal = $$props.internal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 32) {
    			$$invalidate(4, internal = value);
    		}

    		if ($$self.$$.dirty & /*internal, value, set*/ 112) {
    			(value !== internal && set(internal));
    		}
    	};

    	return [
    		type,
    		name,
    		placeholder,
    		style,
    		internal,
    		value,
    		set,
    		input_input_handler,
    		textarea_input_handler,
    		input_change_handler,
    		input_input_handler_1,
    		input_input_handler_2
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			type: 0,
    			value: 5,
    			name: 1,
    			placeholder: 2,
    			set: 6,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get set() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const clamp = (num, range) => {
    	let min = range?.min ?? -Infinity;
    	let max = range?.max ?? Infinity;

    	if (num < min) num = min;
    	if (max < num) num = max;

    	return num;
    };

    const hexify = (h = 0, s = 100, v = 100) => {
    	s /= 100;
    	v /= 100;

    	let l = v * (1 - v / 2);
    	if (l !== 0 && l !== 1) l = (v - l) / Math.min(l, 1 - l);

    	let a = s * Math.min(l, 1 - l);
      let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    	return `#${Math.floor(f(0) * 255).toString(16).padStart(2, '0')}${Math.floor(f(8) * 255).toString(16).padStart(2, '0')}${Math.floor(f(4) * 255).toString(16).padStart(2, '0')}`;
    };

    /* src/components/element/Color.svelte generated by Svelte v3.49.0 */
    const file$o = "src/components/element/Color.svelte";

    function create_fragment$q(ctx) {
    	let main;
    	let div4;
    	let div1;
    	let div0;
    	let div0_style_value;
    	let div1_style_value;
    	let t0;
    	let div3;
    	let div2;
    	let div2_style_value;
    	let t1;
    	let div5;
    	let p0;
    	let t3;
    	let input0;
    	let input0_value_value;
    	let t4;
    	let input1;
    	let input1_value_value;
    	let t5;
    	let input2;
    	let input2_value_value;
    	let t6;
    	let p1;
    	let t8;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t1 = space();
    			div5 = element("div");
    			p0 = element("p");
    			p0.textContent = "hsv(";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			input2 = element("input");
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = ")";
    			t8 = space();
    			button = element("button");
    			button.textContent = "Add to my list";
    			attr_dev(div0, "class", "pointer svelte-okepw2");

    			attr_dev(div0, "style", div0_style_value = `
				left: ${/*position*/ ctx[5].gradient.x}px;
				top: ${/*position*/ ctx[5].gradient.y}px;
				background: hsl(${/*value*/ ctx[0].h}, ${/*value*/ ctx[0].s}%, ${(2 - /*value*/ ctx[0].s / 100) * /*value*/ ctx[0].v / 2}%);
			`);

    			add_location(div0, file$o, 70, 3, 2045);
    			attr_dev(div1, "class", "gradient svelte-okepw2");

    			attr_dev(div1, "style", div1_style_value = `
			background:
				linear-gradient(to bottom, rgba(0, 0, 0, 0%) 0%, rgb(0, 0, 0) 100%),
				linear-gradient(to right, rgb(255, 255, 255) 5%, hsl(${/*value*/ ctx[0].h}, 100%, 50%) 100%);
		`);

    			add_location(div1, file$o, 65, 2, 1804);
    			attr_dev(div2, "class", "pointer svelte-okepw2");
    			attr_dev(div2, "style", div2_style_value = `left: ${/*position*/ ctx[5].band}px;`);
    			add_location(div2, file$o, 77, 3, 2326);
    			attr_dev(div3, "class", "band svelte-okepw2");
    			add_location(div3, file$o, 76, 2, 2286);
    			attr_dev(div4, "class", "color svelte-okepw2");
    			add_location(div4, file$o, 64, 1, 1781);
    			attr_dev(p0, "class", "svelte-okepw2");
    			add_location(p0, file$o, 81, 2, 2454);
    			attr_dev(input0, "type", "text");
    			input0.value = input0_value_value = Math.floor(/*value*/ ctx[0].h);
    			attr_dev(input0, "class", "svelte-okepw2");
    			add_location(input0, file$o, 82, 2, 2469);
    			attr_dev(input1, "type", "text");
    			input1.value = input1_value_value = "" + (Math.floor(/*value*/ ctx[0].s) + "%");
    			attr_dev(input1, "class", "svelte-okepw2");
    			add_location(input1, file$o, 83, 2, 2678);
    			attr_dev(input2, "type", "text");
    			input2.value = input2_value_value = "" + (Math.floor(/*value*/ ctx[0].v) + "%");
    			attr_dev(input2, "class", "svelte-okepw2");
    			add_location(input2, file$o, 84, 2, 2888);
    			attr_dev(p1, "class", "svelte-okepw2");
    			add_location(p1, file$o, 85, 2, 3098);
    			attr_dev(div5, "class", "type svelte-okepw2");
    			add_location(div5, file$o, 80, 1, 2432);
    			toggle_class(button, "disabled", /*listed*/ ctx[4] !== -1);
    			add_location(button, file$o, 87, 1, 3118);
    			attr_dev(main, "class", "svelte-okepw2");
    			add_location(main, file$o, 63, 0, 1772);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			/*div0_binding*/ ctx[12](div0);
    			/*div1_binding*/ ctx[13](div1);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			/*div2_binding*/ ctx[14](div2);
    			/*div3_binding*/ ctx[15](div3);
    			append_dev(main, t1);
    			append_dev(main, div5);
    			append_dev(div5, p0);
    			append_dev(div5, t3);
    			append_dev(div5, input0);
    			append_dev(div5, t4);
    			append_dev(div5, input1);
    			append_dev(div5, t5);
    			append_dev(div5, input2);
    			append_dev(div5, t6);
    			append_dev(div5, p1);
    			append_dev(main, t8);
    			append_dev(main, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "keydown", prevent_default(/*keydown_handler*/ ctx[16]), false, true, false),
    					listen_dev(input1, "keydown", prevent_default(/*keydown_handler_1*/ ctx[17]), false, true, false),
    					listen_dev(input2, "keydown", prevent_default(/*keydown_handler_2*/ ctx[18]), false, true, false),
    					listen_dev(button, "click", /*add*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*position, value*/ 33 && div0_style_value !== (div0_style_value = `
				left: ${/*position*/ ctx[5].gradient.x}px;
				top: ${/*position*/ ctx[5].gradient.y}px;
				background: hsl(${/*value*/ ctx[0].h}, ${/*value*/ ctx[0].s}%, ${(2 - /*value*/ ctx[0].s / 100) * /*value*/ ctx[0].v / 2}%);
			`)) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*value*/ 1 && div1_style_value !== (div1_style_value = `
			background:
				linear-gradient(to bottom, rgba(0, 0, 0, 0%) 0%, rgb(0, 0, 0) 100%),
				linear-gradient(to right, rgb(255, 255, 255) 5%, hsl(${/*value*/ ctx[0].h}, 100%, 50%) 100%);
		`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (dirty & /*position*/ 32 && div2_style_value !== (div2_style_value = `left: ${/*position*/ ctx[5].band}px;`)) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (dirty & /*value*/ 1 && input0_value_value !== (input0_value_value = Math.floor(/*value*/ ctx[0].h)) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty & /*value*/ 1 && input1_value_value !== (input1_value_value = "" + (Math.floor(/*value*/ ctx[0].s) + "%")) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty & /*value*/ 1 && input2_value_value !== (input2_value_value = "" + (Math.floor(/*value*/ ctx[0].v) + "%")) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}

    			if (dirty & /*listed*/ 16) {
    				toggle_class(button, "disabled", /*listed*/ ctx[4] !== -1);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*div0_binding*/ ctx[12](null);
    			/*div1_binding*/ ctx[13](null);
    			/*div2_binding*/ ctx[14](null);
    			/*div3_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let position;
    	let $mouse;
    	let $preferences;
    	validate_store(mouse, 'mouse');
    	component_subscribe($$self, mouse, $$value => $$invalidate(10, $mouse = $$value));
    	validate_store(preferences, 'preferences');
    	component_subscribe($$self, preferences, $$value => $$invalidate(11, $preferences = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Color', slots, []);
    	let { value } = $$props;
    	let { set = v => v } = $$props;
    	let gradient, band, pointer = { gradient: null, band: null };

    	const move = () => {
    		if ($mouse.buttons < 1) return;

    		if ($mouse.down.target === gradient) {
    			const rect = gradient.getBoundingClientRect();

    			set({
    				h: value.h,
    				s: (clamp($mouse.x, { min: rect.x, max: rect.width + rect.x }) - rect.x) / rect.width * 100,
    				v: (1 - (clamp($mouse.y, { min: rect.y, max: rect.height + rect.y }) - rect.y) / rect.height) * 100
    			});
    		} else if ($mouse.down.target === band) {
    			const rect = band.getBoundingClientRect();

    			set({
    				h: (clamp($mouse.x, { min: rect.x, max: rect.width + rect.x }) - rect.x) / rect.width * 360,
    				s: value.s,
    				v: value.v
    			});
    		}
    	};

    	const append = (key, value) => {
    		if ((/\D/).exec(key)) return value;
    		return parseInt(value.toString() + key);
    	};

    	const backspace = value => Math.floor(value / 10);
    	const find = (h, s, v) => $preferences.colors.findIndex(hsv => hexify(h, s, v) === hexify(hsv.h, hsv.s, hsv.v));

    	const add = () => {
    		if (listed !== -1) return;
    		set_store_value(preferences, $preferences.colors = [...$preferences.colors, value], $preferences);
    	};

    	let listed;
    	const writable_props = ['value', 'set'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Color> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			pointer.gradient = $$value;
    			$$invalidate(3, pointer);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			gradient = $$value;
    			$$invalidate(1, gradient);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			pointer.band = $$value;
    			$$invalidate(3, pointer);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			band = $$value;
    			$$invalidate(2, band);
    		});
    	}

    	const keydown_handler = ({ key }) => key === 'Backspace'
    	? $$invalidate(0, value.h = backspace(value.h), value)
    	: $$invalidate(0, value.h = clamp(append(key, value.h), { min: 0, max: 360 }), value);

    	const keydown_handler_1 = ({ key }) => key === 'Backspace'
    	? $$invalidate(0, value.s = backspace(value.s), value)
    	: $$invalidate(0, value.s = clamp(append(key, value.s), { min: 0, max: 100 }), value);

    	const keydown_handler_2 = ({ key }) => key === 'Backspace'
    	? $$invalidate(0, value.v = backspace(value.v), value)
    	: $$invalidate(0, value.v = clamp(append(key, value.v), { min: 0, max: 100 }), value);

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('set' in $$props) $$invalidate(9, set = $$props.set);
    	};

    	$$self.$capture_state = () => ({
    		mouse,
    		preferences,
    		clamp,
    		hexify,
    		value,
    		set,
    		gradient,
    		band,
    		pointer,
    		move,
    		append,
    		backspace,
    		find,
    		add,
    		listed,
    		position,
    		$mouse,
    		$preferences
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('set' in $$props) $$invalidate(9, set = $$props.set);
    		if ('gradient' in $$props) $$invalidate(1, gradient = $$props.gradient);
    		if ('band' in $$props) $$invalidate(2, band = $$props.band);
    		if ('pointer' in $$props) $$invalidate(3, pointer = $$props.pointer);
    		if ('listed' in $$props) $$invalidate(4, listed = $$props.listed);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value, gradient, pointer, band*/ 15) {
    			$$invalidate(5, position = {
    				gradient: {
    					x: value.s / 100 * (gradient?.offsetWidth - pointer.gradient?.offsetWidth) ?? 0,
    					y: (1 - value.v / 100) * (gradient?.offsetHeight - pointer.gradient?.offsetHeight) ?? 0
    				},
    				band: value.h / 360 * (band?.offsetWidth - pointer.band?.offsetWidth) ?? 0
    			});
    		}

    		if ($$self.$$.dirty & /*$preferences, value*/ 2049) {
    			($preferences.colors, $$invalidate(4, listed = find(value.h, value.s, value.v)));
    		}

    		if ($$self.$$.dirty & /*$mouse*/ 1024) {
    			($mouse.x, move());
    		}

    		if ($$self.$$.dirty & /*$mouse*/ 1024) {
    			($mouse.y, move());
    		}
    	};

    	return [
    		value,
    		gradient,
    		band,
    		pointer,
    		listed,
    		position,
    		append,
    		backspace,
    		add,
    		set,
    		$mouse,
    		$preferences,
    		div0_binding,
    		div1_binding,
    		div2_binding,
    		div3_binding,
    		keydown_handler,
    		keydown_handler_1,
    		keydown_handler_2
    	];
    }

    class Color extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { value: 0, set: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Color",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<Color> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error("<Color>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Color>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get set() {
    		throw new Error("<Color>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Color>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/element/Swatch.svelte generated by Svelte v3.49.0 */

    const file$n = "src/components/element/Swatch.svelte";

    function create_fragment$p(ctx) {
    	let main;

    	const block = {
    		c: function create() {
    			main = element("main");
    			set_style(main, "width", /*size*/ ctx[1]);
    			set_style(main, "height", /*size*/ ctx[1]);
    			set_style(main, "background", "hsl(" + (/*value*/ ctx[0]?.h ?? 0) + ", " + (/*value*/ ctx[0]?.s ?? 0) + "%, " + ((2 - /*value*/ ctx[0]?.s / 100) * /*value*/ ctx[0]?.v / 2 ?? 0) + "%)");
    			attr_dev(main, "class", "svelte-12ljnsh");
    			add_location(main, file$n, 5, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 2) {
    				set_style(main, "width", /*size*/ ctx[1]);
    			}

    			if (dirty & /*size*/ 2) {
    				set_style(main, "height", /*size*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_style(main, "background", "hsl(" + (/*value*/ ctx[0]?.h ?? 0) + ", " + (/*value*/ ctx[0]?.s ?? 0) + "%, " + ((2 - /*value*/ ctx[0]?.s / 100) * /*value*/ ctx[0]?.v / 2 ?? 0) + "%)");
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Swatch', slots, []);
    	let { value = undefined } = $$props;
    	let { size = '2rem' } = $$props;
    	const writable_props = ['value', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Swatch> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({ value, size });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, size];
    }

    class Swatch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { value: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Swatch",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get value() {
    		throw new Error("<Swatch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Swatch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Swatch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Swatch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/icons/filled/Close.svelte generated by Svelte v3.49.0 */

    const file$m = "src/icons/filled/Close.svelte";

    function create_fragment$o(ctx) {
    	let div;
    	let svg;
    	let title;
    	let t;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t = text("ionicons-v5-m");
    			path = svg_element("path");
    			add_location(title, file$m, 5, 88, 280);
    			attr_dev(path, "d", "M289.94,256l95-95A24,24,0,0,0,351,127l-95,95-95-95A24,24,0,0,0,127,161l95,95-95,95A24,24,0,1,0,161,385l95-95,95,95A24,24,0,0,0,385,351Z");
    			add_location(path, file$m, 5, 116, 308);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "512");
    			attr_dev(svg, "height", "512");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$m, 5, 1, 193);
    			set_style(div, "width", /*size*/ ctx[0]);
    			set_style(div, "height", /*size*/ ctx[0]);
    			set_style(div, "fill", /*fill*/ ctx[1]);
    			set_style(div, "stroke", /*stroke*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[3]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$m, 4, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, title);
    			append_dev(title, t);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(div, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(div, "stroke", /*stroke*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div, "color", /*color*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close', slots, []);
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Close> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, fill, stroke, color];
    }

    class Close extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { size: 0, fill: 1, stroke: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get size() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/element/Colors.svelte generated by Svelte v3.49.0 */
    const file$l = "src/components/element/Colors.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (17:1) { #each $preferences.colors ?? [] as color, index (color) }
    function create_each_block$7(key_1, ctx) {
    	let div2;
    	let div0;
    	let swatch;
    	let t0;
    	let p;
    	let t1_value = (/*color*/ ctx[6].name ?? hexify(/*color*/ ctx[6].h, /*color*/ ctx[6].s, /*color*/ ctx[6].v)) + "";
    	let t1;
    	let div0_style_value;
    	let t2;
    	let div1;
    	let button;
    	let close;
    	let t3;
    	let div2_transition;
    	let current;
    	let mounted;
    	let dispose;

    	swatch = new Swatch({
    			props: { value: /*color*/ ctx[6], size: "1.5rem" },
    			$$inline: true
    		});

    	close = new Close({
    			props: {
    				size: "1.5rem",
    				fill: "var(--neutral-high)"
    			},
    			$$inline: true
    		});

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*color*/ ctx[6]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[5](/*color*/ ctx[6]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(swatch.$$.fragment);
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			button = element("button");
    			create_component(close.$$.fragment);
    			t3 = space();
    			add_location(p, file$l, 20, 4, 711);
    			attr_dev(div0, "class", "name svelte-4drrvd");
    			attr_dev(div0, "style", div0_style_value = /*index*/ ctx[8] === /*value*/ ctx[0] && 'background: var(--secondary); color: var(--primary);');
    			add_location(div0, file$l, 18, 3, 561);
    			attr_dev(button, "type", "icon");
    			add_location(button, file$l, 23, 4, 896);
    			add_location(div1, file$l, 22, 3, 781);
    			attr_dev(div2, "class", "color svelte-4drrvd");
    			add_location(div2, file$l, 17, 2, 487);
    			this.first = div2;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(swatch, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			mount_component(close, button, null);
    			append_dev(div2, t3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", stop_propagation(click_handler), false, false, true),
    					listen_dev(div2, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const swatch_changes = {};
    			if (dirty & /*$preferences*/ 4) swatch_changes.value = /*color*/ ctx[6];
    			swatch.$set(swatch_changes);
    			if ((!current || dirty & /*$preferences*/ 4) && t1_value !== (t1_value = (/*color*/ ctx[6].name ?? hexify(/*color*/ ctx[6].h, /*color*/ ctx[6].s, /*color*/ ctx[6].v)) + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*$preferences, value*/ 5 && div0_style_value !== (div0_style_value = /*index*/ ctx[8] === /*value*/ ctx[0] && 'background: var(--secondary); color: var(--primary);')) {
    				attr_dev(div0, "style", div0_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swatch.$$.fragment, local);
    			transition_in(close.$$.fragment, local);

    			if (local) {
    				add_render_callback(() => {
    					if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, {}, true);
    					div2_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swatch.$$.fragment, local);
    			transition_out(close.$$.fragment, local);

    			if (local) {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, slide, {}, false);
    				div2_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(swatch);
    			destroy_component(close);
    			if (detaching && div2_transition) div2_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(17:1) { #each $preferences.colors ?? [] as color, index (color) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let main;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$preferences*/ ctx[2].colors ?? [];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*color*/ ctx[6];
    	validate_each_keys(ctx, each_value, get_each_context$7, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$7(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$7(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(main, "class", "svelte-4drrvd");
    			add_location(main, file$l, 15, 0, 417);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*set, $preferences, check, value, hexify*/ 15) {
    				each_value = /*$preferences*/ ctx[2].colors ?? [];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$7, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, outro_and_destroy_block, create_each_block$7, null, get_each_context$7);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $preferences;
    	validate_store(preferences, 'preferences');
    	component_subscribe($$self, preferences, $$value => $$invalidate(2, $preferences = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Colors', slots, []);
    	let { value = undefined } = $$props;
    	let { set = v => v } = $$props;

    	const check = (one, two) => {
    		if (one.h === two.h && one.s === two.s && one.v === two.v) return true;
    	};

    	const writable_props = ['value', 'set'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Colors> was created with unknown prop '${key}'`);
    	});

    	const click_handler = color => set_store_value(preferences, $preferences.colors = $preferences.colors.filter(c => !check(color, c)), $preferences);
    	const click_handler_1 = color => set(color);

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('set' in $$props) $$invalidate(1, set = $$props.set);
    	};

    	$$self.$capture_state = () => ({
    		preferences,
    		slide,
    		hexify,
    		Swatch,
    		Close,
    		value,
    		set,
    		check,
    		$preferences
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('set' in $$props) $$invalidate(1, set = $$props.set);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, set, $preferences, check, click_handler, click_handler_1];
    }

    class Colors extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { value: 0, set: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Colors",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get value() {
    		throw new Error("<Colors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Colors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get set() {
    		throw new Error("<Colors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Colors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Text.svelte generated by Svelte v3.49.0 */
    const file$k = "src/components/Text.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (26:1) { #each visible as item (item) }
    function create_each_block$6(key_1, ctx) {
    	let p;
    	let t_value = /*item*/ ctx[6] + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			add_location(p, file$k, 26, 2, 499);
    			this.first = p;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*visible*/ 1) && t_value !== (t_value = /*item*/ ctx[6] + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide$1, {}, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, slide$1, {}, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(26:1) { #each visible as item (item) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let main;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*visible*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[6];
    	validate_each_keys(ctx, each_value, get_each_context$6, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(main, file$k, 24, 0, 447);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(main, "wheel", /*wheel_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visible*/ 1) {
    				each_value = /*visible*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$6, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, outro_and_destroy_block, create_each_block$6, null, get_each_context$6);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, []);
    	let { options = [], selected } = $$props;
    	let index = options.indexOf(selected) ?? 0;
    	let visible = [options[index]];

    	const update = () => {
    		const i = options.indexOf(selected) ?? index;

    		if (i < index) {
    			visible.unshift(selected);
    			visible.pop();
    		} else if (index < i) {
    			visible.push(selected);
    			visible.shift();
    		}

    		$$invalidate(0, visible);
    	};

    	const writable_props = ['options', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	function wheel_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    		if ('selected' in $$props) $$invalidate(2, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({
    		slide: slide$1,
    		options,
    		selected,
    		index,
    		visible,
    		update
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    		if ('selected' in $$props) $$invalidate(2, selected = $$props.selected);
    		if ('index' in $$props) index = $$props.index;
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selected*/ 4) {
    			(update());
    		}
    	};

    	return [visible, options, selected, wheel_handler];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { options: 1, selected: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selected*/ ctx[2] === undefined && !('selected' in props)) {
    			console.warn("<Text> was created without expected prop 'selected'");
    		}
    	}

    	get options() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/element/Date.svelte generated by Svelte v3.49.0 */
    const file$j = "src/components/element/Date.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	const constants_0 = /*month*/ child_ctx[3].clone().add({ months: /*index*/ child_ctx[11] });
    	child_ctx[3] = constants_0;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;

    	const constants_0 = /*month*/ child_ctx[3].clone().add({
    		date: -/*month*/ child_ctx[3].weekday() + /*index*/ child_ctx[11]
    	});

    	child_ctx[12] = constants_0;
    	return child_ctx;
    }

    // (32:4) { #key internal.month }
    function create_key_block(ctx) {
    	let h2;
    	let t_value = /*month*/ ctx[3].toLongMonth() + "";
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			attr_dev(h2, "class", "svelte-1u9u46u");
    			add_location(h2, file$j, 32, 5, 944);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*month*/ 8 && t_value !== (t_value = /*month*/ ctx[3].toLongMonth() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(32:4) { #key internal.month }",
    		ctx
    	});

    	return block;
    }

    // (39:5) { #each Array(42) as _, index }
    function create_each_block_1$2(ctx) {
    	let p;
    	let t0_value = /*date*/ ctx[12].date + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function mousedown_handler() {
    		return /*mousedown_handler*/ ctx[8](/*date*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(p, "class", "day svelte-1u9u46u");
    			toggle_class(p, "selected", compare(/*internal*/ ctx[2], /*date*/ ctx[12], { date: true }).equals);
    			toggle_class(p, "disabled", !compare(/*date*/ ctx[12], /*month*/ ctx[3], { month: true }).equals);
    			add_location(p, file$j, 41, 6, 1205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(p, "mousedown", mousedown_handler, false, false, false),
    					listen_dev(p, "mouseup", /*up*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*month*/ 8 && t0_value !== (t0_value = /*date*/ ctx[12].date + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*compare, internal, month*/ 12) {
    				toggle_class(p, "selected", compare(/*internal*/ ctx[2], /*date*/ ctx[12], { date: true }).equals);
    			}

    			if (dirty & /*compare, month*/ 8) {
    				toggle_class(p, "disabled", !compare(/*date*/ ctx[12], /*month*/ ctx[3], { month: true }).equals);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(39:5) { #each Array(42) as _, index }",
    		ctx
    	});

    	return block;
    }

    // (27:1) { #each Array(calendars) as _, index }
    function create_each_block$5(ctx) {
    	let div3;
    	let div0;
    	let previous_key = /*internal*/ ctx[2].month;
    	let t0;
    	let h2;
    	let t1_value = /*month*/ ctx[3].year + "";
    	let t1;
    	let t2;
    	let div2;
    	let div1;
    	let t3;
    	let key_block = create_key_block(ctx);
    	let each_value_1 = Array(42);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			key_block.c();
    			t0 = space();
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			attr_dev(h2, "class", "year svelte-1u9u46u");
    			add_location(h2, file$j, 34, 4, 992);
    			attr_dev(div0, "class", "text svelte-1u9u46u");
    			add_location(div0, file$j, 30, 3, 892);
    			attr_dev(div1, "class", "days svelte-1u9u46u");
    			add_location(div1, file$j, 37, 4, 1064);
    			attr_dev(div2, "class", "month svelte-1u9u46u");
    			add_location(div2, file$j, 36, 3, 1040);
    			attr_dev(div3, "class", "container svelte-1u9u46u");
    			add_location(div3, file$j, 29, 2, 865);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			key_block.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, h2);
    			append_dev(h2, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div3, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*internal*/ 4 && safe_not_equal(previous_key, previous_key = /*internal*/ ctx[2].month)) {
    				key_block.d(1);
    				key_block = create_key_block(ctx);
    				key_block.c();
    				key_block.m(div0, t0);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			if (dirty & /*month*/ 8 && t1_value !== (t1_value = /*month*/ ctx[3].year + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*compare, internal, month, down, up*/ 60) {
    				each_value_1 = Array(42);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			key_block.d(detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(27:1) { #each Array(calendars) as _, index }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let main;
    	let each_value = Array(/*calendars*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(main, "flex-flow", /*direction*/ ctx[1]);
    			set_style(main, "cursor", "default");
    			attr_dev(main, "class", "svelte-1u9u46u");
    			add_location(main, file$j, 25, 0, 708);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Array, compare, internal, month, down, up, calendars*/ 61) {
    				each_value = Array(/*calendars*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(main, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*direction*/ 2) {
    				set_style(main, "flex-flow", /*direction*/ ctx[1]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let internal;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Date', slots, []);
    	let { calendars = 3 } = $$props;
    	let { direction = undefined } = $$props;
    	let { value = new Timestamp() } = $$props;
    	let { set = v => v } = $$props;
    	let month = value.clone({ month: true }).add({ months: Math.ceil(-calendars / 2) });

    	const down = date => {
    		date.set({ hours: value.hour });
    		$$invalidate(2, internal = date);
    	};

    	const up = () => $$invalidate(3, month = internal.clone({ month: true }).add({ months: Math.ceil(-calendars / 2) }));
    	const writable_props = ['calendars', 'direction', 'value', 'set'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Date> was created with unknown prop '${key}'`);
    	});

    	const mousedown_handler = date => down(date);

    	$$self.$$set = $$props => {
    		if ('calendars' in $$props) $$invalidate(0, calendars = $$props.calendars);
    		if ('direction' in $$props) $$invalidate(1, direction = $$props.direction);
    		if ('value' in $$props) $$invalidate(6, value = $$props.value);
    		if ('set' in $$props) $$invalidate(7, set = $$props.set);
    	};

    	$$self.$capture_state = () => ({
    		mouse,
    		compare,
    		Timestamp,
    		Text,
    		calendars,
    		direction,
    		value,
    		set,
    		month,
    		down,
    		up,
    		internal
    	});

    	$$self.$inject_state = $$props => {
    		if ('calendars' in $$props) $$invalidate(0, calendars = $$props.calendars);
    		if ('direction' in $$props) $$invalidate(1, direction = $$props.direction);
    		if ('value' in $$props) $$invalidate(6, value = $$props.value);
    		if ('set' in $$props) $$invalidate(7, set = $$props.set);
    		if ('month' in $$props) $$invalidate(3, month = $$props.month);
    		if ('internal' in $$props) $$invalidate(2, internal = $$props.internal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 64) {
    			$$invalidate(2, internal = value);
    		}

    		if ($$self.$$.dirty & /*internal, value, set*/ 196) {
    			(value !== internal && set(internal));
    		}
    	};

    	return [calendars, direction, internal, month, down, up, value, set, mousedown_handler];
    }

    class Date$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			calendars: 0,
    			direction: 1,
    			value: 6,
    			set: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Date",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get calendars() {
    		throw new Error("<Date>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set calendars(value) {
    		throw new Error("<Date>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Date>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Date>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Date>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Date>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get set() {
    		throw new Error("<Date>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Date>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/element/Dial.svelte generated by Svelte v3.49.0 */
    const file$i = "src/components/element/Dial.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[21] = i;
    	const constants_0 = /*i*/ child_ctx[21] - 1;
    	child_ctx[19] = constants_0;
    	return child_ctx;
    }

    // (70:1) { #each options as option, i (option) }
    function create_each_block$4(key_1, ctx) {
    	let p;
    	let t_value = ((/*center*/ ctx[19] === 0 ? /*string*/ ctx[2] : null) || /*display*/ ctx[0](/*option*/ ctx[18])) + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "transform", "rotateX(" + /*center*/ ctx[19] * 45 + "deg");
    			attr_dev(p, "class", "svelte-3qh9dt");
    			add_location(p, file$i, 71, 2, 1586);
    			this.first = p;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*options, string, display*/ 7) && t_value !== (t_value = ((/*center*/ ctx[19] === 0 ? /*string*/ ctx[2] : null) || /*display*/ ctx[0](/*option*/ ctx[18])) + "")) set_data_dev(t, t_value);

    			if (!current || dirty & /*options*/ 2) {
    				set_style(p, "transform", "rotateX(" + /*center*/ ctx[19] * 45 + "deg");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide$1, {}, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, slide$1, {}, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(70:1) { #each options as option, i (option) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let main;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let input_1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*options*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*option*/ ctx[18];
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			input_1 = element("input");
    			attr_dev(input_1, "class", "svelte-3qh9dt");
    			add_location(input_1, file$i, 73, 1, 1718);
    			attr_dev(main, "class", "svelte-3qh9dt");
    			add_location(main, file$i, 68, 0, 1491);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t);
    			append_dev(main, input_1);
    			/*input_1_binding*/ ctx[12](input_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*purify*/ ctx[5], false, false, false),
    					listen_dev(main, "wheel", /*wheel*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options, string, display*/ 7) {
    				each_value = /*options*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, outro_and_destroy_block, create_each_block$4, t, get_each_context$4);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*input_1_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dial', slots, []);
    	let { length = 3, spread = 1, offset = 0 } = $$props;
    	let { initial = 0 } = $$props;
    	let { set = v => v } = $$props;
    	let { display = v => v } = $$props;
    	let options = [];
    	let string = '';
    	let input;
    	const value = i => loop(i) * spread + offset;

    	const nearest = value => {
    		return (value - value % spread + Math.round(value % spread / spread) * spread - offset) / spread; // Lower to nearest option
    		// Round to nearest option
    		// Calculate index
    	};

    	let index = nearest(initial);

    	const loop = value => {
    		if (value < 0) value += length;
    		if (length <= value) value %= length;
    		return value;
    	};

    	const wheel = ({ deltaY: y }) => {
    		$$invalidate(2, string = '');
    		if (y < 0) $$invalidate(11, index = loop(index - 1));
    		if (0 < y) $$invalidate(11, index = loop(index + 1));
    	};

    	const assign = number => {
    		$$invalidate(2, string = String(number));
    		$$invalidate(3, input.value = string, input);
    		$$invalidate(11, index = nearest(number)); // TODO?: Checks even if number matches an entry, but whatever
    	};

    	const clear = () => {
    		$$invalidate(2, string = '');
    		$$invalidate(3, input.value = string, input);
    		$$invalidate(11, index = 0);
    	};

    	const purify = ({ data }) => {
    		const first = value(0);
    		const last = value(-1) + spread;
    		if (!data) return clear();
    		let number = parseFloat((string + data).replace(/\D/, ''));
    		if (number !== 0 && !number) return $$invalidate(3, input.value = '', input);
    		assign(clamp(number, { min: first, max: last }) % last);
    	};

    	const writable_props = ['length', 'spread', 'offset', 'initial', 'set', 'display'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dial> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(3, input);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('length' in $$props) $$invalidate(6, length = $$props.length);
    		if ('spread' in $$props) $$invalidate(7, spread = $$props.spread);
    		if ('offset' in $$props) $$invalidate(8, offset = $$props.offset);
    		if ('initial' in $$props) $$invalidate(9, initial = $$props.initial);
    		if ('set' in $$props) $$invalidate(10, set = $$props.set);
    		if ('display' in $$props) $$invalidate(0, display = $$props.display);
    	};

    	$$self.$capture_state = () => ({
    		slide: slide$1,
    		clamp,
    		length,
    		spread,
    		offset,
    		initial,
    		set,
    		display,
    		options,
    		string,
    		input,
    		value,
    		nearest,
    		index,
    		loop,
    		wheel,
    		assign,
    		clear,
    		purify
    	});

    	$$self.$inject_state = $$props => {
    		if ('length' in $$props) $$invalidate(6, length = $$props.length);
    		if ('spread' in $$props) $$invalidate(7, spread = $$props.spread);
    		if ('offset' in $$props) $$invalidate(8, offset = $$props.offset);
    		if ('initial' in $$props) $$invalidate(9, initial = $$props.initial);
    		if ('set' in $$props) $$invalidate(10, set = $$props.set);
    		if ('display' in $$props) $$invalidate(0, display = $$props.display);
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    		if ('string' in $$props) $$invalidate(2, string = $$props.string);
    		if ('input' in $$props) $$invalidate(3, input = $$props.input);
    		if ('index' in $$props) $$invalidate(11, index = $$props.index);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*index, set*/ 3072) {
    			(set(value(index)));
    		}

    		if ($$self.$$.dirty & /*index*/ 2048) {
    			($$invalidate(1, options = [value(index - 1), value(index), value(index + 1)]));
    		}
    	};

    	return [
    		display,
    		options,
    		string,
    		input,
    		wheel,
    		purify,
    		length,
    		spread,
    		offset,
    		initial,
    		set,
    		index,
    		input_1_binding
    	];
    }

    class Dial extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			length: 6,
    			spread: 7,
    			offset: 8,
    			initial: 9,
    			set: 10,
    			display: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dial",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get length() {
    		throw new Error("<Dial>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set length(value) {
    		throw new Error("<Dial>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spread() {
    		throw new Error("<Dial>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spread(value) {
    		throw new Error("<Dial>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<Dial>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<Dial>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get initial() {
    		throw new Error("<Dial>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initial(value) {
    		throw new Error("<Dial>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get set() {
    		throw new Error("<Dial>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Dial>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get display() {
    		throw new Error("<Dial>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set display(value) {
    		throw new Error("<Dial>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/element/Choice.svelte generated by Svelte v3.49.0 */
    const file$h = "src/components/element/Choice.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[17] = i;
    	const constants_0 = /*i*/ child_ctx[17] - 1;
    	child_ctx[14] = constants_0;
    	const constants_1 = typeof /*value*/ child_ctx[3](/*index*/ child_ctx[0] + /*center*/ child_ctx[14]) === 'object';
    	child_ctx[15] = constants_1;
    	return child_ctx;
    }

    // (54:1) { #each visible.section(index - 1, index + 1) as option, i (option) }
    function create_each_block$3(key_1, ctx) {
    	let p;

    	let t_value = (/*object*/ ctx[15]
    	? 'None'
    	: /*value*/ ctx[3](/*index*/ ctx[0] + /*center*/ ctx[14])) + "";

    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			set_style(p, "transform", "rotateX(" + /*center*/ ctx[14] * 45 + "deg");
    			attr_dev(p, "class", "svelte-1ckckvo");
    			toggle_class(p, "hidden", /*object*/ ctx[15]);
    			add_location(p, file$h, 56, 3, 1212);
    			this.first = p;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if ((!current || dirty & /*index*/ 1) && t_value !== (t_value = (/*object*/ ctx[15]
    			? 'None'
    			: /*value*/ ctx[3](/*index*/ ctx[0] + /*center*/ ctx[14])) + "")) set_data_dev(t, t_value);

    			if (!current || dirty & /*index*/ 1) {
    				set_style(p, "transform", "rotateX(" + /*center*/ ctx[14] * 45 + "deg");
    			}

    			if (dirty & /*value, index, visible*/ 13) {
    				toggle_class(p, "hidden", /*object*/ ctx[15]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, slide$1, {}, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, slide$1, {}, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(54:1) { #each visible.section(index - 1, index + 1) as option, i (option) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let main;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let input_1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*visible*/ ctx[2].section(/*index*/ ctx[0] - 1, /*index*/ ctx[0] + 1);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*option*/ ctx[13];
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			input_1 = element("input");
    			attr_dev(input_1, "class", "svelte-1ckckvo");
    			add_location(input_1, file$h, 58, 1, 1356);
    			attr_dev(main, "class", "svelte-1ckckvo");
    			add_location(main, file$h, 52, 0, 1022);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t);
    			append_dev(main, input_1);
    			/*input_1_binding*/ ctx[9](input_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*purify*/ ctx[5], false, false, false),
    					listen_dev(main, "wheel", /*wheel*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visible, index, value*/ 13) {
    				each_value = /*visible*/ ctx[2].section(/*index*/ ctx[0] - 1, /*index*/ ctx[0] + 1);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, outro_and_destroy_block, create_each_block$3, t, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*input_1_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Choice', slots, []);
    	let { set = v => v } = $$props;
    	let { options = ['A', 'B', 'C'] } = $$props;
    	let { initial = options[0] } = $$props;
    	let visible = [{}, ...options, {}]; // can't use null because animation doesn't work
    	let index = visible.indexOf(initial);
    	let string = '';
    	let input;
    	const value = i => visible[i];

    	const wheel = ({ deltaY: y }) => {
    		string = '';
    		$$invalidate(0, index = clamp(index + y / Math.abs(y), { min: 1, max: visible.length - 2 }));
    	};

    	const assign = option => {
    		for (let o of options) {
    			if (o.includes(option)) {
    				$$invalidate(1, input.value = option, input);
    				string = option;
    				return $$invalidate(0, index = options.indexOf(o));
    			}
    		}
    	};

    	const clear = () => {
    		string = '';
    		$$invalidate(1, input.value = string, input);
    		$$invalidate(0, index = 0);
    	};

    	const purify = ({ data }) => {
    		if (!data) return clear();
    		let option = (string + data).replace(/\d/, '');
    		if (!option) return $$invalidate(1, input.value = '', input);
    		if (!assign(option)) $$invalidate(1, input.value = '', input);
    	};

    	const writable_props = ['set', 'options', 'initial'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Choice> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(1, input);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('set' in $$props) $$invalidate(6, set = $$props.set);
    		if ('options' in $$props) $$invalidate(7, options = $$props.options);
    		if ('initial' in $$props) $$invalidate(8, initial = $$props.initial);
    	};

    	$$self.$capture_state = () => ({
    		slide: slide$1,
    		clamp,
    		set,
    		options,
    		initial,
    		visible,
    		index,
    		string,
    		input,
    		value,
    		wheel,
    		assign,
    		clear,
    		purify
    	});

    	$$self.$inject_state = $$props => {
    		if ('set' in $$props) $$invalidate(6, set = $$props.set);
    		if ('options' in $$props) $$invalidate(7, options = $$props.options);
    		if ('initial' in $$props) $$invalidate(8, initial = $$props.initial);
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('index' in $$props) $$invalidate(0, index = $$props.index);
    		if ('string' in $$props) string = $$props.string;
    		if ('input' in $$props) $$invalidate(1, input = $$props.input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*index, set*/ 65) {
    			(set(value(index)));
    		}
    	};

    	return [
    		index,
    		input,
    		visible,
    		value,
    		wheel,
    		purify,
    		set,
    		options,
    		initial,
    		input_1_binding
    	];
    }

    class Choice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { set: 6, options: 7, initial: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Choice",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get set() {
    		throw new Error("<Choice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Choice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Choice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Choice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get initial() {
    		throw new Error("<Choice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initial(value) {
    		throw new Error("<Choice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/element/Time.svelte generated by Svelte v3.49.0 */
    const file$g = "src/components/element/Time.svelte";

    // (21:1) { #if !$preferences.hour24 }
    function create_if_block$7(ctx) {
    	let choice;
    	let current;

    	choice = new Choice({
    			props: {
    				options: ['AM', 'PM'],
    				set: /*ampm*/ ctx[3],
    				initial: /*value*/ ctx[0].hour < 12 ? 'AM' : 'PM'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(choice.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(choice, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const choice_changes = {};
    			if (dirty & /*value*/ 1) choice_changes.initial = /*value*/ ctx[0].hour < 12 ? 'AM' : 'PM';
    			choice.$set(choice_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(choice.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(choice.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(choice, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(21:1) { #if !$preferences.hour24 }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let main;
    	let dial0;
    	let t0;
    	let dial1;
    	let t1;
    	let current;

    	dial0 = new Dial({
    			props: {
    				length: !/*$preferences*/ ctx[2].hour24 ? 12 : 24,
    				spread: 1,
    				offset: 1,
    				set: /*func*/ ctx[4],
    				initial: !/*$preferences*/ ctx[2].hour24
    				? /*value*/ ctx[0].hour % 12
    				: /*value*/ ctx[0].hour
    			},
    			$$inline: true
    		});

    	dial1 = new Dial({
    			props: {
    				length: 12,
    				spread: 5,
    				set: /*func_1*/ ctx[5],
    				display: /*func_2*/ ctx[6],
    				initial: /*value*/ ctx[0].minute
    			},
    			$$inline: true
    		});

    	let if_block = !/*$preferences*/ ctx[2].hour24 && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(dial0.$$.fragment);
    			t0 = space();
    			create_component(dial1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(main, "class", "svelte-ieliq8");
    			add_location(main, file$g, 17, 0, 515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(dial0, main, null);
    			append_dev(main, t0);
    			mount_component(dial1, main, null);
    			append_dev(main, t1);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dial0_changes = {};
    			if (dirty & /*$preferences*/ 4) dial0_changes.length = !/*$preferences*/ ctx[2].hour24 ? 12 : 24;
    			if (dirty & /*set, value*/ 3) dial0_changes.set = /*func*/ ctx[4];

    			if (dirty & /*$preferences, value*/ 5) dial0_changes.initial = !/*$preferences*/ ctx[2].hour24
    			? /*value*/ ctx[0].hour % 12
    			: /*value*/ ctx[0].hour;

    			dial0.$set(dial0_changes);
    			const dial1_changes = {};
    			if (dirty & /*set, value*/ 3) dial1_changes.set = /*func_1*/ ctx[5];
    			if (dirty & /*value*/ 1) dial1_changes.initial = /*value*/ ctx[0].minute;
    			dial1.$set(dial1_changes);

    			if (!/*$preferences*/ ctx[2].hour24) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$preferences*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dial0.$$.fragment, local);
    			transition_in(dial1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dial0.$$.fragment, local);
    			transition_out(dial1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(dial0);
    			destroy_component(dial1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $preferences;
    	validate_store(preferences, 'preferences');
    	component_subscribe($$self, preferences, $$value => $$invalidate(2, $preferences = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Time', slots, []);
    	let { value = new Timestamp() } = $$props;
    	let { set = v => v } = $$props;

    	const ampm = v => {
    		v === 'AM'
    		? set(value.clone().set({ hours: value.hour % 12 }))
    		: set(value.clone().set({ hours: value.hour % 12 + 12 }));
    	};

    	ampm(value.hour < 12 ? 'AM' : 'PM'); // Initial set
    	const writable_props = ['value', 'set'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Time> was created with unknown prop '${key}'`);
    	});

    	const func = v => set(value.clone().set({ hours: v }));
    	const func_1 = v => set(value.clone().set({ minutes: v }));
    	const func_2 = v => minute(v);

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('set' in $$props) $$invalidate(1, set = $$props.set);
    	};

    	$$self.$capture_state = () => ({
    		preferences,
    		Timestamp,
    		minute,
    		Dial,
    		Choice,
    		value,
    		set,
    		ampm,
    		$preferences
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('set' in $$props) $$invalidate(1, set = $$props.set);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, set, $preferences, ampm, func, func_1, func_2];
    }

    class Time extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { value: 0, set: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Time",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get value() {
    		throw new Error("<Time>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Time>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get set() {
    		throw new Error("<Time>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Time>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Menu.svelte generated by Svelte v3.49.0 */
    const file$f = "src/components/Menu.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (96:0) { :else }
    function create_else_block$2(ctx) {
    	let menu_1;
    	let updating_menu;
    	let current;

    	function menu_1_menu_binding(value) {
    		/*menu_1_menu_binding*/ ctx[11](value);
    	}

    	let menu_1_props = {};

    	if (/*menu*/ ctx[0].children[/*show*/ ctx[1]] !== void 0) {
    		menu_1_props.menu = /*menu*/ ctx[0].children[/*show*/ ctx[1]];
    	}

    	menu_1 = new Menu({ props: menu_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(menu_1, 'menu', menu_1_menu_binding));
    	menu_1.$on("close", /*close_handler*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(menu_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menu_1_changes = {};

    			if (!updating_menu && dirty & /*menu, show*/ 3) {
    				updating_menu = true;
    				menu_1_changes.menu = /*menu*/ ctx[0].children[/*show*/ ctx[1]];
    				add_flush_callback(() => updating_menu = false);
    			}

    			menu_1.$set(menu_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(96:0) { :else }",
    		ctx
    	});

    	return block;
    }

    // (40:0) { #if show === -1 }
    function create_if_block$6(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let main_transition;
    	let current;
    	let if_block0 = (/*menu*/ ctx[0].close ?? true) && create_if_block_15(ctx);
    	let if_block1 = /*menu*/ ctx[0].name && create_if_block_14(ctx);
    	let if_block2 = (/*menu*/ ctx[0].close ?? true) && create_if_block_13(ctx);
    	let each_value = /*menu*/ ctx[0].children ?? [];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "title svelte-1yjxt2z");
    			add_location(div0, file$f, 42, 3, 943);
    			attr_dev(div1, "class", "items svelte-1yjxt2z");
    			add_location(div1, file$f, 41, 2, 920);
    			attr_dev(main, "class", "svelte-1yjxt2z");
    			add_location(main, file$f, 40, 1, 875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div1, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*menu*/ ctx[0].close ?? true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*menu*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_15(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*menu*/ ctx[0].name) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_14(ctx);
    					if_block1.c();
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*menu*/ ctx[0].close ?? true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*menu*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_13(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*menu, show, action, blank, undefined, dispatch*/ 47) {
    				each_value = /*menu*/ ctx[0].children ?? [];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!main_transition) main_transition = create_bidirectional_transition(main, slide, { axis: 'both' }, true);
    				main_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!main_transition) main_transition = create_bidirectional_transition(main, slide, { axis: 'both' }, false);
    			main_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching && main_transition) main_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(40:0) { #if show === -1 }",
    		ctx
    	});

    	return block;
    }

    // (44:4) { #if (menu.close ?? true) }
    function create_if_block_15(ctx) {
    	let button;
    	let chevron;
    	let current;
    	let mounted;
    	let dispose;

    	chevron = new Chevron({
    			props: { direction: 'left', size: '1.5rem' },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(chevron.$$.fragment);
    			attr_dev(button, "type", "icon");
    			add_location(button, file$f, 44, 5, 1001);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(chevron, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevron.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevron.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(chevron);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(44:4) { #if (menu.close ?? true) }",
    		ctx
    	});

    	return block;
    }

    // (49:4) { #if menu.name }
    function create_if_block_14(ctx) {
    	let h3;
    	let t_value = /*menu*/ ctx[0].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "header svelte-1yjxt2z");
    			attr_dev(h3, "style", 'cursor: default;');
    			add_location(h3, file$f, 49, 5, 1164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 1 && t_value !== (t_value = /*menu*/ ctx[0].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(49:4) { #if menu.name }",
    		ctx
    	});

    	return block;
    }

    // (52:4) { #if (menu.close ?? true) }
    function create_if_block_13(ctx) {
    	let button;
    	let chevron;
    	let current;
    	let mounted;
    	let dispose;

    	chevron = new Chevron({
    			props: { direction: 'left', size: '1.5rem' },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(chevron.$$.fragment);
    			attr_dev(button, "type", "icon");
    			attr_dev(button, "class", "spacer svelte-1yjxt2z");
    			add_location(button, file$f, 52, 5, 1277);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(chevron, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevron.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevron.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(chevron);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(52:4) { #if (menu.close ?? true) }",
    		ctx
    	});

    	return block;
    }

    // (60:4) { #if !child.hide }
    function create_if_block_1$3(ctx) {
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*child*/ ctx[13].description && create_if_block_12(ctx);

    	const if_block_creators = [
    		create_if_block_2$1,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8,
    		create_if_block_9,
    		create_if_block_10,
    		create_if_block_11
    	];

    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*child*/ ctx[13].name && (/*child*/ ctx[13].type ?? 'menu') === 'menu') return 0;
    		if (/*child*/ ctx[13].name && /*child*/ ctx[13].type === 'action') return 1;
    		if (/*child*/ ctx[13].type === 'input') return 2;
    		if (/*child*/ ctx[13].type === 'textarea') return 3;
    		if (/*child*/ ctx[13].type === 'time') return 4;
    		if (/*child*/ ctx[13].type === 'toggle') return 5;
    		if (/*child*/ ctx[13].type === 'color' && /*child*/ ctx[13].value !== undefined) return 6;
    		if (/*child*/ ctx[13].type === 'colors') return 7;
    		if (/*child*/ ctx[13].type === 'email') return 8;
    		if (/*child*/ ctx[13].type === 'password') return 9;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*child*/ ctx[13].description) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_12(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block1) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];

    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					} else {
    						if_block1.p(ctx, dirty);
    					}

    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				} else {
    					if_block1 = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(60:4) { #if !child.hide }",
    		ctx
    	});

    	return block;
    }

    // (61:5) { #if child.description }
    function create_if_block_12(ctx) {
    	let p;
    	let t_value = /*child*/ ctx[13].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "" + (null_to_empty('description') + " svelte-1yjxt2z"));
    			add_location(p, file$f, 61, 6, 1549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*menu*/ 1 && t_value !== (t_value = /*child*/ ctx[13].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(61:5) { #if child.description }",
    		ctx
    	});

    	return block;
    }

    // (89:43) 
    function create_if_block_11(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "password",
    				value: /*child*/ ctx[13].value,
    				name: /*child*/ ctx[13].name,
    				placeholder: /*child*/ ctx[13].placeholder,
    				set: /*child*/ ctx[13].set ?? /*blank*/ ctx[2],
    				style: /*child*/ ctx[13].css ?? ''
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty & /*menu*/ 1) input_changes.value = /*child*/ ctx[13].value;
    			if (dirty & /*menu*/ 1) input_changes.name = /*child*/ ctx[13].name;
    			if (dirty & /*menu*/ 1) input_changes.placeholder = /*child*/ ctx[13].placeholder;
    			if (dirty & /*menu*/ 1) input_changes.set = /*child*/ ctx[13].set ?? /*blank*/ ctx[2];
    			if (dirty & /*menu*/ 1) input_changes.style = /*child*/ ctx[13].css ?? '';
    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(89:43) ",
    		ctx
    	});

    	return block;
    }

    // (87:40) 
    function create_if_block_10(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "email",
    				value: /*child*/ ctx[13].value,
    				name: /*child*/ ctx[13].name,
    				placeholder: /*child*/ ctx[13].placeholder,
    				set: /*child*/ ctx[13].set ?? /*blank*/ ctx[2],
    				style: /*child*/ ctx[13].css ?? ''
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty & /*menu*/ 1) input_changes.value = /*child*/ ctx[13].value;
    			if (dirty & /*menu*/ 1) input_changes.name = /*child*/ ctx[13].name;
    			if (dirty & /*menu*/ 1) input_changes.placeholder = /*child*/ ctx[13].placeholder;
    			if (dirty & /*menu*/ 1) input_changes.set = /*child*/ ctx[13].set ?? /*blank*/ ctx[2];
    			if (dirty & /*menu*/ 1) input_changes.style = /*child*/ ctx[13].css ?? '';
    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(87:40) ",
    		ctx
    	});

    	return block;
    }

    // (82:41) 
    function create_if_block_9(ctx) {
    	let colors;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[10](/*child*/ ctx[13], ...args);
    	}

    	colors = new Colors({ props: { set: func }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(colors.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(colors, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const colors_changes = {};
    			if (dirty & /*menu*/ 1) colors_changes.set = func;
    			colors.$set(colors_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colors.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colors.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(colors, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(82:41) ",
    		ctx
    	});

    	return block;
    }

    // (80:69) 
    function create_if_block_8(ctx) {
    	let color;
    	let current;

    	color = new Color({
    			props: {
    				value: /*child*/ ctx[13].value,
    				set: /*child*/ ctx[13].set ?? /*blank*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(color.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(color, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const color_changes = {};
    			if (dirty & /*menu*/ 1) color_changes.value = /*child*/ ctx[13].value;
    			if (dirty & /*menu*/ 1) color_changes.set = /*child*/ ctx[13].set ?? /*blank*/ ctx[2];
    			color.$set(color_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(color.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(color.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(color, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(80:69) ",
    		ctx
    	});

    	return block;
    }

    // (78:41) 
    function create_if_block_7(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "toggle",
    				value: /*child*/ ctx[13].value,
    				name: /*child*/ ctx[13].name,
    				set: /*child*/ ctx[13].set ?? /*blank*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty & /*menu*/ 1) input_changes.value = /*child*/ ctx[13].value;
    			if (dirty & /*menu*/ 1) input_changes.name = /*child*/ ctx[13].name;
    			if (dirty & /*menu*/ 1) input_changes.set = /*child*/ ctx[13].set ?? /*blank*/ ctx[2];
    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(78:41) ",
    		ctx
    	});

    	return block;
    }

    // (73:39) 
    function create_if_block_6(ctx) {
    	let div;
    	let date;
    	let t0;
    	let time;
    	let t1;
    	let current;

    	date = new Date$1({
    			props: {
    				value: /*child*/ ctx[13].value,
    				set: /*child*/ ctx[13].set ?? /*blank*/ ctx[2]
    			},
    			$$inline: true
    		});

    	time = new Time({
    			props: {
    				value: /*child*/ ctx[13].value,
    				set: /*child*/ ctx[13].set ?? /*blank*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(date.$$.fragment);
    			t0 = space();
    			create_component(time.$$.fragment);
    			t1 = space();
    			attr_dev(div, "class", "time svelte-1yjxt2z");
    			add_location(div, file$f, 73, 6, 2344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(date, div, null);
    			append_dev(div, t0);
    			mount_component(time, div, null);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const date_changes = {};
    			if (dirty & /*menu*/ 1) date_changes.value = /*child*/ ctx[13].value;
    			if (dirty & /*menu*/ 1) date_changes.set = /*child*/ ctx[13].set ?? /*blank*/ ctx[2];
    			date.$set(date_changes);
    			const time_changes = {};
    			if (dirty & /*menu*/ 1) time_changes.value = /*child*/ ctx[13].value;
    			if (dirty & /*menu*/ 1) time_changes.set = /*child*/ ctx[13].set ?? /*blank*/ ctx[2];
    			time.$set(time_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(date.$$.fragment, local);
    			transition_in(time.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(date.$$.fragment, local);
    			transition_out(time.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(date);
    			destroy_component(time);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(73:39) ",
    		ctx
    	});

    	return block;
    }

    // (71:43) 
    function create_if_block_5(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "textarea",
    				value: /*child*/ ctx[13].value,
    				name: /*child*/ ctx[13].name,
    				placeholder: /*child*/ ctx[13].placeholder,
    				set: /*child*/ ctx[13].set ?? /*blank*/ ctx[2],
    				style: 'height: 3rem; ' + /*child*/ ctx[13].css ?? ''
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty & /*menu*/ 1) input_changes.value = /*child*/ ctx[13].value;
    			if (dirty & /*menu*/ 1) input_changes.name = /*child*/ ctx[13].name;
    			if (dirty & /*menu*/ 1) input_changes.placeholder = /*child*/ ctx[13].placeholder;
    			if (dirty & /*menu*/ 1) input_changes.set = /*child*/ ctx[13].set ?? /*blank*/ ctx[2];
    			if (dirty & /*menu*/ 1) input_changes.style = 'height: 3rem; ' + /*child*/ ctx[13].css ?? '';
    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(71:43) ",
    		ctx
    	});

    	return block;
    }

    // (69:40) 
    function create_if_block_4(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				value: /*child*/ ctx[13].value,
    				name: /*child*/ ctx[13].name,
    				placeholder: /*child*/ ctx[13].placeholder,
    				set: /*child*/ ctx[13].set ?? /*blank*/ ctx[2],
    				style: /*child*/ ctx[13].css ?? ''
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty & /*menu*/ 1) input_changes.value = /*child*/ ctx[13].value;
    			if (dirty & /*menu*/ 1) input_changes.name = /*child*/ ctx[13].name;
    			if (dirty & /*menu*/ 1) input_changes.placeholder = /*child*/ ctx[13].placeholder;
    			if (dirty & /*menu*/ 1) input_changes.set = /*child*/ ctx[13].set ?? /*blank*/ ctx[2];
    			if (dirty & /*menu*/ 1) input_changes.style = /*child*/ ctx[13].css ?? '';
    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(69:40) ",
    		ctx
    	});

    	return block;
    }

    // (67:55) 
    function create_if_block_3(ctx) {
    	let button;
    	let t_value = /*child*/ ctx[13].name + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[9](/*child*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file$f, 67, 6, 1847);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*menu*/ 1 && t_value !== (t_value = /*child*/ ctx[13].name + "")) set_data_dev(t, t_value);
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(67:55) ",
    		ctx
    	});

    	return block;
    }

    // (65:5) { #if child.name && (child.type ?? 'menu') === 'menu' }
    function create_if_block_2$1(ctx) {
    	let button;
    	let t_value = /*child*/ ctx[13].name + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[8](/*child*/ ctx[13], /*index*/ ctx[15]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "inverse");
    			add_location(button, file$f, 65, 6, 1679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*menu*/ 1 && t_value !== (t_value = /*child*/ ctx[13].name + "")) set_data_dev(t, t_value);
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(65:5) { #if child.name && (child.type ?? 'menu') === 'menu' }",
    		ctx
    	});

    	return block;
    }

    // (59:3) { #each menu.children ?? [] as child, index }
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*child*/ ctx[13].hide && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*child*/ ctx[13].hide) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*menu*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(59:3) { #each menu.children ?? [] as child, index }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*show*/ ctx[1] === -1) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*key*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { menu = {} } = $$props;
    	let blank = v => v;
    	const dispatch = createEventDispatcher();

    	const key = async e => {
    		if (menu.key) {
    			const close = await menu.key(e);
    			if (close) dispatch('close');
    		}

    		if (e.key !== 'Escape') return;
    		if (show === -1) dispatch('close');
    	};

    	const action = async child => {
    		if (child.click) {
    			const close = await child.click();
    			if (close) dispatch('close');
    		}
    	};

    	let show = -1;
    	const writable_props = ['menu'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch('close');
    	const click_handler_1 = () => dispatch('close');

    	const click_handler_2 = (child, index) => child.click
    	? child.click()
    	: $$invalidate(1, show = index);

    	const click_handler_3 = child => action(child);

    	const func = (child, v) => {
    		child.set(v) ?? blank;
    		dispatch('close');
    	};

    	function menu_1_menu_binding(value) {
    		if ($$self.$$.not_equal(menu.children[show], value)) {
    			menu.children[show] = value;
    			$$invalidate(0, menu);
    		}
    	}

    	const close_handler = () => $$invalidate(1, show = -1);

    	$$self.$$set = $$props => {
    		if ('menu' in $$props) $$invalidate(0, menu = $$props.menu);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		slide,
    		Chevron,
    		Input,
    		Color,
    		Colors,
    		Date: Date$1,
    		Time,
    		menu,
    		blank,
    		dispatch,
    		key,
    		action,
    		show
    	});

    	$$self.$inject_state = $$props => {
    		if ('menu' in $$props) $$invalidate(0, menu = $$props.menu);
    		if ('blank' in $$props) $$invalidate(2, blank = $$props.blank);
    		if ('show' in $$props) $$invalidate(1, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		menu,
    		show,
    		blank,
    		dispatch,
    		key,
    		action,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		func,
    		menu_1_menu_binding,
    		close_handler
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { menu: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get menu() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menu(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/icons/filled/Person.svelte generated by Svelte v3.49.0 */

    const file$e = "src/icons/filled/Person.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let svg;
    	let title;
    	let t;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t = text("ionicons-v5-j");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			add_location(title, file$e, 5, 88, 280);
    			attr_dev(path0, "d", "M332.64,64.58C313.18,43.57,286,32,256,32c-30.16,0-57.43,11.5-76.8,32.38-19.58,21.11-29.12,49.8-26.88,80.78C156.76,206.28,203.27,256,256,256s99.16-49.71,103.67-110.82C361.94,114.48,352.34,85.85,332.64,64.58Z");
    			add_location(path0, file$e, 5, 116, 308);
    			attr_dev(path1, "d", "M432,480H80A31,31,0,0,1,55.8,468.87c-6.5-7.77-9.12-18.38-7.18-29.11C57.06,392.94,83.4,353.61,124.8,326c36.78-24.51,83.37-38,131.2-38s94.42,13.5,131.2,38c41.4,27.6,67.74,66.93,76.18,113.75,1.94,10.73-.68,21.34-7.18,29.11A31,31,0,0,1,432,480Z");
    			add_location(path1, file$e, 5, 334, 526);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "512");
    			attr_dev(svg, "height", "512");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$e, 5, 1, 193);
    			set_style(div, "width", /*size*/ ctx[0]);
    			set_style(div, "height", /*size*/ ctx[0]);
    			set_style(div, "fill", /*fill*/ ctx[1]);
    			set_style(div, "stroke", /*stroke*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[3]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$e, 4, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, title);
    			append_dev(title, t);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(div, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(div, "stroke", /*stroke*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div, "color", /*color*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Person', slots, []);
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Person> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, fill, stroke, color];
    }

    class Person extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { size: 0, fill: 1, stroke: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Person",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get size() {
    		throw new Error("<Person>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Person>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Person>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Person>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Person>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Person>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Person>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Person>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Bar.svelte generated by Svelte v3.49.0 */
    const file$d = "src/components/Bar.svelte";

    // (43:1) { #if show }
    function create_if_block$5(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: {
    					tip: [create_tip_slot$1],
    					default: [create_default_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("close", /*close_handler_1*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, menu, show*/ 262) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(43:1) { #if show }",
    		ctx
    	});

    	return block;
    }

    // (44:2) <Modal on:close={() => show = false}>
    function create_default_slot$2(ctx) {
    	let menu_1;
    	let updating_menu;
    	let current;

    	function menu_1_menu_binding(value) {
    		/*menu_1_menu_binding*/ ctx[5](value);
    	}

    	let menu_1_props = {};

    	if (/*menu*/ ctx[2] !== void 0) {
    		menu_1_props.menu = /*menu*/ ctx[2];
    	}

    	menu_1 = new Menu({ props: menu_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(menu_1, 'menu', menu_1_menu_binding));
    	menu_1.$on("close", /*close_handler*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(menu_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menu_1_changes = {};

    			if (!updating_menu && dirty & /*menu*/ 4) {
    				updating_menu = true;
    				menu_1_changes.menu = /*menu*/ ctx[2];
    				add_flush_callback(() => updating_menu = false);
    			}

    			menu_1.$set(menu_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(44:2) <Modal on:close={() => show = false}>",
    		ctx
    	});

    	return block;
    }

    // (45:3) 
    function create_tip_slot$1(ctx) {
    	let p;
    	let kbd0;
    	let t1;
    	let kbd1;
    	let t3;
    	let kbd2;
    	let t5;
    	let kbd3;
    	let t7;

    	const block = {
    		c: function create() {
    			p = element("p");
    			kbd0 = element("kbd");
    			kbd0.textContent = "control";
    			t1 = text(" + ");
    			kbd1 = element("kbd");
    			kbd1.textContent = "s";
    			t3 = text(" or ");
    			kbd2 = element("kbd");
    			kbd2.textContent = "control";
    			t5 = text(" + ");
    			kbd3 = element("kbd");
    			kbd3.textContent = "enter";
    			t7 = text(" to save");
    			add_location(kbd0, file$d, 44, 17, 920);
    			add_location(kbd1, file$d, 44, 38, 941);
    			add_location(kbd2, file$d, 44, 54, 957);
    			add_location(kbd3, file$d, 44, 75, 978);
    			attr_dev(p, "slot", "tip");
    			add_location(p, file$d, 44, 3, 906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, kbd0);
    			append_dev(p, t1);
    			append_dev(p, kbd1);
    			append_dev(p, t3);
    			append_dev(p, kbd2);
    			append_dev(p, t5);
    			append_dev(p, kbd3);
    			append_dev(p, t7);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tip_slot$1.name,
    		type: "slot",
    		source: "(45:3) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let main;
    	let div0;
    	let stats;
    	let t0;
    	let div2;
    	let sync;
    	let t1;
    	let div1;
    	let person;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;

    	stats = new Stats({
    			props: { items: /*items*/ ctx[0] },
    			$$inline: true
    		});

    	sync = new Sync({ $$inline: true });

    	person = new Person({
    			props: { fill: "var(--contrast)" },
    			$$inline: true
    		});

    	let if_block = /*show*/ ctx[1] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			create_component(stats.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			create_component(sync.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(person.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "left svelte-1yt72vz");
    			add_location(div0, file$d, 33, 1, 679);
    			add_location(div1, file$d, 38, 2, 760);
    			attr_dev(div2, "class", "right svelte-1yt72vz");
    			add_location(div2, file$d, 36, 1, 727);
    			attr_dev(main, "class", "svelte-1yt72vz");
    			add_location(main, file$d, 32, 0, 671);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			mount_component(stats, div0, null);
    			append_dev(main, t0);
    			append_dev(main, div2);
    			mount_component(sync, div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(person, div1, null);
    			append_dev(main, t2);
    			if (if_block) if_block.m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const stats_changes = {};
    			if (dirty & /*items*/ 1) stats_changes.items = /*items*/ ctx[0];
    			stats.$set(stats_changes);

    			if (/*show*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stats.$$.fragment, local);
    			transition_in(sync.$$.fragment, local);
    			transition_in(person.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stats.$$.fragment, local);
    			transition_out(sync.$$.fragment, local);
    			transition_out(person.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(stats);
    			destroy_component(sync);
    			destroy_component(person);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let menu;
    	let $preferences;
    	validate_store(preferences, 'preferences');
    	component_subscribe($$self, preferences, $$value => $$invalidate(3, $preferences = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bar', slots, []);
    	let { items = [] } = $$props;
    	let show = false;
    	const writable_props = ['items'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(1, show = true);

    	function menu_1_menu_binding(value) {
    		menu = value;
    		($$invalidate(2, menu), $$invalidate(3, $preferences));
    	}

    	const close_handler = () => $$invalidate(1, show = false);
    	const close_handler_1 = () => $$invalidate(1, show = false);

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	$$self.$capture_state = () => ({
    		preferences,
    		signout,
    		Sync,
    		Stats,
    		Modal,
    		Menu,
    		Person,
    		items,
    		show,
    		menu,
    		$preferences
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('show' in $$props) $$invalidate(1, show = $$props.show);
    		if ('menu' in $$props) $$invalidate(2, menu = $$props.menu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$preferences*/ 8) {
    			$$invalidate(2, menu = {
    				name: 'Account',
    				children: [
    					{
    						name: 'Settings',
    						children: [
    							{
    								name: '24-hour time',
    								type: 'toggle',
    								value: $preferences.hour24,
    								set: v => {
    									set_store_value(preferences, $preferences.hour24 = v, $preferences);
    								}
    							}
    						]
    					},
    					{
    						name: 'Sign out',
    						type: 'action',
    						click: async () => await signout()
    					}
    				]
    			});
    		}
    	};

    	return [
    		items,
    		show,
    		menu,
    		$preferences,
    		click_handler,
    		menu_1_menu_binding,
    		close_handler,
    		close_handler_1
    	];
    }

    class Bar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { items: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bar",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get items() {
    		throw new Error("<Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const remove = async id => { // TODO: multiple undefined ids?
    	items.set(get_store_value(items).grep(i => i.id === id ? false : i));

    	loading.set(true);
    	const { data, error } = await supabase
    		.from('items')
    		.delete()
    		.match({ id });
    	loading.set(false);

    	if (error) console.error(error);

    	return data[0];
    };

    /* src/svg/Check.svelte generated by Svelte v3.49.0 */

    const file$c = "src/svg/Check.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M5 13l4 4L19 7");
    			add_location(path, file$c, 5, 111, 303);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$c, 5, 1, 193);
    			set_style(div, "width", /*size*/ ctx[0]);
    			set_style(div, "height", /*size*/ ctx[0]);
    			set_style(div, "fill", /*fill*/ ctx[1]);
    			set_style(div, "stroke", /*stroke*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[3]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$c, 4, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(div, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(div, "stroke", /*stroke*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div, "color", /*color*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Check', slots, []);
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Check> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, fill, stroke, color];
    }

    class Check extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { size: 0, fill: 1, stroke: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Check",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get size() {
    		throw new Error("<Check>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Check>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Check>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Check>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Check>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Check>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Check>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Check>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Complete.svelte generated by Svelte v3.49.0 */
    const file$b = "src/components/Complete.svelte";

    function create_fragment$d(ctx) {
    	let button;
    	let check;
    	let current;
    	let mounted;
    	let dispose;
    	check = new Check({ $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(check.$$.fragment);
    			attr_dev(button, "type", "icon");
    			toggle_class(button, "inverse", /*value*/ ctx[0]);
    			add_location(button, file$b, 8, 0, 157);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(check, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) {
    				toggle_class(button, "inverse", /*value*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(check.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(check.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(check);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Complete', slots, []);
    	let { value } = $$props;
    	let { set = v => v } = $$props;
    	const writable_props = ['value', 'set'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Complete> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => value ? set(null) : set(new Timestamp());

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('set' in $$props) $$invalidate(1, set = $$props.set);
    	};

    	$$self.$capture_state = () => ({ Timestamp, Check, value, set });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('set' in $$props) $$invalidate(1, set = $$props.set);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, set, click_handler];
    }

    class Complete extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { value: 0, set: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Complete",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<Complete> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error("<Complete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Complete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get set() {
    		throw new Error("<Complete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Complete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/svg/Trash.svelte generated by Svelte v3.49.0 */

    const file$a = "src/svg/Trash.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16");
    			add_location(path, file$a, 5, 111, 303);
    			attr_dev(svg, "class", "w-6 h-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$a, 5, 1, 193);
    			set_style(div, "width", /*size*/ ctx[0]);
    			set_style(div, "height", /*size*/ ctx[0]);
    			set_style(div, "fill", /*fill*/ ctx[1]);
    			set_style(div, "stroke", /*stroke*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[3]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$a, 4, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(div, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(div, "stroke", /*stroke*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div, "color", /*color*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Trash', slots, []);
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Trash> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, fill, stroke, color];
    }

    class Trash extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { size: 0, fill: 1, stroke: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Trash",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get size() {
    		throw new Error("<Trash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Trash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Trash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Trash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Trash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Trash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Trash>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Trash>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Item.svelte generated by Svelte v3.49.0 */
    const file$9 = "src/components/Item.svelte";

    // (37:3) { #if item.start || item.finish }
    function create_if_block$4(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*time*/ ctx[1]);
    			add_location(p, file$9, 37, 4, 1262);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*time*/ 2) set_data_dev(t, /*time*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(37:3) { #if item.start || item.finish }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let complete_1;
    	let t0;
    	let div1;
    	let div0;
    	let swatch;
    	let t1;
    	let h3;
    	let t2_value = /*item*/ ctx[0].title + "";
    	let t2;
    	let t3;
    	let t4;
    	let button;
    	let trash;
    	let button_disabled_value;
    	let current;
    	let mounted;
    	let dispose;

    	complete_1 = new Complete({
    			props: {
    				value: /*item*/ ctx[0].completed,
    				set: /*complete*/ ctx[3]
    			},
    			$$inline: true
    		});

    	swatch = new Swatch({
    			props: {
    				value: /*item*/ ctx[0].color,
    				size: "1.5rem"
    			},
    			$$inline: true
    		});

    	let if_block = (/*item*/ ctx[0].start || /*item*/ ctx[0].finish) && create_if_block$4(ctx);

    	trash = new Trash({
    			props: { size: "1.5rem" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(complete_1.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(swatch.$$.fragment);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			button = element("button");
    			create_component(trash.$$.fragment);
    			add_location(h3, file$9, 35, 3, 1199);
    			attr_dev(div0, "class", "svelte-12lxojn");
    			add_location(div0, file$9, 33, 2, 1143);
    			attr_dev(button, "type", "icon");
    			attr_dev(button, "class", "more");
    			button.disabled = button_disabled_value = !/*item*/ ctx[0].id ? true : false;
    			add_location(button, file$9, 40, 2, 1298);
    			attr_dev(div1, "class", "item svelte-12lxojn");
    			add_location(div1, file$9, 32, 1, 1081);
    			attr_dev(main, "class", "svelte-12lxojn");
    			add_location(main, file$9, 30, 0, 1021);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(complete_1, main, null);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			mount_component(swatch, div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, h3);
    			append_dev(h3, t2);
    			append_dev(div0, t3);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div1, t4);
    			append_dev(div1, button);
    			mount_component(trash, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", stop_propagation(/*click_handler*/ ctx[6]), false, false, true),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const complete_1_changes = {};
    			if (dirty & /*item*/ 1) complete_1_changes.value = /*item*/ ctx[0].completed;
    			complete_1.$set(complete_1_changes);
    			const swatch_changes = {};
    			if (dirty & /*item*/ 1) swatch_changes.value = /*item*/ ctx[0].color;
    			swatch.$set(swatch_changes);
    			if ((!current || dirty & /*item*/ 1) && t2_value !== (t2_value = /*item*/ ctx[0].title + "")) set_data_dev(t2, t2_value);

    			if (/*item*/ ctx[0].start || /*item*/ ctx[0].finish) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*item*/ 1 && button_disabled_value !== (button_disabled_value = !/*item*/ ctx[0].id ? true : false)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(complete_1.$$.fragment, local);
    			transition_in(swatch.$$.fragment, local);
    			transition_in(trash.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(complete_1.$$.fragment, local);
    			transition_out(swatch.$$.fragment, local);
    			transition_out(trash.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(complete_1);
    			destroy_component(swatch);
    			if (if_block) if_block.d();
    			destroy_component(trash);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let time;
    	let $preferences;
    	let $route;
    	validate_store(preferences, 'preferences');
    	component_subscribe($$self, preferences, $$value => $$invalidate(5, $preferences = $$value));
    	validate_store(route, 'route');
    	component_subscribe($$self, route, $$value => $$invalidate(2, $route = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Item', slots, []);
    	let { item } = $$props;
    	let { set = v => v } = $$props;

    	const complete = async v => {
    		$$invalidate(0, item.completed = v, item);
    		set(item);
    	};

    	const format = item => {
    		let string = '';
    		if (item.start && item.finish) string = `from ${hour(item.start.hour)}:${minute(item.start.minute)} ${ampm(item.start.hour)} to ${hour(item.finish.hour)}:${minute(item.finish.minute)} ${ampm(item.finish.hour)}`; else if (item.start) string = `at ${hour(item.start.hour)}:${minute(item.start.minute)} ${ampm(item.start.hour)}`; else if (item.finish) string = `by ${hour(item.finish.hour)}:${minute(item.finish.minute)} ${ampm(item.finish.hour)}`;
    		return string;
    	};

    	const writable_props = ['item', 'set'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Item> was created with unknown prop '${key}'`);
    	});

    	const click_handler = async () => item.id && await remove(item.id);
    	const click_handler_1 = () => set_store_value(route, $route = { save: item }, $route);

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('set' in $$props) $$invalidate(4, set = $$props.set);
    	};

    	$$self.$capture_state = () => ({
    		route,
    		preferences,
    		ampm,
    		hour,
    		minute,
    		remove,
    		Complete,
    		Swatch,
    		Trash,
    		item,
    		set,
    		complete,
    		format,
    		time,
    		$preferences,
    		$route
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('set' in $$props) $$invalidate(4, set = $$props.set);
    		if ('time' in $$props) $$invalidate(1, time = $$props.time);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*item*/ 1) {
    			$$invalidate(1, time = format(item));
    		}

    		if ($$self.$$.dirty & /*$preferences, item*/ 33) {
    			($preferences.hour24, $$invalidate(1, time = format(item)));
    		}
    	};

    	return [
    		item,
    		time,
    		$route,
    		complete,
    		set,
    		$preferences,
    		click_handler,
    		click_handler_1
    	];
    }

    class Item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { item: 0, set: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Item",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<Item> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get set() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set set(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Divider.svelte generated by Svelte v3.49.0 */
    const file$8 = "src/components/Divider.svelte";

    function create_fragment$a(ctx) {
    	let main;
    	let main_transition;
    	let current;

    	const block = {
    		c: function create() {
    			main = element("main");
    			attr_dev(main, "class", "svelte-tftbej");
    			add_location(main, file$8, 4, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			current = true;
    		},
    		p: noop$2,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!main_transition) main_transition = create_bidirectional_transition(main, fade, {}, true);
    				main_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!main_transition) main_transition = create_bidirectional_transition(main, fade, {}, false);
    			main_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (detaching && main_transition) main_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Divider', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Divider> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fade });
    	return [];
    }

    class Divider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Divider",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/components/View.svelte generated by Svelte v3.49.0 */
    const file$7 = "src/components/View.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (102:1) { :else }
    function create_else_block$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Click the plus to add your first item!";
    			attr_dev(h1, "class", "svelte-1qfclko");
    			add_location(h1, file$7, 102, 2, 2858);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop$2,
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(102:1) { :else }",
    		ctx
    	});

    	return block;
    }

    // (85:1) { #if items.length }
    function create_if_block$3(ctx) {
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t0;
    	let divider;
    	let t1;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let each1_anchor;
    	let current;
    	let each_value_1 = /*completed*/ ctx[1];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*item*/ ctx[7];
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1$1(key, child_ctx));
    	}

    	divider = new Divider({ $$inline: true });
    	let each_value = /*uncompleted*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key_1 = ctx => /*item*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key_1);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			create_component(divider.$$.fragment);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			mount_component(divider, target, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*completed, set*/ 18) {
    				each_value_1 = /*completed*/ ctx[1];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, t0.parentNode, outro_and_destroy_block, create_each_block_1$1, t0, get_each_context_1$1);
    				check_outros();
    			}

    			if (dirty & /*uncompleted, set*/ 20) {
    				each_value = /*uncompleted*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, each1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each1_anchor, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			transition_in(divider.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			transition_out(divider.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d(detaching);
    			}

    			if (detaching) detach_dev(t0);
    			destroy_component(divider, detaching);
    			if (detaching) detach_dev(t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(85:1) { #if items.length }",
    		ctx
    	});

    	return block;
    }

    // (86:2) { #each completed as item (item) }
    function create_each_block_1$1(key_1, ctx) {
    	let div;
    	let item;
    	let div_transition;
    	let current;

    	item = new Item({
    			props: {
    				item: /*item*/ ctx[7],
    				set: /*set*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(item.$$.fragment);
    			attr_dev(div, "class", "svelte-1qfclko");
    			add_location(div, file$7, 86, 3, 2519);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(item, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const item_changes = {};
    			if (dirty & /*completed*/ 2) item_changes.item = /*item*/ ctx[7];
    			item.$set(item_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, /*slide*/ ctx[3], {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, /*slide*/ ctx[3], {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(item);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(86:2) { #each completed as item (item) }",
    		ctx
    	});

    	return block;
    }

    // (92:2) { #each uncompleted as item (item) }
    function create_each_block$1(key_1, ctx) {
    	let div;
    	let item;
    	let t;
    	let div_transition;
    	let current;

    	item = new Item({
    			props: {
    				item: /*item*/ ctx[7],
    				set: /*set*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(item.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "svelte-1qfclko");
    			add_location(div, file$7, 92, 3, 2650);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(item, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const item_changes = {};
    			if (dirty & /*uncompleted*/ 4) item_changes.item = /*item*/ ctx[7];
    			item.$set(item_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, /*slide*/ ctx[3], {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, /*slide*/ ctx[3], {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(item);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(92:2) { #each uncompleted as item (item) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*items*/ ctx[0].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-1qfclko");
    			add_location(main, file$7, 83, 0, 2450);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('View', slots, []);
    	let { items } = $$props;

    	// $: internal = items.slice(0, 100);
    	let completed = [], uncompleted = [];

    	let pointer = completed.length;

    	const wheel = e => {
    		if (e.deltaY < 0 && -completed.length < pointer) pointer--;
    		if (0 < e.deltaY && pointer < uncompleted.length) pointer++;
    	};

    	const slide = (node, { duration }) => {
    		const style = getComputedStyle(node);
    		const height = parseFloat(style.height);

    		const padding = {
    			top: parseFloat(style.paddingTop),
    			bottom: parseFloat(style.paddingBottom)
    		};

    		const margin = {
    			top: parseFloat(style.marginTop),
    			bottom: parseFloat(style.marginBottom)
    		};

    		return {
    			delay: 0,
    			duration,
    			easing: cubicOut,
    			css: t => `
				overflow: hidden;
				height: ${t * height}px;
				padding-top: ${t * padding.top}px;
				padding-bottom: ${t * padding.bottom}px;
				margin-top: ${t * margin.top}px;
				margin-bottom: ${t * margin.bottom}px;
			`
    		};
    	};

    	const set = async item => {
    		$$invalidate(0, items[items.findIndex(v => v.id === item.id)] = item, items);
    		await save$1(item);
    	};

    	const writable_props = ['items'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<View> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	$$self.$capture_state = () => ({
    		cubicOut,
    		save: save$1,
    		Item,
    		Divider,
    		items,
    		completed,
    		uncompleted,
    		pointer,
    		wheel,
    		slide,
    		set
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('completed' in $$props) $$invalidate(1, completed = $$props.completed);
    		if ('uncompleted' in $$props) $$invalidate(2, uncompleted = $$props.uncompleted);
    		if ('pointer' in $$props) pointer = $$props.pointer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*items*/ 1) {
    			$$invalidate(1, completed = items.grep((_, index, array) => array[array.length - 1 - index].completed && array[array.length - 1 - index])); // Filter and reverse
    		}

    		if ($$self.$$.dirty & /*items*/ 1) {
    			$$invalidate(2, uncompleted = items.filter(item => !item.completed));
    		}
    	};

    	return [items, completed, uncompleted, slide, set];
    }

    class View extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { items: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "View",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !('items' in props)) {
    			console.warn("<View> was created without expected prop 'items'");
    		}
    	}

    	get items() {
    		throw new Error("<View>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<View>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/icons/filled/Add.svelte generated by Svelte v3.49.0 */

    const file$6 = "src/icons/filled/Add.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let svg;
    	let title;
    	let t;
    	let line0;
    	let line1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t = text("ionicons-v5-a");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			add_location(title, file$6, 5, 88, 280);
    			attr_dev(line0, "x1", "256");
    			attr_dev(line0, "y1", "100");
    			attr_dev(line0, "x2", "256");
    			attr_dev(line0, "y2", "412");
    			set_style(line0, "fill", "none");
    			set_style(line0, "stroke", "#000");
    			set_style(line0, "stroke-linecap", "round");
    			set_style(line0, "stroke-linejoin", "round");
    			set_style(line0, "stroke-width", "2rem");
    			add_location(line0, file$6, 5, 116, 308);
    			attr_dev(line1, "x1", "100");
    			attr_dev(line1, "y1", "256");
    			attr_dev(line1, "x2", "412");
    			attr_dev(line1, "y2", "256");
    			set_style(line1, "fill", "none");
    			set_style(line1, "stroke", "#000");
    			set_style(line1, "stroke-linecap", "round");
    			set_style(line1, "stroke-linejoin", "round");
    			set_style(line1, "stroke-width", "2rem");
    			add_location(line1, file$6, 5, 250, 442);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "512");
    			attr_dev(svg, "height", "512");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$6, 5, 1, 193);
    			set_style(div, "width", /*size*/ ctx[0]);
    			set_style(div, "height", /*size*/ ctx[0]);
    			set_style(div, "fill", /*fill*/ ctx[1]);
    			set_style(div, "stroke", /*stroke*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[3]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$6, 4, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, title);
    			append_dev(title, t);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(div, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(div, "stroke", /*stroke*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div, "color", /*color*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Add', slots, []);
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Add> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, fill, stroke, color];
    }

    class Add extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { size: 0, fill: 1, stroke: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Add",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get size() {
    		throw new Error("<Add>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Add>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Add>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Add>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Add>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Add>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Add>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Add>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Login.svelte generated by Svelte v3.49.0 */

    function create_fragment$7(ctx) {
    	let menu_1;
    	let updating_menu;
    	let current;

    	function menu_1_menu_binding(value) {
    		/*menu_1_menu_binding*/ ctx[1](value);
    	}

    	let menu_1_props = {};

    	if (/*menu*/ ctx[0] !== void 0) {
    		menu_1_props.menu = /*menu*/ ctx[0];
    	}

    	menu_1 = new Menu({ props: menu_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(menu_1, 'menu', menu_1_menu_binding));

    	const block = {
    		c: function create() {
    			create_component(menu_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const menu_1_changes = {};

    			if (!updating_menu && dirty & /*menu*/ 1) {
    				updating_menu = true;
    				menu_1_changes.menu = /*menu*/ ctx[0];
    				add_flush_callback(() => updating_menu = false);
    			}

    			menu_1.$set(menu_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let email, password;

    	let menu = {
    		name: 'Sign in',
    		key: async e => {
    			if (e.key !== 'Enter') return;

    			if (email && password) {
    				await signin(email, password);
    				return true;
    			}
    		},
    		children: [
    			{
    				name: 'Email',
    				type: 'input',
    				value: email,
    				set: v => email = v
    			},
    			{
    				name: 'Send link',
    				type: 'action',
    				click: async () => {
    					await signin(email, password);
    					return true;
    				}
    			}
    		]
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function menu_1_menu_binding(value) {
    		menu = value;
    		$$invalidate(0, menu);
    	}

    	$$self.$capture_state = () => ({ signin, Menu, email, password, menu });

    	$$self.$inject_state = $$props => {
    		if ('email' in $$props) email = $$props.email;
    		if ('password' in $$props) password = $$props.password;
    		if ('menu' in $$props) $$invalidate(0, menu = $$props.menu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menu, menu_1_menu_binding];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src/icons/filled/CloseCircle.svelte generated by Svelte v3.49.0 */

    const file$5 = "src/icons/filled/CloseCircle.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let svg;
    	let title;
    	let t;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t = text("ionicons-v5-m");
    			path = svg_element("path");
    			add_location(title, file$5, 5, 88, 280);
    			attr_dev(path, "d", "M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm75.31,260.69a16,16,0,1,1-22.62,22.62L256,278.63l-52.69,52.68a16,16,0,0,1-22.62-22.62L233.37,256l-52.68-52.69a16,16,0,0,1,22.62-22.62L256,233.37l52.69-52.68a16,16,0,0,1,22.62,22.62L278.63,256Z");
    			add_location(path, file$5, 5, 116, 308);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "512");
    			attr_dev(svg, "height", "512");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$5, 5, 1, 193);
    			set_style(div, "width", /*size*/ ctx[0]);
    			set_style(div, "height", /*size*/ ctx[0]);
    			set_style(div, "fill", /*fill*/ ctx[1]);
    			set_style(div, "stroke", /*stroke*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[3]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$5, 4, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, title);
    			append_dev(title, t);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(div, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(div, "stroke", /*stroke*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div, "color", /*color*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CloseCircle', slots, []);
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CloseCircle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, fill, stroke, color];
    }

    class CloseCircle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { size: 0, fill: 1, stroke: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CloseCircle",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get size() {
    		throw new Error("<CloseCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CloseCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<CloseCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<CloseCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<CloseCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<CloseCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<CloseCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<CloseCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/icons/filled/AlertCircle.svelte generated by Svelte v3.49.0 */

    const file$4 = "src/icons/filled/AlertCircle.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let svg;
    	let title;
    	let t;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t = text("ionicons-v5-a");
    			path = svg_element("path");
    			add_location(title, file$4, 5, 88, 280);
    			attr_dev(path, "d", "M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm0,319.91a20,20,0,1,1,20-20A20,20,0,0,1,256,367.91Zm21.72-201.15-5.74,122a16,16,0,0,1-32,0l-5.74-121.94v-.05a21.74,21.74,0,1,1,43.44,0Z");
    			add_location(path, file$4, 5, 116, 308);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "512");
    			attr_dev(svg, "height", "512");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$4, 5, 1, 193);
    			set_style(div, "width", /*size*/ ctx[0]);
    			set_style(div, "height", /*size*/ ctx[0]);
    			set_style(div, "fill", /*fill*/ ctx[1]);
    			set_style(div, "stroke", /*stroke*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[3]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$4, 4, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, title);
    			append_dev(title, t);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(div, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(div, "stroke", /*stroke*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div, "color", /*color*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AlertCircle', slots, []);
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AlertCircle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, fill, stroke, color];
    }

    class AlertCircle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { size: 0, fill: 1, stroke: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AlertCircle",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get size() {
    		throw new Error("<AlertCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<AlertCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<AlertCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<AlertCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<AlertCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<AlertCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<AlertCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<AlertCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/icons/filled/CheckmarkCircle.svelte generated by Svelte v3.49.0 */

    const file$3 = "src/icons/filled/CheckmarkCircle.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let svg;
    	let title;
    	let t;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t = text("ionicons-v5-e");
    			path = svg_element("path");
    			add_location(title, file$3, 5, 88, 280);
    			attr_dev(path, "d", "M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48ZM364.25,186.29l-134.4,160a16,16,0,0,1-12,5.71h-.27a16,16,0,0,1-11.89-5.3l-57.6-64a16,16,0,1,1,23.78-21.4l45.29,50.32L339.75,165.71a16,16,0,0,1,24.5,20.58Z");
    			add_location(path, file$3, 5, 116, 308);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "512");
    			attr_dev(svg, "height", "512");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$3, 5, 1, 193);
    			set_style(div, "width", /*size*/ ctx[0]);
    			set_style(div, "height", /*size*/ ctx[0]);
    			set_style(div, "fill", /*fill*/ ctx[1]);
    			set_style(div, "stroke", /*stroke*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[3]);
    			attr_dev(div, "class", "svelte-1wvg2uo");
    			add_location(div, file$3, 4, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, title);
    			append_dev(title, t);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*size*/ 1) {
    				set_style(div, "width", /*size*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 1) {
    				set_style(div, "height", /*size*/ ctx[0]);
    			}

    			if (dirty & /*fill*/ 2) {
    				set_style(div, "fill", /*fill*/ ctx[1]);
    			}

    			if (dirty & /*stroke*/ 4) {
    				set_style(div, "stroke", /*stroke*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 8) {
    				set_style(div, "color", /*color*/ ctx[3]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckmarkCircle', slots, []);
    	let { size = '2rem', fill = 'none', stroke = 'white', color = 'inherit' } = $$props;
    	const writable_props = ['size', 'fill', 'stroke', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckmarkCircle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ size, fill, stroke, color });

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(0, size = $$props.size);
    		if ('fill' in $$props) $$invalidate(1, fill = $$props.fill);
    		if ('stroke' in $$props) $$invalidate(2, stroke = $$props.stroke);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, fill, stroke, color];
    }

    class CheckmarkCircle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { size: 0, fill: 1, stroke: 2, color: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckmarkCircle",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get size() {
    		throw new Error("<CheckmarkCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CheckmarkCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<CheckmarkCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<CheckmarkCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<CheckmarkCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<CheckmarkCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<CheckmarkCircle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<CheckmarkCircle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Notification.svelte generated by Svelte v3.49.0 */
    const file$2 = "src/components/Notification.svelte";

    // (18:45) 
    function create_if_block_2(ctx) {
    	let div;
    	let checkmarkcircle;
    	let current;

    	checkmarkcircle = new CheckmarkCircle({
    			props: { size: '2rem', fill: 'var(--green)' },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(checkmarkcircle.$$.fragment);
    			attr_dev(div, "class", "icon svelte-w380aj");
    			add_location(div, file$2, 18, 2, 553);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(checkmarkcircle, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkmarkcircle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkmarkcircle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(checkmarkcircle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(18:45) ",
    		ctx
    	});

    	return block;
    }

    // (14:47) 
    function create_if_block_1$2(ctx) {
    	let div;
    	let alertcircle;
    	let current;

    	alertcircle = new AlertCircle({
    			props: { size: '2rem', fill: 'var(--blue)' },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(alertcircle.$$.fragment);
    			attr_dev(div, "class", "icon svelte-w380aj");
    			add_location(div, file$2, 14, 2, 423);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(alertcircle, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alertcircle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alertcircle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(alertcircle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(14:47) ",
    		ctx
    	});

    	return block;
    }

    // (10:1) { #if notification.type === 'error' }
    function create_if_block$2(ctx) {
    	let div;
    	let closecircle;
    	let current;

    	closecircle = new CloseCircle({
    			props: { size: '2rem', fill: 'var(--red)' },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(closecircle.$$.fragment);
    			attr_dev(div, "class", "icon svelte-w380aj");
    			add_location(div, file$2, 10, 2, 292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(closecircle, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(closecircle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(closecircle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(closecircle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(10:1) { #if notification.type === 'error' }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let div;
    	let h3;
    	let t1_value = /*notification*/ ctx[0].type + "";
    	let t1;
    	let t2;
    	let t3;
    	let p;
    	let t4_value = /*notification*/ ctx[0].message + "";
    	let t4;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*notification*/ ctx[0].type === 'error') return 0;
    		if (/*notification*/ ctx[0].type === 'important') return 1;
    		if (/*notification*/ ctx[0].type === 'success') return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = text("!");
    			t3 = space();
    			p = element("p");
    			t4 = text(t4_value);
    			attr_dev(h3, "class", "svelte-w380aj");
    			add_location(h3, file$2, 23, 2, 671);
    			attr_dev(p, "class", "svelte-w380aj");
    			add_location(p, file$2, 24, 2, 703);
    			attr_dev(div, "class", "text svelte-w380aj");
    			add_location(div, file$2, 22, 1, 650);
    			attr_dev(main, "class", "svelte-w380aj");
    			add_location(main, file$2, 8, 0, 244);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			append_dev(main, t0);
    			append_dev(main, div);
    			append_dev(div, h3);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    			append_dev(div, t3);
    			append_dev(div, p);
    			append_dev(p, t4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, t0);
    				} else {
    					if_block = null;
    				}
    			}

    			if ((!current || dirty & /*notification*/ 1) && t1_value !== (t1_value = /*notification*/ ctx[0].type + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*notification*/ 1) && t4_value !== (t4_value = /*notification*/ ctx[0].message + "")) set_data_dev(t4, t4_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notification', slots, []);
    	let { notification } = $$props;
    	const writable_props = ['notification'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('notification' in $$props) $$invalidate(0, notification = $$props.notification);
    	};

    	$$self.$capture_state = () => ({
    		CloseCircle,
    		AlertCircle,
    		CheckmarkCircle,
    		notification
    	});

    	$$self.$inject_state = $$props => {
    		if ('notification' in $$props) $$invalidate(0, notification = $$props.notification);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [notification];
    }

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { notification: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notification",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*notification*/ ctx[0] === undefined && !('notification' in props)) {
    			console.warn("<Notification> was created without expected prop 'notification'");
    		}
    	}

    	get notification() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notification(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Stack.svelte generated by Svelte v3.49.0 */
    const file$1 = "src/components/Stack.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[17] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (59:1) { #each visible as notification (notification) }
    function create_each_block_1(key_1, ctx) {
    	let div;
    	let notification;
    	let div_intro;
    	let div_outro;
    	let rect;
    	let stop_animation = noop$2;
    	let current;
    	let mounted;
    	let dispose;

    	notification = new Notification({
    			props: { notification: /*notification*/ ctx[15] },
    			$$inline: true
    		});

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*notification*/ ctx[15]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(notification.$$.fragment);
    			add_location(div, file$1, 59, 2, 1383);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(notification, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", click_handler, false, false, false),
    					listen_dev(
    						div,
    						"introstart",
    						function () {
    							if (is_function(/*timer*/ ctx[5](/*notification*/ ctx[15]))) /*timer*/ ctx[5](/*notification*/ ctx[15]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const notification_changes = {};
    			if (dirty & /*visible*/ 4) notification_changes.notification = /*notification*/ ctx[15];
    			notification.$set(notification_changes);
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notification.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fly, { y: 50 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notification.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(notification);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(59:1) { #each visible as notification (notification) }",
    		ctx
    	});

    	return block;
    }

    // (64:1) { #if !expand }
    function create_if_block_1$1(ctx) {
    	let div;
    	let h3;
    	let t_value = /*$stack*/ ctx[1].length + "";
    	let t;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t = text(t_value);
    			add_location(h3, file$1, 65, 3, 1672);
    			attr_dev(div, "class", "expand svelte-rzayqb");
    			add_location(div, file$1, 64, 2, 1580);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_1*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$stack*/ 2) && t_value !== (t_value = /*$stack*/ ctx[1].length + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -50 }, true);
    					div_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (local) {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -50 }, false);
    				div_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(64:1) { #if !expand }",
    		ctx
    	});

    	return block;
    }

    // (71:0) { #if expand }
    function create_if_block$1(ctx) {
    	let div1;
    	let button;
    	let button_transition;
    	let t1;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = [.../*$stack*/ ctx[1]].reverse();
    	validate_each_argument(each_value);
    	const get_key = ctx => /*notification*/ ctx[15];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Clear";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "class", "clear svelte-rzayqb");
    			toggle_class(button, "disabled", !/*$stack*/ ctx[1].length);
    			add_location(button, file$1, 72, 2, 1874);
    			attr_dev(div0, "class", "wrapper svelte-rzayqb");
    			add_location(div0, file$1, 73, 2, 2002);
    			attr_dev(div1, "class", "notifications svelte-rzayqb");
    			add_location(div1, file$1, 71, 1, 1740);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[8], false, false, false),
    					listen_dev(div1, "click", stop_propagation(/*click_handler_4*/ ctx[10]), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$stack*/ 2) {
    				toggle_class(button, "disabled", !/*$stack*/ ctx[1].length);
    			}

    			if (dirty & /*splack, $stack*/ 18) {
    				each_value = [.../*$stack*/ ctx[1]].reverse();
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, fly, { x: -50 }, true);
    				button_transition.run(1);
    			});

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 300, easing: cubicOut }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(button, fly, { x: -50 }, false);
    			button_transition.run(0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 300, easing: cubicOut }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && button_transition) button_transition.end();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(71:0) { #if expand }",
    		ctx
    	});

    	return block;
    }

    // (75:3) { #each [...$stack].reverse() as notification, i (notification) }
    function create_each_block(key_1, ctx) {
    	let div;
    	let notification;
    	let t;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;

    	notification = new Notification({
    			props: { notification: /*notification*/ ctx[15] },
    			$$inline: true
    		});

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[9](/*notification*/ ctx[15]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(notification.$$.fragment);
    			t = space();
    			add_location(div, file$1, 75, 4, 2097);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(notification, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", stop_propagation(click_handler_3), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const notification_changes = {};
    			if (dirty & /*$stack*/ 2) notification_changes.notification = /*notification*/ ctx[15];
    			notification.$set(notification_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notification.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fly, { x: -50, delay: (/*i*/ ctx[17] + 1) * 50 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notification.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fly, { x: -50 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(notification);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(75:3) { #each [...$stack].reverse() as notification, i (notification) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let each_value_1 = /*visible*/ ctx[2];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*notification*/ ctx[15];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	let if_block0 = !/*expand*/ ctx[0] && create_if_block_1$1(ctx);
    	let if_block1 = /*expand*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(main, "class", "svelte-rzayqb");
    			add_location(main, file$1, 57, 0, 1324);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t0);
    			if (if_block0) if_block0.m(main, null);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visplice, visible, timer*/ 44) {
    				each_value_1 = /*visible*/ ctx[2];
    				validate_each_argument(each_value_1);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, main, fix_and_outro_and_destroy_block, create_each_block_1, t0, get_each_context_1);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}

    			if (!/*expand*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*expand*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*expand*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*expand*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $stack;
    	validate_store(stack, 'stack');
    	component_subscribe($$self, stack, $$value => $$invalidate(1, $stack = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stack', slots, []);
    	let visible = [];
    	let expand = false;
    	let length = $stack.length;
    	onMount(() => $$invalidate(2, visible = [...$stack]));

    	const [send, receive] = crossfade({
    		duration: d => Math.sqrt(d * 200),
    		fallback: node => {
    			const style = getComputedStyle(node);
    			const transform = style.transform === 'none' ? '' : style.transform;

    			return {
    				duration: 600,
    				easing: quintOut,
    				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
    			};
    		}
    	});

    	const visplice = item => {
    		// TODO: passing array doesn't work :(
    		const index = visible.indexOf(item);

    		if (index !== -1) visible.splice(index, 1);
    		($$invalidate(2, visible), $$invalidate(0, expand));
    		length = $stack.length;
    	};

    	const splack = item => {
    		// TODO: passing array doesn't work :(
    		const index = $stack.indexOf(item);

    		if (index !== -1) $stack.splice(index, 1);
    		stack.set($stack);
    	};

    	const timer = async item => setTimeout(() => visplice(item), 5000);

    	const fresh = () => {
    		$$invalidate(2, visible = [...$stack.slice(length)]);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Stack> was created with unknown prop '${key}'`);
    	});

    	const click_handler = notification => visplice(notification);
    	const click_handler_1 = () => $$invalidate(0, expand = !expand);
    	const click_handler_2 = () => set_store_value(stack, $stack = [], $stack);
    	const click_handler_3 = notification => splack(notification);
    	const click_handler_4 = () => $$invalidate(0, expand = !expand);

    	$$self.$capture_state = () => ({
    		onMount,
    		flip,
    		cubicOut,
    		fly,
    		fade,
    		crossfade,
    		stack,
    		Notification,
    		visible,
    		expand,
    		length,
    		send,
    		receive,
    		visplice,
    		splack,
    		timer,
    		fresh,
    		$stack
    	});

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(2, visible = $$props.visible);
    		if ('expand' in $$props) $$invalidate(0, expand = $$props.expand);
    		if ('length' in $$props) length = $$props.length;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$stack*/ 2) {
    			(fresh());
    		}

    		if ($$self.$$.dirty & /*expand*/ 1) {
    			if (expand) $$invalidate(2, visible = []);
    		}
    	};

    	return [
    		expand,
    		$stack,
    		visible,
    		visplice,
    		splack,
    		timer,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class Stack extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stack",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Tasks.svelte generated by Svelte v3.49.0 */
    const file = "src/components/Tasks.svelte";

    // (159:1) { :else }
    function create_else_block(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(159:1) { :else }",
    		ctx
    	});

    	return block;
    }

    // (133:1) { #if $user }
    function create_if_block(ctx) {
    	let bar;
    	let t;
    	let await_block_anchor;
    	let promise;
    	let current;

    	bar = new Bar({
    			props: { items: /*$items*/ ctx[3] },
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 16,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*$items*/ ctx[3], info);

    	const block = {
    		c: function create() {
    			create_component(bar.$$.fragment);
    			t = space();
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			mount_component(bar, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const bar_changes = {};
    			if (dirty & /*$items*/ 8) bar_changes.items = /*$items*/ ctx[3];
    			bar.$set(bar_changes);
    			info.ctx = ctx;

    			if (dirty & /*$items*/ 8 && promise !== (promise = /*$items*/ ctx[3]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bar.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bar.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bar, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(133:1) { #if $user }",
    		ctx
    	});

    	return block;
    }

    // (160:2) <Modal>
    function create_default_slot_1$1(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(160:2) <Modal>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>  import { supabase }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop$2,
    		m: noop$2,
    		p: noop$2,
    		i: noop$2,
    		o: noop$2,
    		d: noop$2
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>  import { supabase }",
    		ctx
    	});

    	return block;
    }

    // (138:2) { :then items }
    function create_then_block(ctx) {
    	let view;
    	let t0;
    	let t1;
    	let button;
    	let add;
    	let current;
    	let mounted;
    	let dispose;

    	view = new View({
    			props: { items: /*items*/ ctx[16] },
    			$$inline: true
    		});

    	let if_block = /*$route*/ ctx[0].save && create_if_block_1(ctx);

    	add = new Add({
    			props: { size: "2.5rem" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(view.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			button = element("button");
    			create_component(add.$$.fragment);
    			attr_dev(button, "type", "icon");
    			attr_dev(button, "class", "new svelte-1h1yi05");
    			add_location(button, file, 145, 3, 3203);
    		},
    		m: function mount(target, anchor) {
    			mount_component(view, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    			mount_component(add, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const view_changes = {};
    			if (dirty & /*$items*/ 8) view_changes.items = /*items*/ ctx[16];
    			view.$set(view_changes);

    			if (/*$route*/ ctx[0].save) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$route*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(view.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(add.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(view.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(add.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(view, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    			destroy_component(add);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(138:2) { :then items }",
    		ctx
    	});

    	return block;
    }

    // (140:3) { #if $route.save }
    function create_if_block_1(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: {
    					tip: [create_tip_slot],
    					default: [create_default_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("close", /*close_handler_1*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, menu, $route*/ 131077) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(140:3) { #if $route.save }",
    		ctx
    	});

    	return block;
    }

    // (141:4) <Modal on:close={() => $route = {}}>
    function create_default_slot$1(ctx) {
    	let menu_1;
    	let updating_menu;
    	let current;

    	function menu_1_menu_binding(value) {
    		/*menu_1_menu_binding*/ ctx[8](value);
    	}

    	let menu_1_props = {};

    	if (/*menu*/ ctx[2] !== void 0) {
    		menu_1_props.menu = /*menu*/ ctx[2];
    	}

    	menu_1 = new Menu({ props: menu_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(menu_1, 'menu', menu_1_menu_binding));
    	menu_1.$on("close", /*close_handler*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(menu_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menu_1_changes = {};

    			if (!updating_menu && dirty & /*menu*/ 4) {
    				updating_menu = true;
    				menu_1_changes.menu = /*menu*/ ctx[2];
    				add_flush_callback(() => updating_menu = false);
    			}

    			menu_1.$set(menu_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(141:4) <Modal on:close={() => $route = {}}>",
    		ctx
    	});

    	return block;
    }

    // (142:5) 
    function create_tip_slot(ctx) {
    	let p;
    	let kbd0;
    	let t1;
    	let kbd1;
    	let t3;
    	let kbd2;
    	let t5;
    	let kbd3;
    	let t7;

    	const block = {
    		c: function create() {
    			p = element("p");
    			kbd0 = element("kbd");
    			kbd0.textContent = "control";
    			t1 = text(" + ");
    			kbd1 = element("kbd");
    			kbd1.textContent = "s";
    			t3 = text(" or ");
    			kbd2 = element("kbd");
    			kbd2.textContent = "control";
    			t5 = text(" + ");
    			kbd3 = element("kbd");
    			kbd3.textContent = "enter";
    			t7 = text(" to save");
    			add_location(kbd0, file, 141, 19, 3036);
    			add_location(kbd1, file, 141, 40, 3057);
    			add_location(kbd2, file, 141, 56, 3073);
    			add_location(kbd3, file, 141, 77, 3094);
    			attr_dev(p, "slot", "tip");
    			add_location(p, file, 141, 5, 3022);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, kbd0);
    			append_dev(p, t1);
    			append_dev(p, kbd1);
    			append_dev(p, t3);
    			append_dev(p, kbd2);
    			append_dev(p, t5);
    			append_dev(p, kbd3);
    			append_dev(p, t7);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tip_slot.name,
    		type: "slot",
    		source: "(142:5) ",
    		ctx
    	});

    	return block;
    }

    // (136:19)     <!-- <Loading /> -->   { :then items }
    function create_pending_block(ctx) {
    	const block = {
    		c: noop$2,
    		m: noop$2,
    		p: noop$2,
    		i: noop$2,
    		o: noop$2,
    		d: noop$2
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(136:19)     <!-- <Loading /> -->   { :then items }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let stack_1;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	stack_1 = new Stack({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$user*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(stack_1.$$.fragment);
    			t = space();
    			if_block.c();
    			attr_dev(main, "class", "svelte-1h1yi05");
    			add_location(main, file, 130, 0, 2776);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(stack_1, main, null);
    			append_dev(main, t);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousedown", /*down*/ ctx[4], false, false, false),
    					listen_dev(window, "mousemove", /*move*/ ctx[5], false, false, false),
    					listen_dev(window, "mouseup", /*up*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack_1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack_1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(stack_1);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let menu;
    	let $route;
    	let $preferences;
    	let $stack;
    	let $mouse;
    	let $user;
    	let $items;
    	validate_store(route, 'route');
    	component_subscribe($$self, route, $$value => $$invalidate(0, $route = $$value));
    	validate_store(preferences, 'preferences');
    	component_subscribe($$self, preferences, $$value => $$invalidate(7, $preferences = $$value));
    	validate_store(stack, 'stack');
    	component_subscribe($$self, stack, $$value => $$invalidate(12, $stack = $$value));
    	validate_store(mouse, 'mouse');
    	component_subscribe($$self, mouse, $$value => $$invalidate(13, $mouse = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(1, $user = $$value));
    	validate_store(items, 'items');
    	component_subscribe($$self, items, $$value => $$invalidate(3, $items = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tasks', slots, []);

    	supabase.auth.onAuthStateChange(async (_, session) => {
    		set_store_value(user, $user = session?.user, $user);
    		if ($user) set_store_value(preferences, $preferences = await read(), $preferences);
    	});

    	const down = e => {
    		set_store_value(mouse, $mouse.buttons = e.buttons, $mouse);

    		set_store_value(
    			mouse,
    			$mouse.down = {
    				x: e.clientX,
    				y: e.clientY,
    				target: e.target
    			},
    			$mouse
    		);
    	};

    	const move = e => {
    		set_store_value(mouse, $mouse.x = e.clientX, $mouse);
    		set_store_value(mouse, $mouse.y = e.clientY, $mouse);
    		set_store_value(mouse, $mouse.target = e.target, $mouse);
    	};

    	const up = e => {
    		set_store_value(mouse, $mouse.buttons = e.buttons, $mouse);
    		set_store_value(mouse, $mouse.down = { x: null, y: null, target: null }, $mouse);
    	};

    	const error = item => {
    		if (!item) return 'No item supplied!';

    		if (item.start && item.finish && !compare(item.start, item.finish).less) {
    			return 'Ending time must be after starting time!';
    		}

    		return '';
    	};

    	const audit = async () => {
    		const err = error($route.save);
    		if (err) return set_store_value(stack, $stack = [...$stack, { type: 'error', message: err }], $stack);
    		const item = $route.save;
    		set_store_value(route, $route = {}, $route);
    		await save$1(item);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tasks> was created with unknown prop '${key}'`);
    	});

    	function menu_1_menu_binding(value) {
    		menu = value;
    		(($$invalidate(2, menu), $$invalidate(0, $route)), $$invalidate(7, $preferences));
    	}

    	const close_handler = () => set_store_value(route, $route = {}, $route);
    	const close_handler_1 = () => set_store_value(route, $route = {}, $route);

    	const click_handler = () => {
    		if ($route.save) set_store_value(route, $route = {}, $route); else set_store_value(
    			route,
    			$route = {
    				save: {
    					title: '',
    					desc: '',
    					start: undefined,
    					end: undefined,
    					color: { h: 0, s: 0, v: 100 }
    				}
    			},
    			$route
    		);
    	};

    	$$self.$capture_state = () => ({
    		supabase,
    		route,
    		user,
    		mouse,
    		preferences,
    		items,
    		stack,
    		save: save$1,
    		read,
    		update: save,
    		compare,
    		Bar,
    		View,
    		Modal,
    		Menu,
    		Add,
    		Login,
    		Stack,
    		down,
    		move,
    		up,
    		error,
    		audit,
    		menu,
    		$route,
    		$preferences,
    		$stack,
    		$mouse,
    		$user,
    		$items
    	});

    	$$self.$inject_state = $$props => {
    		if ('menu' in $$props) $$invalidate(2, menu = $$props.menu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$user, $preferences*/ 130) {
    			if ($user) save($user.id, $preferences);
    		}

    		if ($$self.$$.dirty & /*$route, $preferences*/ 129) {
    			$$invalidate(2, menu = {
    				name: 'New task',
    				key: async e => {
    					if (!e.ctrlKey || e.key !== 's' && e.key !== 'Enter') return;
    					e.preventDefault();
    					audit();
    				},
    				children: [
    					{
    						name: 'Title',
    						type: 'input',
    						value: $route.save?.title,
    						set: v => set_store_value(route, $route.save.title = v, $route)
    					},
    					{
    						name: 'Description',
    						type: 'textarea',
    						css: 'resize: none',
    						value: $route.save?.description,
    						set: v => set_store_value(route, $route.save.description = v, $route)
    					},
    					{
    						name: 'Start',
    						children: [
    							{
    								type: 'time',
    								value: $route.save?.start,
    								set: v => set_store_value(route, $route.save.start = v, $route)
    							}
    						]
    					},
    					{
    						name: 'Finish',
    						children: [
    							{
    								type: 'time',
    								value: $route.save?.finish,
    								set: v => set_store_value(route, $route.save.finish = v, $route)
    							}
    						]
    					},
    					{
    						name: 'Edit color',
    						children: [
    							{
    								name: 'My list',
    								children: [
    									{
    										type: 'colors',
    										value: $route.save?.color,
    										set: v => {
    											set_store_value(route, $route.save.color = v, $route);
    											return true;
    										}
    									}
    								]
    							},
    							{
    								name: 'Custom',
    								children: [
    									{
    										type: 'color',
    										value: $route.save?.color ?? $preferences?.color ?? { h: 0, s: 0, v: 0 },
    										set: v => set_store_value(route, $route.save.color = v, $route)
    									}
    								]
    							}
    						]
    					},
    					{
    						name: 'Save',
    						type: 'action',
    						click: audit
    					}
    				]
    			});
    		}
    	};

    	return [
    		$route,
    		$user,
    		menu,
    		$items,
    		down,
    		move,
    		up,
    		$preferences,
    		menu_1_menu_binding,
    		close_handler,
    		close_handler_1,
    		click_handler
    	];
    }

    class Tasks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tasks",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.49.0 */

    // (10:1) <Route path='/'>
    function create_default_slot_2(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(10:1) <Route path='/'>",
    		ctx
    	});

    	return block;
    }

    // (13:1) <Route path='/tasks/*'>
    function create_default_slot_1(ctx) {
    	let tasks;
    	let current;
    	tasks = new Tasks({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(tasks.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tasks, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tasks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tasks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tasks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(13:1) <Route path='/tasks/*'>",
    		ctx
    	});

    	return block;
    }

    // (9:0) <Router {url}>
    function create_default_slot(ctx) {
    	let route0;
    	let t;
    	let route1;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/tasks/*",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(9:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let url = '';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router, Route, Home, Tasks, url });

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    Array.prototype.insert = function(index, item) {
    	let build = [...this];

    	build.splice(index, 0, item);

    	return build;
    };

    Array.prototype.grep = function(callback) {
    	let build = [];
    	for (let i = 0; i < this.length; i++) {
    		const result = callback(this[i], i, this);
    		if (result) build.push(result);
    	}

    	return build;
    };

    Array.prototype.section = function(start, end) {
    	let build = [];
    	for (let i = 0; i <= Math.abs(start - end); i++) {
    		build.push(this.at((start + i) % this.length));
    	}

    	return build;
    };

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
