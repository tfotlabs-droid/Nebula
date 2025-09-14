import React, { useEffect, useState } from "react";

const TestApi: React.FC = () => {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setMsg("✅ API работает"))
      .catch((err) => setMsg("❌ Ошибка подключения"));
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl">Проверка связи фронт ↔ бэк</h2>
      <p>{msg}</p>
    </div>
  );
};

export default TestApi;