# Request Multiple Urls

node.js package which fetches an array of URLs which contain JSON data and returns their contents in a promise.

## Installation steps

This project has not been published to an npm registry and therefore can only be used locally for now:

### `npm install (or) yarn`

Run this command at the package root to install all dependencies and generate the `node_modules` directory.

### `npm (or) yarn build`

Run this command at the package root to generate the `dist` folder with the transpiled javascript.

### `npm (or) yarn link`

Run this command at the package root.

### `npm (or) yarn link request-multiple-urls`

Run this command at the root of the node.js project that you wish to use this package in to complete the linking.

## Development

### `npm install (or) yarn`

Run this command at the package root to install all dependencies and generate the `node_modules` directory.

### `npm (or) yarn build`

Run this command at the package root to generate the `dist` folder with the transpiled javascript. You can then automatically see your changes reflect in your project of choice assuming linking is complete.

## Test

We are using mocha and chai along with nyc to create integration tests and display the code coverage each time the tests are ran.

### `yarn test`

Runs all integration tests

## Build

### `yarn build`

Runs the tests and on successful completion builds the package using [babel](https://babeljs.io/docs/en/) which will transpile the main project javascript into backwards-compatible javascript and export it in the `/dist` folder.

## Example response

Should an array of URLs is provided, this is what the response body's structure is expected to look like.

The `status` will be either 'fulfilled' or 'rejected' and the `value` would hold the data along with additional response information.

Should a response fail we would return `reason` instead of `value`.

```
[
  {
    status: 'fulfilled',
    value: {
      status: 200,
      statusText: 'OK',
      headers: [AxiosHeaders],
      config: [Object],
      request: [ClientRequest],
      data: [Object]
    }
  },
  {
    status: 'rejected',
    reason: {
      code: 'INVALID_URL',
      response: {
        status: 400,
        statusText: 'Bad Request',
      }
    }
  },
  {
    status: 'rejected',
    reason: {
      code: 'ERR_BAD_REQUEST',
      response: {
        status: 404,
        statusText: 'Not Found',
        ...
        (since this was the result of an axios request error, and was not a custom validation error, we will return more fields here)
      },
      ...
      (since this was the result of an axios request error, and was not a custom validation error, we will also return the `config`, and `request` fields)
    }
  },
  {
    status: 'fulfilled',
    value: {
      status: 200,
      statusText: 'OK',
      headers: [AxiosHeaders],
      config: [Object],
      request: [ClientRequest],
      data: [Object]
    }
  }
]
```

## General comments

### Why are we using Promise.allSettled?

We are using [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) to not make the requests dependent on each other. If one of the requests fails the rest which may be successful are not affected. The Promise.allSettled() method returns a promise that fulfills after all of the given promises have either fulfilled or rejected, with an array of objects that each describes the outcome of each promise. Had we used Promise.all we would not have been able to achieve this as it would immediately fail as soon as one of the requests fails.

### Why are we using axios?

Making requests is the core part of this package and we heavily rely on [axios](https://github.com/axios/axios) a popular http request library - it supports older browsers, allows us to write less code and comes with many custom options on both the global and per request level.

### Custom validation errors

The package expects to be passed an array of urls and will throw custom errors BEFORE the requests are made if:

1. An array is not passed in
2. An empty array is passed in
3. A URL is invalid

The custom validation errors are mimicked after the errors that axios returns to preserve the data structure and make it easy to interrogate in the front end. Example for No 3 (A URL is invalid):

```
{
  code: 'INVALID_URL',
  response: {
    status: 400,
    statusText: 'Bad Request',
  }
}
```

### What can be improved or added to this package in the future

1. This package uses `Promise.allSettled` which is a ES2020 feature and is supported on all modern browsers since 2019 based on [caniuse](https://caniuse.com/?search=Promise.allSettled), however should we wish to support browsers prior to 2019 and IE11 we would have to use a polyfill.

2. `axios` allows us to add many custom options to our requests. We haven't taken advantage of this in the current version of this package. Optional features that can be added is the option to set a timeout at a global or request level or a specific number of retries.

3. We could potentially filter out some of what axios returns back as a response body, as a lot of that information such as `headers` or `config` we might choose to not want to reveal in the front end for security reasons or because it increases the size of the response body. Currently we are returning all of what axios returns.

4. This is a JavaScript package however since many projects these days also use TypeScript, this package can be rewritten in Typescript to make it easier to use within TypeScript projects and to ease development as well (especially if we were to extend it).