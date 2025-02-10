const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoURI='mongodb://localhost:27017/ISTuchetDB';
mongoose.connection.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
mongoose.connection.on('open', () => {
    console.log('Подключение к MongoDB успешно установлено');
});

const problemSchema = new mongoose.Schema({
    auditorium: { type: String, required: true },
    computer: { type: Number, requred: true },
    text: { type: String, requred: true},
    severity: { type: String, enum: ['red', 'yellow'], requred: true },
    createdAt: { type: Date, default: Date.now }
});

const Problem = mongoose.model('Problem', problemSchema);

const app = express();
const PORT = procces.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/problems', async (req, res) => {
    try {
        const { auditorium, computer } = req.query;
        const filter = {};
        if (auditorium) filter.auditorium = auditorium;
        if (computer) filter.computer = Number(computer);

        const problems = await Problem.find(filter).sort({ createdAt: -1});
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении проблем'});
    }
});

app.post('/problems', async (req, res) => {
    try {
        const { auditorium, computer, text, severity } = req.body;
        const newProblem = new Problem({ auditorium, computer, text, severity });
        const savedProblem = await newProblem.save();
        res.status(201).json(savedProblem);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при добавлении проблемы' });
    }
});

add.delete('/problems/:id', async (req, res) => {
    try {
        const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
        if (!deletedProblem) return res.status(404).json({ error: 'Проблема не найдена' });
        res.json({ message: 'Проблема удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении проблемы' });
    }
})

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
})

