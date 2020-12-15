const ChildrenFlags = {
    // 未知的children类型
    UNKNOWN_CHILDREN: 0,
    // 没有children
    NO_CHILDREN: 1,
    // children是单个的VNode
    SINGLE_VNODE: 1 << 1,
    // children是多个拥有key的VNode
    KEYED_VNODES: 1 << 2,
    // children是多个没有key的VNode
    NONE_KEYED_VNODES: 1 << 3
}

ChildrenFlags.MULTIPLE_VNODE = ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODES
