function FancyButton(props) {
    return (
        <button className="FancyButton">
            {props.children}
        </button>
    )
}

const FancyButton = React.forwardRef((props, ref) => {
    // ref当第二个参数传递下去，思考那class组件呢
    <button ref={ref} className="FancyButton">
        {props.children}
    </button>
})

const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>

// 高阶组件
function logProps(WrappedComponent) {
    class logProps extends React.Component {
        componentDidUpdate(prevProps) {
            console.log('old props:', prevProps)
            console.log('new props:', this.props)
        }

        render() {
            const { forwardRef, ...rest } = this.props
            return <Component ref={forwardRef} {...rest} />
        }
    }

    // 注意React.forwardRef回调的第二个参数“ref”
    // 我们可以将其作为常规props属性传递给LogProps,例如“forwardRef”
    // 然后他就可以被挂载到被LogProps包裹的子组件上

    return React.forwardRef((props, ref) => {
        return <logProps {...props} forwardRef={ref} />
    });
}