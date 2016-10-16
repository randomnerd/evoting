var acc = eth.accounts.length ? eth.accounts[0] : personal.newAccount('');
personal.unlockAccount(acc, '');
eth.defaultAccount = acc;

var mining_threads = 1;

var timer = null;
function delayedMining() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(function() {
    console.log('pending');

    miner.start(1);
    admin.sleepBlocks(1);
    miner.stop();
  }, 500);
}

eth.filter("pending", delayedMining);

