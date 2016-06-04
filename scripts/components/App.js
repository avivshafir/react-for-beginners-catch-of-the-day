import React from 'react';
import Header from './/Header';
import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

var Rebase = require('re-base');
var base = Rebase.createClass('https://catch-of-the-day-4e891.firebaseio.com/');

@autobind
class App extends React.Component {

	constructor() {
		super();
		this.state = {
			fishes: {},
			order: {}
		}
	}

	componentDidMount() {
		base.syncState(this.props.params.storeId + '/fishes', {
			context: this,
			state: 'fishes'
		});

		var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);
		if(localStorageRef) {
			this.setState({ 
				order: JSON.parse(localStorageRef) 
			});
		}
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));		
	}

	addFish(fish) {
		var timestamp = (new Date()).getTime();
		this.state.fishes['fish-' + timestamp] = fish;
		this.setState({ fishes: this.state.fishes });
	}

	removeFish(key) {
		if(confirm("Are you are you want to remove this fish?")) {
			this.state.fishes[key] = null;
			this.setState({ fishes: this.state.fishes });
		}
	}

	addOrder(key) {
		this.state.order[key] = this.state.order[key] + 1 || 1;
		this.setState({ order: this.state.order });
	}

	removeOrder(key) {
		delete this.state.order[key];
		this.setState({ order: this.state.order });
	}

	loadSamples() {
		this.setState({
			fishes: require('../sample-fishes')
		});
	}

	renderFish(key) {
		return <Fish key={key} index={key} details={this.state.fishes[key]} addOrder={this.addOrder} />
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div class="menu">
					<Header tagline="Fresh Seafood Market"/>
					<ul className="list-of-fishes">
						{Object.keys(this.state.fishes).map(this.renderFish)}
					</ul>
				</div>
				<Order 
					order={this.state.order} 
					fishes={this.state.fishes} 
					removeOrder={this.removeOrder} />
				<Inventory 
					addFish={this.addFish} 
					loadSamples={this.loadSamples} 
					fishes={this.state.fishes} 
					linkState={this.linkState.bind(this)} 
					removeFish={this.removeFish} />
			</div>
		);
	}
}

reactMixin.onClass(App, Catalyst.LinkedStateMixin);

export default App;
