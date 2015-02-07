(function (CartApp) {
    "use strict";

    _.extend(CartApp.Views, {
        Products: Backbone.View.extend({
            el: ".route-view",
            template: "/templates/products.html",
            loaded: null,
            currentCategory: null,
            currentMin: null,
            currentMax: null,

            events: {
                "click .add-to-cart":  "addToCart",
                "click .categories a": "filterCategory",
                "change .prices":      "filterPrices",
                "change .sort":        "sortProducts"
            },

            initialize: function () {
                var self = this,
                    dfd  = $.Deferred();

                this.loaded = dfd.promise();
                this.collection = new CartApp.Collections.Products();

                var promises = [
                    $.get(this.template, function (template) {
                        self.template = _.template(template);
                    }),
                    this.collection.fetch()
                ];

                $.when.apply(this, promises).done(function () {
                    dfd.resolve();
                });

                this.collection.on("sort", function () {
                    self.render();
                });
            },

            isSelectedPriceFilter: function (min, max) {
                return (min === Number(this.currentMin) && max === Number(this.currentMax));
            },

            isSelectedSortOrder: function (order) {
                if (_.isEmpty(order)) {
                    return this.collection.sortField === "id";
                }

                return (this.collection.sortField === "price" && order === this.collection.sortOrder);
            },

            render: function () {
                var self = this;

                $.when(this.loaded).done(function () {
                    self.$el.html(self.template({
                        products: self.collection.toJSON(),
                        categories: self.collection.getCategories(),
                        prices: [
                            { text: "All Prices",    min: null, max: null, selected: self.isSelectedPriceFilter(null, null)},
                            { text: "Less than $5",  min: null, max: 5,    selected: self.isSelectedPriceFilter(null, 5) },
                            { text: "$5 - $10",      min: 5,    max: 10,   selected: self.isSelectedPriceFilter(5, 10) },
                            { text: "$10 - $15",     min: 10,   max: 15,   selected: self.isSelectedPriceFilter(10, 15) },
                            { text: "$15 - $20",     min: 15,   max: 20,   selected: self.isSelectedPriceFilter(15, 20) },
                            { text: "More than $20", min: 20,   max: null, selected: self.isSelectedPriceFilter(20, null) }
                        ],
                        sorting: [
                            { text: "Default Sorting",   order: null,   selected: self.isSelectedSortOrder(null) },
                            { text: "Price Low to High", order: "asc",  selected: self.isSelectedSortOrder("asc") },
                            { text: "Price High to Low", order: "desc", selected: self.isSelectedSortOrder("desc") },
                        ],
                        filterCategory: self.currentCategory,
                        filterMin: self.currentMin,
                        filterMax: self.currentMax
                    }));
                });
            },

            addToCart: function (e) {
                var productId = e.currentTarget.getAttribute("data-id"),
                    product   = this.collection.get(productId);

                e.preventDefault();

                CartApp.trigger("cart:add", product);
            },

            filterCategory: function (e) {
                var category = e.currentTarget.getAttribute("data-category");

                this.currentCategory = category;
                this.render();
            },

            filterPrices: function (e) {
                var option = e.currentTarget.options[e.currentTarget.selectedIndex],
                    min    = option.getAttribute("data-min"),
                    max    = option.getAttribute("data-max");

                this.currentMin = min;
                this.currentMax = max;

                this.render();
            },

            sortProducts: function (e) {
                var order = e.currentTarget.value;

                this.collection.sortByField(_.isEmpty(order) ? "id" : "price", order);
            },
        })
    });

})(window.CartApp);
