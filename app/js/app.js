(function (CartApp) {
    "use strict";

    var Router = Backbone.Router.extend({
        routes: {
            "": "products",
        },

        products: function () {
            _.each([
                new CartApp.Views.Cart(),
                new CartApp.Views.Products(),
            ], function (view) {
                view.render();
            });
        }
    });

    new Router();

    Backbone.history.start({
        pushState: true,
        hashChange: false
    });

})(window.CartApp);
