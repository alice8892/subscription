import {subscriptionsGateway} from "./gateways/subscriptions/subscriptionsGateway";
import {environment} from "./environment";
import {databaseTemplate} from "./databaseSupport/databaseTemplate";
import {orderEventListener} from "./services/orderEventListener";

const {postgresUrl} = environment.fromEnv();
const dbTemplate = databaseTemplate.create(postgresUrl);
const subscriptions = subscriptionsGateway.create(dbTemplate)

orderEventListener(subscriptions).catch(error => console.log(error))
