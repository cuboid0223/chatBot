// 全域自定義的 type

interface Message {
  text: string;
  createdAt: admin.firestore.Timestamp;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}
