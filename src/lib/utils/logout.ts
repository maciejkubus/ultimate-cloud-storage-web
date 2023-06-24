import { browser } from "$app/environment";

const logout = () => {
  if (browser) {
      localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }
};

export { logout };
