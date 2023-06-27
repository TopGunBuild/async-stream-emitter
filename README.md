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

## Usage AsyncStreamEmitter

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

## Usage StreamDemux

### Consuming using async loops

```js
let demux = new StreamDemux();

(async () => {
  // Consume data from 'abc' stream.
  let substream = demux.stream('abc');
  for await (let packet of substream) {
    console.log('ABC:', packet);
  }
})();

(async () => {
  // Consume data from 'def' stream.
  let substream = demux.stream('def');
  for await (let packet of substream) {
    console.log('DEF:', packet);
  }
})();

(async () => {
  // Consume data from 'def' stream.
  // Can also work with a while loop for older environments.
  // Can have multiple loops consuming the same stream at
  // the same time.
  // Note that you can optionally pass a number n to the
  // createAsyncIterator(n) method to force the iteration to
  // timeout after n milliseconds of innactivity.
  let asyncIterator = demux.stream('def').createAsyncIterator();
  while (true) {
    let packet = await asyncIterator.next();
    if (packet.done) break;
    console.log('DEF (while loop):', packet.value);
  }
})();

(async () => {
  for (let i = 0; i < 10; i++) {
    await wait(10);
    demux.write('abc', 'message-abc-' + i);
    demux.write('def', 'message-def-' + i);
  }
  demux.close('abc');
  demux.close('def');
})();

// Utility function for using setTimeout() with async/await.
function wait(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
```

### Consuming using the once method

```js
// Log the next received packet from the abc stream.
(async () => {
  // The returned promise never times out.
  let packet = await demux.stream('abc').once();
  console.log('Packet:', packet);
})();

// Same as above, except with a timeout of 10 seconds.
(async () => {
  try {
    let packet = await demux.stream('abc').once(10000);
    console.log('Packet:', packet);
  } catch (err) {
    // If no packets are written to the 'abc' stream before
    // the timeout, an error will be thrown and handled here.
    // The err.name property will be 'TimeoutError'.
    console.log('Error:', err);
  }
})();
```

## Goal

The goal of this module is to efficiently distribute data to a large number of named asynchronous streams while facilitating functional programming patterns which decrease the probability of memory leaks.

Each stream returned by this module is responsible for picking up its own data from a shared source stream - This means that the stream-demux module doesn't hold any references to streams which it produces via its `stream()` method; this reduces the likelihood of programming mistakes which would lead to memory leaks because streams don't need to be destroyed or cleaned up explicitly.

The downside to making each stream responsible for consuming its own data is that having a lot of concurrent streams can have a negative impact on performance (especially if there are a lot of idle streams). A goal of stream-demux is to keep that overhead to a minimum.

## License

MIT
