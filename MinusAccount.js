const Account = require("./Account");

// 마이너스 계좌
class MinusAccount extends Account {
  constructor(accountNum, accountOwner, password, initMoney, rentMoney) {
    super(accountNum, accountOwner, password, initMoney);
    this.rentMoney = rentMoney;
  }

  set rentMoney(rentMoney) {
    this._rentMoney = rentMoney;
  }
  get rentMoney() {
    return this._rentMoney;
  }

  toString() {
    return super.toString() + ` \t\t${this.rentMoney}`;
  }
  getBalance() {
    return super.getBalance() - this.rentMoney;
  }

  // 종료할 때 계좌정보 JSON파일로 변환
  toJSON() {
    return {
      type: "MinusAccount",
      accountNum: this.accountNum,
      accountOwner: this.accountOwner,
      password: this.password,
      initMoney: this.initMoney,
      rentMoney: this.rentMoney,
    };
  }
}

module.exports = MinusAccount;
