import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Пример данных (товары)
const products = [
  { id: 1, name: "Товар 1", price: 500 },
  { id: 2, name: "Товар 2", price: 1500 },
  { id: 3, name: "Товар 3", price: 2500 },
];

// Эндпоинт для получения списка товаров
app.get("/products", (req, res) => {
  res.json(products);
});

// Эндпоинт для обработки заказа
app.post("/order", async (req, res) => {
  const { items } = req.body; // Получаем список товаров из заказа

  // Формируем сообщение для Telegram
  const message = items
    .map((item) => `${item.name} - ${item.price} ₽`)
    .join("\n");

  // Укажите ваш токен бота и ID чата владельца магазина
  const botToken = "8029396925:AAGs5xNwPBe6awGpdktEsqe14j2EhngO9P8"; // Замените на токен вашего Telegram-бота
  const chatId = "5450770011"; // Замените на ID чата или пользователя

  try {
    // Отправляем сообщение в Telegram
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: `Новый заказ:\n${message}`,
    });

    // Возвращаем успешный ответ
    res.json({ success: true, message: "Заказ успешно оформлен!" });
  } catch (error) {
    // Обработка ошибок
    console.error("Ошибка отправки сообщения в Telegram:", error);
    res
      .status(500)
      .json({ success: false, error: "Ошибка отправки уведомления." });
  }
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);
