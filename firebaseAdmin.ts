import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
/*
Firebase Admin SDK
您可以利用具有整合功能的 Admin SDK 編寫程式碼，以使用您的 Firebase 服務帳戶驗證多項 Firebase 功能，
例如「資料庫」、「儲存空間」和「驗證」。

在這個 project 下，用來將 OpenAI回傳的答案寫入資料庫的 message
(即不需要 建立虛擬使用者 即可將 回答寫入 firestore )
*/

// 將變為 環境變數的 JSON 變回 json
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_SECRET as string
);

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();

export { adminDb };
