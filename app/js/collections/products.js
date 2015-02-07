(function (CartApp) {
    "use strict";

    _.extend(CartApp.Collections, {
        Products: Backbone.Collection.extend({
            url: "/fake-api/products",
            model: CartApp.Models.Product,

            sortField: "id",
            sortOrder: "asc",

            parse: function (response) {
                return response.products;
            },

            sortByField: function (field, order) {
                this.sortField = field || "id";
                this.sortOrder = order || "asc";

                this.sort();
            },

            comparator: function (model) {
                if (this.sortOrder === "desc") {
                    return -model.get(this.sortField);
                }

                return model.get(this.sortField);
            },

            getCategories: function () {
                var categories = [];
                _.each(this.models, function (model) {
                    categories.push(model.get("category"));
                });

                return _.uniq(categories).sort();
            }
        }),
    });

})(window.CartApp);
