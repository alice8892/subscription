import {afterEach, beforeEach, describe, expect, test} from "vitest";
import {index} from "./handleIndex";
import {appServer, AppServer} from "./webSupport/appServer";

describe("handleIndex", () => {
    let server: AppServer;

    beforeEach(async () => {
        server = await appServer.start(0, index.registerHandler);
    });

    afterEach(() => {
        server.stop();
    });

    test("get /", async () => {
        const response = await fetch(`${server.address}/`);

        expect(response.status).toEqual(200);
        expect(await response.text()).toContain("Dashboard");
    });
});
