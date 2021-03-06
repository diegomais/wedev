# WeDev

> Social network for developers

This is a MERN stack application. It is a small social network app that includes authentication, profiles and forum posts.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The project can be built with npm or yarn, so choose one of the approach bellow in case you don't have any installed on your system.

* **Npm** is distributed with Node.js which means that when you download Node.js, you automatically get npm installed on your computer. [Download Node.js](https://nodejs.org/en/download/)

* **Yarn** is a package manager built by Facebook Team and seems to be faster than npm in general.  [Download Yarn](https://yarnpkg.com/en/docs/install)

### Installing

To download the project follow the instructions bellow:

```
1. git clone https://github.com/diegomais/wedev.git
2. cd wedev
```

* Set environment variables in .env file

```
DB_URI: uri of your mongodb connection for example: "mongodb://localhost/dev-social"
JWT_SECRET: secret key, to compute the signature of JSON Web Tokens
GITHUB_CLIENT_ID: GitHub app's Client ID
GITHUB_CLIENT_SECRET GitHub app's Client Secret
```

* Install the dependencies and start the server

```
1. yarn install
2. yarn run dev
```

or

```
3. npm install
4. npm run dev
```

## Author

Diego Mais
* [diegomais@live.com](mailto:diegomais@live.com)
* [diegomais.github.io](http://diegomais.github.io)
* [github.com/diegomais](http://github.com/diegomais)
* [linkedin.com/in/diegomais](http://linkedin.com/in/diegomais)

 ## License

  [MIT](LICENSE)
