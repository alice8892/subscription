import {Express} from "express";
import {DatabaseTemplate} from "./databaseSupport/databaseTemplate";

const checkDb = async (dbTemplate: DatabaseTemplate): Promise<boolean> => {
    try {
        return await dbTemplate.queryOne("select true as success", (result): boolean => result["success"]);
    } catch (e) {
        return false;
    }
};

const registerHandler = (app: Express, dbTemplate: DatabaseTemplate) => {
    app.get("/health", async (req, res) => {
            const success = await checkDb(dbTemplate);
            if (success) {
                res.json({
                    status: "UP",
                    database: "UP",
                });
            } else {
                res.json({
                    status: "DOWN",
                    database: "DOWN",
                });
            }

        },
    );
};

export const health = {
    registerHandler,
};
