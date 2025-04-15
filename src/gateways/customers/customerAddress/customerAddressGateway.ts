import {DatabaseTemplate} from "../../../databaseSupport/databaseTemplate";

export type CustomerAddress = {
    address_id: number,
    customer_id: number,
    first_name: string,
    last_name: string,
    street_1: string,
    street_2: string,
    post_code: string,
    city: string,
    state: string,
    country: string,
    phone_number: string,
    default_billing: boolean,
    default_shipping: boolean,
    created_at: Date,
    updated_at: Date
};

export type CustomerAddressGateway = {
    create: (customer_id: number, first_name: string, last_name: string, street_1: string, street_2: string, post_code: string, city: string, state: string, country: string, phone_number: string, default_billing: boolean, default_shipping: boolean) => Promise<CustomerAddress>,
    list: (customer_id: number) => Promise<CustomerAddress[]>,
    findById: (customer_id: number, address_id: number) => Promise<CustomerAddress | null>,
    update: (address_id: number, customer_id: number, first_name: string, last_name: string, street_1: string, street_2: string, post_code: string, city: string, state: string, country: string, phone_number: string, default_billing: boolean, default_shipping: boolean) => Promise<CustomerAddress | null>,
    delete: (customer_id: number, address_id: number) => Promise<void>
};

const mapCustomerAddress = (row: any): CustomerAddress => ({
    address_id: row['address_id'],
    customer_id: row['customer_id'],
    first_name: row['first_name'],
    last_name: row['last_name'],
    street_1: row['street_1'],
    street_2: row['street_2'],
    post_code: row['post_code'],
    city: row['city'],
    state: row['state'],
    country: row['country'],
    phone_number: row['phone_number'],
    default_billing: row['default_billing'],
    default_shipping: row['default_shipping'],
    created_at: new Date(row['created_at']),
    updated_at: new Date(row['updated_at']),
});

const create = (dbTemplate: DatabaseTemplate): CustomerAddressGateway => ({
    create: async (customer_id: number, first_name: string, last_name: string, street_1: string, street_2: string, post_code: string, city: string, state: string, country: string, phone_number: string, default_billing: boolean, default_shipping: boolean): Promise<CustomerAddress> =>
        dbTemplate.queryOne(
            "insert into customers_address (customer_id, first_name, last_name, street_1, street_2, post_code, city, state, country, phone_number, default_billing, default_shipping) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning address_id, customer_id, first_name, last_name, street_1, street_2, post_code, city, state, country, phone_number, default_billing, default_shipping, created_at, updated_at",
            mapCustomerAddress,
            customer_id, first_name, last_name, street_1, street_2, post_code, city, state, country, phone_number, default_billing, default_shipping
        ),
    list: async (customer_id: number): Promise<CustomerAddress[]> =>
        dbTemplate.query(
            "select address_id, customer_id, first_name, last_name, street_1, street_2, post_code, city, state, country, phone_number, default_billing, default_shipping, created_at, updated_at from customers_address where customer_id = $1 order by created_at desc",
            mapCustomerAddress,
            customer_id
        ),
    findById: async (customer_id: number, address_id: number): Promise<CustomerAddress | null> =>
        dbTemplate.queryOne(
            "select address_id, customer_id, first_name, last_name, street_1, street_2, post_code, city, state, country, phone_number, default_billing, default_shipping, created_at, updated_at from customers_address where customer_id = $1 and address_id = $2",
            row => row == undefined ? null : mapCustomerAddress(row),
            customer_id, address_id
        ),
    update: async (address_id: number, customer_id: number, first_name: string, last_name: string, street_1: string, street_2: string, post_code: string, city: string, state: string, country: string, phone_number: string, default_billing: boolean, default_shipping: boolean): Promise<CustomerAddress | null> =>
        dbTemplate.queryOne(
            "update customers_address set first_name = $3, last_name = $4, street_1 = $5, street_2 = $6, post_code = $7, city = $8, state = $9, country = $10, phone_number = $11, default_billing = $12, default_shipping = $13, updated_at = now() where address_id = $1 and customer_id = $2",
            row => row == undefined ? null : mapCustomerAddress(row),
            address_id, customer_id, first_name, last_name, street_1, street_2, post_code, city, state, country, phone_number, default_billing, default_shipping
        ),
    delete: async (customer_id: number, address_id: number): Promise<void> =>
        dbTemplate.execute(
            "delete from customers_address where customer_id = $1 and address_id = $2",
            customer_id, address_id,
        ),
});

export const customerAddressGateway = {
    create,
}