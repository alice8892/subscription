import {Express} from "express";
import {SubscriptionsGateway} from "./gateways/subscriptions/subscriptionsGateway";
import bodyParser from "body-parser";
import {OrderGateway} from "./gateways/orders/ordersGateway";
import {OrderSchedulesGateway} from "./gateways/orderScheduler/orderSchedulesGateway";
import {ProfileOrderGateway} from "./gateways/subscriptions/profileOrders/profileOrdersGateway";

const registerHandler = (app: Express, ordersGateway: OrderGateway, subscriptionGateway: SubscriptionsGateway, orderSchedulesGateway: OrderSchedulesGateway, profileOrderGateway: ProfileOrderGateway) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/customer/:customer_id/orders", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        const orders = await ordersGateway.findByCustomerId(customerId);

        res.render("customer/orders", {customerId: customerId, orders: orders});
    });

    app.get("/admin/orders", async (_, res) => {
        const orders = await ordersGateway.list();

        res.render("admin/orders", {orders: orders});
    });

    app.post("/order/save", async (req, res) => {
        const customerId = parseInt(req.body.customer_id);
        const order = await ordersGateway.create(
            req.body.customer_id,
            req.body.plan_id,
            req.body.sku,
            req.body.qty,
            "Created",
            req.body.total_amount,
            1, //req.body.billing_address_id,
            1, //req.body.shipping_address_id
        );

        const profile = await subscriptionGateway.create(
            req.body.customer_id,
            req.body.plan_id,
            'active',
            new Date(order.created_at),
            null,
            JSON.parse(JSON.stringify(order)),
            new Date(order.created_at)
        );

        await profileOrderGateway.create(profile.profile_id, order.order_id);

        res.redirect(`/admin/orders?success=true`);
    });

    app.get("/customer/:customer_id/orders", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        const orders = await ordersGateway.findByCustomerId(customerId);

        res.render("customer/orders", {query: req.query, customerId: customerId, orders: orders});
    });

    app.post("/order/:schedule_id/create", async (req, res) => {
        const scheduleId = parseInt(req.params.schedule_id);
        const orderSchedule = await orderSchedulesGateway.getById(scheduleId);
        const subscriptionProfile = await subscriptionGateway.findById(orderSchedule.profile_id)
        if(subscriptionProfile?.profile_id){
            const order = await subscriptionGateway.createOrder(ordersGateway, subscriptionProfile);
            await profileOrderGateway.create(orderSchedule.profile_id, order.order_id);
            await subscriptionGateway.updateLastOrderDate(orderSchedule.profile_id, new Date(order.created_at));
            await orderSchedulesGateway.update(scheduleId, "Completed", new Date(order.created_at));
        }
        res.redirect(`/orders/order_schedule?success=true`);
    });

    app.post("/admin/orders/delete", async (req, res) => {
        await ordersGateway.deleteAll();
        const orders = await ordersGateway.list();
        res.render("admin/orders", {orders: orders});
    });
};

export const orders = {
    registerHandler,
};