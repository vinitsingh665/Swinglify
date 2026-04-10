const https = require('https');
const t = 'HDFCSML250.NS';
https.get({
  hostname: 'query1.finance.yahoo.com',
  path: `/v8/finance/chart/${t}?interval=5m&range=1d`,
  headers: {'User-Agent': 'Mozilla/5.0'}
}, res => {
  let d=''; 
  res.on('data', c=>d+=c); 
  res.on('end', ()=>console.log("HDFCSML250 1D:", JSON.parse(d).chart.result?.[0]?.timestamp?.length || 'No Data'))
});
