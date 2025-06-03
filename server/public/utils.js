export const checkDevTool=()=>{
    let isDevTool=false

    function detectDevToolsBySize() {
        const threshold = 160;
        return (
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold
        );
      }
      
        if (detectDevToolsBySize()) {
          console.warn("DevTools is likely open (by size check)");
          isDevTool=true
        }
      

      return isDevTool

}


export async function detectIncognitoMode() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  
    // Test FileSystem API (Chrome)
    const fsCheck = () => new Promise((resolve) => {
      const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
      if (!fs) return resolve(false); // Not Chrome
      fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
    });
  
    // Test storage quota (most browsers)
    const quotaCheck = async () => {
      if (navigator.storage && navigator.storage.estimate) {
        const { quota } = await navigator.storage.estimate();
        return quota && quota < 1200000000; // under 120MB is suspect
      }
      return false;
    };
  
    // Test Safari IndexedDB
    const safariCheck = () => {
      try {
        window.openDatabase(null, null, null, null);
        return false;
      } catch (_) {
        return isSafari;
      }
    };
  
    const [isFs, isQuota] = await Promise.all([fsCheck(), quotaCheck()]);
    return isFs || isQuota || safariCheck();
  }
  
  detectIncognitoMode().then(isIncog => {
    return isIncog
  });
  