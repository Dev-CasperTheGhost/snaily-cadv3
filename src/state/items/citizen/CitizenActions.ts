import { Dispatch } from "react";
import { getErrorFromResponse, handleRequest, notify, RequestData } from "@lib/utils";
import {
  GetCitizenById,
  ICitizenWeapons,
  GetUserCitizens,
  RegisterVehicle,
  RegisterWeapon,
  ICitizenVehicles,
  UpdateCitizenLicenses,
  CreateCitizen,
} from "./CitizenTypes";
import lang from "src/language.json";
import { Citizen } from "types/Citizen";

export const getUserCitizens = (cookie?: string) => async (dispatch: Dispatch<GetUserCitizens>) => {
  try {
    const res = await handleRequest("/citizen/", "GET", {
      cookie,
    });

    dispatch({
      type: "GET_USER_CITIZENS",
      citizens: res.data.citizens,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const getCitizenById = (id: string, cookie?: string) => async (
  dispatch: Dispatch<GetCitizenById>,
) => {
  try {
    const res = await handleRequest(`/citizen/${id}`, "GET", {
      cookie,
    });

    dispatch({
      type: "GET_CITIZEN_BY_ID",
      citizen: res.data.citizen,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const getCitizenWeapons = (citizenId: string, cookie?: string) => async (
  dispatch: Dispatch<ICitizenWeapons>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}/weapons`, "GET", {
      cookie,
    });

    dispatch({
      type: "GET_CITIZEN_WEAPONS",
      weapons: res.data.weapons,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const deleteWeaponById = (citizenId: string, id: string) => async (
  dispatch: Dispatch<ICitizenWeapons>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}/weapons?weaponId=${id}`, "DELETE");

    dispatch({
      type: "DELETE_WEAPON_BY_ID",
      weapons: res.data.weapons,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const getCitizenVehicles = (citizenId: string, cookie?: string) => async (
  dispatch: Dispatch<ICitizenVehicles>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}/vehicles`, "GET", {
      cookie,
    });

    dispatch({
      type: "GET_CITIZEN_VEHICLES",
      vehicles: res.data.vehicles,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    console.log(error);
  }
};

export const deleteVehicleById = (citizenId: string, id: string) => async (
  dispatch: Dispatch<ICitizenVehicles>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}/vehicles?vehicleId=${id}`, "DELETE");

    dispatch({
      type: "DELETE_VEHICLE_BY_ID",
      vehicles: res.data.vehicles,
    });
  } catch (e) {
    const error = getErrorFromResponse(e);
    notify.error(error);
  }
};

export const updateVehicleById = (
  citizenId: string,
  vehicleId: string,
  data: RequestData,
) => async (dispatch: Dispatch<ICitizenVehicles>) => {
  try {
    const res = await handleRequest(
      `/citizen/${citizenId}/vehicles?vehicleId=${vehicleId}`,
      "PUT",
      data,
    );

    dispatch({
      type: "UPDATE_VEHICLE_BY_ID",
      vehicles: res.data.vehicles,
    });

    return notify.success(lang.citizen.vehicle.updated_veh);
  } catch (e) {
    const error = getErrorFromResponse(e);
    return notify.warn(error);
  }
};

export const registerVehicle = (data: RequestData) => async (
  dispatch: Dispatch<RegisterVehicle>,
) => {
  try {
    const res = await handleRequest(`/citizen/${data.citizenId}/vehicles`, "POST", data);

    dispatch({
      type: "REGISTER_VEHICLE",
      vehicles: res.data.vehicles,
    });

    return notify.success(lang.citizen.vehicle.added_veh);
  } catch (e) {
    const error = getErrorFromResponse(e);

    return notify.warn(error);
  }
};

export const registerWeapon = (data: RequestData) => async (dispatch: Dispatch<RegisterWeapon>) => {
  try {
    const res = await handleRequest(`/citizen/${data.citizenId}/weapons`, "POST", data);

    dispatch({
      type: "REGISTER_WEAPON",
      weapons: res.data.weapons,
    });

    return notify.success("Successfully registered weapon");
  } catch (e) {
    const error = getErrorFromResponse(e);

    return notify.warn(error);
  }
};

export const updateLicenses = (citizenId: string, data: RequestData) => async (
  dispatch: Dispatch<UpdateCitizenLicenses>,
) => {
  try {
    const res = await handleRequest(`/citizen/${citizenId}/licenses`, "PUT", data);

    dispatch({
      type: "UPDATE_CITIZEN_LICENSES",
      citizen: res.data.citizen,
    });

    return notify.success("Successfully registered weapon");
  } catch (e) {
    const error = getErrorFromResponse(e);

    return notify.warn(error);
  }
};

export const createCitizen = (data: Partial<Citizen>) => async (
  dispatch: Dispatch<CreateCitizen>,
) => {
  try {
    const fd = new FormData();

    if (data.image) {
      fd.append("image", data.image, data.image?.name);
    }

    fd.append("full_name", data.full_name!);
    fd.append("gender", data.gender!);
    fd.append("ethnicity", data.ethnicity!);
    fd.append("birth", data.birth!);
    fd.append("hair_color", data.hair_color!);
    fd.append("eye_color", data.eye_color!);
    fd.append("address", data.address!);
    fd.append("height", data.height!);
    fd.append("weight", data.weight!);
    fd.append("dmv", data.dmv!);
    fd.append("pilot_license", data.pilot_license!);
    fd.append("fire_license", data.fire_license!);
    fd.append("ccw", data.ccw!);
    fd.append("phone_nr", data.phone_nr!);

    const res = await handleRequest("/citizen", "POST", (fd as unknown) as RequestData);

    dispatch({
      type: "CREATE_CITIZEN",
    });

    return `/citizen/${res.data.citizenId}`;
  } catch (e) {
    const error = getErrorFromResponse(e);

    return notify.warn(error);
  }
};
