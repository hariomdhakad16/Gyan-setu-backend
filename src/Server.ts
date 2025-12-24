import express from 'express';
const app = express();

app.use(express.json());


const port = process.env.PORT ;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/v1',)
app.listen(port, () => {console.log(`server started on port: http://localhost:${port}`)})