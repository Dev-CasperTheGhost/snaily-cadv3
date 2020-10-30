import Bleet from "../../interfaces/Bleet";
import {
  GET_BLEETS,
  SET_LOADING_BLEETS,
  GET_BLEET_BY_ID,
  CREATE_BLEET,
  CREATE_BLEET_ERROR,
  UPDATE_BLEET_ERROR,
} from "../types";

const initState = {
  bleets: [],
  bleet: {},
  loading: true,
  error: null,
};

type Actions =
  | {
      type: typeof GET_BLEETS;
      bleets: Bleet[];
    }
  | {
      type: typeof SET_LOADING_BLEETS;
      loading: boolean;
    }
  | {
      type: typeof GET_BLEET_BY_ID;
      bleet: Bleet;
    }
  | {
      type: typeof CREATE_BLEET_ERROR;
      error: string;
    }
  | {
      type: typeof UPDATE_BLEET_ERROR;
      error: string;
    }
  | {
      type: typeof CREATE_BLEET;
    };

export default function bleetReducer(state = initState, action: Actions) {
  switch (action.type) {
    case "GET_BLEETS":
      return {
        ...state,
        bleets: action.bleets,
      };
    case "SET_LOADING_BLEETS":
      return {
        ...state,
        loading: action.loading,
      };
    case "GET_BLEET_BY_ID":
      return {
        ...state,
        bleet: action.bleet,
      };
    case "UPDATE_BLEET_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "CREATE_BLEET_ERROR":
      return {
        ...state,
        error: action.error,
      };
    case "CREATE_BLEET":
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
}
