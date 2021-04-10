import { combineReducers } from "redux";
import { AuthReducer } from "./auth/AuthReducer";
import { GlobalReducer } from "./global/GlobalReducer";
import { CitizenReducer } from "./citizen/CitizenReducer";
import { CallReducer } from "./calls/CallReducer";
import { TruckLogReducer } from "./truck-logs/TruckLogReducer";

export default combineReducers({
  auth: AuthReducer,
  global: GlobalReducer,
  citizen: CitizenReducer,
  calls: CallReducer,
  truckLogs: TruckLogReducer,
});