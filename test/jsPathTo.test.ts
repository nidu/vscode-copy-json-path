import * as assert from 'assert'
import {jsPathTo} from '../src/jsPathTo'

const cursorChar = "#"

function checkJsonPath(expected: string, strWithCursor: string) {
    const pos = strWithCursor.indexOf("#")
    if (pos == -1) throw `Cursor not found in ${strWithCursor}`

    const path = jsPathTo(strWithCursor.replace('#', ''), pos)
    it(expected, () =>
      assert.equal(expected, path, `Expected [${expected}], got [${path}] for [${strWithCursor}]`)
    )
}

describe("jsonPathTo", () => {
    checkJsonPath('b[1]', '{b: [1,2,#]}')
    checkJsonPath('[1]', '[1,#2,]')
    checkJsonPath('a', '{# a: 2, b : 3}')
    checkJsonPath('a', '{a#: 2}')
    checkJsonPath('a', '{"a"#: 2}')
    checkJsonPath('a', '{#a: 2}')

    checkJsonPath('b["Hey there"]', '{"b": {"Hey there"#: 2}}')
    checkJsonPath('b["Hey there"]', '{"b": {\'Hey there\'#: 2}}')

    checkJsonPath('a.b', '{"a": {"b#": 1}}')
    checkJsonPath('a', '{"a"#: {"b": 1}}')

    checkJsonPath('c[1]', '{"a": {"b": 1}, "c": [4, #6, 8]}')
    checkJsonPath('a.b', '{"a": {#"b": 1}, "c": [4, 6, 8]}')
    checkJsonPath('a.b', '{"a": {# "b": 1}, "c": [4, 6, 8]}')
    checkJsonPath('a[1].b', '{"a": [6, {# "b": 1}], "c": [4, 6, 8]}')

    checkJsonPath("c[0][\"k''\"]", '{"a": {"b": 1}, "c": [{"k\'#\'": true}, 6, 8]}')
    checkJsonPath('a.j["2a"]', '{"a": {"b": 1, "j": {"1a": "b", "2a#": false}}, "c": [{"k\'\'": true}, 6, 8]}')

    checkJsonPath('b.c', 'var a = {"b": {#c: 4, daq: [5, 15]}}')
    checkJsonPath('b.c', 'var a = {"b": {c#: 4, daq: [5, 15]}}')
    checkJsonPath('b.daq[1]', 'var a = {"b": {c: 4, daq: [5, 15#]}}')
    checkJsonPath('b.daq[1]', 'var a = {"b": {c: 4, daq: [5, 1#5]}}')
    checkJsonPath('b.daq[1]', 'var a = {"b": {c: 4, daq: [5, #15]}}')

    checkJsonPath('q["Long string"][1]', `
        var a = {"b": {c: 4, daq: [5, 15]}}
        var b = {'q': {"Long string": [2, #12]}}
    `)

    checkJsonPath('a[1]', `
        function main() {
            return {a: ['c', 'd#']};
        }
    `)

    checkJsonPath('a2["b-q"]', `
        function main() {
            const b = {q: 14};
            let someStr = "{b: 14"
            function q() { help() }
            const a = {"a1": ['c', 'd'], a2: {"b-#q": "z"}};
            return a
        }
    `)

    checkJsonPath('c', `
        function main() {
            return {b: 1, c: function() { return #2; }}
        }
    `)

    checkJsonPath('q', `
        function main() {
            return {b: 1, c: function() { return {q: 6#}; }}
        }
    `)

    checkJsonPath('a[3].d[0]', "{a: [1, {b: 3}, 4, {d: [6#, 7]}]}")
    checkJsonPath('a[1].b', "{a: [1, {b: 3#}, 4, {d: [6, 7]}]}")

    checkJsonPath('q', "{b, #q}")

    checkJsonPath('b', "{a: function() { return 13 }, b: 1#4}")

    checkJsonPath('contributes.commands[0].title', `
      {
        "name": "copy-json-path",
        "displayName": "copy-json-path",
        "description": "Copy json path under the cursor",
        "version": "0.0.4",
        "publisher": "nidu",
        "engines": {
          "vscode": "^1.5.0"
        },
        "categories": [
          "Other"
        ],
        "activationEvents": [
          "onCommand:extension.copyJsonPath"
        ],
        "repository": { 
          "type": "git",
          "url": "https://github.com/nidu/vscode-copy-json-path.git"
        },
        "bugs": {
          "url": "https://github.com/nidu/vscode-copy-json-path/issues"
        },
        "homepage": "https://github.com/nidu/vscode-copy-json-path/blob/master/README.md",
        "main": "./out/src/extension",
        "contributes": {
          "commands": [
            {
              "command": "extension.copyJsonPath",
              "t#itle": "Copy Json Path"
            }
          ]
        },
        "keywords": [
          "JSON"
        ],
        "scripts": {
          "vscode:prepublish": "tsc -p ./",
          "compile": "tsc -watch -p ./",
          "postinstall": "node ./node_modules/vscode/bin/install",
          "test": "tsc -p . && mocha out/test/jsPathTo.test.js"
        },
        "devDependencies": {
          "@types/mocha": "^2.2.32",
          "@types/node": "^6.0.40",
          "mocha": "^5.2.0",
          "mocha-typescript": "^1.0.11",
          "typescript": "^2.0.3",
          "vscode": "^1.0.0"
        },
        "dependencies": {
          "@types/copy-paste": "^1.1.30",
          "acorn": "^5.7.1",
          "copy-paste": "^1.3.0"
        }
      }
      `)

    checkJsonPath('dependencies["@types/copy-paste"]', `{
        "dependencies": {
            "@types/copy-paste": "^1.1.#30",
            "acorn": "^5.7.1",
            "copy-paste": "^1.3.0"
          }
        }`)
})