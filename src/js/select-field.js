var SuperField = require('ember-super-field');
var functionProxy = require('function-proxy');

module.exports = SuperField.extend({
    classNames: ['select-field'],

    inputReadonly: true,

    allowKeyInput: false,

    inputValuePath: 'name',

    init: function() {
        this.set('type', SuperField.types.Basic.createWithMixins({
            content: Em.computed.alias('field.content'),
            field: this
        }));
        this._super();
    },

    didInsertElement: function() {
        this._super()

        var input = this.$('input');
        input.keypress(functionProxy(this.selectFromKeyPress, this));
    },

    selectFromKeyPress: function(e) {
        if (e.hasModifier) {
            return
        }
        var key = e.keyCode || e.which
        var char = String.fromCharCode(key)
        if (!char) {
            return
        }
        char = char.toLowerCase()
        var match = this.get('content').find(function(item) {
            if (char === item.get('name').toLowerCase().substring(0, 1)) {
                return true
            }
        })
        if (match) {
            this.selectOption(match)
        }
    },

    eventManager: {
        click: function(e, view) {
            if (view.get('disabled')) {
                return;
            }
            e.stopPropagation();
            var el = $(e.target).closest('.select-field');
            var select = Em.View.views[el.attr('id')];
            select.showSelector();
        }
    },

    formatInputValue: function(value) {
        var self = this,
            inputValuePath = this.get('inputValuePath'),
            inputValue = '',
            content = this.get('type.content');
        if (content) {
            content.find(function(item) {
                if (self.valuesAreEqual(value, item.get('value'))) {
                    inputValue = item.get(inputValuePath);
                    return true;
                }
                return false;
            });
        }
        return inputValue;
    },

    optionsDidChange: function() {
        //Update selected value, if options changed
        this.reformatInputValue();
    }.observes('content.@each'),

    valuesAreEqual: function(a, b) {
        if (moment.isMoment(a)) {
            return a.isSame(b);
        }
        return a === b;
    },

    selectOption: function(option) {
        this.set('value', option.get('value'));
    }
});
