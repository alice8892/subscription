import {appServer} from "./webSupport/appServer";
import {configureApp} from "./appConfig";
import {environment} from "./environment";

appServer.start(3000, configureApp(environment.fromEnv()));
