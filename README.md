# Backend

## Create SSL certificate and key

_To do this step you need to have [OpenSSL](https://www.openssl.org/source/) installed_

Create a directory `"certificate"` in the root folder of this repository and run the following command from inside that new repository

```bash
openssl req -nodes -new -x509 -keyout key.pem -out cert.pem
```

Answer the prompted questions and you will get two new files, key.pem and cert.pem

## Install and start development server

Install dependencies `npm ci`

Start development server `npm run dev`

## build

`npm run dev`

^ bruh
