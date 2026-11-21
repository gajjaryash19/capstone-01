import { spawn } from 'child_process'
import http from 'http'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    await wait(250)
    try {
      const data = await new Promise((resolve, reject) => {
        http
          .get('http://127.0.0.1:9222/json/version', (res) => {
            let body = ''
            res.on('data', (c) => (body += c))
            res.on('end', () => resolve(JSON.parse(body)))
          })
          .on('error', reject)
      })
      if (data.webSocketDebuggerUrl) return data.webSocketDebuggerUrl
    } catch {
      // retry
    }
  }
  throw new Error('Could not connect to Chrome debugging port')
}

async function runBenchmark() {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--no-sandbox',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    'about:blank',
  ])

  try {
    const wsUrl = await getWsUrl()
    const ws = new WebSocket(wsUrl)
    await new Promise((resolve) => {
      ws.onopen = resolve
    })

    let id = 1
    const pending = new Map()

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data)
      }
    }

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++
        pending.set(msgId, resolve)
        ws.send(JSON.stringify({ id: msgId, method, params }))
      })
    }

    async function evaluateOnPage(url, evalFnString) {
      const target = await send('Target.createTarget', { url })
      const pageWsUrl = `ws://127.0.0.1:9222/devtools/page/${target.result.targetId}`
      const pageWs = new WebSocket(pageWsUrl)
      await new Promise((resolve) => {
        pageWs.onopen = resolve
      })

      const pagePending = new Map()
      pageWs.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.id && pagePending.has(data.id)) {
          pagePending.get(data.id)(data)
        }
      }

      let pageMsgId = 1
      function pageSend(method, params = {}) {
        return new Promise((resolve) => {
          const mId = pageMsgId++
          pagePending.set(mId, resolve)
          pageWs.send(JSON.stringify({ id: mId, method, params }))
        })
      }

      await pageSend('Page.enable')
      await pageSend('Runtime.enable')

      // Wait for React hydration and layout
      await wait(1800)

      const result = await pageSend('Runtime.evaluate', {
        expression: evalFnString,
        awaitPromise: true,
        returnByValue: true,
      })

      await send('Target.closeTarget', { targetId: target.result.targetId })
      pageWs.close()
      return result.result?.result?.value ?? result.result?.value
    }

    // 1. Measure Customers filter typing latency (5 sequential keystrokes)
    const customersFilterLatency = await evaluateOnPage(
      'http://127.0.0.1:4173/app/customers',
      `
        (async () => {
          const input = document.querySelector('input[type="search"]');
          if (!input) return { error: 'Input not found' };
          const times = [];
          const query = 'Apex';
          for (let i = 0; i < query.length; i++) {
            const char = query[i];
            const t0 = performance.now();
            input.value += char;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(r => requestAnimationFrame(r));
            const t1 = performance.now();
            times.push(t1 - t0);
          }
          const avg = times.reduce((a, b) => a + b, 0) / times.length;
          const max = Math.max(...times);
          return { avgMs: Number(avg.toFixed(2)), maxMs: Number(max.toFixed(2)), samples: times.map(t => Number(t.toFixed(2))) };
        })()
      `
    )

    // 2. Measure Customers sort click latency
    const customersSortLatency = await evaluateOnPage(
      'http://127.0.0.1:4173/app/customers',
      `
        (async () => {
          const sortBtn = document.querySelector('button[aria-label*="Sort by Predicted CLV"]');
          if (!sortBtn) return { error: 'Sort button not found' };
          const t0 = performance.now();
          sortBtn.click();
          await new Promise(r => requestAnimationFrame(r));
          const t1 = performance.now();
          return { latencyMs: Number((t1 - t0).toFixed(2)) };
        })()
      `
    )

    // 3. Measure Predictions filter typing latency
    const predictionsFilterLatency = await evaluateOnPage(
      'http://127.0.0.1:4173/app/predictions',
      `
        (async () => {
          const input = document.querySelector('input[type="search"]');
          if (!input) return { error: 'Input not found' };
          const times = [];
          const query = 'Tech';
          for (let i = 0; i < query.length; i++) {
            const char = query[i];
            const t0 = performance.now();
            input.value += char;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(r => requestAnimationFrame(r));
            const t1 = performance.now();
            times.push(t1 - t0);
          }
          const avg = times.reduce((a, b) => a + b, 0) / times.length;
          const max = Math.max(...times);
          return { avgMs: Number(avg.toFixed(2)), maxMs: Number(max.toFixed(2)), samples: times.map(t => Number(t.toFixed(2))) };
        })()
      `
    )

    // 4. Measure Predictions sort click latency
    const predictionsSortLatency = await evaluateOnPage(
      'http://127.0.0.1:4173/app/predictions',
      `
        (async () => {
          const sortBtn = document.querySelector('button[aria-label*="Sort by Predicted CLV"]');
          if (!sortBtn) return { error: 'Sort button not found' };
          const t0 = performance.now();
          sortBtn.click();
          await new Promise(r => requestAnimationFrame(r));
          const t1 = performance.now();
          return { latencyMs: Number((t1 - t0).toFixed(2)) };
        })()
      `
    )

    ws.close()

    console.log(JSON.stringify({
      customersFilterLatency,
      customersSortLatency,
      predictionsFilterLatency,
      predictionsSortLatency,
    }, null, 2))

  } finally {
    chrome.kill()
  }
}

runBenchmark().catch((err) => {
  console.error(err)
  process.exit(1)
})
