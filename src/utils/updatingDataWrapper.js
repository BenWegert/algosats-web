import React from "react";

function getDisplayName(ChartComponent) {
	const name = ChartComponent.displayName || ChartComponent.name || "ChartComponent";
	return name;
}

export default function updatingDataWrapper(ChartComponent) {
	const LENGTH = 200;

	class UpdatingComponentHOC extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				length: LENGTH,
				data: this.props.data,
				last: false
			}
			this.pusher = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");
			this.price = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade")

		}
		componentDidMount() {

			this.price.onopen = () => {
				console.log("price connected")
			}

			this.pusher.onopen = () => {
				console.log("pusher connected")
			}

			this.price.onclose = () => {}
			this.pusher.oncolse = () => {}

			this.price.onmessage = evt => {
				var data = JSON.parse(evt.data)
				var candle = this.state.data
				if (data.p > candle[candle.length-1]['high'])
					candle[candle.length-1]['high'] = data.p
				if (data.p < candle[candle.length-1]['low'])
					candle[candle.length-1]['low'] = data.p
				candle[candle.length-1]['close'] = data.p
				candle[candle.length-1]['volume'] += parseFloat(data.q)
				this.setState({
					data: candle
				})
			}

	    	this.pusher.onmessage = evt => {
		    	var data = JSON.parse(evt.data)
		    	if (this.state.last == true) {
		    		var candle = {
		    			date: new Date(data.k.t),
		    			open: parseFloat(data.k.o),
		    			high: parseFloat(data.k.h),
		    			low: parseFloat(data.k.l),
		    			close: parseFloat(data.k.c),
		    			volume: parseFloat(data.k.v),
		    			split: "",
		    			dividend: "",
		    			absoluteChange: "",
		    			percentChange: ""
		    		}
		    		this.state.data.push(candle)
		      		this.setState({
						length: this.state.length + 1,
						data: this.state.data,
					});
					this.setState({last: false})
		      	}
				if (data.k.x == true)
		    		this.setState({last: true})
	    	}
		}
		componentWillUnmount() {
			if (this.interval) clearInterval(this.interval);
			delete this.price
			delete this.pusher
		}
		render() {
			const { data } = this.state;

			return <ChartComponent ref="component" data={data} />;
		}
	}
	UpdatingComponentHOC.defaultProps = {
		type: "hybrid",
	};
	UpdatingComponentHOC.displayName = `updatingDataWrapper(${ getDisplayName(ChartComponent) })`;

	return UpdatingComponentHOC;
}