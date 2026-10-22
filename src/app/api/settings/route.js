import {
  getSettings,
  saveSettings,
} from "@/controllers/settingsController";

export async function GET(request) {
  return getSettings(request);
}

export async function PUT(request) {
  return saveSettings(request);
}
