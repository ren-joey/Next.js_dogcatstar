# How To Use

## Dependencies Preview
### System
- Nginx
- Node.js
- MongoDB

### Software
- Next.js
- cAdvisor - docker status gathering tool
- Prometheus - log integration
- Grafana - log visualization
- Grafana K6 - Stress test

## Installation
You have to install Docker for the project operations.
The requirements list below:
- For Windows
    - Docker Desktop
    - WSL
- For UNIX
    - Docker

### Start The Project
```bash
docker compose up --build -d
```

### Stress Test
```bash
cat ./k6/script.js | docker run --rm -i --network host grafana/k6 run -
```

### Update Test Script
You can append the test script from `k6/scripts.js`
```js
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
```