import {afterEach, beforeEach, describe, expect, test} from "vitest";
import {customer} from "./handleCustomer";
import {appServer, AppServer} from "./webSupport/appServer";
import {testDbTemplate} from "./testSupport/databaseTestSupport";
import {customerGateway} from "./gateways/customers/customerGateway";

describe("handleCustomer", async () => {
    let server: AppServer;
    const template = await testDbTemplate("handleCustomer");
    const gateway = customerGateway.create(template);

    beforeEach(async () => {
        await template.clear();
        server = await appServer.start(0, app => {
            customer.registerHandler(app, gateway);
        });
    });

    afterEach(() => {
        server.stop();
    });

    test("get /customer", async () => {
        const response = await fetch(`${server.address}/customer`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Please enter your email to login!");
        expect(textBody).toContain("Don't have an account?");
    });

    test("get /customer", async () => {
        const response = await fetch(`${server.address}/customer?success=true`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("successfully");
    });

    test("get /customer", async () => {
        const response = await fetch(`${server.address}/customer?profile=false`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Profile with email id does not exist!");
    });

    test("get /customer/register", async () => {
        const response = await fetch(`${server.address}/customer/register`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Register");
    });

    test("get /customer/register", async () => {
        const response = await fetch(`${server.address}/customer/register?success=false`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Customer with same email already exist!");
    });

    test("get /customer/:customer_id/profile", async () => {
        const customerCreate = await gateway.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        const response = await fetch(`${server.address}/customer/${customerCreate.customer_id}}/profile`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("My Addresses");
        expect(textBody).toContain("My Orders");
        expect(textBody).toContain("My Subscriptions");
        expect(textBody).toContain("john.doe@demo.com");
    });

    test("get /customer/:customer_id/profile/edit", async () => {
        const customerCreate = await gateway.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        const response = await fetch(`${server.address}/customer/${customerCreate.customer_id}}/profile/edit`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        });

        const textBody = await response.text();
        expect(textBody).toContain("Edit profile");
    });

    test("post /customer/:customer_id/profile/update", async () => {
        await template.execute("insert into customers (customer_id, first_name, last_name, email, phone_number) values ('1111', 'John', 'Woo', 'john.woo@demo.com', '+919876543210')");

        const response = await fetch(`${server.address}/customer/1111/profile/update`, {
            method: "post",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "first_name=Jenny&last_name=Dug&email=jenny.dug@demo.com&phone_number=+919876543210",
            redirect: "manual"
        });

        expect(response.headers.get("location")).toBe(`/customer/1111/profile?success=true`);

        const redirectResponse = await fetch(`${server.address}/customer/1111/profile?success=true`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        })

        const textBody = await redirectResponse.text();
        expect(textBody).toContain("Welcome");
        expect(textBody).toContain("Customer profile saved successfully!");
        expect(textBody).toContain("Jenny");
        expect(textBody).toContain("Dug");
        expect(textBody).toContain("jenny.dug@demo.com");
        expect(textBody).toContain("919876543210");
    });

    test("post /customer/profile", async () => {

    });

    test("post /customer/profile", async () => {

    });

    test("post /customer/save", async () => {
        await gateway.create("John", "Doe", "john.doe@demo.com", "+919876543210");

        const response = await fetch(`${server.address}/customer/save`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "first_name=John&last_name=Doe&email=john.doe@demo.com&phone_number=+919876543210",
            redirect: "manual"
        });

        expect(response.headers.get("location")).toBe("/customer/register?success=false");

        const redirectResponse = await fetch(`${server.address}/customer/register?success=false`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        })

        const textBody = await redirectResponse.text();
        expect(textBody).toContain("Customer with same email already exist!");
        expect(textBody).toContain("Register");
    });

    test("post /customer/save", async () => {

        const response = await fetch(`${server.address}/customer/save`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: "first_name=John&last_name=Doe&email=john.doe@demo.com&phone_number=+919876543210",
            redirect: "manual"
        });

        expect(response.headers.get("location")).toBe("/customer?success=true");

        const redirectResponse = await fetch(`${server.address}/customer?success=true`, {
            method: "GET",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        })

        const textBody = await redirectResponse.text();
        expect(textBody).toContain("Customer profile saved successfully!");
        expect(textBody).toContain("Please enter your email to login!");
    });
});

