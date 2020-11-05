# Coil Trustline

This interactive CLI tool allows users to exchange currency with one another. 

### Usage
To use this on your Mac's CLI, clone the git repo. Once you have navigated into the repo on your machine, run `npm i && npm i -g`. This will install Coil Trustline as a global NPM package on your computer.

To initiate the trustline, you must specify the host/port you wish to run your trustline from, along with the host/port you will be establishing the connection with. For example, if I want to run mine from http://localhost:3000 and send money to http://localhost:8080, my command would look like this:
```
coil-trustline -h 3000 -d http://localhost:8080
```
Once the trustline has been established, the `pay` command will send money. The `balance` command will display your current balance. The `exit` command will close the tool and terminate the connection (which will also reset your balance).