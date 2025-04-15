import {beforeEach, describe, expect, test} from "vitest";
import {ordersGateway} from "./ordersGateway";
import {testDbTemplate} from "../../testSupport/databaseTestSupport";

describe('ordersGateway', async () => {
    const template = await testDbTemplate("ordersGateway");
    const gateway = ordersGateway.create(template);

    beforeEach(async () => {
        await template.clear();
    });

    test("create", async () => {
        const result = await gateway.create(1, 1, "fsl", 1, "Created", 100, 1, 1);

        console.log(result);

        expect(result.customer_id).toEqual(1);
        expect(result.plan_id).toEqual(1);
        expect(result.sku).toEqual("fsl");
        expect(result.qty).toEqual(1);
        expect(result.order_status).toEqual("Created");
        expect(result.billing_address_id).toEqual(1);
        expect(result.shipping_address_id).toEqual(1);
    });

    test("list", async () => {
        await template.execute("insert into orders (customer_id, plan_id, sku, qty, order_status, total_amount, billing_address_id, shipping_address_id) values (1, 1, 'fsl', 1, 'Created', 100, 1, 1)");

        const result = await gateway.list();

        expect(result).toHaveLength(1);
        expect(result[0].customer_id).toEqual(1);
        expect(result[0].plan_id).toEqual(1);
        expect(result[0].sku).toEqual("fsl");
        expect(result[0].qty).toEqual(1);
        expect(result[0].order_status).toEqual("Created");
        expect(result[0].billing_address_id).toEqual(1);
        expect(result[0].shipping_address_id).toEqual(1);
    });

    test("findByCustomerId", async () => {
        await template.execute("insert into orders (customer_id, plan_id, sku, qty, order_status, total_amount, billing_address_id, shipping_address_id) values (1, 1, 'fsl', 1, 'Created', 100, 1, 1)");

        const result = await gateway.findByCustomerId(1);

        expect(result[0].customer_id).toEqual(1);
        expect(result[0].plan_id).toEqual(1);
        expect(result[0].sku).toEqual("fsl");
        expect(result[0].qty).toEqual(1);
        expect(result[0].order_status).toEqual("Created");
        expect(result[0].billing_address_id).toEqual(1);
        expect(result[0].shipping_address_id).toEqual(1);
    });

    test("findByOrderId", async () => {
        await template.execute("insert into orders (order_id, customer_id, plan_id, sku, qty, order_status, total_amount, billing_address_id, shipping_address_id) values (1, 1, 1, 'fsl', 1, 'Created', 100, 1, 1)");

        const result = await gateway.findByOrderId(1);

        expect(result!.customer_id).toEqual(1);
        expect(result!.plan_id).toEqual(1);
        expect(result!.sku).toEqual("fsl");
        expect(result!.qty).toEqual(1);
        expect(result!.order_status).toEqual("Created");
        expect(result!.billing_address_id).toEqual(1);
        expect(result!.shipping_address_id).toEqual(1);
    });

    test("no orders", async () => {
        expect(await gateway.findByOrderId(1)).toBeNull();
    });
});