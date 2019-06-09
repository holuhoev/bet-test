import React from "react";
import ReactDom from "react-dom";
import SockJsClient from "react-stomp";

const runWithInterval = (func, interval) => {
    return setInterval(function () {
        func();
    }, interval);
};

class App extends React.Component {


    componentDidMount() {
        const timerId = runWithInterval(this.sendEvent, 1000);

        this.setState({
            timerId: timerId
        });

        console.log(timerId);
    }

    constructor(props) {
        super(props);

        this.state = {
            clientConnected: false,
            sendingEvents:   [],
            timerId:         null
        };
    }

    onSummaryReceive = (msg) => {
        this.setState(prevState => ({
            sendingEvents: [ ...prevState.sendingEvents, msg ]
        }));
    };

    sendEvent = () => {
        try {
            this.clientRef.sendMessage("/app/all", JSON.stringify("hello world"));
            return true;
        } catch (e) {
            return false;
        }
    };

    stopEvent = () => {
        if (this.state.timerId) {
            clearTimeout(this.state.timerId);
            this.setState({ timerId: null })
        }
    };

    startEvent = () => {
        if (!this.state.timerId) {
            const timerId = runWithInterval(this.sendEvent, 1000);
            this.setState({ timerId })
        }
    };

    render() {
        const wsSourceUrl = window.location.protocol + "//" + window.location.host + "/handler";

        return (
            <div
                style={ {
                    display:       'flex',
                    height:        '100%',
                    flexDirection: 'column'
                } }
            >
                <div
                    style={ {
                        display:        'flex',
                        flexDirection:  'row',
                        justifyContent: 'space-between'
                    } }
                >
                    <button style={ { width: 250 } } onClick={ this.startEvent }> Run</button>
                    <button style={ { width: 250 } } onClick={ this.stopEvent }> Stop</button>
                </div>
                <div
                    style={ {
                        display:       'flex',
                        flexDirection: 'row',
                        width:         '100%'
                    } }
                >
                    <div style={ {
                        display:       'flex',
                        flexDirection: 'column',
                        height:        500,
                        overflow:      'auto'
                    } }>
                        {
                            this.state.sendingEvents.map((event, i) => (
                                <div key={ i }>{ event }</div>
                            ))
                        }
                    </div>
                    <div style={ {
                        display:       'flex',
                        flexDirection: 'column',
                        height:        500,
                        overflow:      'auto'
                    } }>
                        {
                            this.state.sendingEvents.map((event, i) => (
                                <div key={ i }>{ event }</div>
                            ))
                        }
                    </div>
                </div>

                <SockJsClient
                    url={ wsSourceUrl }
                    topics={ [ "/topic/all" ] }
                    onMessage={ this.onSummaryReceive }
                    ref={ (client) => {
                        this.clientRef = client
                    } }
                    onConnect={ () => {
                        this.setState({ clientConnected: true })
                    } }
                    onDisconnect={ () => {
                        this.setState({ clientConnected: false })
                    } }
                    debug={ false }
                />
            </div>
        );
    }
}

ReactDom.render(<App/>, document.getElementById("root"));
