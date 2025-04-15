import {Express} from "express";
import {CustomerGateway} from "./gateways/customers/customerGateway";
import bodyParser from "body-parser";

const registerHandler = (app: Express, gateway: CustomerGateway) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/customer", async (req, res) => {
        res.render("customer", {query: req.query});
    });

    app.get("/customer/register", async (req, res) => {
        res.render("customer/register", {query: req.query});
    });

    app.get("/customer/:customer_id/profile", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        const customerProfile = await gateway.findById(customerId);

        res.render("customer/profile", {query: req.query, customerProfile: customerProfile});
    });

    app.get("/customer/:customer_id/profile/edit", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        const customerProfile = await gateway.findById(customerId);

        res.render("customer/profile_edit", {customerProfile: customerProfile});
    });

    app.post("/customer/:customer_id/profile/update", async (req, res) => {
        const customerId = parseInt(req.params.customer_id);
        await gateway.update(
            customerId,
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            req.body.phone_number,
            req.body.is_active
        );

        res.redirect(`/customer/${customerId}/profile?success=true`);
    });

    app.post("/customer/profile", async (req, res) => {
        const email = req.body.email;
        const customerProfile = await gateway.findByEmail(email);

        if (customerProfile == null) {
            return res.redirect("/customer?profile=false");
        }
        res.redirect(`/customer/${customerProfile.customer_id}/checkout`);
    });

    app.post("/customer/save", async (req, res) => {
        const isAccountExist = await gateway.findByEmail(req.body.email);
        if (isAccountExist != null) {
            return res.redirect("/customer/register?success=false");
        }
        await gateway.create(
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            req.body.phone_number
        );
        res.redirect("/customer?success=true");
    });
}

export const customer = {
    registerHandler,
}