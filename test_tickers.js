const https = require('https');

const test = (t) => {
  return new Promise((resolve) => {
    https.get({
      hostname: 'query1.finance.yahoo.com',
      path: `/v8/finance/chart/${encodeURIComponent(t)}?interval=1d&range=1y`,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if(j.chart.error) console.log(t + ' ERROR: ' + j.chart.error.code);
          else console.log(t + ' SUCCESS. Points: ' + j.chart.result[0].timestamp.length);
        } catch(e) { console.log(t + " parsing failed (HTTP " + res.statusCode + ")"); }
        resolve();
      });
    }).on('error', (err) => {
      console.log(t + " network error: " + err.message);
      resolve();
    });
  });
};

const run = async () => {
  await test('HDFCSML250.NS'); // Smallcap 250 Proxy
  await test('MOTILALOFS.NS'); 
};
run();
