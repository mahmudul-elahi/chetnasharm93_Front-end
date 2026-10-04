export const waitForCookie = (cookieName: string, maxWait = 2000): Promise<boolean> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const checkCookie = () => {
      const cookieExists = document.cookie.includes(`${cookieName}=`);
      
      if (cookieExists) {
        resolve(true);
        return;
      }
      
      if (Date.now() - startTime >= maxWait) {
        resolve(false);
        return;
      }
      
      setTimeout(checkCookie, 50);
    };
    
    checkCookie();
  });
};
