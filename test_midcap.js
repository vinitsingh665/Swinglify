const https = require('https');
https.get({
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/%5ECRSMID?interval=5m&range=1d',
  headers: {'User-Agent': 'Mozilla/5.0'}
}, res => {
  let d=''; 
  res.on('data', c=>d+=c); 
  res.on('end', ()=>console.log("CRSMID 1D:", JSON.parse(d).chart.result?.[0]?.timestamp?.length || 'No Data'))
});
https.get({
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/NIFTY_MIDCAP_100.NS?interval=5m&range=1d',
  headers: {'User-Agent': 'Mozilla/5.0'}
}, res => {
  let d=''; 
  res.on('data', c=>d+=c); 
  res.on('end', ()=>console.log("NIFTY_MIDCAP_100.NS 1D:", JSON.parse(d).chart.result?.[0]?.timestamp?.length || 'No Data'))
});
https.get({
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/HDFCMID250.NS?interval=5m&range=1d',
  headers: {'User-Agent': 'Mozilla/5.0'}
}, res => {
  let d=''; 
  res.on('data', c=>d+=c); 
  res.on('end', ()=>console.log("HDFCMID250.NS 1D:", JSON.parse(d).chart.result?.[0]?.timestamp?.length || 'No Data'))
});
https.get({
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/MIDCAP150.NS?interval=5m&range=1d',
  headers: {'User-Agent': 'Mozilla/5.0'}
}, res => {
  let d=''; 
  res.on('data', c=>d+=c); 
  res.on('end', ()=>console.log("MIDCAP150.NS 1D:", JSON.parse(d).chart.result?.[0]?.timestamp?.length || 'No Data'))
});
