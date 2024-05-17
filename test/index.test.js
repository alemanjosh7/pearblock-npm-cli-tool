const test = require('brittle')
const { init_dictionary, beekey, ask } = require('../index.js')

test('init', async function (t) {
  const response = await new Promise((resolve) => setTimeout(async () => resolve(await init_dictionary('xd')), 1000))
  t.comment(response)
  t.pass()
})

test('ask', async function (t) {
  const response = await new Promise((resolve) => setTimeout(async () => resolve(await ask('hypercore', 'xd')), 1000))
  t.comment(response)
  t.pass()
})

test('beekey', async function (t) {
  const b = t.test('other sub test')
  b.plan(1)
  setTimeout(() => b.ok(true), beekey('b'))
  await b
  t.pass()
})
