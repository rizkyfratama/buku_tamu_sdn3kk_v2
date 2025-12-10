
// Konfigurasi Aplikasi

// URL Google Apps Script untuk Backend (Spreadsheet & Drive & Email)
export const GOOGLE_SCRIPT_URL: string = "https://script.google.com/macros/s/AKfycbxPA17ZRVV7Ga8Yzgdm1qbuNAN5VuPSubAmGh2SaHs6IuzWEqO0HbmIBt7LjUi_RYl_Xw/exec"; 

// Link Folder Google Drive untuk Admin
export const DRIVE_FOLDER_LINK = "https://drive.google.com/drive/folders/1gt2NLSpQxMe57JcrnfyRDj54zEeKeRY1?usp=drive_link";

export const APP_CONFIG = {
  scriptUrl: GOOGLE_SCRIPT_URL,
  useCloudStorage: GOOGLE_SCRIPT_URL !== "" // Otomatis true karena URL sudah diisi
};
