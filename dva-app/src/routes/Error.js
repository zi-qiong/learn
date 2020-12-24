import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hasError: false
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        logErrorToMyService(error, errorInfo)
    }

    render() {
        if(this.state.hasError) {
            return <h1>Something went wrong.</h1>
        }

        return this.props.children
    }
}

// 然后把上面的组件当成一个常规组件去使用
<ErrorBoundary>
    <MyWidget />
</ErrorBoundary>