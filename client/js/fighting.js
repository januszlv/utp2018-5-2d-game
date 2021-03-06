'use strict';

const canvas_fighting = document.getElementById("fighting");
const context_fighting = canvas_fighting.getContext("2d");

const bg = new Image();
bg.src = "../design/fight/fighting-back.png";

const boss_bg = new Image();
boss_bg.src = '../design/fight/boss-back.png';
//размер героя в файтинге 189х292

let battle = false;
let was_attack_bool = false;
let was_defend_bool = false;
let enemyHealth = 100;
let historyLineX = 308;
let historyLineY = 750;
let historySteps = [];

function drawFighting() {

	battle = true;
	was_attack_bool = false;
	was_defend_bool = false;
	drawFightingBg();
	hero.type = 'fight-position';
	historySteps[0] = 'Начало боя';
	historyLine();
	drawFightingEnemy();
	heroStep();

}

const canvas_history = document.getElementById("history");
const context_history = canvas_history.getContext("2d");
	
function drawFightingBg() {
	if (currentEnemy.isBoss) {
		context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
		context_fighting.drawImage(boss_bg, 0, 0);
	}
	else if (!currentEnemy.isBoss) {
		context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
		context_fighting.drawImage(bg, 0, 0);
	}
}

function historyLine() {

    context_history.fillStyle = "#ffffff";
    context_history.font = '15px Arial';
	
	context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
	context_history.clearRect(0, 0, canvas_history.width, 600);
	if ((hero.health > 0) || (enemyHealth > 0)) {
		let dy = 0;
		
		let len = historySteps.length;
		for (let i = len-1; i>=0; i--) {
			context_history.fillText(historySteps[i], historyLineX, historyLineY+dy, 344);
			dy -= 20;
		}
	}
	else {
		context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
	}
	context_history.clearRect(0, 0, canvas_history.width, 600);
}

function heroStep() {
	
	if (Math.floor(Math.random() * (120 - hero.skillLuck + 1)) + hero.skillLuck <= hero.skillLuck + 5) {
		let s = hero.name + " уклонился от удара и не получил урона.";
		historySteps.push(s);
		enemyStep();
	}
  
	if ((enemyHealth <= 0) || (hero.health <= 0)) {
		historySteps = [];
		context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
		context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
		cheakKillerQuest();
		finish();
	}
	
	else {
		let damageToHero = Math.floor(Math.random() * (currentEnemy.max - currentEnemy.min + 1)) + currentEnemy.min;
		
		if (was_attack_bool) {
			was_attack_bool = false;
			hero.health -= damageToHero;
			let s = hero.name + " получил " + damageToHero + " урона.";
			historySteps.push(s);			
			historyLine();
			enemyStep();
			console.log('прошлый ход героя был атакой, жизнь героя: ' + hero.health);
		}
		else if (was_defend_bool) {
			was_defend_bool = false;
			damageToHero -= hero.skillDefense;
			if (damageToHero > 0){
				hero.health -= damageToHero;
				let s = hero.name + " заблокировал часть атаки и получил " + damageToHero + "урона";
				historySteps.push(s);
			}
			else {
				let rebound = damageToHero/3;
				enemyHealth += rebound;
				let s = "Навык защиты героя " + hero.name + " позволил отразить удар.";
				historySteps.push(s);
				s = currentEnemy.name + " получил " + (-rebound) + " урона.";
				historySteps.push(s);
			}
			historyLine();
			enemyStep();
			console.log('прошлый ход героя был защитой, жизнь героя: ' + hero.health);
		}
	}
	
	if ((enemyHealth <= 0) || (hero.health <= 0)) {
		historySteps = [];
		context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
		context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
		cheakKillerQuest();
		finish();
	}
}

function enemyStep() {
	
	if (Math.floor(Math.random() * (120 - hero.skillLuck + 1)) + hero.skillLuck == hero.skillLuck) {
		let s = currentEnemy.name + " уклонился от удара и не получил урона";
		historySteps.push(s);
	}
	
	if ((enemyHealth <= 0) || (hero.health <= 0)) {
		historySteps = [];
		context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
		context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
		cheakKillerQuest();
		finish();
	}
	
	else {
			if (was_attack_bool) {
			let damageToEnemy = Math.floor(Math.random() * (hero.max - hero.min + 1)) + hero.min; //определение урона
			enemyHealth -= damageToEnemy;
			let s = currentEnemy.name + " получил " + damageToEnemy + " урона.";
			historySteps.push(s);
			}
			heroStep();
	}

	if ((enemyHealth <= 0) || (hero.health <= 0)) {
		historySteps = [];
		context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
		context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
		cheakKillerQuest();
		finish();
	}
	
}


function attack() {
	
	hero.type = 'attack';
	currentEnemy.type = 'defend';
	was_attack_bool = true; 
	enemyStep();
}

function defend() {
	
	hero.type = 'defend';
	was_defend_bool = true;
	enemyStep();
}

function escape() {
	hero.health /= 5;
	battle = false;
	hero.type = 'usual';
	context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
	context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
}

function finish() {
	if (enemyHealth <= 0) {
		if(currentEnemy.isBoss){
			setInterval(drawWin, 10);
		}
		else if (!currentEnemy.isBoss) {
			historySteps = [];
			context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
			context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
			hero.type = 'usual';
			currentEnemy.status = 0;
			battle = false;
			enemyHealth = 100;
			historySteps = [];
			context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
			context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
		}
	}
		
	else if (hero.health <= 0) {
		historySteps = [];
		context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
		context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
		hero.type = 'dead';
		battle = false;
		context_fighting.clearRect(0, 0, canvas_fighting.width, canvas_fighting.height);
		context_history.clearRect(0, 0, canvas_history.width, canvas_history.height);
		drawYouLose();
	}
}

let currentEnemy = {};

function curEnemy(enemy) {
	currentEnemy = enemy;
	if (currentEnemy.isBoss) {
		currentEnemy.type = 'boss';
	}
	else {
		currentEnemy.type = 'fighting-position';
	}
}

function drawEnXP() {
	let ex = 735 - enemyHealth*3;
	context_statistic.beginPath();
	context_statistic.lineWidth = 10;
	context_statistic.moveTo(ex, 555);
	context_statistic.lineTo(735, 555);
	context_statistic.strokeStyle = "blue";
	context_statistic.lineCap = "round";
	context_statistic.stroke();
	context_statistic.closePath();
}

function drawFightingEnemy() {
	if (currentEnemy.type === 'fighting-position') {
		context_fighting.drawImage(enemiesImg, 
								0, animate['enemies']['fighting-position'].sy,
								currentEnemy.FW, currentEnemy.FH, 
								currentEnemy.fightX, currentEnemy.fightY,
								currentEnemy.FW, currentEnemy.FH);
	}
	else if (currentEnemy.type === 'defend') {
		context_fighting.drawImage(enemiesImg, 
								0, animate['enemies']['fighting-position'].sy,
								currentEnemy.FW, currentEnemy.FH, 
								currentEnemy.fightX, currentEnemy.fightY,
								currentEnemy.FW, currentEnemy.FH);
	}
	else if (currentEnemy.type === 'boss') {
		context_fighting.drawImage(enemiesImg, 
								0, animate['enemies']['boss'].sy,
								currentEnemy.FW, currentEnemy.FH, 
								currentEnemy.fightX, currentEnemy.fightY,
								currentEnemy.FW, currentEnemy.FH);
	}
}

function drawWin() {
	clearInterval(intervalID);
	const winImg = new Image();
	winImg.src = '../design/fight/winImg.png';
	context_statistic.clearRect(0, 0, canvas_statistic.width, canvas_statistic.height);
	context_statistic.drawImage(winImg, 0, 0);
}

let loseFlag = false;

function drawLose() {
	clearInterval(intervalID);
	const loseImg = new Image();
	loseImg.src = '../design/fight/loseImg.png';
	context_statistic.clearRect(0, 0, canvas_statistic.width, canvas_statistic.height);
	context_statistic.drawImage(loseImg, 0, 0);
	loseFlag = true;
	
	if (loseFlag) {
		document.addEventListener("click", function () {
			if (isCursorInButtonReturn()) {
				window.open('../html/login.html', '_self');
			}
		}, false);
	}
}
