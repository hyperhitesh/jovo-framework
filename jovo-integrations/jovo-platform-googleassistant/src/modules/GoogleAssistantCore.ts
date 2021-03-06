import {Plugin, HandleRequest, EnumRequestType} from "jovo-core";
import _set = require('lodash.set');
import _get = require('lodash.get');

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionResponse} from "../core/GoogleActionResponse";
import {GoogleActionSpeechBuilder} from "../core/GoogleActionSpeechBuilder";




export class GoogleAssistantCore implements Plugin {

    install(googleAssistant: GoogleAssistant) {
        googleAssistant.middleware('$init')!.use(this.init.bind(this));
        googleAssistant.middleware('$type')!.use(this.type.bind(this));

        googleAssistant.middleware('$output')!.use(this.output.bind(this));
        googleAssistant.middleware('after.$output')!.use(this.userStorage.bind(this));

        GoogleAction.prototype.displayText = function(displayText: string) {
            _set(this.$output, 'GoogleAssistant.displayText',
                displayText
            );
            return this;
        };

    }

    async init(handleRequest: HandleRequest) {
        const requestObject = handleRequest.host.$request;

        if (requestObject.user &&
            requestObject.conversation &&
            requestObject.surface &&
            requestObject.availableSurfaces) {
            handleRequest.jovo = new GoogleAction(handleRequest.app, handleRequest.host);
        }
    }

    type(googleAction: GoogleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.CANCEL') {
            _set(googleAction.$type, 'type', EnumRequestType.END);
        }
    }

    async output(googleAction: GoogleAction) {
        const output = googleAction.$output;
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }
        const tell = _get(output, 'GoogleAssistant.tell') || _get(output, 'tell');
        if (tell) {
            _set(googleAction.$response, 'expectUserResponse', false);
            _set(googleAction.$response, 'richResponse.items', [{
                simpleResponse: {
                    ssml: GoogleActionSpeechBuilder.toSSML(tell.speech),
                }
            }]);
        }
        const ask = _get(output, 'GoogleAssistant.ask') || _get(output, 'ask');

        if (ask) {
            _set(googleAction.$response, 'expectUserResponse', true);

            // speech
            _set(googleAction.$response, 'richResponse.items', [{
                simpleResponse: {
                    ssml: GoogleActionSpeechBuilder.toSSML(ask.speech),
                }
            }]);

            // reprompts
            const noInputPrompts: any[] = []; // tslint:disable-line

            if (output.ask && output.ask.reprompt && typeof output.ask.reprompt === 'string') {
                noInputPrompts.push({
                    ssml: GoogleActionSpeechBuilder.toSSML(ask.reprompt)
                });
            } else if (Array.isArray(ask.reprompt)) {
                ask.reprompt.forEach((reprompt: string) => {
                    noInputPrompts.push({
                        ssml: GoogleActionSpeechBuilder.toSSML(reprompt)
                    });
                });
            }
            _set(googleAction.$response, 'noInputPrompts', noInputPrompts);
        }

        if (_get(output, 'GoogleAssistant.displayText') && googleAction.hasScreenInterface()) {
            _set(googleAction.$response, 'richResponse.items[0].simpleResponse.displayText', _get(output, 'GoogleAssistant.displayText'));
        }
    }

    async userStorage(googleAction: GoogleAction) {
        const output = googleAction.$output;
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }
        _set(googleAction.$response, 'userStorage', JSON.stringify(googleAction.$user.$storage));
    }
    uninstall(googleAssistant: GoogleAssistant) {

    }

}
