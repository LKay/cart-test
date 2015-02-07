(function (CartApp) {
    "use strict";

    _.extend(CartApp.Collections, {
        Items: Backbone.Collection.extend({
            model: CartApp.Models.Product,

            _currentId: 1,

            add: function (models, options) {
                // for this app purpose only add fake id
                var self = this;

                if (models !== undefined) {
                    models = _.isArray(models) ? models : [models];
                    _.each(models, function (model) {
                        model.id = self._currentId++;
                    });
                }

                return Backbone.Collection.prototype.add.call(this, models, options);
            },

            getTotal: function () {
                var total = {
                    price: 0,
                    discount: 0,
                    discountedPrice: 0,
                };

                _.each(this.models, function (model) {
                    total.price += model.get("price");
                });

                if (total.price > 50) {
                    total.discount = total.price * 0.1;
                    total.discountedPrice = total.price - total.discount;
                }

                _.reduce(["price", "discount", "discountedPrice"], function (_p, key) {
                    total["_" + key] = "$" + parseFloat(total[key]).toFixed(2);
                }, null);

                return total;
            }
        }),
    });

})(window.CartApp);
