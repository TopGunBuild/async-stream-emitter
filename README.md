<h1 align="center" style="border-bottom: none;">🔥 topgun-async-stream-emitter</h1>
<h3 align="center">EventEmitter using async iterable streams and asynchronous iterable stream demultiplexer for <a href="https://github.com/TopGunBuild/topgun">TopGun</a>. Improves control flow whilst helping to avoid memory leaks.</h3>

<p align="center">
  <a href="https://github.com/semantic-release/semantic-release">
      <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>
  <a href="https://npm.im/topgun-async-stream-emitter">
    <img alt="npm" src="https://badgen.net/npm/v/topgun-async-stream-emitter">
  </a>
  <a href="https://bundlephobia.com/result?p=topgun-async-stream-emitter">
    <img alt="bundlephobia" src="https://img.shields.io/bundlephobia/minzip/topgun-async-stream-emitter.svg">
  </a>
  <a href="https://opensource.org/licenses/MIT">
      <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

## Install

`npm install topgun-async-stream-emitter`

## Usage

```ts
let emitter = new AsyncStreamEmitter();

(async () => {
  await wait(10);
  emitter.emit('foo', 'hello');

  // This will cause all for-await-of loops for that event to exit.
  // Note that you can also use the 'break' statement inside
  // individual for-await-of loops.
  emitter.closeListener('foo');
})();

(async () => {
  for await (let data of emitter.listener('foo')) {
    // data is 'hello'
  }
  console.log('The listener was closed.');
})();

// Utility function.
function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
```

Note that unlike with `EventEmitter`, you cannot get the count for the number of active listeners at any given time.
This is intentional as it encourages code to be written in a more declarative style and lowers the risk of memory leaks.

## License

MIT
