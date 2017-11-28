module.exports = function calculateProfit(capital, prices) {
  
  function eb(capital, prices) {
    const bitcoin = capital / prices.BTCUSD;
    const ether = bitcoin / prices.ETHBTC;
    const profit = ether * prices.ETHUSD;
    return profit - capital;
  }
  
  function be(capital, prices) {
    const ether = capital / prices.ETHUSD;
    const bitcoin = ether * prices.ETHBTC;
    const profit = bitcoin * prices.BTCUSD;
    return profit - capital;
  }
  
  const bThenE = be(capital, prices);
  const eThenB = eb(capital, prices);
  
  const greater = bThenE > eThenB ? bThenE : eThenB;
  const method = bThenE > eThenB ? 'USD => BTC => ETH => USD' : 'USD => ETH => BTC => USD';
  
  const average = capital + greater / 2;
  const fees = average * 3 * 0.001;
  
  const result = greater - fees;
  
  return [result, method];
};