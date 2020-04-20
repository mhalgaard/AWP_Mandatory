class Db {
    /**
     * Constructors an object for accessing questions in the database
     * @param mongoose the mongoose object used to create schema objects for the database
     */
    constructor(mongoose) {
        // This is the schema we need to store questions in MongoDB
        const questionsSchema = new mongoose.Schema({
            title: String,
            question: String,
            answers: [{
                text: String,
                votes: Number
            }]
        });
        
        mongoose.set('useFindAndModify', false);

        // This model is used in the methods of this class to access questions
        this.questionModel = mongoose.model('question', questionsSchema);
    }

    async getQuestions() {
        try {
            return await this.questionModel.find({});
        } catch (error) {
            console.error("getQuestions:", error.message);
            return {};
        }
    }

    async getQuestion(id) {
        try {
            return await this.questionModel.findById(id);
        } catch (error) {
            console.error("getQuestion:", error.message);
            return {};
        }
    }

    async createQuestion(title, desc) {
        const question = new this.questionModel({
            title: title,
            question: desc
        });

        try {
            let saveQ = await question.save();
            console.log("Question saved.", saveQ);
        } catch (error) {
            console.log("createQuestion", error.message);
            return {};
        }
    }

    async addAnswer(id, answer) {
        const newAnswer = {
            votes: 0,
            text: answer
        };
        try {
            await this.questionModel.findByIdAndUpdate( 
                { _id: id },
                { $push: { answers: newAnswer } }
                );
            return newAnswer;
        } catch (error) {
            console.log("addAnswer", error.message);
            return {};
        }
    };

    async vote(answerId, vote) {
        let points = -1;
        if (vote === "up") {
            points = 1;
        }

        let answers = this.questionModel;
        await answers.updateOne(
            {'answers._id' : answerId}, 
            {'$inc' : {'answers.$.votes' : points } 
        })
    }
}

// We export the object used to access the questions in the database
module.exports = mongoose => new Db(mongoose);