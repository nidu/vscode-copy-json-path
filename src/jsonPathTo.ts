export function jsonPathTo(text: string, offset: number): string {
    offset -= (text.match(/\\"/g) || []).length
    text = text.replace(/\\"/g, '')
    let path: string[] = []
    let pos = offset

    const isInString = text.substring(0, offset).match(/"/g).length % 2 == 1
    if (isInString) {
        while (pos < text.length && text[pos] != '"') {
            pos++
        }
    }

    let isInKey = findIsKey(pos)
    let commaCounter = 0
    // console.log('getJsonPath', {offset, isInString, pos, isInKey})

    let stack = 0
    let lastAddedAtStack = 1
    enum Where { Key, Value, Array, SiblingObject, SiblingArray }

    while (pos > 0) {
        const ch = text[pos]
        // console.log({pos, ch, isInKey})
        switch (ch) {
            case '"':
                const s = readString()
                // console.log('readString', {s, pos})
                if (isInKey && stack < lastAddedAtStack) {
                    path.push(s)
                    isInKey = false
                    lastAddedAtStack = stack
                }
                break
            case '}':
            case ']':
                stack++
                pos--
                break
            case '{':
            case '[':
                stack--
                pos--
                break
            case ':':
                isInKey = true
                pos--
                break
            default:
                pos--
                break
        }
    }
    return path.reverse().join('.')

    function findIsKey(pos: number): boolean {
        let i = pos
        while (i < text.length && ['{', '}', '[', ']', ','].indexOf(text[i]) == -1) {
            if (text[i] == ':') return true
            i++
        }
        return false
    }

    function readString() {
        let i = pos - 1
        while (pos > 0 && !(text[pos] == '"' && (pos == 0 || text[pos - 1] != '\\'))) {
            i--
        }
        const s = text.substring(i, pos)
        pos = i - 2
        return s
    }
}

enum ColType {Object, Array} 
interface Frame {
    colType: ColType
    index: number
}

function getJsonContext(text: string, offset: number) {
    let pos = 0
    let path: string[] = []
    let stack: Frame[] = []
    let isInKey = false

    while (pos < offset) {
        switch (text[pos]) {
            case '"':
                const {text: s, pos: newPos} = readString(text, pos)
                if (stack.length) {
                    const frame = stack[stack.length - 1]
                    if (frame.colType == ColType.Object && isInKey) {
                        path.push(s)
                        isInKey = false
                    } else {
                        path.push(frame.index.toString())
                    }
                }
                pos = newPos
                break
            case '{':
                stack.push({colType: ColType.Object, index: 0})
                isInKey = true
                break
            case '[':
                stack.push({colType: ColType.Array, index: 0})
                break
            case '}':
            case ']':
                stack.pop()
                break
            case ',':
                if (stack.length) {
                    const frame = stack[stack.length - 1]
                    if (frame.colType == ColType.Object) {
                        isInKey = true
                    }
                    frame.index++
                }
                break
        }
        if (text[pos] != '"')
    }
}

function readString(text: string, pos: number): {text: string, pos: number} {
    let i = pos + 1
    while (text[i] != '"') i++
    return {
        text: text.substring(pos + 1, i),
        pos: i + 2
    }
}