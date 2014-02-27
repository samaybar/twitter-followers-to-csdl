var   vows      = require('vows')
    , assert    = require('assert')
    , processor = require('../lib/processor')
    ;

var testData ={"ids":[1128997034,1061530674,37228122,2179743754,994770710,58467528,862800487,92613363,51261422,2343743176,88733560,360197621,2346682567,20620232,2344754086,25579571,602132105,2301003461,2341372663,2328750822],"next_cursor":1460190974672878800,"next_cursor_str":"1460190974672878817","previous_cursor":0,"previous_cursor_str":"0"};

vows.describe('Processing a successful data response').addBatch({
    'successfully extracts the id\'s to create a CSDL string': {
        topic: function () {
            return processor.getCsdl(testData);
        },
        'an string is returned': function (topic) {
            assert.isString(topic);
        },
        'an string is returned matching the test id\'s': function (topic) {
            assert.deepEqual(topic, 'twitter.user.id in [1128997034,1061530674,37228122,2179743754,994770710,58467528,862800487,92613363,51261422,2343743176,88733560,360197621,2346682567,20620232,2344754086,25579571,602132105,2301003461,2341372663,2328750822]');
        }
    },
    'can compile CSDL from within the processor': {
        topic: function () {
            return processor.getStreamHash(processor.getCsdl(testData), this.callback);
        },
        'returns a JSON object with a hash': function (topic) {
            var t = JSON.parse(topic);
            assert.isString(t.hash);
        },
        'returns a JSON object with a valid hash': function (topic) {
            var t = JSON.parse(topic);
            assert.deepEqual(t.hash, '5ded054560fd76a909b243076d332572');
        }
    },
    'can save ids to memory store': {
        topic: function () {
            return processor.setStoreIds(processor.getPayloadIds(testData));
        },
        'returns TRUE': function (topic) {
            assert.isTrue(topic);
        }
    },
    'can get the size of the stored data in bytes': {
        topic: function () {
            processor.setStoreIds(processor.getPayloadIds(testData));
            return processor.getStoreSize();
        },
        'returns a byte size number': function (topic) {
            assert.isNumber(topic);
        },
        'returns a byte size number > 0': function (topic) {
            assert.strictEqual(topic > 0, true);
        }
    }
}).export(module);