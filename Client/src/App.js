import React, { Component } from "react";
import { Router, Link } from "@reach/router";
import AskQuestion from "./AskQuestion";
import Question from "./Question";
import Questions from "./Questions";
import "./style.css";

class App extends Component {
	API_URL = process.env.REACT_APP_API_URL;

	constructor(props) {
		super(props);
		this.state = {
			questions: []
		};
	}

	componentDidMount() {
		// Get everything from the API
		this.getQuestions().then(() => console.log("Questions gotten!"));
	}

	async getQuestions() {
		let url = `${this.API_URL}/questions`; // URL of the API.
		let result = await fetch(url); // Get the data
		let json = await result.json(); // Turn it into json
		return this.setState({
			// Set it in the state
			questions: json
		});
	}

	// getQuestion(id) {
	//     const findFunction = question => question.id === parseInt(id);
	//     return this.state.questions.find(findFunction);
	// }

	getQuestion(id) {
		// Find the relevant question by id
		return this.state.questions.find(q => q._id === id);
	}

	submit(title, question, answers) {
		let last = this.state.questions[this.state.questions.length - 1];
		const newQuestion = {
			id: last.id + 1,
			title: title,
			question: question,
			answers: answers
		};
		this.setState({
			questions: [...this.state.questions, newQuestion]
		});
	}

	submitAnswer(answer, id) {
		console.log(answer, id);
		let state = this.state.questions;
		let element = state.find(x => x.id === parseInt(id));
		element.answers.unshift(answer);
		console.log(element);
	}

	render() {
		return (
			<>
				<nav>
					<ul>
						<Link to="/">
							<li>Questions</li>
						</Link>
						<Link to="/ask">
							<li>Ask a question</li>
						</Link>
					</ul>
				</nav>
				<Router>
					<AskQuestion
						path="/ask"
						submit={(title, desc, comments) =>
							this.submit(title, desc, comments)
						}
					></AskQuestion>
					<Question
						path="/question/:id"
						getQuestion={id => this.getQuestion(id)}
						submitAnswer={(answer, id) => this.submitAnswer(answer, id)}
					></Question>
					<Questions path="/" data={this.state.questions}></Questions>
				</Router>
			</>
		);
	}
}

export default App;