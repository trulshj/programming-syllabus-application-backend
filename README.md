# Backend for Programming Syllabus Application

## Installation

### 1. Install dependencies with `npm install`

### 2. Create SSL Certificate and Key

_To do this step you need to have [OpenSSL](https://www.openssl.org/source/) installed_

If you run `npm run cert` you will be prompted with some questions, answer these and you will get two new files: `key.pem` and `cert.pem` in the `certificate` directory.

These certificates will of course be self signed and your browser might not like them very much. To accept them anyways for localhost you can follow [this](https://improveandrepeat.com/2016/09/allowing-self-signed-certificates-on-localhost-with-chrome-and-firefox/) guide for Firefox and Chrome.

If you want to run this application on a more permanent thing such as a server, we'd advise getting a proper certificate authority to issue them for you.

### 3. Set up environment variables

Create a copy of `.env.example` and name it `.env`

Then fill out the variables with correct information for your SQL server instance.

```js
DATABASE_NAME = "";
DATABASE_USER = "";
DATABASE_PASSWORD = "";
DATABASE_URL = "";
DATABASE_DIALECT = "mysql";
DATABASE_FORCE_UPDATE = "true"; // drop tables before trying to migrate?
QUERY_LOG = "false"; // log SQL queries to console?
SERVER_TEST_DATA = "true"; // Add mock data to the database?
```

### 4. Start the development server with `npm run dev`
