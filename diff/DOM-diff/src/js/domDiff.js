import { from } from "webpack-sources/lib/CompatSource";
import { ATTR, TEXT, REPLACE, REMOVE } from './type'

let patches = {}

function domDiff(oldVDom, newVDom) {
    let index = 0
    vnodeWalk(oldVDom, newVDom, index)
    return patches
}

function vnodeWalk(oldNode, newNode, index) {
    
}

export default domDiff;