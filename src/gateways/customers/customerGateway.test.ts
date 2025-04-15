import {beforeEach, describe, expect, test} from "vitest";
import {customerGateway} from "./customerGateway";
import {testDbTemplate} from "../../testSupport/databaseTestSupport";

describe('customerGateway', async () => {
    const template = await testDbTemplate("customerGateway");
    const gateway = customerGateway.create(template);

    beforeEach(async () => {
       await template.clear();
    });

    test("create", async () => {
        const customer = await gateway.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        expect(customer.first_name).toEqual("John");
        expect(customer.last_name).toEqual("Doe");
        expect(customer.email).toEqual("john.doe@demo.com");
        expect(customer.phone_number).toEqual("+919876543210");
    });

    test("list", async () => {
        await template.execute("insert into customers (customer_id, first_name, last_name, email, phone_number) values ('1112', 'John', 'Woo', 'john.woo@demo.com', '+919876543210')");

        const customer = await gateway.list();
        expect(customer).toHaveLength(1);

        expect(customer[0].customer_id).toEqual(1112);
        expect(customer[0].first_name).toEqual("John");
        expect(customer[0].last_name).toEqual("Woo");
        expect(customer[0].email).toEqual("john.woo@demo.com");
        expect(customer[0].phone_number).toEqual("+919876543210");
    });

    test("listActive", async () => {
        await template.execute("insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values ('1112', 'John', 'Woo', 'john.woo@demo.com', '+919876543210', false)");
        await template.execute("insert into customers (customer_id, first_name, last_name, email, phone_number, is_active) values ('1113', 'Jenny', 'Woo', 'jenny.woo@demo.com', '+919876543210', true)");

        const customer = await gateway.listActive();
        expect(customer).toHaveLength(1);

        expect(customer[0].customer_id).toEqual(1113);
        expect(customer[0].first_name).toEqual("Jenny");
        expect(customer[0].last_name).toEqual("Woo");
        expect(customer[0].email).toEqual("jenny.woo@demo.com");
        expect(customer[0].phone_number).toEqual("+919876543210");
        expect(customer[0].is_active).toEqual(true);
    });

    test("findByEmail", async () => {
        await template.execute("insert into customers (customer_id, first_name, last_name, email, phone_number) values ('1', 'John', 'Doe', 'john.doe@demo.com', '+919876543210')");

        const customer = await gateway.findByEmail("john.doe@demo.com");

        expect(customer!.first_name).toEqual("John");
        expect(customer!.last_name).toEqual("Doe");
        expect(customer!.email).toEqual("john.doe@demo.com");
        expect(customer!.phone_number).toEqual("+919876543210");
    });

    test("find not found", async () => {
        expect(await gateway.findByEmail("no.exist@demo.com")).toBeNull();
    });

    test("findById", async () => {
        await template.execute("insert into customers (customer_id, first_name, last_name, email, phone_number) values ('1111', 'John', 'Woo', 'john.woo@demo.com', '+919876543210')");

        const customer = await gateway.findById(1111);

        expect(customer!.first_name).toEqual("John");
        expect(customer!.last_name).toEqual("Woo");
        expect(customer!.email).toEqual("john.woo@demo.com");
        expect(customer!.phone_number).toEqual("+919876543210");
    });

    test("find not found for customer id", async () => {
        expect(await gateway.findById(99999999)).toBeNull();
    });

    test("update", async () => {
        await template.execute("insert into customers (customer_id, first_name, last_name, email, phone_number) values ('1112', 'John', 'Woo', 'john.woo@demo.com', '+919876543210')");

        const customer = await gateway.update(1112, 'Johnn', 'Woo', 'john.woo@demo.com', '+919876543210', false);

        expect(customer!.first_name).toEqual("Johnn");
        expect(customer!.is_active).toEqual(false);
    });
});