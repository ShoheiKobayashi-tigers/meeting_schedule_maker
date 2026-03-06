// src/utils/secureStorage.ts
import CryptoJS from 'crypto-js';
import { StateStorage } from 'zustand/middleware';

let sessionPassword: string | null = null;
let forceDemoMode = false; // ★追加：強制デモモードフラグ

export const setSessionPassword = (pwd: string | null) => {
    sessionPassword = pwd;
};
export const getSessionPassword = () => sessionPassword;

// ★追加：強制的にデモモード扱いにする関数
export const setForceDemoMode = (val: boolean) => {
    forceDemoMode = val;
};

// 🌟 URLからデモモードかどうかを判定するヘルパー
// （強制フラグが立っているか、URLが /demo の場合はデモとして扱う）
const isDemoMode = () => forceDemoMode || window.location.pathname.startsWith('/demo');

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

// ==========================================
// クラウド通信用の暗号化 / 復号化ヘルパー
// ==========================================

// 鍵（secretKeyなど）を使ってデータを暗号化し、Base64文字列にして返します
export const encryptForCloud = (data: any, key: string): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// 暗号化された文字列を鍵を使って復元します
export const decryptFromCloud = (encryptedStr: string, key: string): any => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedStr, key);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    } catch (error) {
        // 暗号化されていない古いデータやパースエラーのフェイルセーフ
        return null; 
    }
};