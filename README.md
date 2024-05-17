# pearblock-npm-cli-tool

This app is a CLI dictionary that works as a serverless application using hyperswarm, corestore, hyperbee, b4a, bare-readline and bare-tty, and where you can look for specific information about a Holepunch's blocks or terminology such as Hyperbee, Hyperswarm, etc

```
npm i pearblock-npm-cli-tool
```

## Usage

### Start

First of all, to start CLI you have to do the following commands

```bash
Usage: pearblock-npm-cli-tool [command] [options]

Options:

Commands:
  init <key>               Starts importing or seeding Pearblocks Dictionary with a specific Hypercore Key
  beekey <key>             With a Hypercore key you can ask what is your Hyperbee Key
  ask <word> <key>         Ask about a specific word in the dictionary with a specific Hypercore key
```

## Help

Use `pearblock-npm-cli-tool help` for more information.

## Import dictionary

```bash
pearblock-npm-cli-tool init dict
Your core key is: dict
Importing dictionary...
Dictionary imported!
```

In the case that with [key] has already imported the dictionary with that specific Hypercore key then it would output this

```bash
pearblock-npm-cli-tool init dict
Your core key is: dict
Seeding dictionary...
Dictionary seeded!
```

## Request hyperbee key

```bash
pearblock-npm-cli-tool beekey dict
You can connect start asking now with this Hyperbee key: 786ed2df6946c4fe4d24256d15b9428aef88a5206f2eecfaff4cb72245dc1486
```

## Asking to the dictionary

```bash
pearblock-npm-cli-tool ask hypercore mykey
The pearblock you want to know about is: hypercore
Holepunch's Block hypercore is: Hypercore is a secure, distributed append-only log built for sharing large datasets and streams of real-time data. It comes with a secure transport protocol, making it easy to build fast and scalable peer-to-peer applications.
```

If there is no response the following output would be received

```bash
pearblock-npm-cli-tool ask hypercore
No dictionary entry for hypercore
```
