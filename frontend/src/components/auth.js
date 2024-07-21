/**
 * The function checks if a user is logged in by verifying the presence of a valid access token cookie
 * and a non-null user object in local storage.
 * @param cookieName - The name of the cookie that needs to be checked.
 * @returns The function `isLoggedIn` is returning a boolean value. It returns `true` if there is a
 * user object stored in the local storage and a cookie named "access-token" exists, otherwise it
 * returns `false`.
 */

function checkCookie(cookieName) {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      // Check if the cookie name matches
      if (cookie.startsWith(`${cookieName}=`)) {
        return true;
      }
      
    }
    
    return false;
  }
export default function isLoggedIn() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null && checkCookie("access-token") === true;
  }
  