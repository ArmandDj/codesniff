import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

class SubmitCode extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '(e.g. CS 242 - Chess)',
			defaultLanguage: {value: 'Java'}
		};
		// React components in ES6 no long autobinds this to nonReact methods
		this.handleChange = this.handleChange.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
	}
	handleChange(evt) {
		this.setState({
			value: evt.target.value
		});
	}
	handleSelect(language) {
		this.setState({
			defaultLanguage: language
		});
	}
	render() {
		var languages = [
			{value: 'Java'},
			{value: 'Python'},
			{value: 'C'},
			{value: 'C++'}
		];
		return (
			<div className="component-submit">
				<h2>Submit Code</h2>
				<p>Logged in as <span className="profile">John</span></p>
				<form>
					<label className="title">Title<input placeholder={this.state.value} onChange={this.handleChange}/></label>
					<label><span>Language</span><input placeholder="Java"/></label>
					<textarea placeholder="paste or drag your code here">
					</textarea>
					<button type="button" className="cta">Submit</button>
				</form>
			</div>
		)
	}
}

export default connect()(SubmitCode)