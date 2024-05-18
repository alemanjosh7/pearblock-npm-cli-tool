#!/usr/bin/env bare
const fsp = require('bare-fs/promises.js')
const Hyperswarm = require('hyperswarm')
const Corestore = require('corestore')
const Hyperbee = require('hyperbee')
const b4a = require('b4a')
const process = require('bare-process')
const file = require('./dict.json')

const notFound = (command) => {
  return `error: unknown command '${command}'`
}

const missingArgument = (...args) => {
  return `error: missing argument '${args}'`
}

const beekey = async (corekey) => {
  const store = new Corestore('./reader-storage')
  const swarm = new Hyperswarm()

  swarm.on('connection', conn => store.replicate(conn))

  const core = store.get({ name: corekey })

  const bee = new Hyperbee(core, {
    keyEncoding: 'utf-8',
    valueEncoding: 'utf-8'
  })

  await core.ready()
  const response = 'You can connect from another command like using this Hyperbee key: ' + b4a.toString(core.key, 'hex')
  await core.close()
  await store.close()
  swarm.destroy()
  return response
}

const init_dictionary = async (corekey) => {
  const store = new Corestore('./reader-storage')
  const swarm = new Hyperswarm()
  swarm.on('connection', conn => store.replicate(conn))

  const core = store.get({ name: corekey })

  const bee = new Hyperbee(core, {
    keyEncoding: 'utf-8',
    valueEncoding: 'utf-8'
  })
  await core.ready()
  if (core.length <= 1) {
    const dict = JSON.parse(JSON.stringify(file))
    const batch = bee.batch()
    for (const { key, value } of dict) {
      await batch.put(key, value)
    }
    await batch.flush()
    await core.close()
    await store.close()
    await swarm.destroy()
    return 'Importing dictionary...\nDictionary imported!'
  }

  await core.close()
  await store.close()
  await swarm.destroy()
  return 'Seeding dictionary...\nDictionary seeded!'
}

const ask = async (word, corekey) => {
  const store = new Corestore('./reader-storage')
  const swarm = new Hyperswarm()
  swarm.on('connection', conn => store.replicate(conn))
  console.log(`The pearblock you want to know about is: ${word}`)
  const core = store.get({ name: corekey })

  const bee = new Hyperbee(core, {
    keyEncoding: 'utf-8',
    valueEncoding: 'utf-8'
  })

  await core.ready()

  const key = b4a.toString(core.key, 'hex')

  swarm.join(core.discoveryKey)

  if (!word.length) return
  let response = ''

  await bee.get(word).then(node => {
    if (((!node || !node.value) && response === '')) {
      response = `No dictionary entry for ${word}`
    }
    else response = `Holepunch's Block ${word} is: ${node.value}.`
  })
  await core.close()
  await store.close()
  swarm.destroy()
  return response
}

(async () => {
  switch (process.argv[2]) {
    case 'init':
      if (process.argv[3] === undefined) {
        return new Promise(async () => console.log(missingArgument('key'))).finally(setTimeout(() => { process.exit(1) }, 1000))
      }
      return new Promise(async () => console.log(await init_dictionary(process.argv[3]))).finally(setTimeout(() => {
        process.exit(1)
      }, 1000))
    case 'beekey':
      if (process.argv[3] === undefined) {
        return new Promise(async () => console.log(missingArgument('key'))).finally(setTimeout(() => { process.exit(1) }, 1000))
      }
      return new Promise(async () => console.log(await beekey(process.argv[3]))).finally(setTimeout(() => {
        process.exit(1)
      }, 1000))
    case 'ask':
      if (process.argv[3] === undefined) {
        return new Promise(async () => console.log(missingArgument('key'))).finally(setTimeout(() => { process.exit(1) }, 1000))
      }
      if (process.argv[4] === undefined) {
        return new Promise(async () => console.log(missingArgument('word'))).finally(setTimeout(() => { process.exit(1) }, 1000))
      }
      return new Promise(async () => console.log(await ask(process.argv[3], process.argv[4]))).finally(setTimeout(() => {
        process.exit(1)
      }, 1000))
    case 'help':
      console.log(`
Usage: pearblock-npm-cli-tool [command] [options]\n
This app is a CLI dictionary that works as serverless application using hyperswarm, corestore, hyperbee, b4a, bare-readline and bare-tty, and where you can look for specific information about a Holepunch's blocks or terminology such as Hyperbee, Hyperswarm, etc\n
Commands:\n
  init <key>               Starts importing or seeding Pearblocks Dictionary with a specific Hypercore Key\n
  beekey <key>             With a Hypercore key you can ask what is your Hyperbee Key\n
  ask <key> <word>         Ask about a specific word in the dictionary with a specific Hypercore key\n`)
      break
    default:
      console.log(notFound((process.argv[2])))
      break
  }
})()
module.exports = {
  init_dictionary,
  beekey,
  ask
}
