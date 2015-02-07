(function (CartApp) {
    "use strict";

    _.extend(CartApp.Views, {
        Cart: Backbone.View.extend({
            el: ".cart-view",
            template: "/templates/cart.html",
            checkoutTemplate: "/templates/checkout.html",
            items: null,
            loaded: null,

            events: {
                "click .remove-from-cart": "removeFromCart",
                "click .checkout-cart":    "checkoutCart",
                "click .confirm-checkout": "confirmCheckout",
                "click .confirm-invoice":  "confirmInvoice"
            },

            initialize: function () {
                var self = this,
                    dfd  = $.Deferred();

                this.loaded = dfd.promise();

                var promises = [
                    $.get(this.template).done(function (template) {
                        self.template = _.template(template);
                    }),
                    $.get(this.checkoutTemplate).done(function (template) {
                        self.checkoutTemplate = _.template(template);
                    }),
                ];

                $.when.apply(this, promises).done(function () {
                    dfd.resolve();
                });

                this.items = new CartApp.Collections.Items();

                this.items.on("add remove reset", function () {
                    self.render();
                });

                CartApp.on("cart:add", function () {
                    self.addToCart.apply(self, arguments);
                });
            },

            render: function () {
                var self = this;

                $.when(this.loaded).done(function () {
                    self.$el.html(self.template({
                        items: self.items.toJSON(),
                        total: self.items.getTotal()
                    }));
                });
            },

            addToCart: function (product) {
                var serialized = product.toJSON();

                delete serialized.id;

                this.items.add(serialized);
            },

            removeFromCart: function (e) {
                var productId = e.currentTarget.getAttribute("data-id"),
                    product   = this.items.get(productId);

                e.preventDefault();
                this.items.remove(product);
            },

            checkoutCart: function () {
                var template = this.checkoutTemplate({
                    items: this.items.toJSON(),
                    total: this.items.getTotal()
                });

                var $checkout = this.$(".modal-checkout");
                $checkout.find(".content").html(template);
                $checkout.openModal();
            },

            confirmCheckout: function () {
                var self = this,
                    $checkout = this.$(".modal-checkout"),
                    template = this.checkoutTemplate({
                        items: this.items.toJSON(),
                        total: this.items.getTotal()
                    });

                $checkout.closeModal({
                    complete: function () {
                        var $invoice = self.$(".modal-invoice");
                        $invoice.find(".content").html(template);
                        $invoice.openModal();
                    }
                });

            },

            confirmInvoice: function () {
                var self = this,
                    $invoice = this.$(".modal-invoice");

                $invoice.closeModal({
                    complete: function () {
                        self.items.reset();
                    }
                });
            }
        })
    });

})(window.CartApp);
