# copy-json-path

Copy path to selected JSON node as string.

Path parts are concatenated with `.` or wrapped with `[""]` for object keys and wrapped in `[]` for array indices.

Example:

For state like this (cursor position is bold)

{"a": ["q", {"k": **1**}, 1]}

Path would be `a[1].k`.

## Using

Launch command `Copy Json Path`.

## Linux dependency

xclip

## Change Log

### 0.0.1

Initial release.

## License
This extension is [licensed under the MIT License]. Please see the [third-party notices]file for additional copyright notices and license terms applicable to portions of the software.
