import Item from 'antd/lib/list/Item';
import React from 'react';

class Fragment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [{
                id: 1,
                title: "你好"
            }]
        }
    }

    render() {
        return (
            // 有时候遇到语义化被破坏时 可以用Fragemnt
            <dl>
                {this.state.items.map(item => (
                    <Fragment key={item.id}>
                        {/* 简写<> */}
                        {/* 父组件是<ul> */}
                        <dt>{item.title}</dt>
                    </Fragment>
                ))}
            </dl>
            
        )
    }
}
export default Fragment