import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement | null>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.current) return;

    emailjs
      .sendForm(
        "service_nvk37er", // твой Service ID
        "template_p13aggx", // твой Template ID
        form.current,
        "5L8QDD2BqEECRZRgk" // твой Public Key
      )
      .then(
        () => {
          alert("✅ Сообщение успешно отправлено!");
          form.current?.reset();
        },
        (error: any) => {
          console.error("Ошибка:", error.text);
          alert("❌ Ошибка при отправке. Попробуй снова.");
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Свяжись с нами ✉️</h2>
        <form ref={form} onSubmit={sendEmail} className="space-y-4">
          <input
            type="text"
            name="user_name"
            placeholder="Ваше имя"
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            name="user_email"
            placeholder="Ваш Email"
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            name="message"
            placeholder="Ваше сообщение..."
            required
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={5}
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-3 rounded-lg font-semibold"
          >
            Отправить 🚀
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Или напиши нам напрямую:{" "}
          <a
            href="mailto:tfotlabs@gmail.com"
            className="text-purple-400 hover:underline"
          >
            tfotlabs@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Contact;
