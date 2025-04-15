import {DatabaseTemplate} from "../../../databaseSupport/databaseTemplate";

export type ProfileOrder = {
    profile_id: number,
    order_id: number,
};

export type ProfileOrderGateway = {
    create: (profile_id: number, order_id: number) => Promise<ProfileOrder>
    list: () => Promise<ProfileOrder[]>
    findByProfileId: (profile_id: number) => Promise<ProfileOrder[]>
    findByOrderId: (order_id: number) => Promise<ProfileOrder[]>
}

const mapProfileOrders = (row: any): ProfileOrder => ({
    profile_id: row['profile_id'],
    order_id: row['order_id']
});

const create = (dbTemplate: DatabaseTemplate): ProfileOrderGateway => ({
    create: (profile_id, order_id) =>
        dbTemplate.queryOne(
            "insert into subscription_profile_orders (profile_id, order_id) values ($1, $2) returning profile_id, order_id",
            mapProfileOrders,
            profile_id, order_id
        ),

    list: () =>
        dbTemplate.query(
            "select profile_id, order_id from subscription_profile_orders",
            mapProfileOrders
        ),

    findByProfileId: (profile_id) =>
        dbTemplate.query(
            "select profile_id, order_id from subscription_profile_orders where profile_id = $1",
            mapProfileOrders,
            profile_id
        ),


    findByOrderId: (order_id): Promise<ProfileOrder[]> =>
        dbTemplate.query(
            "select profile_id, order_id from subscription_profile_orders where order_id = $1",
            mapProfileOrders,
            order_id
        ),
});

export const profileOrderGateway = {
    create,
};