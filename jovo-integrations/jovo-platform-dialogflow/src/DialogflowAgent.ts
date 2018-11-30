import {BaseApp, Jovo, JovoRequest, Platform, Host, JovoResponse, SpeechBuilder} from "jovo-core";
import * as _ from 'lodash';
import {DialogflowUser} from "./DialogflowUser";

export class DialogflowAgent extends Jovo {

    constructor(app: BaseApp, host: Host) {
        super(app, host);
        // this.$request = DialogflowRequest.fromJSON(hostwrapper.getRequestObject()) as DialogflowRequest;
        // this.$request.requestObj = hostwrapper.getRequestObject();
        // this.$response = new DialogflowResponse();
        // this.$sessionAttributes = this.$request.getSessionAttributes();
        // this.$inputs = this.$request.getInputs();
        this.$user = new DialogflowUser(this);
    }


    dialogflowAgent(): DialogflowAgent {
        return this;
    }
    isNewSession(): boolean {
        return true;
    }

    getDeviceId(): string | undefined {
        return undefined;
    }

    getRawText(): string | undefined {
        return undefined;
    }

    getRepromptText(): string | undefined {
        return undefined;
    }

    getSpeechBuilder(): SpeechBuilder | undefined {
        return undefined;
    }

    getSpeechText(): string | undefined {
        return undefined;
    }

    hasAudioInterface(): boolean {
        return false;
    }

    hasScreenInterface(): boolean {
        return false;
    }

    hasVideoInterface(): boolean {
        return false;
    }

}
