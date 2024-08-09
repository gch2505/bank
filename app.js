const { createInterface } = require("readline");
const Account = require("./Account");
const MinusAccount = require("./MinusAccount");
const AccountRepository = require("./AccountRepository");

const fs = require("fs").promises;

// 키보드 입력을 위한 인터페이스 생성
const consoleInterface = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 키보드 입력 받기
const readLine = function (message) {
  return new Promise((resolve) => {
    consoleInterface.question(message, (userInput) => {
      resolve(userInput);
    });
  });
};

// 실행 중 정보 변경된 어카운트 저장
const accountRepository = new AccountRepository();

// 계좌 정보 파일 조회
// ams.json 파일에 저장된 계좌 목록 불러오기
const amsData = async function () {
  try {
    // ams.json 읽기
    const readJsonData = await fs.readFile(
      accountRepository.userDirectory,
      "utf8"
    );
    // ams.json의 계좌 정보를 계좌 종류에 따라 분류
    const deserializedObjects = await accountRepository.deserialize(
      readJsonData
    );
    // deserializedObjects.forEach(obj => console.log(obj)); 확인용

    // 분류된 배열 복사해서 accountRepository에 넣기
    accountRepository.accounts.push(...deserializedObjects);
  } catch (err) {
    console.error("데이터를 불러오는 중 오류가 발생했습니다:", err);
  }
};

// 메뉴 출력
const printMenu = function () {
  console.log(
    "--------------------------------------------------------------------"
  );
  console.log(
    "1.계좌등록 | 2.계좌목록 | 3.예금 | 4.출금 | 5.검색 | 6.삭제 | 7.종료"
  );
  console.log(
    "--------------------------------------------------------------------"
  );
};
const app = async function () {
  console.log(
    `====================================================================`
  );
  console.log(
    `--------------     KOSTA 은행 계좌 관리 프로그램     ---------------`
  );
  console.log(
    `====================================================================`
  );

  let running = true;
  while (running) {
    printMenu();
    let menuNum = parseInt(await readLine("> "));

    // regexp
    // 이름(2~5자, 한글)
    const checkName = (name) => {
      let checkOwner = /^[가-힣]{2,5}$/;
      return checkOwner.test(name);
    };
    // 비밀번호(4자, 숫자)
    const checkPw = (pw) => {
      let checkPw = /^\d{4}$/;
      return checkPw.test(pw);
    };
    // 계좌번호(4자-4자, 숫자)
    const checkNumber = (num) => {
      let checkNum = /^\d{4}-\d{4}$/;
      return checkNum.test(num);
    };
    // 금액(숫자)
    const checkMoney = (money) => {
      let checkMoney = /[\d]/;
      return checkMoney.test(money);
    };

    switch (menuNum) {
      case 1:
        // createAccount();
        console.log("■ 등록 계좌 종류 선택");
        const header =
          "--------------------------------\n" +
          "1. 입출금계좌 | 2. 마이너스 계좌\n" +
          "--------------------------------";
        console.log(header);
        let account = null;
        let no = parseInt(await readLine("> "));
        let rentMoney = 0;

        if (no === 1) {
          // 계좌등록
          let accountNum = await readLine("- 계좌번호 : ");
          if (!checkNumber(accountNum)) {
            // 계좌양식체크
            console.log("숫자 4자-4자를 입력해주세요.");
            break;
          } else if (accountRepository.findByNumber(accountNum)) {
            // 계좌중복체크
            console.log("이미 있는 계좌번호입니다.");
            break;
          }
          let accountOwner = await readLine("- 예금주명 : ");
          if (!checkName(accountOwner)) {
            // 이름양식체크
            console.log("한글 2~5자를 입력해주세요.");
            break;
          }
          let password = parseInt(await readLine("- 비밀번호 : "));
          if (!checkPw(password)) {
            // 비밀번호양식체크
            console.log("숫자 4자를 입력해주세요.");
            break;
          }
          let initMoney = parseInt(await readLine("- 입금액 : "));
          if (!checkMoney(initMoney)) {
            // 잔액양식체크
            console.log("숫자를 입력해주세요.");
            break;
          } else if (initMoney < 0) {
            // 금액체크
            console.log("음수는 입력할 수 없습니다.");
            break;
          }
          account = new Account(accountNum, accountOwner, password, initMoney);
          accountRepository.addAccount(account);
          console.log(
            `${account.accountOwner}님의 신규 계좌가 등록되었습니다.`
          );
        } else if (no === 2) {
          let accountNum = await readLine("- 계좌번호 : ");
          if (!checkNumber(accountNum)) {
            // 계좌양식체크
            console.log("숫자 4자-4자를 입력해주세요.");
            break;
          } else if (accountRepository.findByNumber(accountNum)) {
            // 계좌중복체크
            console.log("이미 있는 계좌번호입니다.");
            break;
          }
          let accountOwner = await readLine("- 예금주명 : ");
          if (!checkName(accountOwner)) {
            // 이름양식체크
            console.log("한글 2~5자를 입력해주세요.");
            break;
          }
          let password = parseInt(await readLine("- 비밀번호 : "));
          if (!checkPw(password)) {
            // 비밀번호양식체크
            console.log("숫자 4자를 입력해주세요.");
            break;
          }
          let initMoney = parseInt(await readLine("- 입금액 : "));
          if (!checkMoney(initMoney)) {
            // 잔액양식체크
            console.log("숫자를 입력해주세요.");
            break;
          } else if (initMoney < 0) {
            // 금액체크
            console.log("음수는 입력할 수 없습니다.");
            break;
          }
          rentMoney = parseInt(await readLine("- 대출금액 : "));
          if (!checkMoney(rentMoney)) {
            // 대출금양식체크
            console.log("숫자를 입력해주세요.");
            break;
          } else if (rentMoney < 0) {
            // 금액체크
            console.log("음수는 입력할 수 없습니다.");
            break;
          }

          account = new MinusAccount(
            accountNum,
            accountOwner,
            password,
            initMoney,
            rentMoney
          );
          accountRepository.addAccount(account);
          console.log(
            `${account.accountOwner}님의 신규 계좌가 등록되었습니다.`
          );
        } else {
          console.log("잘못된 선택입니다.");
        }
        break;
      case 2: // 전체계좌 목록 출력
        const allList = accountRepository.findByAll();
        // 이름 순으로 계좌 정렬 (이름 순으로 정렬 후 마이너스 계좌 - 입출금 계좌 순으로 정렬하고 싶으나 방법을 모르겠음)
        let allListRange = allList.sort(
          (account1, account2) =>
            account1._accountOwner.charCodeAt(0) -
            account2._accountOwner.charCodeAt(0)
        );

        console.log(
          "-----------------------------------------------------------------------"
        );
        console.log("계좌구분 \t 계좌번호 \t 예금주 \t 잔액 \t\t 대출금");
        allListRange.forEach((account) => {
          if (account instanceof MinusAccount) {
            process.stdout.write("마이너스계좌\t");
          } else {
            process.stdout.write("입출금계좌\t");
          }
          console.log(account.toString());
        });
        console.log(
          "-----------------------------------------------------------------------"
        );
        break;
      case 3: // 입금
        // 계좌번호와 입금액 입력 받아 입금 처리
        let inputNo = await readLine("- 계좌번호 : ");
        if (!checkNumber(inputNo)) {
          console.log("숫자 4자-4자를 입력해주세요.");
          break;
        }
        let inputMoney = parseInt(await readLine("- 입금액 : "));
        if (!checkMoney(inputMoney)) {
          // 입금액 양식체크
          console.log("숫자를 입력해주세요.");
          break;
        } else if (inputMoney < 0) {
          // 금액체크
          console.log("음수는 입력할 수 없습니다.");
          break;
        }
        let inputAcc = accountRepository.findByNumber(inputNo);

        try {
          // 입금하기
          inputAcc.deposit(inputMoney);
          console.log(
            `${inputAcc.accountOwner}님의 계좌에 ${inputMoney}원 입금했습니다. 현재 잔액: ${inputAcc.initMoney}`
          );
        } catch (error) {
          console.log("처리 도중 문제가 발생했습니다. 다시 시도해주세요.");
        }
        break;
      case 4: // 출금
        // 계좌번호와 출금액 입력 받아 출금 처리
        let outputNo = await readLine("- 계좌번호 : ");
        if (!checkNumber(outputNo)) {
          console.log("숫자 4자-4자를 입력해주세요.");
          break;
        }
        let outputPW = parseInt(await readLine("- 비밀번호 : "));
        if (!checkPw(outputPW)) {
          // 비밀번호양식체크
          console.log("숫자 4자를 입력해주세요.");
          break;
        }
        let outputMoney = parseInt(await readLine("- 출금액 : "));
        let outputAcc = accountRepository.findByNumber(outputNo);

        try {
          // 출금하기
          outputAcc.withdraw(outputMoney, outputPW);
          console.log(
            `${outputAcc.accountOwner}님의 계좌에서 ${outputMoney}원 출금했습니다. 현재 잔액: ${outputAcc.initMoney}`
          );
        } catch (error) {
          console.log(error.code, error.message);
        }
        break;
      case 5:
        // 이름으로 계좌 검색 후 정렬해서 출력하기

        console.log("■ 등록 계좌 종류 선택");
        const header5 =
          "---------------------------------------\n" +
          "1. 이름으로 검색 | 2. 계좌번호로 검색\n" +
          "---------------------------------------";
        console.log(header5);

        let kindofAcc = (account) => {
          if (account instanceof MinusAccount) {
            return "마이너스계좌\t";
          } else if (account instanceof Account) {
            return "입출금계좌\t";
          } else {
            return "오류\t";
          }
        };

        let selectno = 0;
        selectno = parseInt(await readLine("> "));

        if (selectno === 1) {
          // 이름으로 검색

          let searchOwner = await readLine("- 예금주명 : ");
          // 목록 받아오기 함수
          let ownerResult = accountRepository.findByName(searchOwner);
          if (!checkName(searchOwner)) {
            // 이름양식체크
            console.log("한글 2~5자를 입력해주세요.");
            break;
          } else if (!ownerResult[0]) {
            console.log("계좌를 찾을 수 없습니다.");
            break;
          }

          const printOwnerAcc = function (accounts) {
            //출력
            console.log(
              "-----------------------------------------------------------------------"
            );
            console.log("계좌구분 \t 계좌번호 \t 예금주 \t 잔액 \t\t 대출금");
            for (let i = 0; i < accounts.length; i++) {
              console.log(kindofAcc(accounts[i]) + accounts[i]);
            }
            console.log(
              "-----------------------------------------------------------------------"
            );
          };
          printOwnerAcc([...ownerResult]);
        } else if (selectno === 2) {
          // 계좌번호로 검색

          let searchNum = await readLine("- 계좌번호 : ");
          // 목록 받아오기 함수
          let accResult = accountRepository.findByNumber(searchNum);
          if (!checkNumber(searchNum)) {
            // 계좌번호 양식 체크
            console.log("숫자 4자-4자를 입력해주세요.");
            break;
          } else if (!accResult) {
            console.log("계좌를 찾을 수 없습니다.");
            break;
          }

          const printOwnerAcc = function () {
            //출력
            console.log(
              "-----------------------------------------------------------------------"
            );
            console.log("계좌구분 \t 계좌번호 \t 예금주 \t 잔액 \t\t 대출금");
            console.log(kindofAcc(accResult) + accResult);
            console.log(
              "-----------------------------------------------------------------------"
            );
          };
          printOwnerAcc();
        } else {
          console.log("잘못된 선택입니다.");
        }
        break;
      case 6:
        console.log("계좌 삭제");
        // 계좌 번호 입력 받아 해당 계좌 삭제
        let deleteNum = await readLine("- 계좌번호 : ");
        if (!checkNumber(deleteNum)) {
          // 계좌번호 양식 체크
          console.log("숫자 4자-4자를 입력해주세요.");
          break;
        }
        let deletePW = parseInt(await readLine("- 비밀번호 : "));
        if (!checkPw(deletePW)) {
          // 비밀번호 양식 체크
          console.log("숫자 4자를 입력해주세요.");
          break;
        }
        let deleteAcc = accountRepository.findByNumber(deleteNum);
        console.log(deleteAcc);
        if (deleteAcc.password !== deletePW) {
          console.log("비밀번호가 맞지 않습니다.");
        } else {
          let num = parseInt(
            await readLine(`정말 삭제하시겠습니까? 1.삭제, 2.취소 :`)
          );
          if (num === 1) {
            accountRepository.deleteAccount(deleteNum);
            console.log("계좌 삭제가 완료되었습니다.");
          } else if (num === 2) {
            console.log("삭제가 취소되었습니다.");
          } else {
            console.log("잘못된 선택입니다.");
          }
        }
        break;
      case 7:
        console.log(">>> 프로그램을 종료합니다.");
        consoleInterface.close();
        running = false;
        await fs.writeFile(
          accountRepository.userDirectory,
          accountRepository.serialize(accountRepository.findByAll())
        );
        console.log("계좌 데이터가 저장되었습니다.");
        break;
      default:
        console.log("잘못된 선택입니다.");
    }
  }
};

amsData();
app();
