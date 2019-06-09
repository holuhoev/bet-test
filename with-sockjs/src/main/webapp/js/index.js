import React from "react";
import ReactDom from "react-dom";
import SockJsClient from "react-stomp";


const runWithInterval = (func, interval) => {
    return setInterval(function () {
        func();
    }, interval);
};

const generateBetEvent = () => {

    return {
        name:      'Реал - Барса',
        type:      'П1',
        coef:      '1.5',
        timestamp: new Date().valueOf(),
        brand:     'bet360'
    }
};

class App extends React.Component {


    componentDidMount() {
        const timerId = runWithInterval(this.sendEvent, 1000);

        this.setState({
            timerId: timerId
        });

    }

    constructor(props) {
        super(props);

        this.state = {
            clientConnected: false,
            sendingEvents:   [],
            receivingEvents: [],
            timerId:         null
        };
    }

    onSummaryReceive = (msg) => {
        this.setState(prevState => {
            return ({
                receivingEvents: [
                    ...prevState.receivingEvents,
                    {
                        ...msg.body,
                        receiveAt: new Date().valueOf()
                    } ]
            });
        });
    };

    sendEvent = () => {
        try {
            const betEvent = generateBetEvent();
            this.setState(prevState => ({
                sendingEvents: [ ...prevState.sendingEvents, betEvent ]
            }));

            this.clientRef.sendMessage("/app/all", JSON.stringify(betEvent));

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

    clear = () => {
        this.setState({
            sendingEvents:   [],
            receivingEvents: [],
        })
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
                        display:       'flex',
                        flexDirection: 'row'
                    } }
                >
                    <button style={ { width: 250 } } onClick={ this.startEvent }> Run</button>
                    <button style={ { width: 250 } } onClick={ this.stopEvent }> Stop</button>
                    <button style={ { width: 250 } } onClick={ this.clear }> Clear</button>
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
                        overflow:      'auto',
                        width:         '100%'
                    } }>
                        {
                            this.state.sendingEvents.map((event, i) => (
                                <div key={ i }>
                                    { i + ". " + event.name + " " + event.type + " " + event.coef }
                                </div>
                            ))
                        }
                    </div>
                    <div style={ {
                        display:       'flex',
                        flexDirection: 'column',
                        height:        500,
                        overflow:      'auto',
                        width:         '100%'
                    } }>
                        {
                            this.state.receivingEvents.map((event, i) => (
                                <div key={ i }>
                                    {
                                        i + ". " + event.timestamp
                                        + " --- "
                                        + event.receiveAt
                                    }
                                </div>
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
