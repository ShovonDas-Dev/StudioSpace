export const THEME_STORAGE_KEY = "studiospace:theme"

export const THEME_SCRIPT = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})()`
