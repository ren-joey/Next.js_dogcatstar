These steps follow the [guides](https://grafana.com/docs/k6/latest/get-started/running-k6/).

### STEP 1: Installation
```bash
docker pull grafana/k6
```

### STEP 2: Create Script (optional)
```bash
docker run --rm -i -v ${PWD}:/app -w /app grafana/k6 init
```

### STEP 3: Run the Script
```bash
cat script.js | docker run --rm -i --network host grafana/k6 run -
```