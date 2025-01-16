import CryptoJS from "crypto-js";

// Function to get the access token from localStorage
export const getAccessToken = () => {
  const encryptedToken = localStorage.getItem("accessToken");
  if (!encryptedToken) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedToken,
      "abcdefghijklmnopqrstuvwxyz1234567890"
    );
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken ? JSON.parse(decryptedToken) : null;
  } catch (error) {

    return null;
  }
};

// Check if the user is authenticated based on the presence of a valid token
const isAuthenticated = () => {
  const token = getAccessToken();
  console.log("Token in isAuthenticated: ", token); 
  
  if (!token) {
    return false;
  }
  return true;
};



export default isAuthenticated;
