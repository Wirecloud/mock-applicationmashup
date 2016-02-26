import Http from "lib/vendor/Http";

describe('Http', () => {
    let http;

    beforeEach(() => {
        http = new Http();
        http.resetData();
    });

    it('should have spies', () => {
        http.buildProxyURL("");
        expect(http.buildProxyURL).toHaveBeenCalled();
        http.makeRequest("/");
        expect(http.makeRequest).toHaveBeenCalled();
    });

    it('should reset spies', () => {
        http.buildProxyURL("");
        expect(http.buildProxyURL).toHaveBeenCalled();
        http.makeRequest("/");
        expect(http.makeRequest).toHaveBeenCalled();

        http.reset();
        expect(http.buildProxyURL).not.toHaveBeenCalled();
        expect(http.makeRequest).not.toHaveBeenCalled();
    });

    it('should reset data', () => {
        http.addAnswer("get", "/test", 200);
        expect(http.answers.get["/test"]).toBeDefined();
        http.resetData();
        expect(http.answers.get["/test"]).not.toBeDefined();
    });

    it('should not add if not method', () => {
        http.addAnswer("nomethod", "/test", 200);
        expect(http.answers.nomethod).toBeUndefined();
    });


    it('should mock success static answers', () => {
        let test1 = false,
            test2 = false,
            test3 = true;

        const jAnswer = `{"yeah": 1}`;

        http.addAnswer("get", "/test", 200, jAnswer);
        http.makeRequest("/test", {
            method: "GET",
            onSuccess: x => {
                expect(x).toEqual(jAnswer);
                test1 = true;
            },
            onFailure: () => {
                test2 = true;
            },
            onComplete: () => {
                test3 = true;
            }
        });

        expect(test1).toBeTruthy();
        expect(test2).toBeFalsy();
        expect(test3).toBeTruthy();
    });

    it('should mock error answers', () => {
        let test1 = false,
            test2 = false,
            test3 = true;

        http.addAnswer("post", "/test", 404);
        http.makeRequest("/test", {
            onSuccess: () => {
                test1 = true;
            },
            onFailure: () => {
                test2 = true;
            },
            onComplete: () => {
                test3 = true;
            }
        });

        expect(test1).toBeFalsy();
        expect(test2).toBeTruthy();
        expect(test3).toBeTruthy();
    });

    it('should mock dynamic answers', () => {
        http.addAnswer("post", "/test", 200, "", x => `You said: ${x}`);
        let test1 = false,
            test2 = false,
            test3 = true;

        http.makeRequest("/test", {
            method: "POST",
            postBody: "YAY",
            onSuccess: x => {
                expect(x).toEqual("You said: YAY");
                test1 = true;
            },
            onFailure: () => {
                test2 = true;
            },
            onComplete: () => {
                test3 = true;
            }
        });

        expect(test1).toBeTruthy();
        expect(test2).toBeFalsy();
        expect(test3).toBeTruthy();
    });

    it('should call on success and failure if there are no other callbacks onCompleted', () => {
        http.addAnswer("get", "/test", 200);
        http.addAnswer("get", "/test2", 404);
        http.makeRequest("/test", {
            method: "GET",
            onComplete: () => {
                expect(true).toBeTruthy();
            }
        });

        http.makeRequest("/test2", {
            method: "GET",
            onComplete: () => {
                expect(true).toBeTruthy();
            }
        });
    });

    it('should makeRequest to a not handled URL', () => {
        let test1 = false,
            test2 = false,
            test3 = true;

        http.makeRequest("/test", {
            onSuccess: () => {
                test1 = true;
            },
            onFailure: x => {
                expect(x).toEqual("Not given an answer to post:/test");
                test2 = true;
            },
            onComplete: () => {
                test3 = true;
            }
        });

        expect(test1).toBeFalsy();
        expect(test2).toBeTruthy();
        expect(test3).toBeTruthy();
    });
});
