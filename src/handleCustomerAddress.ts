import {Express} from "express";
import {CustomerAddressGateway} from "./gateways/customers/customerAddress/customerAddressGateway";
import bodyParser from "body-parser";

const registerHandler = (app: Express, gateway: CustomerAddressGateway) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/customer/:customer_id/address", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        const customerAddresses = await gateway.list(customerId);

        res.render("customer/address", {query: req.query, customerId: customerId, customerAddresses: customerAddresses});
    });

    app.get("/customer/:customer_id/address/create", async (req, res) => {
        const customerId = req.params.customer_id;
        res.render("customer/address_create", {customerId: customerId});
    });

    app.post("/customer/:customer_id/address/save", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);

        await gateway.create(
            customerId,
            req.body.first_name,
            req.body.last_name,
            req.body.street_1,
            req.body.street_2,
            req.body.post_code,
            req.body.city,
            req.body.state,
            req.body.country,
            req.body.phone_number,
            req.body.default_billing,
            req.body.default_shipping,
        );

        return res.redirect(`/customer/${customerId}/address?address=save`);
    });

    app.get("/customer/:customer_id/address/:address_id", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        const addressId = parseInt(req.params.address_id);

        const addressExist = await gateway.findById(customerId, addressId);
        if (addressExist == null) {
            return res.redirect("/customer/:customer_id/address?noaddress=true");
        }

        const customerAddress = await gateway.findById(customerId, addressId);
        res.render("customer/address_edit", {customerId: customerId, addressId: addressId, customerAddress: customerAddress});
    });

    app.post("/customer/:customer_id/address/:address_id/update", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        const addressId = parseInt(req.params.address_id);

        await gateway.update(
            addressId,
            customerId,
            req.body.first_name,
            req.body.last_name,
            req.body.street_1,
            req.body.street_2,
            req.body.post_code,
            req.body.city,
            req.body.state,
            req.body.country,
            req.body.phone_number,
            req.body.default_billing,
            req.body.default_shipping,
        );

        return res.redirect(`/customer/${customerId}/address?address=save`);
    });
}

export const customerAddress = {
    registerHandler,
}