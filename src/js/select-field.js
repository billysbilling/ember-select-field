var SuperField = require('ember-super-field');

module.exports = SuperField.extend({
    classNames: ['select-field'],
    
    readonly: true,
    
    allowKeyInput: false,
    
    init: function() {
        this.set('type', SuperField.types.Basic.createWithMixins({
            content: Em.computed.alias('field.content'),
            field: this
        }));
        this._super();
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
            inputValue = '',
            content = this.get('type.content');
        if (content) {
            content.find(function(item) {
                if (self.valuesAreEqual(value, item.get('value'))) {
                    inputValue = item.get('name');
                    return true;
                }
                return false;
            });
        }
        return inputValue;
    },
    
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