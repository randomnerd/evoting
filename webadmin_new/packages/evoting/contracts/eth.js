// var acc = eth.accounts.length ? eth.accounts[0] : personal.newAccount('');
// personal.unlockAccount(acc, '');
// eth.defaultAccount = acc;

//admin.addPeer('enode://');
var mining_threads = 1;
var stopTimer = null;
var startTimer = null;

function clearStopTimer() {
	if (!stopTimer) return;
	clearTimeout(stopTimer);
	stopTimer = null;
}

function setStopTimer() {
	if (stopTimer) clearStopTimer();
	stopTimer = setTimeout(stopMining.bind(this, false), 500);
}

function stopMining(delay) {
	console.log("== No transactions! Mining stopped.");
	if (!eth.mining) return;
	if (delay) return setStopTimer();
	else {
		clearStopTimer();
		miner.stop();
	}
}

function clearStartTimer() {
	if (!startTimer) return;
	clearTimeout(startTimer);
	startTimer = null;
}

function setStartTimer() {
	if (startTimer) clearStartTimer();
	startTimer = setTimeout(startMining.bind(this, false), 500);
}

function startMining(delay) {
	console.log("== Pending transactions! Mining...");
	if (eth.mining) return;
	if (delay) return setStartTimer();
	clearStartTimer();
	miner.start(mining_threads);
}

function checkWork() {
	if (eth.getBlock("pending").transactions.length) startMining(true);
	else stopMining(true);
}

eth.filter("latest", function(err, block) { checkWork(); });
eth.filter("pending", function(err, block) { checkWork(); });

checkWork();
