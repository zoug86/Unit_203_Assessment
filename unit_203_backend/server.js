const express = require('express');
const app = express();
const items = require('./lineItems');

const DELIVERY_DATES = [
    {
        postal: "V",
        ids: [2],
        estimatedDeliveryDate: "Nov 24, 2021"
    },
    {
        postal: "V",
        ids: [1, 3],
        estimatedDeliveryDate: "Nov 19, 2021"
    },
    {
        postal: "M",
        ids: [2, 3],
        estimatedDeliveryDate: "Nov 22, 2021"
    },
    {
        postal: "M",
        ids: [1],
        estimatedDeliveryDate: "Dec 19, 2021"
    },
    {
        postal: "K",
        ids: [1, 2, 3],
        estimatedDeliveryDate: "Dec 24, 2021"
    },
]

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/api/lineitems', (req, res) => {
    res.status(200).json(items);
});

app.post('/api/lineitems', (req, res) => {
    const { postalCode } = req.body;
    const newDelivery = DELIVERY_DATES.filter(deliveryDate => deliveryDate.postal === postalCode);
    res.status(200).json(newDelivery);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});