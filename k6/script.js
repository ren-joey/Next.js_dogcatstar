import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 30,
    duration: '60s'
};

export default function () {
    const loginRes = http.post('http://localhost/api/auth/login', JSON.stringify({
        username: 'root',
        password: '123456789',
    }), {
        headers: { 'Content-Type': 'application/json' },
    });

    const loginSuccess = check(loginRes, {
        'login successful': (res) => res.status === 200,
        'token received': (res) => !!res.json('token'),
    });

    const token = loginRes.json('token');

    const createOrderRes = http.post('http://localhost/api/orders/create', JSON.stringify({
        name: 'New Product',
        price: 99.99,
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const createOrderSuccess = check(createOrderRes, {
        'order created': (res) => res.status === 201,
        'order id received': (res) => !!res.json('data')._id,
    });

    if (!createOrderSuccess) {
        console.error('Order creation failed');
        return;
    }

    const orderId = createOrderRes.json('data')._id;

    const deleteOrderRes = http.del('http://localhost/api/orders/delete', JSON.stringify({
        orderId: orderId,
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    check(deleteOrderRes, {
        'order deleted': (res) => res.status === 200,
    });

    http.get('http://localhost/api/orders');

    sleep(1);
}