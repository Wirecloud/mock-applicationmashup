"use strict";

import Http from "lib/vendor/Http";

describe('Http', () => {
    let http;

    beforeEach(() => {
        http = new Http();
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
        http.resetData();
        expect(true).toBeTruthy(); // no behaviour
    });
});
