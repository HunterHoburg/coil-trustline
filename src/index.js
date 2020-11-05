#!/usr/bin/env node

// Much of this file can be broken up, but I left it in one file for ease of consumption
const express = require('express');
const axios = require('axios');
const yargs = require('yargs');
const vorpal = require('vorpal')();

// This logic belongs in an app.js file
const options = yargs
  .usage('Usage: -h <host>')
  .option('h', {
    alias: 'host',
    describe: 'Your host port',
    type: 'string',
    demandOption: true
  })
  .option('d', {
    alias: 'destinationPort',
    describe: 'The port of the user you will interact with',
    type: 'string',
    demandOption: true
  })
  .argv;

const app = express();

// As the user's balance needn't be persisted, this variable serves the purpose fine
let balance = 0;

// This logic belongs in a router
app.put('/pay/:amount', (req, res) => {
  // This logic belongs in a controller
  // Depending on business requirements, type errors should be handled
  // for security and 3rd party integration purposes
  const amount = parseInt(req.params.amount)
  balance += amount;
  vorpal.log(`You were paid ${amount}!`);
  res.send('success');
});

// This logic belongs in an app.js file
app.listen(options.host, err => {
  if (err) {
    return console.error('ERROR: ', err);
  }
});

// The following three Vorpal commands belong in a separate utility file
vorpal.command('pay [amount]', 'Sends the specified amount to the other user.')
  .validate(args => {
    return typeof args.amount === 'number' ? true : 'Amount must be a number.';
  })
  .action((args, callback) => {
    const { amount } = args;
    axios
      .put(`${options.destinationPort}/pay/${amount}`)
      .then(res => {
        balance -= amount;
        vorpal.log('Sent');
        // callback() is required by Vorpal. Without it, the dialogue won't progress
        callback();
      })
  });

vorpal.command('balance', 'Prints out your balance')
  .action((args, callback) => {
    vorpal.log(balance);
    callback();
  });

vorpal.command('exit', 'Closes the trustline')
  .action((args, callback) => {
    vorpal.log('Goodbye.');
    setTimeout(() => {
      process.exit(1);
    }, 1500);
  });

vorpal.delimiter(`trustline (port:${options.host}) $ `).show();