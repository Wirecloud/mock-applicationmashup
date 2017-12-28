# MashupPlatform API mock

[![Build Status](https://travis-ci.org/Wirecloud/mock-applicationmashup.svg?branch=develop)](https://travis-ci.org/Wirecloud/mock-applicationmashup)
[![Coverage Status](https://coveralls.io/repos/github/Wirecloud/mock-applicationmashup/badge.svg?branch=develop)](https://coveralls.io/github/Wirecloud/mock-applicationmashup?branch=develop)

A JavaScript mock library for the Application Mashup's [Widget API](http://wirecloud.readthedocs.org/en/latest/widgetapi/widgetapi/). This library aims to make testing WireCloud widgets and operators as simple as possible (from browsers or using phantomjs).

**WARNING: THIS DOCUMENTATION IS FOR VERSION 0.1.3, THE DOCUMENTATION FOR VERSION 1.0.0 ARE NOT READY YET**

Installation
--------

- Using `npm`

    - Install without adding it to `package.json`

    ```
    npm install -g mock-applicationmashup
    ```

    - Add it to devDependencies in `package.json`:

    ```javascript
    "mock-applicationmashup": "^version", // See package.json to get the last version
    ```

- Using `bower`

    - Install without adding it to `bower.json`

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
            "mock-applicationmashup": "^version"  // See package.json to get the last version
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

To add the mock library, in your jasmine task, you will have to add it in the vendor section, like this (change `node_modules` for `bower_components` if you are using bower instead of npm):

```javascript
jasmine: {
    test:{
        src: ['your_src/*.js'],
        options: {
            specs: 'your_test_src/*Spec.js',
            helpers: ['your_test_src/helpers/*.js'],
            vendor: ['node_modules/mock-applicationmashup/lib/vendor/mockMashupPlatform.js',
                     'your_test_src/vendor/*.js']
        }
    },
    coverage: {
        // ...
    }
}
```

Note that we added to the vendor section the mock file, this will add it to your tests.


Using it in your tests
----------

`MockMP` is a drop in replacement for the `MashupPlatform` global object found when running widgets and operators in the WireCloud platform. To replace it, you will have to set it into the window object:

```
window.MashupPlatform = new MockMP.MockMP();
```

Actually, this will create the default mock, and you can start using it.

To specify the behaviour, you can use three strategies:

- Constant Strategy
This strategy will return always the same value. For example:
```javascript
var constantTest = MockMP.strategy.constant("test");
expect(constantTest()).toBe("test");
```

- Exception Strategy
This strategy will always throw an exception.
```javascript
function TestException() {}
var exceptionTest = MockMP.strategy.exception(TestException);
expect(exceptionTest).toThrow();
```

- Dict Strategy
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


With a new clean instance of `MashupPlatform`, you can expect the following behaviour with the default values:

```javascript

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

```

Known the default values and how it works are great, but the widgets probably won't use the default values, you can set the initial default values when you construct the MashupPlatform.

For example, if you have a widget that have two preferences: `url` and `name`, and the default values are `http://example.org` and `anonymous`, you can change the default values in this way:

```javascript
// Create the default values in a dictionary (in this case)
var preferencesValues = {
    'url': 'http://example.org',
    'name': 'anonymous'
};
// Construct the default values with strategies
var values = {
    'prefs.get': MockMP.strategy.dict(preferencesValues)
};
// Construct the MashupPlatform with that values
window.MashupPlatform = new MockMP.MockMP(values);

// Our default values
expect(MashupPlatform.prefs.get('url')).toEqual('http://example.org');
expect(MashupPlatform.prefs.get('name')).toEqual('anonymous');

// The other default values don't changes, only the ones that you specify in the constructor
expect(MashupPlatform.widget.id).toBe('id33');
```

You can change the strategy after the initalization, the result will be like when you construct the MashupPlatform, so, the values that are not setted in the setStrategy, will be undefined, even if you had it before.

```javascript
// Construct the MashupPlatform with default values
window.MashupPlatform = new MockMP.MockMP({
    'prefs.get': MockMP.strategy.dict({
        'url': 'http://example.org',
        'name': 'anonymous'
    })
});

expect(MashupPlatform.prefs.get('url')).toEqual('http://example.org');
expect(MashupPlatform.prefs.get('name')).toEqual('anonymous');

// Change the strategy
MashupPlatform.setStrategy({
    'prefs.get': MockMP.strategy.dict({
        'name': 'registered'
    })
});

// url is not defined anymore, because we didn't specified it in the setStrategy
expect(MashupPlatform.prefs.get('url')).toBeUndefined();
expect(MashupPlatform.prefs.get('name')).toEqual('registered');
```

You can always reset all the MashupPlatform, this will reset the strategy to the one that you setted in the constructor and will reset all the calls spies. But, if you just want to reset one spy, you can do it yourself!

```javascript
// Create the default MashupPlatform
window.MashupPlatform = new MockMP.MockMP({
    'prefs.get': MockMP.strategy.dict({
        'url': 'http://example.org',
        'name': 'anonymous'
    })
});

// Test that the default values are right, and that the spy works
expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
expect(MashupPlatform.prefs.get('url')).toEqual('http://example.org');
expect(MashupPlatform.prefs.get('name')).toEqual('anonymous');
expect(MashupPlatform.prefs.get).toHaveBeenCalled();

// Let's change the strategy!
MashupPlatform.setStrategy({
    'prefs.get': MockMP.strategy.dict({
        'name': 'registered'
    })
});

// Now, we don't have the url, and the spy is new
expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
expect(MashupPlatform.prefs.get('url')).toBeUndefined();
expect(MashupPlatform.prefs.get).toHaveBeenCalled();

// We can reset only one spy!
MashupPlatform.prefs.get.calls.reset();

// And test it with the new value of the strategy
expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
expect(MashupPlatform.prefs.get('name')).toEqual('registered');
expect(MashupPlatform.prefs.get).toHaveBeenCalled();

// With this function we reset to the initial state everything
MashupPlatform.reset();
expect(MashupPlatform.prefs.get).not.toHaveBeenCalled();
expect(MashupPlatform.prefs.get('url')).toEqual('http://example.org');
expect(MashupPlatform.prefs.get('name')).toEqual('anonymous');
expect(MashupPlatform.prefs.get).toHaveBeenCalled();
```


The mock library try to emulate as much as possible the MashupPlatform, this means that all the side-effect actions that you can do with MashupPlatform, you can do it here too, if you find some function that are not implemented, or not work properly, please open as issue in the GitHub project.

The functions that have side-effect are the "setters" and the "registerCallback".

Let's see some examples:

- Preferences are stateful.
  ```javascript
    MashupPlatform.setStrategy({
        'prefs.get': MockMP.strategy.dict({}) // all undefined
    });
    expect(MashupPlatform.prefs.get('testvalue')).toBeUndefined();  // First is not defined
    MashupPlatform.prefs.set('testvalue', 'newvalue');  // We set the value
    expect(MashupPlatform.prefs.get('testvalue')).toBe('newvalue');  // Now it's defined!
    ```

- You can set a callback and that callback will be called properly.
  ```javascript
  MashupPlatform.setStrategy({
      'prefs.get': MockMP.strategy.dict({
          'test': 'value1'
      })
  });

  var cb = jasmine.createSpy('cb'); // create a fake function to know when it's called
  MashupPlatform.prefs.registerCallback(cb);  // Register the callback for preferences
  expect(cb).not.toHaveBeenCalled();  // The callback isn't called yet

  MashupPlatform.prefs.set('test', 'value2');  // Set the new value
  expect(cb).toHaveBeenCalledWith({'test': 'value2'});  // The callback is called properly!
  ```

The functions that allow this kind of functionality are: `prefs.set/get/registerCallback`, `widget.context.registerCallback`, `wiring.registerCallback`.

All the callbacks are usually called because of external interactions (the user change the preferences, the context change in the widget, or arrive some data from the wiring), and to emulate this external interactions we provide functions:

- `simulateReceiveEvent(name, value)`: This will call the the wiring callback that is setted to the wiring `name` with the value `value`.
- `simulateReceiveContext(name, value)` or `simulateReceiveContext(value)`: This will call the widget.context callback. You can use the two parameter option, that will send the object {name: value}, or the single parameter option that will send the value.
- `simulateReceivePrefs(name, value)` or `simulateReceivePrefs(value)`: This will call the preferences callback. You can use the two parameter option, that will send the object {name: value}, or the single parameter option that will send the value.

There you have examples:

- Widget callback simulate:
  ```javascript
  var cb = jasmine.createSpy('cb'); // create spy
  MashupPlatform.widget.context.registerCallback(cb); // register to the context
  expect(cb).not.toHaveBeenCalled();  // still not called

  MashupPlatform.simulateReceiveContext({'test': 'value', 'test2': 'value2'}); // call with a custom object
  expect(cb).toHaveBeenCalledWith({'test': 'value', 'test2': 'value2'});  // The callback is called properly!

  MashupPlatform.simulateReceiveContext('test', 'value'); // Now with just a pair of values
  expect(cb).toHaveBeenCalledWith({'test': 'value'}); // The callback is called properly again
  ```
- Wiring callback simulate:
  ```javascript
  var cb = jasmine.createSpy('cb'); // create spy
  MashupPlatform.wiring.registerCallback('testv', cb); // register to the wiring "testv"
  expect(cb).not.toHaveBeenCalled(); // not called yet

  MashupPlatform.simulateReceiveEvent('testv', 'myvalue!'); // Simulate an event in that wiring
  expect(cb).toHaveBeenCalledWith('myvalue!'); // Received!
  cb.calls.reset(); // reset the calls
  MashupPlatform.simulateReceiveEvent('othertestv', 'myvalue!'); // Simulate an event in other wiring
  expect(cb).not.toHaveBeenCalled(); // Not received :)
  ```
- Preferences callback simulate:
  ```javascript
  var cb = jasmine.createSpy('cb'); // create spy
  MashupPlatform.prefs.registerCallback(cb); // registe to the preferences
  expect(cb).not.toHaveBeenCalled();  // Not called yet

  MashupPlatform.simulateReceivePrefs({'test': 'value', 'test2': 'value2'}); // call with a custom object
  expect(cb).toHaveBeenCalledWith({'test': 'value', 'test2': 'value2'}); // received!
  MashupPlatform.prefs.set('test', 'value3'); // Call with a pair of values
  expect(cb).toHaveBeenCalledWith({'test': 'value3'}); // received!
  ```

Thanks to all this behaviour, your code that use MashupPlatform will work like if it's deployed and you can test better without "tricks".

To see examples of use in jasmine, you can see the tests of this project [here](https://github.com/Wirecloud/mock-applicationmashup/blob/master/test/js/mockMashupPlatformSpec.js)
