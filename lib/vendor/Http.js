const spyOn = window.spyOn;

export default class Http {
    constructor() {
        this.resetData();
        this.setSpies();
    }

    setSpies() {
        spyOn(this, "buildProxyURL").and.callThrough();
        spyOn(this, "makeRequest").and.callThrough();
    }

    reset() {
        this.buildProxyURL.calls.reset();
        this.makeRequest.calls.reset();
        this.resetData();
    }

    resetData() { // To not break, but maybe useful in some way
        this.answers = {
            get: {},
            post: {},
            put: {},
            delete: {}
        };
    }

    addAnswer(method, url, code, body = "", fnBody = () => "") {
        if (this.answers[method.toLowerCase()]) {
            this.answers[method.toLowerCase()][url] = {
                code,
                body,
                fnBody
            };
        }
    }

    // PUBLIC

    buildProxyURL(url) {
        return url;
    }

    makeRequest(url, options = {}) {
        const method = (options.method || "POST").toLowerCase();

        if (this.answers[method] && this.answers[method][url]) {
            const {code, body, fnBody} = this.answers[method][url];
            // Apply fnBody, if the answer are "", use body
            const response = fnBody(options.postBody || "") || body;

            if (code === 200 && options.onSuccess) {
                options.onSuccess(response);
            } else if (code !== 200 && options.onFailure) {
                options.onFailure(response);
            }
        } else if (options.onFailure) {
            options.onFailure(`Not given an answer to ${method}:${url}`);
        }
        if (options.onComplete) {
            options.onComplete();
        }
    }
}
