# MashupPlatform API mock

[![Build Status](https://travis-ci.org/Wirecloud/mock-applicationmashup.svg?branch=develop)](https://travis-ci.org/Wirecloud/mock-applicationmashup)
[![Coverage Status](https://coveralls.io/repos/github/Wirecloud/mock-applicationmashup/badge.svg?branch=develop)](https://coveralls.io/github/Wirecloud/mock-applicationmashup?branch=develop)

A JavaScript mock library for the Application Mashup's [Widget API](http://wirecloud.readthedocs.org/en/stable/widgetapi/widgetapi/). This library aims to make testing WireCloud widgets and operators as simple as possible.


## Installation

- Using `npm`

    ```
    npm install mock-applicationmashup
    ```

- Using `bower`

    ```
    bower install mock-applicationmashup
    ```


## Using it in your tests

`MockMP` is a drop in replacement for the `MashupPlatform` global object found when running widgets and operators in the WireCloud platform. To replace it, you will have to set it into the window object:

```
window.MashupPlatform = new MockMP({
    type: "widget"
});
```

Once installed, you will be able to use `MashupPlatform` as if your code were running inside WireCloud. This
`MashupPlatform` object is built using [jasmine spies](https://jasmine.github.io/api/3.5/Spy.html), providing support
for evaluating how they are called.

Some of those spies are configured to provide a basic behaviour simulating that you are running inside WireCloud. For
example, `MashupPlatform.prefs.get` will throw an exception for non existing preferences. The list of available
preferences is configured through the `MockMP` constructor. The available options are:

- `type`: type of component to mockup: `widget` or `operator`.
- `prefs`: object providing the available preferences and the default values.
- `inputs`: list of available input enpdoints.
- `outputs`: list of available output endpoints.
- `context`: object providing the available platform context and the default values.

**Sorry, documentation in progress, will be updated as soon as possible**
