import {Express} from "express";
import {PlansGateway} from "./admin/plansGateway";
import bodyParser from "body-parser";

const registerHandler = (app: Express, gateway: PlansGateway) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/admin", async (req, res) => {
       res.render("admin", {query: req.query})
    });

    app.get("/admin/plans", async (req, res) => {
        const plans =  await gateway.list();
        res.render("admin/plans", {query: req.query, plans});
    });

    app.get("/admin/plans/:plan_id/edit", async (req, res) => {
        const planId = parseInt(req.params.plan_id);
        const plan = await gateway.findById(planId);

        if (plan == null) {
            res.redirect("/admin/plans?noplan=true");
        }

        res.render("admin/plans_edit", {planId: planId, plan: plan});
    });

    app.post("/admin/plans/:plan_id/update", async (req, res) => {
        const planId = parseInt(req.params.plan_id);
        await gateway.update(
            planId,
            req.body.plan_code,
            req.body.plan_title,
            req.body.frequency,
            req.body.frequency_duration,
            req.body.is_active,
            req.body.plan_description,
        );

        res.redirect("/admin/plans?success=true");
    });

    app.get("/admin/plans/create", async (req, res) => {
        res.render("admin/plans_create", {query: req.query})
    });

    app.post("/admin/plans/save", async (req, res) => {
        const duplicatePlan = await gateway.findDuplicate(req.body.frequency,  req.body.frequency_duration);
        if (duplicatePlan != null) {
            return res.redirect("/admin/plans/create?duplicateplan=true");
        }

        await gateway.create(
            req.body.plan_code,
            req.body.plan_title,
            req.body.frequency,
            req.body.frequency_duration,
            req.body.is_active,
            req.body.plan_description,
        );

        res.redirect(`/admin/plans?success=true`);
    });
}

export const plans = {
    registerHandler,
}