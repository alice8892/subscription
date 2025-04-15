import {DatabaseTemplate} from '../../databaseSupport/databaseTemplate';
import {faker} from "@faker-js/faker";
import {OrderGateway, Orders} from "../orders/ordersGateway";

export type OrderDetail = {
    order_id: number,
    sku: string,
    qty: number,
    total_amount: number,
    billing_address_id: number,
    shipping_address_id: number
};

export type Subscriptions = {
    profile_id: number,
    customer_id: number,
    plan_id: number,
    status: string,
    start_date: string,
    end_date: string,
    created_at: Date,
    updated_at: Date,
    last_order_date: Date,
    order_details: OrderDetail,
    frequency: string
};

export const orderDetails = () => JSON.stringify({
    order_id: faker.number.int(),
    sku: faker.string.alphanumeric(5),
    qty: 1,
    total_amount: faker.commerce.price(),
    billing_address_id: faker.number.int({ min: 1, max: 9999 }),
    shipping_address_id: faker.number.int({ min: 1, max: 9999 })
});

export type SubscriptionsGateway = {
    create: (customer_id: number, plan_id: number, status: 'active' | 'inactive' | 'cancelled', start_date: Date, end_date: Date | null, order_details: JSON | null, last_order_date: Date | null) => Promise<Subscriptions>
    findById: (profile_id: number) => Promise<Subscriptions | null>
    list: () => Promise<Subscriptions[]>
    findByCustomerId: (customer_id: number) => Promise<Subscriptions[]>
    update: (profile_id: number, customer_id: number, plan_id: number, status: string, start_date: string, end_date: string) => Promise<Subscriptions>
    fetchPendingSubscriptions: () => Promise<Subscriptions[]>
    updateLastOrderDate: (profile_id: number, last_order_date: Date) => Promise<Subscriptions>
    createOrder: (ordersGateway: OrderGateway, subscription: Subscriptions) => Promise<Orders>
    deleteAll: () => Promise<void>
}

const mapSubscriptions = (row: any): Subscriptions => ({
    profile_id: row['profile_id'],
    customer_id: row['customer_id'],
    plan_id: row['plan_id'],
    status: row['status'],
    start_date: row['start_date'],
    end_date: row['end_date'],
    created_at: row['created_at'],
    updated_at: row['updated_at'],
    last_order_date: row['last_order_date'],
    order_details: row['order_details'],
    frequency: row['frequency']
});

const create = (dbTemplate: DatabaseTemplate): SubscriptionsGateway => ({
    create: (customer_id, plan_id, status, start_date, end_date, order_details, last_order_date): Promise<Subscriptions> =>
        dbTemplate.queryOne(
            "insert into subscription_profiles (customer_id, plan_id, status, start_date, end_date, order_details, last_order_date) values ($1, $2, $3, $4, $5, $6, $7) returning profile_id, customer_id, plan_id, status, start_date, end_date, last_order_date, created_at, updated_at, order_details",
            mapSubscriptions,
            customer_id, plan_id, status, start_date, end_date, order_details, last_order_date),

    list: (): Promise<Subscriptions[]> =>
        dbTemplate.query(
            `select profile_id, customer_id, sp.plan_id, status, start_date, end_date, sp.created_at, sp.updated_at, order_details, p.frequency
                from subscription_profiles sp
                left join plans p on p.plan_id = sp.plan_id
                order by profile_id desc`,
            mapSubscriptions
        ),

    findById: (profile_id): Promise<Subscriptions | null> =>
        dbTemplate.queryOne(
            "select profile_id, customer_id, plan_id, status, start_date, end_date, created_at, updated_at, last_order_date, order_details from subscription_profiles where profile_id = $1",
             mapSubscriptions,
            profile_id
        ),


    findByCustomerId: (customer_id): Promise<Subscriptions[]> =>
        dbTemplate.query(
            "select profile_id, customer_id, plan_id, status, start_date, end_date, created_at, updated_at, last_order_date, order_details from subscription_profiles where customer_id = $1",
            mapSubscriptions,
            customer_id
        ),

    update: (profile_id, customer_id, plan_id, status, start_date, end_date): Promise<Subscriptions> =>
        dbTemplate.queryOne(
            "update subscription_profiles set customer_id = $2, plan_id = $3, status = $4, start_date = $5, end_date = $6 where profile_id = $1",
            mapSubscriptions,
            profile_id, customer_id, plan_id, status, start_date, end_date
        ),

    fetchPendingSubscriptions: (): Promise<Subscriptions[]> =>
        dbTemplate.query(
            "select profile_id, customer_id, plan_id, status, start_date, end_date, created_at, updated_at, last_order_date, order_details from subscription_profiles where status = $1",
            mapSubscriptions,
            "active"
        ),
    updateLastOrderDate: (profile_id, last_order_date): Promise<Subscriptions> =>
        dbTemplate.queryOne(
            "update subscription_profiles set last_order_date = $2 where profile_id = $1 returning profile_id, customer_id, plan_id, status, start_date, end_date, created_at, updated_at, last_order_date",
            mapSubscriptions,
            profile_id, last_order_date
        ),

    createOrder: async function (ordersGateway: OrderGateway, subscription: Subscriptions) : Promise<Orders>  {
        const orderD = subscription.order_details;
        const order = await ordersGateway.create(
            subscription.customer_id,
            subscription.plan_id,
            orderD.sku,
            orderD.qty,
            "Created",
            orderD.total_amount,
            orderD.billing_address_id,
            orderD.shipping_address_id
        );
        return order;
    },

    deleteAll: async (): Promise<void> =>
        dbTemplate.execute(
            "truncate table subscription_profiles cascade"
        ),
});

export const subscriptionsGateway = {
    create,
};