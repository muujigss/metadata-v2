import { useQuery } from "@tanstack/react-query";
import {
  getOrganization,
  getOrganizationById,
} from "@/services/OrganizationService";

import { getSector } from "@/services/SectorService";
import getSources from "@/services/LibSourceService";
import getCollectionMethods from "@/services/LibCollectionMethodService";
import getFrequencies from "@/services/LibFrequencyService";
import {
  getDatabaseLocation,
  getDatabaseType,
  getLicence,
  getSpecification,
} from "@/services/DatabaseService";
import getSecurityLevels from "@/services/LibSecurityLevelService";
import { getDissimenationLevel } from "@/services/LibDissimenationLevelService";
import getUnitValue from "@/services/LibUnitValueService";
import getLibraryService from "@/services/LibLibraryService";
export const useGetSectors = () => {
  return useQuery({
    queryKey: ["fetch sector"],
    queryFn: () => getSector(),
    refetchOnWindowFocus: true,
  });
};

export const useGetOrgs = () => {
  return useQuery({
    queryKey: ["fetch org"],
    queryFn: () => getOrganization(),
    refetchOnWindowFocus: true,
  });
};

export const useGetSources = () => {
  return useQuery({
    queryKey: ["fetch sources"],
    queryFn: () => getSources(),
    refetchOnWindowFocus: true,
  });
};

export const useGetCollectionMethod = () => {
  return useQuery({
    queryKey: ["fetch CollectionMethods"],
    queryFn: () => getCollectionMethods(),
    refetchOnWindowFocus: true,
  });
};

export const useGetFrequencies = () => {
  return useQuery({
    queryKey: ["fetch Frequencies"],
    queryFn: () => getFrequencies(),
    refetchOnWindowFocus: true,
  });
};

export const useGetDbType = () => {
  return useQuery({
    queryKey: ["fetch db type"],
    queryFn: () => getDatabaseType(),
    refetchOnWindowFocus: true,
  });
};

export const useGetSpecification = () => {
  return useQuery({
    queryKey: ["fetch specification"],
    queryFn: () => getSpecification(),
    refetchOnWindowFocus: true,
  });
};

export const useGetSecurityLevels = () => {
  return useQuery({
    queryKey: ["fetch getSecurityLevels"],
    queryFn: () => getSecurityLevels(),
    refetchOnWindowFocus: true,
  });
};

export const useGetDbLocation = () => {
  return useQuery({
    queryKey: ["fetch databse location"],
    queryFn: () => getDatabaseLocation(),
    refetchOnWindowFocus: true,
  });
};

export const useGetLicence = () => {
  return useQuery({
    queryKey: ["fetch licence type"],
    queryFn: () => getLicence(),
    refetchOnWindowFocus: true,
  });
};
export const useGetDissimenationLevel = () => {
  return useQuery({
    queryKey: ["fetch dissimenation level"],
    queryFn: () => getDissimenationLevel(),
    refetchOnWindowFocus: true,
  });
};
export const useGetUnit = () => {
  return useQuery({
    queryKey: ["fetch unit"],
    queryFn: () => getUnitValue("unit"),
    refetchOnWindowFocus: true,
  });
};
export const useGetValueTypes = () => {
  return useQuery({
    queryKey: ["fetch value types"],
    queryFn: () => getLibraryService("value"),
    refetchOnWindowFocus: true,
  });
};
export const useGetUserRole = () => {
  return useQuery({
    queryKey: ["fetch user role"],
    queryFn: () => getLibraryService("userrole"),
    refetchOnWindowFocus: true,
  });
};
export const useGetUserLevel = () => {
  return useQuery({
    queryKey: ["fetch user level"],
    queryFn: () => getLibraryService("userlevel"),
    refetchOnWindowFocus: true,
  });
};

export const useGetActionType = () => {
  return useQuery({
    queryKey: ["fetch user action"],
    queryFn: () => getLibraryService("actiontype"),
    refetchOnWindowFocus: true,
  });
};

export const imageUpload = async (img_url: any) => {
  const formData = new FormData();
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;

  const apiKey: any = process.env.CLOUDINARY_API_KEY;
  const upload_preset: any = process.env.CLOUDINARY_UPLOAD_PRESET;
  formData.append("file", img_url);
  formData.append("api_key", apiKey);
  formData.append("folder", "sector-icons");
  formData.append("upload_preset", upload_preset);

  const resUpload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const resData = await resUpload.json();

  return resData.secure_url;
};

export const fileUpload = async (file: any) => {
  const formData = new FormData();
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;

  const apiKey: any = process.env.CLOUDINARY_API_KEY;
  const upload_preset: any = process.env.CLOUDINARY_UPLOAD_PRESET;
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("folder", "forms");
  formData.append("upload_preset", upload_preset);

  const resUpload = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const resData = await resUpload.json();

  return resData.secure_url;
};

export const useGetOrgInfo = (id: any) => {
  return useQuery({
    queryKey: ["fetch org" + id],
    queryFn: () => getOrganizationById(id),
    refetchOnWindowFocus: true,
  });
};
