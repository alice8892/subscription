import {DatabaseTemplate} from '../../databaseSupport/databaseTemplate';

export type Orders = {
    order_id: number,
    customer_id: number,
    sku: string,
    qty: number,
    order_status: string,
    total_amount: number,
    created_at: string,
    updated_at: string,
    plan_id: number,
    frequency: string,
    billing_address_id: number,
    shipping_address_id: number,
};

export type OrderGateway = {
    create: (customer_id: number, plan_id: number, sku: string, qty: number, order_status: 'Created' | 'Pending' | 'Cancelled', total_amount: number, billing_address_id: number, shipping_address_id: number) => Promise<Orders>;
    list: () => Promise<Orders[]>;
    findByCustomerId: (customer_id: number) => Promise<Orders[]>;
    findByOrderId: (order_id: number) => Promise<Orders | null>;
    deleteAll: () => Promise<void>
}

const mapOrders = (row: any): Orders => ({
    order_id: row['order_id'],
    customer_id: row['customer_id'],
    sku: row['sku'],
    qty: row['qty'],
    order_status: row['order_status'],
    total_amount: row['total_amount'],
    created_at: row['created_at'],
    updated_at: row['updated_at'],
    plan_id: row['plan_id'],
    billing_address_id: row['billing_address_id'],
    shipping_address_id: row['shipping_address_id'],
    frequency: row['frequency']
});

const create = (dbTemplate: DatabaseTemplate): OrderGateway => ({
    create: (customer_id, plan_id, sku, qty, order_status, total_amount, billing_address_id, shipping_address_id): Promise<Orders> =>
        dbTemplate.queryOne(
            "insert into orders (customer_id, plan_id, sku, qty, order_status, total_amount, billing_address_id, shipping_address_id) values ($1, $2, $3, $4, $5, $6, $7, $8) returning order_id, customer_id, plan_id, sku, qty, order_status, total_amount, created_at, updated_at, billing_address_id, shipping_address_id",
            mapOrders,
            customer_id, plan_id, sku, qty, order_status, total_amount, billing_address_id, shipping_address_id
        ),
    list: async (): Promise<Orders[]> =>
        dbTemplate.query(
            `select order_id, o.plan_id, customer_id, sku, qty, order_status, total_amount, o.created_at, o.updated_at, billing_address_id, shipping_address_id, p.frequency
                from orders o 
                left join plans p on p.plan_id = o.plan_id
                order by order_id desc`,
            mapOrders
        ),
    findByCustomerId: async (customer_id: number): Promise<Orders[]> =>
        dbTemplate.query(
            "select order_id, plan_id, customer_id, sku, qty, order_status, total_amount, created_at, updated_at, billing_address_id, shipping_address_id from orders where customer_id = $1;",
            mapOrders,
            customer_id
        ),
    findByOrderId: async (order_id: number): Promise<Orders | null> =>
        dbTemplate.queryOne(
            "select order_id, plan_id, customer_id, sku, qty, order_status, total_amount, created_at, updated_at, billing_address_id, shipping_address_id from orders where order_id = $1",
            row => row == undefined ? null : mapOrders(row),
            order_id
        ),
    deleteAll: async (): Promise<void> =>
        dbTemplate.execute(
            "truncate table orders cascade"
        ),
});

export const ordersGateway = {
    create,
};
