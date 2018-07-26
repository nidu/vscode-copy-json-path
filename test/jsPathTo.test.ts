import * as assert from 'assert'
import {jsPathTo} from '../src/jsPathTo'

const cursorChar = "#"

function checkJsonPath(expected: string, strWithCursor: string) {
    const pos = strWithCursor.indexOf("#")
    if (pos == -1) throw `Cursor not found in ${strWithCursor}`

    const path = jsPathTo(strWithCursor.replace('#', ''), pos)
    assert.equal(expected, path, `Expected [${expected}], got [${path}] for [${strWithCursor}]`)
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
})