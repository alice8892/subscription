import {beforeEach, describe, expect, test} from "vitest";
import {customerGateway} from "../customerGateway";
import {customerAddressGateway} from "./customerAddressGateway";
import {testDbTemplate} from "../../../testSupport/databaseTestSupport";

describe('customerAddressGateway', async () => {
    const template = await testDbTemplate("customerAddressGateway");
    const gatewayCustomer = customerGateway.create(template);
    const gatewayCustomerAddress = customerAddressGateway.create(template);

    beforeEach(async () => {
        await template.clear();
    });

    test("create", async () => {
        const customer = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        expect(customer).toBeDefined();
        expect(customer.customer_id).toBeGreaterThan(0);

        const customerAddress = await gatewayCustomerAddress.create(customer.customer_id, "John", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);

        expect(customerAddress).toBeDefined();
        expect(customerAddress.address_id).toBeGreaterThan(0);

        expect(customerAddress.customer_id).toEqual(customer.customer_id);
        expect(customerAddress.first_name).toEqual("John");
        expect(customerAddress.last_name).toEqual("Doe");
        expect(customerAddress.street_1).toEqual("129");
        expect(customerAddress.street_2).toEqual("Im Sandbüel");
        expect(customerAddress.post_code).toEqual("1702");
        expect(customerAddress.city).toEqual("Schwanden");
        expect(customerAddress.state).toEqual("Süd");
        expect(customerAddress.country).toEqual("Switzerland");
        expect(customerAddress.phone_number).toEqual("+4198765432");
        expect(customerAddress.default_billing).toEqual(false);
        expect(customerAddress.default_shipping).toEqual(false);
    });

    test("list", async () => {
        const customer = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        expect(customer).toBeDefined();
        expect(customer.customer_id).toBeGreaterThan(0);

        const customerAddressCreate = await gatewayCustomerAddress.create(customer.customer_id, "John", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);

        const customerAddress = await gatewayCustomerAddress.list(customer.customer_id);

        expect(customerAddress).toHaveLength(1);

        expect(customerAddress[0].customer_id).toEqual(customer.customer_id);
        expect(customerAddress[0].first_name).toEqual("John");
        expect(customerAddress[0].last_name).toEqual("Doe");
        expect(customerAddress[0].street_1).toEqual("129");
        expect(customerAddress[0].street_2).toEqual("Im Sandbüel");
        expect(customerAddress[0].post_code).toEqual("1702");
        expect(customerAddress[0].city).toEqual("Schwanden");
        expect(customerAddress[0].state).toEqual("Süd");
        expect(customerAddress[0].country).toEqual("Switzerland");
        expect(customerAddress[0].phone_number).toEqual("+4198765432");
        expect(customerAddress[0].default_billing).toEqual(false);
        expect(customerAddress[0].default_shipping).toEqual(false);
    });

    test("findById", async () => {
        const customer = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        expect(customer).toBeDefined();
        expect(customer.customer_id).toBeGreaterThan(0);

        const customerAddressCreate = await gatewayCustomerAddress.create(customer.customer_id, "John", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);

        expect(customerAddressCreate).toBeDefined();
        expect(customerAddressCreate.address_id).toBeGreaterThan(0);

        const customerAddress = await gatewayCustomerAddress.findById(customer.customer_id, customerAddressCreate.address_id);

        expect(customerAddress!.customer_id).toEqual(customer.customer_id);
        expect(customerAddress!.address_id).toEqual(customerAddressCreate.customer_id);
        expect(customerAddress!.first_name).toEqual("John");
        expect(customerAddress!.last_name).toEqual("Doe");
        expect(customerAddress!.street_1).toEqual("129");
        expect(customerAddress!.street_2).toEqual("Im Sandbüel");
        expect(customerAddress!.post_code).toEqual("1702");
        expect(customerAddress!.city).toEqual("Schwanden");
        expect(customerAddress!.state).toEqual("Süd");
        expect(customerAddress!.country).toEqual("Switzerland");
        expect(customerAddress!.phone_number).toEqual("+4198765432");
        expect(customerAddress!.default_billing).toEqual(false);
        expect(customerAddress!.default_shipping).toEqual(false);
    });

    test("find not found", async () => {
        expect(await gatewayCustomerAddress.findById(12232, 2323232)).toBeNull();
    });

    test("update", async () => {
        const customer = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        expect(customer).toBeDefined();
        expect(customer.customer_id).toBeGreaterThan(0);

        const customerAddressCreate = await gatewayCustomerAddress.create(customer.customer_id, "John", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);

        expect(customerAddressCreate).toBeDefined();
        expect(customerAddressCreate.address_id).toBeGreaterThan(0);

        await gatewayCustomerAddress.update(customerAddressCreate.address_id, customer.customer_id, "Jenny", "Dug", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);
        const getUpdatedAddressResponse = await gatewayCustomerAddress.findById(customer.customer_id, customerAddressCreate.address_id);

        expect(getUpdatedAddressResponse!.first_name).toEqual("Jenny");
        expect(getUpdatedAddressResponse!.last_name).toEqual("Dug");
    });

    test("delete", async () => {
        const customer = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        expect(customer).toBeDefined();
        expect(customer.customer_id).toBeGreaterThan(0);

        const customerAddressCreate = await gatewayCustomerAddress.create(customer.customer_id, "John", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);

        expect(customerAddressCreate).toBeDefined();
        expect(customerAddressCreate.address_id).toBeGreaterThan(0);

        await gatewayCustomerAddress.delete(customerAddressCreate.address_id, customer.customer_id);

        const deleteAddress = await gatewayCustomerAddress.findById(customer.customer_id, customerAddressCreate.address_id);
        expect(deleteAddress).toBeNull();
    });
});