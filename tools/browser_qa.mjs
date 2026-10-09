#!/usr/bin/env node
// Browser smoke check for PMICBook; no package dependencies.
// Usage: node tools/browser_qa.mjs https://frbread7.github.io/pmicbook/
import { spawn } from 'node:child_process';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = new URL(process.argv[2] || 'http://localhost:8000/');
const isPages = base.origin === 'https://frbread7.github.io';
const isLocal = base.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(base.hostname);
if (base.username || base.password || base.search || base.hash || !(isPages || isLocal) ||
    (isPages && !['/pmicbook', '/pmicbook/'].includes(base.pathname)) ||
    (isLocal && !['/', '/pmicbook', '/pmicbook/'].includes(base.pathname))) {
  throw new Error('Browser QA accepts only https://frbread7.github.io/pmicbook/ or a local HTTP server');
}
if (!base.pathname.endsWith('/')) base.pathname += '/';
function resolveRoute(route) {
  if (typeof route !== 'string' || route.startsWith('/') || route.startsWith('\\') ||
      route.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(route)) {
    throw new Error(`Browser QA route must be relative to the allowed site: ${route}`);
  }
  const url = new URL(route, base);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
    throw new Error(`Browser QA route escaped its allowed site path: ${route}`);
  }
  return url;
}
const registry = await readFile(new URL('../js/common.js', import.meta.url), 'utf8');
const slugs = [...registry.matchAll(/\{ slug: "([^"]+)"/g)].map(match => match[1]);
if (slugs.length !== 25) throw new Error(`Expected 25 chapter slugs, found ${slugs.length}`);
const focus = process.argv[3] || '';
const routes = focus.startsWith('route:') ? [focus.slice(6)] : ['--lab', '--lab-presets', '--diagnostics'].includes(focus) ? [] :
  ['', 'ko/', ...slugs.flatMap(slug => [`chapters/${slug}.html`, `ko/chapters/${slug}.html`]), 'chapters/resist.html'];
routes.map(resolveRoute);
const profile = await mkdtemp(join(tmpdir(), 'pmicbook-chrome-'));
let chrome;
let chromeStartError;
let chromeStderr = '';
let ws;
let nextId = 0;
const pending = new Map();
const events = new Map();
const requests = new Map();
const issues = [];
let currentRoute = '';
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function exceptionSummary(details) {
  const frames = details.stackTrace?.callFrames || [];
  const stack = frames.slice(0, 4).map(frame =>
    `${frame.functionName || '<anonymous>'} (${frame.url}:${frame.lineNumber + 1}:${frame.columnNumber + 1})`
  ).join(' <- ');
  const location = details.url ? `${details.url}:${(details.lineNumber || 0) + 1}:${(details.columnNumber || 0) + 1}` : '';
  return [details.exception?.description || details.text || 'Uncaught exception', location, stack].filter(Boolean).join(' | ');
}
function waitForExit(child, timeout) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve(true);
  return Promise.race([
    new Promise(resolve => child.once('exit', () => resolve(true))),
    sleep(timeout).then(() => false)
  ]);
}
function event(name, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { events.delete(name); reject(new Error(`${name} timeout`)); }, timeout);
    events.set(name, data => { clearTimeout(timer); events.delete(name); resolve(data); });
  });
}
function navigationEvent(timeout) {
  return new Promise((resolve, reject) => {
    const finish = value => {
      clearTimeout(timer);
      events.delete('Page.loadEventFired');
      events.delete('Page.navigatedWithinDocument');
      resolve(value);
    };
    const timer = setTimeout(() => {
      events.delete('Page.loadEventFired');
      events.delete('Page.navigatedWithinDocument');
      reject(new Error(`Page navigation timeout after ${timeout} ms`));
    }, timeout);
    events.set('Page.loadEventFired', finish);
    events.set('Page.navigatedWithinDocument', finish);
  });
}
function send(method, params = {}, timeoutMs = 45000) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${currentRoute || '/'}: ${method} timed out`)); }, timeoutMs);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(`${currentRoute || '/'}: ${response.exceptionDetails.exception?.description || response.exceptionDetails.text}`);
  return response.result?.value;
}
async function page(route, viewport = { width: 1280, height: 900 }, loadTimeout = 30000) {
  currentRoute = route;
  await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: viewport.width < 600 });
  const url = resolveRoute(route);
  const navigationTimeout = loadTimeout + 1000;
  if (url.hash.startsWith('#r=')) {
    const blankNavigation = navigationEvent(loadTimeout).then(() => true).catch(() => false);
    await send('Page.navigate', { url: 'about:blank' }, navigationTimeout);
    if (!(await blankNavigation)) throw new Error(`${route}: could not reset the page before loading shared state`);
  }
  let loaded = false;
  const pageNavigation = navigationEvent(loadTimeout).then(() => { loaded = true; }).catch(() => {});
  const result = await send('Page.navigate', { url: url.href }, navigationTimeout);
  if (result.errorText) throw new Error(`${route}: ${result.errorText}`);
  await pageNavigation;
  if (!loaded) {
    issues.push(`${route || '/'}: load event timed out after ${loadTimeout} ms`);
    return { loaded: false };
  }
  await sleep(120);
  const info = await evaluate(`(() => ({title: document.title, path: location.pathname, ready: document.readyState,
    css: !!document.querySelector('link[href$="css/style.css"]'), bar: !!document.querySelector('.pb-topbar'),
    badCanvas: [...document.querySelectorAll('canvas')].filter(c => !c.width || !c.height).length,
    katexErrors: document.querySelectorAll('.katex-error').length, overflow: document.body.scrollWidth > innerWidth + 6,
    canonical: document.querySelector('link[rel="canonical"]')?.href || ''}))()`);
  if (!info?.title || !info?.css || !info?.bar || info.katexErrors || info.badCanvas || (viewport.width < 600 && info.overflow)) {
    issues.push(`${route || '/'}: ${JSON.stringify(info)}`);
  }
  return { ...info, loaded: true };
}
async function clickAndWait(selector) {
  const didNavigate = navigationEvent(10000);
  await evaluate(`(() => {
    const link = document.querySelector(${JSON.stringify(selector)});
    if (!link) throw new Error('Missing navigation link: ' + ${JSON.stringify(selector)});
    link.click();
  })()`);
  await didNavigate;
  const href = await evaluate('location.href');
  const destination = new URL(href);
  if (destination.origin !== base.origin || !destination.pathname.startsWith(base.pathname)) {
    issues.push(`${currentRoute || '/'}: generated link escaped the project site: ${href}`);
  }
  currentRoute = destination.pathname.slice(base.pathname.length) + destination.search + destination.hash;
  return { href, path: destination.pathname, hash: destination.hash };
}
try {
  chrome = spawn('google-chrome', [
    '--headless=new', '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'], detached: process.platform !== 'win32' });
  chrome.on('error', error => { chromeStartError = error; });
  chrome.stderr?.on('data', data => { chromeStderr = (chromeStderr + data.toString()).slice(-4000); });
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; }
    catch {
      if (chromeStartError) throw new Error(`Unable to start google-chrome: ${chromeStartError.message}`);
      if (chrome.exitCode !== null || chrome.signalCode !== null) {
        throw new Error(`Chrome exited before DevTools started (code ${chrome.exitCode}, signal ${chrome.signalCode}): ${chromeStderr.trim() || 'no stderr output'}`);
      }
      await sleep(100);
    }
  }
  if (!port) throw new Error(`Chrome DevTools did not start: ${chromeStderr.trim() || 'no stderr output'}`);
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const tab = tabs.find(x => x.type === 'page');
  if (!tab) throw new Error('No Chrome page target');
  ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  ws.onmessage = e => {
    const message = JSON.parse(e.data);
    if (message.id) {
      const request = pending.get(message.id); pending.delete(message.id);
      if (message.error) request?.reject(new Error(message.error.message)); else request?.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') {
      issues.push(`${currentRoute || '/'}: runtime exception: ${exceptionSummary(message.params.exceptionDetails)}`);
    } else if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
      const entry = message.params.entry;
      const location = entry.url ? ` at ${entry.url}:${(entry.lineNumber || 0) + 1}` : '';
      issues.push(`${currentRoute || '/'}: console error${location}: ${entry.text}`);
    } else if (message.method === 'Network.requestWillBeSent') {
      requests.set(message.params.requestId, { url: message.params.request.url, route: currentRoute || '/' });
    } else if (message.method === 'Network.loadingFailed' && !message.params.canceled) {
      const request = requests.get(message.params.requestId);
      issues.push(`${request?.route || currentRoute || '/'}: network failure ${request?.url || ''}: ${message.params.errorText}`);
      requests.delete(message.params.requestId);
    } else if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) {
      const request = requests.get(message.params.requestId);
      issues.push(`${request?.route || currentRoute || '/'}: HTTP ${message.params.response.status}: ${request?.url || message.params.response.url}`);
    } else if (message.method === 'Network.loadingFinished') {
      requests.delete(message.params.requestId);
    } else events.get(message.method)?.(message.params);
  };
  await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Log.enable'), send('Network.enable')]);
  let checked = 0;
  for (const route of routes) { await page(route); checked++; }
  if (focus.startsWith('route:')) {
    console.log(JSON.stringify({ base: base.href, routes: checked, issues }, null, 2));
    process.exitCode = issues.length ? 1 : 0;
  } else if (focus === '--lab') {
    const costly = { op: 'litho', thick: 400, wl: 193, NA: 1.35, sigma: 1, dose: 120,
      focus: 400, swing: 1, peb: 60, dev: 200, clear: [[0, 640]] };
    const fragment = '#r=' + Buffer.from(JSON.stringify({ d: 'std', s: Array(100).fill(costly) })).toString('base64');
    const lab = [];
    for (const lang of ['', 'ko/']) {
      const started = performance.now();
      const info = await page(`${lang}chapters/lab.html${fragment}`, undefined, 5000);
      if (!info.loaded) throw new Error(`${lang}hostile 100-step state did not load in time`);
      const state = await evaluate(`({steps: document.querySelectorAll('#lab .steps-list li').length,
        message: document.querySelector('#lab-msg')?.textContent || ''})`);
      lab.push({ lang: lang || 'en', seconds: Number(((performance.now() - started) / 1000).toFixed(2)), ...state });
      if (state.steps !== 8 || !state.message) issues.push(`${lang}lab: hostile share state did not fall back`);
    }
    await page('chapters/lab.html');
    const limits = await evaluate(`(() => {
      const domains = {fine:{W:150,H:150,dx:2},std:{W:160,H:130,dx:4},wide:{W:160,H:110,dx:10}};
      function work(d, time, T, ambient) {
        const grid = domains[d], cells = grid.W * grid.H;
        const D = Math.max(XS.diffusivity('P', T), XS.diffusivity('B', T));
        const sigma = Math.min(Math.sqrt(2 * D * time) * 1e7 / grid.dx, 80);
        let diffusion = 0;
        if (sigma >= 0.3) {
          const requested = Math.max(1, Math.ceil((sigma / 6) ** 2));
          const iterations = Math.min(requested, 40);
          const radius = Math.ceil(3 * sigma / Math.sqrt(requested > 40 ? 40 : requested));
          const diameter = 2 * radius + 1;
          diffusion = 4 * cells + iterations * (6 * cells + 4 * cells * diameter + 2 * diameter);
        }
        let sweeps = 0;
        if (ambient) {
          const dg = XS.dealGrove(T, ambient, '100');
          const maxRate = 1.76 * (dg.BA * 1e3 / 3600) / grid.dx;
          const iterations = Math.min(8000, Math.ceil(2 * maxRate * time));
          sweeps = iterations ? 120 + 24 * (iterations - 1) : 0;
        }
        return diffusion <= 20000000 && sweeps <= 120;
      }
      const out = {};
      Object.keys(domains).forEach(d => {
        for (const [name, T, ambient] of [['diffusion',1200,''], ['wet',800,'wet']]) {
          let limit = 0;
          for (let t = 1; t <= 3600; t++) if (work(d,t,T,ambient)) limit = t;
          out[d + '_' + name] = limit;
        }
      });
      return out;
    })()`);
    const workloads = [];
    for (const lang of ['', 'ko/']) {
      const cases = [];
      for (const domain of ['fine', 'std', 'wide']) {
        const maxDiffusion = limits[`${domain}_diffusion`];
        const maxWet = limits[`${domain}_wet`];
        cases.push({ name: `${domain} max diffusion accepted`, domain, time: maxDiffusion, T: 1200, ambient: '', accepted: true });
        cases.push({ name: `${domain} diffusion just over budget`, domain, time: maxDiffusion + 1, T: 1200, ambient: '', accepted: false });
        cases.push({ name: `${domain} max oxidation accepted`, domain, time: maxWet, T: 800, ambient: 'wet', accepted: true });
        cases.push({ name: `${domain} oxidation just over budget`, domain, time: maxWet + 1, T: 800, ambient: 'wet', accepted: false });
      }
      for (const domain of ['fine', 'std', 'wide']) {
        for (const ambient of ['', 'dry', 'wet']) cases.push({ name: `${domain} maximum anneal ${ambient || 'N2'} rejected`, domain, time: 3400, T: 1200, ambient, accepted: false });
      }
      for (const test of cases) {
        const step = { op: 'anneal', T: test.T, time: test.time, ambient: test.ambient };
        const hash = '#r=' + Buffer.from(JSON.stringify({ d: test.domain, s: [step] })).toString('base64');
        const started = performance.now();
        const info = await page(`${lang}chapters/lab.html${hash}`, undefined, 5000);
        if (!info.loaded) throw new Error(`${lang}${test.name}: route did not load within 5 seconds`);
        const state = await evaluate(`({steps: document.querySelectorAll('#lab .steps-list li').length,
          domain: document.querySelector('#lab-dom')?.value, message: document.querySelector('#lab-msg')?.textContent || ''})`);
        const seconds = Number(((performance.now() - started) / 1000).toFixed(2));
        workloads.push({ lang: lang || 'en', ...test, inputDomain: test.domain, restoredDomain: state.domain, seconds, ...state });
        if (state.steps !== (test.accepted ? 1 : 8) || state.domain !== (test.accepted ? test.domain : 'wide') ||
            (test.accepted ? !!state.message : !state.message)) {
          issues.push(`${lang}${test.name}: unexpected restore result ${JSON.stringify(state)}`);
        }
      }
      for (const domain of ['fine', 'std', 'wide']) {
        for (const ambient of ['', 'dry', 'wet']) {
          const steps = Array.from({ length: 16 }, () => ({ op: 'anneal', T: 1200, time: 3400, ambient }));
          const hash = '#r=' + Buffer.from(JSON.stringify({ d: domain, s: steps })).toString('base64');
          const name = `${domain} hostile 16-step anneal ${ambient || 'N2'} rejected`;
          const started = performance.now();
          const info = await page(`${lang}chapters/lab.html${hash}`, undefined, 5000);
          if (!info.loaded) throw new Error(`${lang}${name}: route did not load within 5 seconds`);
          const state = await evaluate(`({steps: document.querySelectorAll('#lab .steps-list li').length,
            domain: document.querySelector('#lab-dom')?.value, message: document.querySelector('#lab-msg')?.textContent || ''})`);
          const seconds = Number(((performance.now() - started) / 1000).toFixed(2));
          workloads.push({ lang: lang || 'en', name, inputDomain: domain, restoredDomain: state.domain, seconds, ...state });
          if (state.steps !== 8 || state.domain !== 'wide' || !state.message) {
            issues.push(`${lang}${name}: unexpected restore result ${JSON.stringify(state)}`);
          }
        }
      }
    }
    const stepLimits = [];
    for (const lang of ['', 'ko/']) {
      for (const count of [32, 33]) {
        const steps = Array.from({ length: count }, () => ({ op: 'strip', mat: 'pr' }));
        const hash = '#r=' + Buffer.from(JSON.stringify({ d: 'wide', s: steps })).toString('base64');
        const started = performance.now();
        const info = await page(`${lang}chapters/lab.html${hash}`, undefined, 5000);
        if (!info.loaded) throw new Error(`${lang}${count}-step share limit did not load`);
        const state = await evaluate(`({steps: document.querySelectorAll('#lab .steps-list li').length,
          domain: document.querySelector('#lab-dom')?.value, message: document.querySelector('#lab-msg')?.textContent || ''})`);
        const seconds = Number(((performance.now() - started) / 1000).toFixed(2));
        stepLimits.push({ lang: lang || 'en', count, accepted: count === 32, seconds, ...state });
        if (state.steps !== (count === 32 ? 32 : 8) || state.domain !== (count === 32 ? 'wide' : 'wide') ||
            (count === 32 ? !!state.message : !state.message)) {
          issues.push(`${lang}${count}-step share boundary: unexpected result ${JSON.stringify(state)} in ${seconds}s`);
        }
      }
    }
    const malformedStates = [];
    const malformedCases = [
      { name: 'invalid base64', hash: '#r=%%%bad' },
      { name: 'invalid JSON', hash: '#r=' + Buffer.from('{not-json').toString('base64') },
      { name: 'unknown operation', data: { d: 'wide', s: [{ op: 'unknown' }] } },
      { name: 'unknown field', data: { d: 'wide', s: [{ op: 'strip', mat: 'pr', unexpected: true }] } },
      { name: 'oversized fragment', hash: '#r=' + 'A'.repeat(65537) }
    ];
    for (const lang of ['', 'ko/']) {
      for (const test of malformedCases) {
        const hash = test.hash || '#r=' + Buffer.from(JSON.stringify(test.data)).toString('base64');
        const started = performance.now();
        const firstIssue = issues.length;
        const info = await page(`${lang}chapters/lab.html${hash}`, undefined, 5000);
        if (!info.loaded) throw new Error(`${lang}${test.name}: malformed share state did not load safely`);
        const state = await evaluate(`({steps: document.querySelectorAll('#lab .steps-list li').length,
          domain: document.querySelector('#lab-dom')?.value, message: document.querySelector('#lab-msg')?.textContent || ''})`);
        const seconds = Number(((performance.now() - started) / 1000).toFixed(2));
        malformedStates.push({ lang: lang || 'en', name: test.name, seconds, ...state });
        const fallbackNotice = lang ? '기본 BCD nLDMOS 프리셋을 불러왔습니다.' : 'default BCD nLDMOS preset was loaded.';
        const runtimeIssue = issues.slice(firstIssue).some(issue => issue.includes('runtime exception'));
        if (state.steps !== 8 || state.domain !== 'wide' || !state.message.includes(fallbackNotice) || runtimeIssue) {
          issues.push(`${lang}${test.name}: unsafe fallback ${JSON.stringify(state)} in ${seconds}s`);
        }
      }
    }
    console.log(JSON.stringify({ base: base.href, hostileLitho: lab, annealLimits: limits, workloads, stepLimits, malformedStates, issues }, null, 2));
    process.exitCode = issues.length ? 1 : 0;
  } else if (focus === '--lab-presets') {
    for (const lang of ['', 'ko/']) {
      const route = `${lang}chapters/lab.html`;
      await page(route);
      const presets = [];
      for (const button of Array.from(await evaluate("[...document.querySelectorAll('#presets button')].map(button => button.dataset.p)"))) {
        const started = performance.now();
        const result = await evaluate(`(() => { const button = document.querySelector('#presets button[data-p="${button}"]'); button.click();
          return {steps: document.querySelectorAll('#lab .steps-list li').length, shareable: location.hash.startsWith('#r='),
            message: document.querySelector('#lab-msg')?.textContent || ''}; })()`);
        const seconds = Number(((performance.now() - started) / 1000).toFixed(2));
        presets.push({ name: button, seconds, ...result });
        if (!result.steps) issues.push(`${route}: preset ${button} did not load steps`);
        if (seconds > 5) issues.push(`${route}: preset ${button} blocked for ${seconds}s`);
        if (result.shareable) {
          const hash = await evaluate('location.hash');
          const info = await page(`${route}${hash}`, undefined, 5000);
          if (!info.loaded) throw new Error(`${route}: preset ${button} share link did not reload`);
          const reloaded = await evaluate("document.querySelectorAll('#lab .steps-list li').length");
          if (reloaded !== result.steps) issues.push(`${route}: preset ${button} changed step count after reload`);
        } else if (!result.message) issues.push(`${route}: preset ${button} has no share-limit explanation`);
        await page(route);
      }
      console.log(JSON.stringify({ route, presets, issues }, null, 2));
    }
    process.exitCode = issues.length ? 1 : 0;
  } else if (focus === '--diagnostics') {
    await page('chapters/overview.html');
    const firstInjectedIssue = issues.length;
    await send('Network.setBlockedURLs', { urls: ['*__pmicbook_qa_blocked__*'] });
    await evaluate("(() => { const script = document.createElement('script'); script.src = new URL('../__pmicbook_qa_blocked__.js', location.href).href; document.head.append(script); setTimeout(() => { throw new Error('PMICBook QA diagnostic exception'); }, 0); })()");
    await sleep(500);
    const observed = issues.slice(firstInjectedIssue);
    const exceptionSignals = observed.filter(issue => issue.includes('PMICBook QA diagnostic exception'));
    const requestSignals = observed.filter(issue => issue.includes('__pmicbook_qa_blocked__.js'));
    const exceptionFound = exceptionSignals.some(issue => issue.includes('chapters/overview.html'));
    const requestFound = requestSignals.some(issue => issue.includes('chapters/overview.html'));
    const unexpected = observed.filter(issue => !issue.includes('PMICBook QA diagnostic exception') && !issue.includes('__pmicbook_qa_blocked__.js'));
    issues.splice(firstInjectedIssue, observed.length, ...unexpected);
    if (!exceptionFound || !requestFound) issues.push(`Diagnostic attribution incomplete: ${observed.join('\n')}`);
    console.log(JSON.stringify({ base: base.href, exceptionFound, requestFound,
      expectedSignals: [...exceptionSignals, ...requestSignals], issues }, null, 2));
    process.exitCode = issues.length ? 1 : 0;
  } else {
  for (const route of ['ko/chapters/fundamentals.html', 'ko/chapters/integration.html', 'ko/chapters/lab.html', 'chapters/lab.html']) {
    await page(route, { width: 390, height: 844 });
  }
  await page('chapters/oxidation.html');
  const physics = await evaluate(`(() => { const c100 = XS.dealGrove(1000, 'dry', '100'); const c111 = XS.dealGrove(1000, 'dry', '111'); const cDefault = XS.dealGrove(1000, 'dry');
    return {ratio: c111.BA / c100.BA, dry100nm: XS.dgThickness(c100.B, c100.A, 1, 0) * 1000,
      defaultOrientationRatio: cDefault.BA / c100.BA,
      wet100nm: (() => { const c = XS.dealGrove(1000, 'wet', '100'); return XS.dgThickness(c.B, c.A, 1, 0) * 1000; })()}; })()`);
  if (Math.abs(physics.ratio - 1.68) > 0.001 || Math.abs(physics.defaultOrientationRatio - 1) > 1e-9 || physics.dry100nm < 30 || physics.dry100nm > 50 || physics.wet100nm < 350 || physics.wet100nm > 430) {
    issues.push(`Oxidation model: ${JSON.stringify(physics)}`);
  }
  await page('chapters/wafer.html');
  const wafer = await evaluate(`(() => { const first = document.querySelector('#lf-o-t')?.textContent;
    const slider = document.querySelector('#lf-n'); slider.value = '12'; slider.dispatchEvent(new Event('input', {bubbles:true}));
    return {first, second: document.querySelector('#lf-o-t')?.textContent}; })()`);
  if (!wafer.first || !wafer.second || wafer.first === wafer.second) issues.push(`Wafer lifetime interaction: ${JSON.stringify(wafer)}`);
  await page('chapters/overview.html');
  const navigation = await evaluate(`(() => { const menu = document.querySelector('#pb-menu'); menu.click();
    const opened = menu.getAttribute('aria-expanded') === 'true' && !document.querySelector('#pb-chapter-drawer').inert;
    document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true}));
    return {opened, closed: menu.getAttribute('aria-expanded') === 'false' && document.querySelector('#pb-chapter-drawer').inert,
      focus: document.activeElement === menu, language: document.querySelector('a[href*="ko/chapters/overview.html"]')?.href || ''}; })()`);
  if (!navigation.opened || !navigation.closed || !navigation.focus || !navigation.language) issues.push(`Drawer/language: ${JSON.stringify(navigation)}`);
  await evaluate("document.querySelector('#pb-menu').click()");
  const drawerDestination = await clickAndWait('#pb-chapter-drawer .pb-chlist a[href$="fundamentals.html"]');
  if (!drawerDestination.path.endsWith('/chapters/fundamentals.html')) issues.push(`Drawer chapter link: ${JSON.stringify(drawerDestination)}`);
  const pagerNext = await clickAndWait('.pb-pager a.next');
  if (!pagerNext.path.endsWith('/chapters/references-ldo.html')) issues.push(`Next chapter link: ${JSON.stringify(pagerNext)}`);
  const pagerPrevious = await clickAndWait('.pb-pager a.prev');
  if (!pagerPrevious.path.endsWith('/chapters/fundamentals.html')) issues.push(`Previous chapter link: ${JSON.stringify(pagerPrevious)}`);
  const tocDestination = await clickAndWait('.pb-toc a[href^="#"]');
  if (!tocDestination.path.endsWith('/chapters/fundamentals.html') || !tocDestination.hash ||
      !await evaluate(`!!document.getElementById(decodeURIComponent(${JSON.stringify(tocDestination.hash.slice(1))}))`)) {
    issues.push(`Table-of-contents fragment: ${JSON.stringify(tocDestination)}`);
  }
  const localeDestination = await clickAndWait('.pb-locale');
  if (!localeDestination.path.endsWith('/ko/chapters/fundamentals.html')) issues.push(`Korean language switch: ${JSON.stringify(localeDestination)}`);
  const englishDestination = await clickAndWait('.pb-locale');
  if (!englishDestination.path.endsWith('/chapters/fundamentals.html')) issues.push(`English language switch: ${JSON.stringify(englishDestination)}`);
  const compatibility = await page('chapters/resist.html');
  const compatibilityHref = await evaluate('location.href');
  const compatibilityUrl = new URL(compatibilityHref);
  if (compatibilityUrl.origin !== base.origin || !compatibilityUrl.pathname.startsWith(base.pathname) ||
      !compatibilityUrl.pathname.endsWith('/chapters/litho.html')) {
    issues.push(`Compatibility redirect escaped or reached the wrong route: ${compatibilityHref}`);
  }
  await page('chapters/references-ldo.html');
  const quiz = await evaluate(`(() => {
    const questions = [...document.querySelectorAll('.quiz-q')];
    questions[0].querySelectorAll('button.opt')[1].click();
    questions[1].querySelectorAll('button.opt')[1].click();
    return questions.map(q => ({done:q.classList.contains('done'), disabled:[...q.querySelectorAll('button.opt')].every(b=>b.disabled),
      explanation:getComputedStyle(q.querySelector('.quiz-exp')).display !== 'none', right:!!q.querySelector('button.right'), wrong:!!q.querySelector('button.wrong')}));
  })()`);
  if (quiz.length !== 2 || !quiz[0].done || !quiz[0].disabled || !quiz[0].explanation || !quiz[0].right ||
      !quiz[1].done || !quiz[1].disabled || !quiz[1].explanation || !quiz[1].right || !quiz[1].wrong) {
    issues.push(`Chapter quiz behavior: ${JSON.stringify(quiz)}`);
  }
  await page('chapters/references-ldo.html');
  const ldo = await evaluate(`(() => { const input = document.querySelector('#ldo-i'); input.value = '200'; input.dispatchEvent(new Event('input',{bubbles:true}));
    return {drop:document.querySelector('#ldo-drop')?.textContent, loss:document.querySelector('#ldo-loss')?.textContent}; })()`);
  if (ldo.drop !== '100 mV' || !ldo.loss || ldo.loss === '—') issues.push(`LDO model interaction: ${JSON.stringify(ldo)}`);
  await page('chapters/switching.html');
  const converter = await evaluate(`(() => { const output = document.querySelector('#sw-vout'); output.value = '18'; output.dispatchEvent(new Event('input',{bubbles:true}));
    document.querySelector('#sw-type [data-value="boost"]').click();
    return {duty:document.querySelector('#sw-duty')?.textContent, ripple:document.querySelector('#sw-ripple')?.textContent, note:document.querySelector('#sw-note')?.textContent}; })()`);
  if (converter.duty !== '33.3%' || !converter.ripple || converter.ripple === '—' || !converter.note.includes('CCM')) issues.push(`Converter model interaction: ${JSON.stringify(converter)}`);
  await page('chapters/integration.html');
  const bcd = await evaluate(`(() => { const before = document.querySelector('#sim-cmos .sim-readout .v')?.textContent;
    document.querySelector('#mods button[data-m="0"]').click();
    const after = document.querySelector('#sim-cmos .sim-readout .v')?.textContent;
    return {before, after, selected:!!document.querySelector('#sim-cmos .steps-list li.cur')}; })()`);
  if (!bcd.selected || !bcd.after || bcd.after === bcd.before) issues.push(`BCD integration simulator: ${JSON.stringify(bcd)}`);
  await page('chapters/glossary.html');
  const finalQuiz = await evaluate(`(() => {
    const first = document.querySelector('#fq-opts .fq-opt');
    if (!first) return {start:false};
    first.click();
    const answer = {start:true, disabled:[...document.querySelectorAll('#fq-opts .fq-opt')].every(b=>b.disabled),
      explanation:!document.querySelector('#fq-exp').hidden, next:!document.querySelector('#fq-next').hidden};
    for (let i=0;i<20;i++) {
      const options = document.querySelectorAll('#fq-opts .fq-opt');
      if (options.length) options[0].click();
      const next = document.querySelector('#fq-next');
      if (next.hidden) break;
      next.click();
    }
    answer.result = !document.querySelector('#fq-result').hidden && !!document.querySelector('#cv-fq').width;
    document.querySelector('#fq-retry').click();
    answer.retry = document.querySelector('#fq-count').textContent.includes('1 / 20');
    return answer;
  })()`);
  if (!finalQuiz.start || !finalQuiz.disabled || !finalQuiz.explanation || !finalQuiz.next || !finalQuiz.result || !finalQuiz.retry) {
    issues.push(`Final knowledge check: ${JSON.stringify(finalQuiz)}`);
  }
  await page('chapters/overview.html');
  const theme = await evaluate(`(() => { const button = document.querySelector('#pb-theme'); const initial = PB.isDark(); button.click();
    return {initial, current:PB.isDark(), explicit:document.documentElement.getAttribute('data-theme'), saved:localStorage.getItem('pb-theme')}; })()`);
  if (theme.initial === theme.current || !theme.explicit || theme.saved !== theme.explicit) issues.push(`Theme toggle: ${JSON.stringify(theme)}`);
  await page('ko/chapters/overview.html');
  const themePersisted = await evaluate(`({theme:document.documentElement.getAttribute('data-theme'), saved:localStorage.getItem('pb-theme')})`);
  if (!themePersisted.theme || themePersisted.theme !== themePersisted.saved) issues.push(`Theme persistence across bilingual route: ${JSON.stringify(themePersisted)}`);
  console.log(JSON.stringify({ base: base.href, routes: checked, mobilePages: 4, physics, wafer, navigation, quiz, ldo, converter, bcd, finalQuiz, theme, themePersisted, issues }, null, 2));
  process.exitCode = issues.length ? 1 : 0;
  }
} catch (error) {
  console.error(error?.stack || error);
  process.exitCode = 1;
} finally {
  if (ws?.readyState === WebSocket.OPEN) {
    try { await send('Browser.close'); } catch { /* Fall back to terminating the owned process group. */ }
  }
  ws?.close();
  if (chrome && !(await waitForExit(chrome, 3000)) && chrome.pid) {
    try {
      if (process.platform !== 'win32') process.kill(-chrome.pid, 'SIGTERM');
      else chrome.kill('SIGTERM');
    } catch { /* The owned Chrome process group already exited. */ }
    if (!(await waitForExit(chrome, 2000))) {
      try {
        if (process.platform !== 'win32') process.kill(-chrome.pid, 'SIGKILL');
        else chrome.kill('SIGKILL');
      } catch { /* The owned Chrome process group already exited. */ }
      await waitForExit(chrome, 1000);
    }
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
}
