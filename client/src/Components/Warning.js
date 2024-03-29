const Warning = (props) => {
    if (props.message.length !== 0)
        return <><br/><a className="warning">{props.message}</a></>
    return <></>
}

export default Warning;