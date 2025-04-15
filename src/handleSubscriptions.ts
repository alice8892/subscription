import {Express} from "express";
import {SubscriptionsGateway} from "./gateways/subscriptions/subscriptionsGateway";
import bodyParser from "body-parser";

const registerHandler = (app: Express, subscriptionGateway: SubscriptionsGateway) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/customer/:customer_id/subscriptions", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        const subscriptions = await subscriptionGateway.findByCustomerId(customerId);

        res.render("customer/subscriptions", {customerId: customerId, subscriptions: subscriptions});
    });

    app.get("/admin/subscriptions", async (_, res) => {

        const subscriptions = await subscriptionGateway.list();
        res.render("admin/subscriptions", {subscriptions: subscriptions});
    })

    app.post("/admin/subscriptions/delete", async (_, res) => {
        await subscriptionGateway.deleteAll();
        const subscriptions = await subscriptionGateway.list();
        res.render("admin/subscriptions", {subscriptions: subscriptions});
    })

};

export const subscriptions = {
    registerHandler,
};