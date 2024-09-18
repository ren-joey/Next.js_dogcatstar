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

### Access The Service
Once all dependent container are started, you may access the service by [http://localhost](http://localhost)
|Method|API|Payload|Header|
|---|---|---|---|
|GET|{{base_url}}/orders|{}|{}|
|POST|{{base_url}}/orders/create|{"name": "test", "price": 1000}|{"Authorization" : "Bearer <JWT_TOKEN>"}|
|PUT|{{base_url}}/orders/update|{"orderId": "66e725481052fd75723c077f", "name": "test2"}|{"Authorization" : "Bearer <JWT_TOKEN>"}|
|DEL|{{base_url}}/orders/delete|{"orderId": "66e8541650c76f3b8027473f"}|{"Authorization" : "Bearer <JWT_TOKEN>"}|
|POST|{{base_url}}/auth/signup|{"username": "root", "password": "123456789"}|{}|
|GET|{{base_url}}/auth/login|{"username": "root", "password": "123456789"}|{}|

### Stress Test
```bash
cat ./k6/script.js | docker run --rm -i --network host grafana/k6 run -
```

### Stop and Remove The Container
```bash
docker compose down -v
```

### Append Your Test Script (optional)
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