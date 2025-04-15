import {DatabaseTemplate} from "../../databaseSupport/databaseTemplate";
import {faker} from "@faker-js/faker";

export type Customer = {
    customer_id: number
    first_name: string
    last_name: string
    email: string
    phone_number: string,
    is_active: boolean,
    created_at: Date,
    updated_at: Date
};

export const customerInput = () => JSON.stringify({
    customer_id: 1,
    first_name: faker.string.alpha(10),
    last_name: faker.string.alpha(10),
    email: faker.string.alphanumeric(10),
    phone_number: faker.number.int(10),
    is_active: true
});

export type CustomerGateway = {
    create: (first_name: string, last_name: string, email: string, phone_number: string) => Promise<Customer>;
    list: () => Promise<Customer[]>;
    listActive: () => Promise<Customer[]>;
    findByEmail: (email: string) => Promise<Customer | null>;
    findById: (customer_id: number) => Promise<Customer | null>;
    update: (customer_id: number, first_name: string, last_name: string, email: string, phone_number: string, is_active: boolean) => Promise<Customer | null>;
};

const mapCustomer = (row: any): Customer => ({
    customer_id: row['customer_id'],
    first_name: row['first_name'],
    last_name: row['last_name'],
    email: row['email'],
    phone_number: row['phone_number'],
    is_active: row['is_active'],
    created_at: new Date(row['created_at']),
    updated_at: new Date(row['updated_at']),
});

const create = (dbTemplate: DatabaseTemplate): CustomerGateway => ({
    create: async (first_name: string, last_name: string, email: string, phone_number: string): Promise<Customer> =>
        dbTemplate.queryOne(
            "insert into customers (first_name, last_name, email, phone_number) values ($1, $2, $3, $4) returning customer_id, first_name, last_name, email, phone_number, is_active, created_at, updated_at",
            mapCustomer,
            first_name, last_name, email, phone_number
        ),
    list: async (): Promise<Customer[]> =>
        dbTemplate.query(
            "select customer_id, first_name, last_name, email, phone_number, is_active, created_at, updated_at from customers order by created_at desc;",
            mapCustomer,
        ),
    listActive: async (): Promise<Customer[]> =>
        dbTemplate.query(
            "select customer_id, first_name, last_name, email, phone_number, is_active, created_at, updated_at from customers where is_active = true order by created_at desc;",
            mapCustomer,
        ),
    findByEmail: async (email: string): Promise<Customer | null> =>
        dbTemplate.queryOne(
            "select customer_id, first_name, last_name, email, phone_number, is_active, created_at, updated_at from customers where email = $1",
            row => row == undefined ? null : mapCustomer(row),
            email
        ),
    findById: async (customer_id: number): Promise<Customer | null> =>
        dbTemplate.queryOne(
            "select customer_id, first_name, last_name, email, phone_number, is_active, created_at, updated_at from customers where customer_id = $1",
            row => row == undefined ? null : mapCustomer(row),
            customer_id
        ),
    update: async (customer_id: number, first_name: string, last_name: string, email: string, phone_number: string, is_active: boolean): Promise<Customer | null> =>
        dbTemplate.queryOne(
            "update customers set first_name = $2, last_name = $3, email = $4, phone_number = $5, is_active = $6, updated_at = now() where customer_id = $1 returning customer_id, first_name, last_name, email, phone_number, is_active, created_at, updated_at",
            row => row == undefined ? null : mapCustomer(row),
            customer_id, first_name, last_name, email, phone_number, is_active
        ),
});

export const customerGateway = {
    create,
};