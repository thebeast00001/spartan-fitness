const http = require('http');

const TARGET_URL = 'http://localhost:3000';
const CONCURRENT_USERS = 10; 
const TOTAL_REQUESTS = 50;

console.log(`\n🔥 INITIATING STRESS TEST: ${CONCURRENT_USERS} CONCURRENT USERS`);
console.log(`🎯 TARGET: ${TARGET_URL}\n`);

let completed = 0;
let success = 0;
let failed = 0;
const start = Date.now();

function makeRequest(id) {
  const reqStart = Date.now();
  http.get(TARGET_URL, (res) => {
    res.on('data', () => {}); 
    res.on('end', () => {
      const duration = Date.now() - reqStart;
      completed++;
      success++;
      
      console.log(`[PASS] Request ${completed}/${TOTAL_REQUESTS} | ${duration}ms`);

      if (completed < TOTAL_REQUESTS) {
        makeRequest(completed + 1);
      } else {
        finish();
      }
    });
  }).on('error', (e) => {
    completed++;
    failed++;
    console.log(`[FAIL] Request ${completed}/${TOTAL_REQUESTS} | ${e.message}`);
    if (completed < TOTAL_REQUESTS) {
      makeRequest(completed + 1);
    } else {
      finish();
    }
  });
}

function finish() {
  if (completed < TOTAL_REQUESTS) return;
  
  const totalTime = (Date.now() - start) / 1000;
  const rps = (success / totalTime).toFixed(2);

  console.log(`\n--- TEST COMPLETE ---`);
  console.log(`⏱️ Total Time: ${totalTime}s`);
  console.log(`✅ Successful Requests: ${success}`);
  console.log(`❌ Failed Requests: ${failed}`);
  console.log(`🚀 Throughput: ${rps} requests/sec`);
  console.log(`----------------------\n`);
  
  process.exit(0);
}

for (let i = 0; i < CONCURRENT_USERS; i++) {
  makeRequest(i);
}
