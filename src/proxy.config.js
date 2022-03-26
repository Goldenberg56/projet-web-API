var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [{
  context: ['/ISteamApps/','/ISteamNews/','/ISteamUser/','/IPlayerService/','/ISteamUserStats/'],
  target: 'https://api.steampowered.com',
  secure: false,
  "changeOrigin": true
},
{
context: ['/comment'],
  target: 'https://steamcommunity.com',
  secure: false,
  "changeOrigin": true
}
];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);