const {App, Alexa, GoogleAssistant, Jovo} = require('jovo-framework');

const app = new App();


app.use(
    new GoogleAssistant(),
    new Alexa()
);


app.setHandler({
    async LAUNCH() {
        this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.$sessionAttributes.name = 'John Doe';

        this
            .addSessionAttribute('foo', 'bar')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    MyNameIsIntent() {


        return this.tell(`Session attribute values are ${this.$sessionAttributes.name} and ${this.$sessionAttributes.foo}`);
    },
});

module.exports.app = app;
