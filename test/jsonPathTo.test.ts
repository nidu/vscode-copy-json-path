import * as assert from 'assert'
import {jsonPathTo} from '../src/jsonPathTo'

describe("jsonPathTo", () => {
    assert.equal('a', jsonPathTo('{"a": 2}', 4))

    assert.equal('a.b', jsonPathTo('{"a": {"b": 1}}', 10))
    assert.equal('a', jsonPathTo('{"a": {"b": 1}}', 4))

    assert.equal('c.1', jsonPathTo('{"a": {"b": 1}, "c": [4, 6, 8]}', 25))
})