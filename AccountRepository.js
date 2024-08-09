/**
 * 계좌 관리 객체
 */
const Account = require("./Account");
const MinusAccount = require("./MinusAccount");

class AccountRepository {
  constructor() {
    this.accounts = [];
    this.userDirectory = "./ams.json";
  }

  // setter/getter
  set accounts(accounts) {
    this._accounts = accounts;
  }
  get accounts() {
    return this._accounts;
  }

  async deserialize(data) {
    const dataList = JSON.parse(data);
    // 데이터 넣을 배열 생성
    const accounts = [];

    for (const item of dataList) {
      if ("rentMoney" in item) {
        // 'rentMoney' 가지고 있을 시 클래스 MinusAccount로 재생성
        accounts.push(
          new MinusAccount(
            item.accountNum,
            item.accountOwner,
            item.password,
            item.initMoney,
            item.rentMoney
          )
        );
      } else {
        // 'rentMoney' 없을 시 클래스 Account로 재생성
        accounts.push(
          new Account(
            item.accountNum,
            item.accountOwner,
            item.password,
            item.initMoney
          )
        );
      }
    }
    // 배열 내보내기
    return accounts;
  }

  serialize(accounts) {
    return JSON.stringify(accounts.map((account) => account.toJSON()));
  }

  // 신규 계좌 등록
  addAccount(account) {
    // 계좌 등록 구현
    if (this.accounts.indexOf(account) === -1) {
      this.accounts.push(account);
      return true;
    } else {
      return false;
    }
  }

  // 전체계좌 목록 반환
  findByAll() {
    // 계좌 목록의 복사본 반환
    return [...this.accounts];
  }

  // 계좌 번호로 조회하여 반환 (OK)
  findByNumber(number) {
    //
    return this.accounts.find((account) => account.accountNum === number);
  }

  // 예금주명으로 조회하여 반환 (OK)
  findByName(owner) {
    // 가지고 있는 모든 계좌를 반환 (구현안됨)
    return this.accounts.filter((account) => account.accountOwner === owner);
  }

  // 모든 계좌의 총금액 반환
  deposit() {
    return this.accounts.reduce(
      (acc, account) => acc + account.getBalance(),
      0
    );
  }

  // 계좌 잔액중에서 최대값 반환
  maxBalance() {
    return this.accounts.reduce(
      (acc, account) => (acc > account.initMoney ? acc : account.initMoney),
      0
    );
  }

  // 계좌 잔액중에서 최소값 반환
  minBalance() {
    return this.accounts.reduce(
      (acc, account) => (acc < account.initMoney ? acc : account.initMoney),
      this.accounts[0].initMoney
    );
  }

  // 특정 범위의 잔액 조회
  findSomeMoney(num1, num2) {
    return this.accounts.reduce(
      (account) => num1 <= account.initMoney && account.initMoney <= num2
    );
  }

  // 이름을 받아 계좌의 예금주명 수정
  changeName(updateAccount) {
    // let index = this.accounts.findIndex((account) => account.name === owner)
    // if (index > -1){
    //     this.accounts[index].name = changeOwner;
    //     return true;
    // } else {
    //     return false;
    // }
    let findAccount = this.accounts.find(
      (account) => account.accountNum === updateAccount.accountNum
    );
    if (findAccount) {
      findAccount.accountOwner = updateAccount.accountOwner;
      return true;
    } else {
      return false;
    }
  }

  // 계좌번호를 입력받아 해당 계좌 삭제
  deleteAccount(number) {
    let index = this.accounts.findIndex(
      (account) => account.accountNum === number
    );
    if (index != -1) {
      return this.accounts.splice(index, 1);
    }
    return null;
  }
}

module.exports = AccountRepository;
