import {DatabaseTemplate} from "../databaseSupport/databaseTemplate";

export type CollectionRun = {
    id: string
    feedsCollected: number
    articlesCollected: number
    runAt: Date
}

export type CollectionRunsGateway = {
    create: (feedsCollected: number, articlesCollected: number) => Promise<CollectionRun>
    list: () => Promise<CollectionRun[]>
}

const mapRow = (row: any): CollectionRun => ({
    id: row["id"],
    feedsCollected: Number.parseInt(row["feeds_collected"]),
    articlesCollected: Number.parseInt(row["articles_collected"]),
    runAt: new Date(row["run_at"]),
});

const create = (dbTemplate: DatabaseTemplate): CollectionRunsGateway => ({
    create: async (feedsCollected: number, articlesCollected: number): Promise<CollectionRun> =>
        dbTemplate.queryOne(
            "insert into collection_runs (feeds_collected, articles_collected) values ($1, $2) returning id, feeds_collected, articles_collected, run_at",
            mapRow, feedsCollected, articlesCollected),
    list: async (): Promise<CollectionRun[]> =>
        dbTemplate.query(
            "select id, feeds_collected, articles_collected, run_at from collection_runs order by run_at desc",
            mapRow,
        ),
});

export const collectionRunsGateway = {
    create,
};
