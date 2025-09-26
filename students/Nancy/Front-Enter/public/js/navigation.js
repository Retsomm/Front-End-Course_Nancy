import { handleGoogleLogin, loginEmailPassword, createAccount } from './auth-service.js';

// 更新導覽列函式
export const updateNavigation = (user) => {
  const profileItem = document.querySelector(".profileitem");
  const loginContainer = document.querySelector(".loginContainer");

  if (!profileItem) return;

  Object.assign(profileItem.style, {
    cursor: "pointer",
  });

  const handleProfileClick = (event) => {
    if (!user && loginContainer) {
      event.preventDefault();
      event.stopPropagation();
      loginContainer.classList.toggle("active");
    }
  };

  // 設置登入視窗的點擊外部關閉功能
  setupLoginContainerClickOutside(loginContainer, profileItem);

  // 設置登入容器內按鈕的事件監聽器（只有在存在 loginContainer 時才執行）
  if (loginContainer) {
    setupLoginContainerEvents(loginContainer);
  }

  if (user) {
    updateLoggedInNavigation(user, profileItem);
  } else {
    updateLoggedOutNavigation(profileItem);
  }

  // 重新綁定點擊事件
  rebindProfileItemEvent(profileItem, handleProfileClick);
  //觸發動畫
  profileItem.classList.add('auth-loaded');
}

// 全局變量來儲存外部點擊處理函數
let globalOutsideClickHandler = null;

// 設置登入視窗點擊外部關閉
function setupLoginContainerClickOutside(loginContainer, profileItem) {
  if (loginContainer) {
    // 移除現有的事件監聽器（避免重複綁定）
    if (globalOutsideClickHandler) {
      document.removeEventListener("click", globalOutsideClickHandler);
    }
    
    globalOutsideClickHandler = function(event) {
      const currentLoginContainer = document.querySelector(".loginContainer");
      if (
        currentLoginContainer &&
        !currentLoginContainer.contains(event.target) &&
        !profileItem.contains(event.target)
      ) {
        currentLoginContainer.classList.remove("active");
      }
    };
    
    document.addEventListener("click", globalOutsideClickHandler);
  }
}

// 更新已登入狀態的導航
function updateLoggedInNavigation(user, profileItem) {
  if (
    user.providerData.some((provider) => provider.providerId === "password")
  ) {
    // 一般登入（Email/密碼）
    setProfileItemStyle(profileItem, "./image/default.jpg");
  } else if (
    user.providerData.some((provider) => provider.providerId === "google.com")
  ) {
    // Google 登入
    setProfileItemStyle(profileItem, user.photoURL || "./default-avatar.png");
  }
}

// 更新未登入狀態的導航
function updateLoggedOutNavigation(profileItem) {
  Object.assign(profileItem.style, {
    backgroundImage: "none",
    width: "auto",
    height: "auto",
  });
  profileItem.innerHTML = "登入";
  profileItem.removeAttribute("href");
}

// 設置頭像樣式
function setProfileItemStyle(profileItem, imageUrl) {
  profileItem.innerHTML = "";
  profileItem.href = "profile.html";
  Object.assign(profileItem.style, {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "inline-block",
  });
}

// 重新綁定頭像點擊事件
function rebindProfileItemEvent(profileItem, handleProfileClick) {
  const newProfileItem = profileItem.cloneNode(true);
  profileItem.parentNode.replaceChild(newProfileItem, profileItem);
  newProfileItem.addEventListener("click", handleProfileClick);
}

// 設置登入容器內按鈕的事件監聽器
function setupLoginContainerEvents(loginContainer) {
  if (!loginContainer) return;

  // 綁定登入按鈕事件
  const loginBtn = loginContainer.querySelector(".loginIn");
  if (loginBtn) {
    // 移除現有事件監聽器
    const newLoginBtn = loginBtn.cloneNode(true);
    loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);
    
    newLoginBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await loginEmailPassword();
    });
  }

  // 綁定註冊按鈕事件
  const registerBtn = loginContainer.querySelector(".registerIn");
  if (registerBtn) {
    // 移除現有事件監聽器
    const newRegisterBtn = registerBtn.cloneNode(true);
    registerBtn.parentNode.replaceChild(newRegisterBtn, registerBtn);
    
    newRegisterBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await createAccount();
    });
  }

  // 綁定 Google 登入按鈕事件
  const googleLoginBtn = loginContainer.querySelector("#googleLoginBtn");
  if (googleLoginBtn) {
    // 移除現有事件監聽器
    const newGoogleLoginBtn = googleLoginBtn.cloneNode(true);
    googleLoginBtn.parentNode.replaceChild(newGoogleLoginBtn, googleLoginBtn);
    
    newGoogleLoginBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await handleGoogleLogin();
    });
  }

}

