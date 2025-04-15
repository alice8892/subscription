import {Express} from "express";
import {OrderSchedulesGateway} from "./gateways/orderScheduler/orderSchedulesGateway";

const registerHandler = (app: Express, gateway: OrderSchedulesGateway) => {

    app.get('/orders/order_schedule', async (req, res) => {
        const result = await gateway.list();
        res.render("orders/order_schedule", {result});
    });
};

export const orderschedule = {
    registerHandler,
};