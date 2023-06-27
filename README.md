<h1 align="center" style="border-bottom: none;">✅ topgun-typed</h1>
<h3 align="center">Fast, tiny and type-safe runtime validation library for <a href="https://github.com/TopGunBuild/topgun">TopGun</a></h3>

<p align="center">
  <a href="https://github.com/semantic-release/semantic-release">
      <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>
  <a href="https://npm.im/topgun-typed">
    <img alt="npm" src="https://badgen.net/npm/v/topgun-typed">
  </a>
  <a href="https://bundlephobia.com/result?p=topgun-typed">
    <img alt="bundlephobia" src="https://img.shields.io/bundlephobia/minzip/topgun-typed.svg">
  </a>
  <a href="https://opensource.org/licenses/MIT">
      <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

## Install

`npm install topgun-typed`

## Usage

```ts
import * as t from "topgun-typed";

const post = t.object({
  id: t.number(),
  title: t.string(),
});

const postList = t.array(post);

// Get the actual type of the postList
type PostList = t.Infer<typeof postList>;

// Some json data from somewhere
const data = {} as any;

const result = postList(data);

if (result.ok) {
  // Do something with the data
  result.data;
} else {
  // Handle the error
  result.error;
}

// Or you can just unwrap the value directly. It will throw if the data is invalid.
const parsed = t.unwrap(result);

// Or if you don't want it to throw, you can use `unwrapOr`
const parsed = t.unwrapOr(result, {
  /* a default value */
});
```

### Fetch example

Validate data from a remote API.

```ts
import * as t from "topgun-typed";

const post = t.object({
  id: t.number(),
  title: t.string(),
});

const postList = t.array(post);

// If everything goes ok, posts will be correctly typed as `Post[]`.
// If not, an error will be thrown.
const posts = await fetch("https://jsonplaceholder.typicode.com/posts")
  .then((res) => res.json())
  .then(postList)
  .then(t.unwrap);
```

## Custom Types

There's a chance you'll want to define more complex types to deal with your data. You can do this in a few ways:

- Using the `map` function.
- Using the `chain` function.
- Creating a struct from scratch.

### Using the `map` function

The map function allows you to convert one "base" type into another. It always starts from a base type.

```ts
import * as t from "topgun-typed";

// Suppose we have this geolocation struct.
const latLng = t.object({
  lat: t.number(),
  lng: t.number(),
});

// `asNumber` means we can pass a string and it will be converted to a number.
const latLngPair = t.tuple([t.asNumber(), t.asNumber()]);

// And we'd like to have a type that takes a string a returns a `LatLng`.
const asLatLng = t.map(t.string(), (str) => {
  // Here `str` is guaranteed to be a string.

  // Here we validate our splited string against a tuple of two numbers.
  const result = latLngPair(str.split(","));

  // If it succeeds we return a `LatLng` struct. If not, forwards the error.
  return t.isOk(result) ? latLng(result.data) : result;
});

// Now we can use `asLatLng` to validate a string.
const str = "42.123,42.123";

const result = asLatLng(str); // `result` will be a `LatLng` struct.
```

### Using the `chain` function

The `chain` function is useful when you don't want to change the type of your data, but further process it.

For example, if you have a string that you want to trim and lowercase it, then `chain` is the function you want to use.

```ts
import * as t from "topgun-typed";

const trim = (value: string) => value.trim();
const lower = (value: string) => value.toLowerCase();

const trimLower = t.chain(
  t.string(),
  trim,
  lower /* whatever else function you want as longs as it at takes the same type and returns the same type */,
);

const result = trimLower("  Hello World  "); // { ok: true, value: "hello world" }
```

### Creating a struct from scratch

A struct is nothing more than a function that takes whatever input and returns a `Result`. The convention in `topgun-typed` is to have factory functions that return a struct just to be able to customize error messages. This was not the case in previous versions of typed, but it is now.

```ts
import * as t from "topgun-typed";

const regex =
  (regex: RegExp, msg = "Expecting value to match regex"): t.Struct<string> =>
  (input) => {
    if (typeof input !== "string" || !regex.test(input)) {
      return t.err(new t.StructError(msg, { input }));
    }
    return t.ok(input);
  };
```

_You can browse the `topgun-typed` source code to see how structs are implemented if you're curious._

## Notes

`topgun-typed` will deep clone non primitive values as it validates them. So if you pass an object or array to a struct, it will be cloned. This is to say that `topgun-typed` will get rid of any extra properties on your data, so it'll exactly match the shape you defined.

## Reference

The code in this repository is based on `typed` (https://github.com/brielov/typed).

## License

MIT
