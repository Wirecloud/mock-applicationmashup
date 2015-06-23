MashupPlatform Mock for WireCloud.
=================================

A javascript mocking library for [MashupPlatform API](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/Application_Mashup_-_Wirecloud_-_User_and_Programmer_Guide#Javascript_API). This library aims to make testing WireCloud widgets in the browser or in phantomjs, as simple as possible.

Installation
--------

- Install it without bower.json

```
bower install mock-applicationmashup --save-dev
```

- Add it to bower.json to use in per project.

``` javascript
// In bower.json:
{
    //...
    "dependencies": {
        //...
        "mock-applicationmashup": "~version"  // Right now "~0.0.4"
        //...
    },
    "exportsOverride": {
        //...
        "mock-applicationmashup": {},
        //...
    }
    //...
}
```

Then execute `bower install`, or add the task `grunt-bower-task` to your `Gruntfile.js`.


Adding for testing
----------

Once you have it installed, the file is in `bower_components/mock-applicationmashup/lib/vendor/mockMashupPlatform.js`, you can use it with your favorite testing framework.

Here is an example, using `jasmine`, `grunt`, and the `grunt-contrib-jasmine` task.

To add the mock library, in your jasmine task, you will have to add it in the vendor section, like this:

```javascript
jasmine: {
    test:{
        src: ['your_src/*.js'],
        options: {
            specs: 'your_test_src/*Spec.js',
            helpers: ['your_test_src/helpers/*.js'],
            vendor: ['bower_components/mock-applicationmashup/lib/vendor/mockMashupPlatform.js',
                     'your_test_src/vendor/*.js']
        }
    },
    coverage: {
        // ...
    }
}
```

Note that we added to the vendor section the mock file, this will add it to your tests.


Using it in tests
----------

MockSocket is a drop in replacement for the MashupPlatform global found in the WireCloud platform. To replace it, you will have to set it in the window object:

```
window.MashupPlatform = new MockMP.MockMP();
```

Actually, this will create the default mock, and you can start using it.

To specify the behaviour, you can use three strategies:

1. Constant Strategy
This strategy will return always the same value. For example:

```javascript
var constantTest = MockMP.strategy.constant("test");
expect(constantTest()).toBe("test");
```

2. Exception Strategy
This strategy will always throw an exception.

```javascript
function TestException() {}
var exceptionTest = MockMP.strategy.exception(TestException);
expect(exceptionTest).toThrow();
```

3. Dict Strategy
This strategy is really important, you set a dictionary in a value.

```javascript
var dictionary = {
    'value1': true,
    'value2': 'yeah',
    'value3': function() {return 3;}
};
var dictTest = MockMP.strategy.dict(dictionary);
expect(dictTest('value1')).toBeTruthy();
expect(dictTest('value2')).toBe('yeah');
expect(dictTest('value3')()).toBe(3);
```

The default values of the MashupPlatform when you create it with `MockMP.MockMP()` are:
```
{
    "context.get": namespace.strategy.constant("not set yet"),
    "http.buildProxyURL": namespace.strategy.constant(null),
    "http.makeRequest": namespace.strategy.constant(null),
    "log.ERROR": 1,
    "log.WARN": 2,
    "log.INFO": 3,
    "mashup.context.get" : namespace.strategy.constant(null),
    "prefs.get": namespace.strategy.constant("value"),
    "prefs.set": namespace.strategy.constant(null),
    "prefs.registerCallback": namespace.strategy.constant(null),
    "widget.getVariable": namespace.strategy.constant("value"),
    "widget.drawAttention": namespace.strategy.constant(null),
    "widget.id": "id33",
    "widget.log": namespace.strategy.constant("something"),
    "widget.context.get" : namespace.strategy.constant(null),
    "widget.context.registerCallback": namespace.strategy.constant(null),
    "wiring.getReachableEndpoints": namespace.strategy.constant([]),
    "wiring.pushEvent": namespace.strategy.constant(null),
    "wiring.registerCallback": namespace.strategy.constant(null)
}
```

So, you can expect the following behaviour with the default MashupPlatform:

```javascript
it("default values for MashupPlatform", function() {
    window.MashupPlatform = new MockMP.MockMP();

    expect(MashupPlatform.context.get('whatever')).toBe('not set yet');
    expect(MashupPlatform.http.buildProxyURL('url', 'options')).toBeNull();
    expect(MashupPlatform.http.makeRequest('url', 'options')).toBeNull();
    expect(MashupPlatform.log.ERROR).toBe(1);
    expect(MashupPlatform.log.WARN).toBe(2);
    expect(MashupPlatform.log.INFO).toBe(3);
    expect(MashupPlatform.mashup.context.get('anycontext')).toBeNull();
    expect(MashupPlatform.prefs.get('any pref')).toBe('value');
    expect(MashupPlatform.prefs.set('any pref', 'any value')).toBeNull();
    expect(MashupPlatform.prefs.registerCallback('name', function() {})).toBeNull();
    expect(MashupPlatform.widget.getVariable('var')).toBe('value');
    expect(MashupPlatform.widget.drawAttention()).toBeNull();
    expect(MashupPlatform.widget.id).toBe('id33');
    expect(MashupPlatform.widget.log('anything')).toBe('something');
    expect(MashupPlatform.widget.context.get('this')).toBeNull();
    expect(MashupPlatform.widget.context.registerCallback('name', function() {})).toBeNull();
    expect(MashupPlatform.wiring.getReachableEndpoints()).toEqual([]);
    expect(MashupPlatform.wiring.pushEvent('this', {})).toBeNull();
    expect(MashupPlatform.wiring.registerCallback('that', function() {})).toBeNull();
});
```
