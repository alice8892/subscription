import {afterEach, beforeEach, describe, expect, test} from "vitest";
import {appServer, AppServer} from "./webSupport/appServer";
import {testDbTemplate} from "./testSupport/databaseTestSupport";
import {customerAddress} from "./handleCustomerAddress";
import {customerAddressGateway} from "./gateways/customers/customerAddress/customerAddressGateway";
import {customer} from "./handleCustomer";
import {customerGateway} from "./gateways/customers/customerGateway";

describe("handleCustomerAddress", async () => {
    let server: AppServer;
    const template = await testDbTemplate("handleCustomerAddress");
    const gatewayCustomerAddress = customerAddressGateway.create(template);
    const gatewayCustomer = customerGateway.create(template);

    beforeEach(async () => {
        await template.clear();
        server = await appServer.start(0, app => {
            customer.registerHandler(app, gatewayCustomer);
            customerAddress.registerHandler(app, gatewayCustomerAddress);
        });
    });

    afterEach(() => {
        server.stop();
    });

    test("get /customer/:customer_id/address", async () => {
        const customerCreate = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        await gatewayCustomerAddress.create(customerCreate.customer_id, "John", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);
        await gatewayCustomerAddress.create(customerCreate.customer_id, "Johnny", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);
        await gatewayCustomerAddress.create(customerCreate.customer_id, "Jenny", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);

        const response = await fetch(`${server.address}/customer/${customerCreate.customer_id}/address`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("My Addresses");
        expect(textBody).toContain("John");
        expect(textBody).toContain("Johnny");
        expect(textBody).toContain("Jenny");
    });

    test("get /customer/:customer_id/address no address", async () => {
        const customerCreate = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        const response = await fetch(`${server.address}/customer/${customerCreate.customer_id}/address`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("My Addresses");
        expect(textBody).toContain("No addresses found.");
    });

    test("get /customer/:customer_id/address/create", async () => {
        const customerCreate = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        const response = await fetch(`${server.address}/customer/${customerCreate.customer_id}/address/create`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Create address");
    });

    test("post /customer/:customer_id/address/save", async () => {
        const customerCreate = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        const response = await fetch(`${server.address}/customer/${customerCreate.customer_id}/address/save`, {
            "method": "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "first_name=Jenny&last_name=Dug&street_1=129&street_2=Im Sandbüel&post_code=1703&city=Schwanden&state=Süd&country=Switzerland&phone_number=+4198765432&default_shipping=0&default_billing=0",
        });

        const textBody = await response.text();
        expect(textBody).toContain("Address has been successfully saved!");
        expect(textBody).toContain("My Addresses");
        expect(textBody).toContain("Jenny");
        expect(textBody).toContain("Dug");
    });

    test("get /customer/:customer_id/address/:address_id", async () => {
        const customerCreate = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");
        const customerAddressCreate = await gatewayCustomerAddress.create(customerCreate.customer_id, "John", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);

        const response = await fetch(`${server.address}/customer/${customerCreate.customer_id}/address/${customerAddressCreate.address_id}`, {
            "method": "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Edit address");
        expect(textBody).toContain("John");
        expect(textBody).toContain("Doe");
        expect(textBody).toContain("Save");
        expect(textBody).toContain("Cancel");
    });

    test("post /customer/:customer_id/address/:address_id/update", async () => {
        const customerCreate = await gatewayCustomer.create("John", "Doe", "john.doe@demo.com", "+919876543210");
        const customerAddressCreate = await gatewayCustomerAddress.create(customerCreate.customer_id, "John", "Doe", "129", "Im Sandbüel", "1702", "Schwanden", "Süd", "Switzerland", "+4198765432", false, false);

        const response = await fetch(`${server.address}/customer/${customerCreate.customer_id}/address/${customerAddressCreate.address_id}/update`, {
            "method": "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "first_name=John&last_name=Doe&street_1=129&street_2=Im Sandbüel&post_code=1703&city=Schwanden&state=Süd&country=Switzerland&phone_number=+4198765432&default_shipping=0&default_billing=0",
        });

        const textBody = await response.text();
        expect(textBody).toContain("Address has been successfully saved!");
        expect(textBody).toContain("My Addresses");
        expect(textBody).toContain("1703");
    });
});

