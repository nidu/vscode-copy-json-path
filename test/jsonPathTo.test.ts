import * as assert from 'assert'
import {jsonPathTo} from '../src/jsonPathTo'

const cursorChar = "#"

function checkJsonPath(expected: string, strWithCursor: string) {
    const pos = strWithCursor.indexOf("#")
    if (pos == -1) throw `Cursor not found in ${strWithCursor}`

    const path = jsonPathTo(strWithCursor.replace('#', ''), pos)
    assert.equal(expected, path, `Expected [${expected}], got [${path}] for [${strWithCursor}]`)
}

describe("jsonPathTo", () => {
    checkJsonPath('a', '{"a"#: 2}')

    checkJsonPath('b["Hey there"]', '{"b": {"Hey there"#: 2}}')
    checkJsonPath('b["Hey there"]', '{"b": {\'Hey there\'#: 2}}')

    checkJsonPath('a.b', '{"a": {"b#": 1}}')
    checkJsonPath('a', '{"a"#: {"b": 1}}')

    checkJsonPath('c[1]', '{"a": {"b": 1}, "c": [4, #6, 8]}')
    checkJsonPath('a.b', '{"a": {#"b": 1}, "c": [4, 6, 8]}')
    checkJsonPath('a.b', '{"a": {# "b": 1}, "c": [4, 6, 8]}')

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
})