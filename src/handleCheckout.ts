import {Express} from "express";
import {PlansGateway} from "./admin/plansGateway";
import {OrderGateway} from "./gateways/orders/ordersGateway";
import bodyParser from "body-parser";

const registerHandler = (app: Express, gatewayPlans: PlansGateway, gatewayOrder: OrderGateway) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/customer/:customer_id/checkout', async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        const plans = await gatewayPlans.listActive();

        res.render('customer/checkout', {customerId: customerId, plans: plans});
    });

    app.post('/customer/:customer_id/order/create', async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        await gatewayOrder.create(
            customerId,
            req.body.plan_id,
            req.body.sku,
            req.body.qty,
            "Created",
            req.body.total_amount,
            1,
            1
        );

        res.redirect(`/admin/orders`);
    });
};

export const checkout = {
    registerHandler,
};