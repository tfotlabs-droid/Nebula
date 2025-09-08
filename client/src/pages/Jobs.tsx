import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Jobs: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    telegram: "",
    resume: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const vacancies = [
    {
      title: "Frontend-разработчик (React/TypeScript)",
      description:
        "Работаем над интерфейсом Nebula: анимации, адаптивность, интеграция с API.",
      requirements: [
        "Опыт работы с React и TypeScript",
        "Знание TailwindCSS или аналогов",
        "Опыт работы с REST API",
      ],
    },
    {
      title: "Backend-разработчик (Node.js)",
      description:
        "Проектирование API для трансляций, подписок и аналитики пользователей.",
      requirements: [
        "Опыт с Node.js, Express",
        "Знание баз данных (PostgreSQL, MongoDB)",
        "Опыт работы с WebSockets",
      ],
    },
    {
      title: "ML/AI инженер",
      description:
        "Нейросеть для рекомендаций матчей, анализа игр и персонализации.",
      requirements: [
        "Опыт работы с Python (PyTorch/TensorFlow)",
        "Навыки в обработке данных",
        "Понимание спортивной аналитики будет плюсом",
      ],
    },
  ];

  const openModal = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedJob(null);
    setFormData({ name: "", email: "", phone: "", telegram: "", resume: "" });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Введите имя";
    if (!formData.email.trim())
      newErrors.email = "Введите email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Некорректный email";
    if (!formData.phone.trim()) newErrors.phone = "Введите номер телефона";
    if (!formData.telegram.trim()) newErrors.telegram = "Введите Telegram";
    if (!formData.resume.trim()) newErrors.resume = "Укажите ссылку на резюме";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Заявка отправлена! 🚀");
      closeModal();
    }
  };

  return (
    <section
      id="jobs"
      className="min-h-screen pt-20 px-6 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white scroll-mt-28"
    >
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.7 }}
      >
        Вакансии <span className="text-yellow-300">Nebula</span>
      </motion.h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {vacancies.map((job, index) => (
          <motion.div
            key={index}
            className="bg-white/10 text-white p-6 rounded-2xl shadow-xl border border-white/20 hover:border-purple-300 hover:shadow-purple-500/30 transition relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-3 text-purple-200">
              {job.title}
            </h2>
            <p className="mb-4 opacity-90">{job.description}</p>
            <h3 className="font-semibold mb-2 text-yellow-300">Требования:</h3>
            <ul className="list-disc list-inside space-y-1 mb-6 text-sm opacity-90">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
                ))}
            </ul>
            <button
              onClick={() => openModal(job.title)}
              className="w-full py-2 px-4 bg-yellow-300 text-gray-900 font-semibold rounded-xl hover:brightness-95 transition"
            >
              Откликнуться
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>

              <h2 className="text-2xl font-bold mb-4">
                Отклик на вакансию:{" "}
                <span className="text-purple-600">{selectedJob}</span>
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="telegram"
                    placeholder="@Telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${
                      errors.telegram ? "border-red-500" : ""
                    }`}
                  />
                  {errors.telegram && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.telegram}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="resume"
                    placeholder="Ссылка на резюме"
                    value={formData.resume}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg ${errors.resume ? "border-red-500" : ""
                    }`}
                  />
                  {errors.resume && (
                    <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                >
                  Отправить
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Jobs;
