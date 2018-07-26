# copy-json-path

Copy path to selected JSON or JS node as string.

Path parts are concatenated with `.` or wrapped with `[""]` for object keys and wrapped in `[]` for array indices.

Example:

For state like this (cursor position is bold)

{"a": ["q", {"k": **1**}, 1]}

Path would be `a[1].k`.

For JS like this 

```
var a = {"b": {c: 4, daq: [5, 15]}}
var b = {q: [2, 1**2**]}
```

Path would be `q[1]`.

NOTE: JS objects are not validated.

## Using

Launch command `Copy Json Path`.

## Linux dependency

xclip

## Change Log

### 0.0.5

- Fix JSON check function

### 0.0.4

- Better JS support
- Using acorn parser so valid JS is expected

### 0.0.3

- Less broken JS object support
- Fix when getting path before key like `{a: {# b: 3}}`
- Audit fix

### 0.0.2

- Single quoted and unquoted keys are allowed
- Can copy path in js objects (expects valid js, no check for validity)
- Dont validate JSON on start because we wanna call it from js
- Path is also copied when cursor stands to the left of key (could return error before)

### 0.0.1

Initial release.

## License
This extension is [licensed under the MIT License]. Please see the [third-party notices]file for additional copyright notices and license terms applicable to portions of the software.
