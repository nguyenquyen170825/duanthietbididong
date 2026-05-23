// ======================================================
// CẤU HÌNH IP SERVER - CHỈ SỬA Ở ĐÂY KHI ĐỔI MẠNG WIFI
// ======================================================
export const SERVER_IP = '192.168.0.104';
export const SERVER_PORT = '8080';
export const API_BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}/api`;
export const IMAGE_BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

// Hàm sửa URL ảnh: thay localhost bằng IP thật để điện thoại load được
export const fixImageUrl = (url) => {
  if (!url) return null;
  return url
    .replace('http://localhost:8080', IMAGE_BASE_URL)
    .replace('http://127.0.0.1:8080', IMAGE_BASE_URL);
};
