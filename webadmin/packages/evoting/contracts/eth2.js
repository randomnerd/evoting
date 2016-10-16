var acc = eth.accounts.length ? eth.accounts[0] : personal.newAccount('');
personal.unlockAccount(acc, '');
eth.defaultAccount = acc;

var mining_threads = 1;

function checkWork() {
    if (eth.getBlock("pending").transactions.length > 0) {
        if (eth.mining) return;
        console.log("== Pending transactions! Mining...");
        miner.start(mining_threads);
    } else {
        if (eth.mining) miner.stop(0);  // This param means nothing
        console.log("== No transactions! Mining stopped.");
    }
}

eth.filter("latest", function(err, block) { checkWork(); });
eth.filter("pending", function(err, block) { checkWork(); });

//checkWork();
