import { Button } from 'antd'
import React from 'react'

class App extends React.Component {
    render() {
        return <Toolbar theme="dark" />
    }
}

function Toolbar(props) {
    return (
        <div>
            <themedButton theme={props.theme} />
        </div>
    );
}

class themedButton extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return <Button theme={this.props.theme} />
    }
}
// 通过props一层层往下传是一件很蛮烦的事情，为了避免我们可以使用context

const ThemeContext = React.createContext("light")

class App extends React.Component {
    render() {
        return (
            <ThemeContext.Provider value="dark">
                <Toolbar />
            </ThemeContext.Provider>
        )
    }
}
// 中间组件再也不必指明往下传递theme
function ToolBar() {
    return (
        <div>
            <ThemedButton />
        </div>
    )
}

class ThemedButton extends React.Component {
    // 指定contextType读取挡墙theme context
    // React 会网上找到最近的theme provider,然后使用它的值
    // 在这个例子中，当前的theme值为‘dark'
    static contextType = ThemeContext;
    render() {
        return <Button theme={this.context} />
    }
}

function Page(props) {
    const user = props.user;
    // 把组件自身传递下去，中间间无需知道user和avatarSize
    const userLink = (
        <link href={user.permalink}>
            <Avatar user={user} size={props.avatarSize} />
        </link>
    );
    return <PageLayout userLink={userLink} />
}

{/* <Page user={user} avatarSize={avatarSize} />
<PageLayout userLink={...} />
<Navigator userLink={...} /> */}

{props.userLink}