import { from } from "webpack-sources/lib/CompatSource";
import { ATTR, TEXT, REPLACE, REMOVE } from './type'

let patches = {}

function domDiff(oldVDom, newVDom) {
    let index = 0
    vnodeWalk(oldVDom, newVDom, index)
    return patches
}

function vnodeWalk(oldNode, newNode, index) {
    let vnPatch = []
    if(!newNode) {
        vnPatch.push({
            type:  REMOVE,
            index
        })
    } else if(typeof oldNode === 'string' && typeof newNode === 'string') {
        if(oldNode !== newNode) {
            vnPatch.push({
                type: TEXT,
                text: newNode
            })
        }
    } else if(oldNode.type === newNode.type) {
        const attrPatch = attrsWalk(oldNode.props, newNode.props)
    }
}

export default domDiff;