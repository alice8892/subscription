import {afterEach, beforeEach, describe, expect, test} from "vitest";
import {databaseUrl, testDbTemplate} from "./testSupport/databaseTestSupport";
import {appServer, AppServer} from "./webSupport/appServer";
import {configureApp} from "./appConfig";

describe("collection and analysis", async () => {
    let webAppServer: AppServer;
    const template = await testDbTemplate("integration");

    beforeEach(async () => {
        await template.clear();

        webAppServer = await appServer.start(0, configureApp({
            postgresUrl: databaseUrl(`capstone_starter_test_integration`),
        }));
    });

    afterEach(() => {
        webAppServer.stop();
    });

    test("everything working together", async () => {
        const healthResponse = await fetch(`${webAppServer.address}/health`);
        expect(healthResponse.status).toEqual(200);
    });
});
