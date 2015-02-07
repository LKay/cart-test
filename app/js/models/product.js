(function (CartApp) {
    "use strict";

    _.extend(CartApp.Models, {
        Product: Backbone.Model.extend({
            toJSON: function () {
                var serialized = Backbone.Model.prototype.toJSON.apply(this, arguments);

                return _.extend(serialized, {
                    _price:  "$" + parseFloat(serialized.price).toFixed(2)
                });
            }
        }),
    });

})(window.CartApp);
