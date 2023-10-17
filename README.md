# FTP Client

Web application of the file transfer protocol

## Demo application: [FTP Client](https://ftp-client.onrender.com)

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```bash
git clone
```

## Installing NPM modules

```bash
# install dependencies
$ npm install
```

## Project env variables

| Key                     | Comment                 |
| ----------------------- | ----------------------- |
| `PORT`                  | API port (optional)     |
| `HOST`                  | API host (optional)     |
| `JWT_ACCESS_SECRET`     | Access token secret key |
| `JWT_ACCESS_EXPIRES_IN` | Access token expires in |
| `VITE_APP_BASE_URL`     | APP Base url            |

## Serve static

- `dist/client` - Directory with static site

After starting the API you can open client app in your browser by base route path

## Running the app

```bash
# production mode
$ npm run start

# development watch mode
$ npm run start:dev

# debug mode
$ npm run start:prod
```

### Compile and Minify for Production

```bash
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```bash
npm run lint
```

### Format with [Prettier](https://prettier.io/)

```bash
npm run format
```

## Default login to the application

The service administrator is created during the first registration on the service

After starting the app on port (3000 as default) you can open
in your browser helpdesk api by typing http://localhost:3000.
