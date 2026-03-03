// src/utils/secureStorage.ts
import CryptoJS from 'crypto-js';
import { StateStorage } from 'zustand/middleware';

let sessionPassword: string | null = null;

export const setSessionPassword = (pwd: string | null) => {
    sessionPassword = pwd;
};
export const getSessionPassword = () => sessionPassword;

// 🌟 URLからデモモードかどうかを判定するヘルパー
const isDemoMode = () => window.location.pathname.startsWith('/demo');

export const secureStorage: StateStorage = {
    setItem: (name, value) => {
        const demo = isDemoMode();
        const actualName = demo ? `${name}-demo` : name;
        const pwd = demo ? 'demo-mode' : sessionPassword;

        if (!pwd) return; 
        
        const encryptedValue = CryptoJS.AES.encrypt(value, pwd).toString();
        localStorage.setItem(actualName, encryptedValue);
    },
    
    getItem: (name) => {
        const demo = isDemoMode();
        const actualName = demo ? `${name}-demo` : name;
        const pwd = demo ? 'demo-mode' : sessionPassword;

        const encryptedValue = localStorage.getItem(actualName);
        if (!encryptedValue || !pwd) return null;

        try {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, pwd);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            
            if (!decryptedString) throw new Error('復号化に失敗しました');
            return decryptedString;
        } catch (error) {
            console.error("データ破損またはパスワードエラー:", error);
            return null; 
        }
    },
    
    removeItem: (name) => {
        const actualName = isDemoMode() ? `${name}-demo` : name;
        localStorage.removeItem(actualName);
    },
};