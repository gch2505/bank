const AccountError = require("./AccountError");

class Account {
    constructor(accountNum, accountOwner, password, initMoney) {
        this.accountNum = accountNum;
        this.accountOwner = accountOwner;
        this.password = password;
        this.initMoney = initMoney;
    }

    // setter/getter
    set accountNum(accountNum) {
        this._accountNum = accountNum;
    }
    get accountNum() {
        return this._accountNum;
    }

    set accountOwner(accountOwner) {
        this._accountOwner = accountOwner;
    }
    get accountOwner() {
        return this._accountOwner;
    }

    set password(password) {
        this._password = password;
    }
    get password() {
        return this._password;
    }

    set initMoney(initMoney) {
        this._initMoney = initMoney;
    }
    get initMoney() {
        return this._initMoney;
    }

    checkPassword(pw) {
        return this.password === pw;
    }
    deposit(money) {
        return this.initMoney += money;
    }
    withdraw(money, pw) {
        // if (money > this.balance) {
        //     return -1;
        // }
        // return this.balance -= money;
        if(pw !== this.password){
            throw new AccountError(100, "비밀번호를 다시 확인해주세요.");
        }
        
        if(this.initMoney < money) {
            throw new AccountError(200, "계좌의 잔액이 부족합니다.");
        }

        return this.initMoney -= money;

    }
    getBalance() {
        return this.initMoney;
    }
    toString() {
        return `${this.accountNum} \t ${this.accountOwner} \t ${this.initMoney}`;
    }
    
    // 종료할 때 계좌정보 JSON파일로 변환
    toJSON() {
        return {
            type: 'Account',
            accountNum: this.accountNum,
            accountOwner: this.accountOwner,
            password: this.password,
            initMoney: this.initMoney
        };
    }

}


module.exports = Account;
