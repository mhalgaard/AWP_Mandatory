import React, { Component } from "react";
import { Link } from "@reach/router";
import PostAnswer from "./PostAnswer";

class Question extends Component {
	API_URL = process.env.REACT_APP_API_URL;
	
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.id
		}
	}


	submit(answer) {
		this.setState(
			{
				answer: answer
			},
			() => {
				this.props.submitAnswer(this.state.answer, this.state.id);
			}
		);
	}


	async addVote(id, vote) {
		let response = await fetch(`${this.API_URL}/vote`, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'PUT',
				mode: 'cors',
				body: JSON.stringify({
					answerId: id,
					vote: vote
				})
			})
			const data = await response.json();
			console.log("Here's the response: ", data)
	}

	render() {
		const question = this.props.getQuestion(this.props.id);
		// const question = this.props.getQuestion(id);
		let content = <p>Loading...</p>;
		if (question) {
			content = (
				<>
					<h1>{question.title}</h1>
                    <p>{question.question}</p>

					<div id="newAnswer">
						<PostAnswer data={this.state.id}></PostAnswer>
					</div>

					<h3>Answers</h3>
					<ul id="questions">
						{question.answers.map(a => (
							<li className="clearfix" key={a._id}>
								<p>{a.text}</p>
								<div className="voting">
									<button className="upvote" onClick={ () => {this.addVote(a._id, "up")}}>Upvote</button>
									<p>{a.votes}</p>
									<button className="downvote" onClick={ () => {this.addVote(a._id, "down")}}>Downvote</button>
								</div>
							</li>
						))}
					</ul>

					<Link to="/" className="back">Back</Link>
				</>
			);
		}
		return content;
	}
}

export default Question;
