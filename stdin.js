// process.stdin 스트림은 표준 입력 데이터를 읽기위해 사용되는 Node.js의 내장 스트림이다. 

// 키보드에서 발생하는 입력 이벤트 처리 
console.log("아무것나 입력혀봐 : ");
process.stdin.on("data", (data) => {
    console.log(`읽은 데이터 : ${data}`);
    if (data.toString().trim() === "7"){
        process.exit();
    }
});

// chunk  단위 읽기
// process.stdin.on('readable', () => {
//     let chunk;
//     while ((chunk = process.stdin.read()) !== null) {
//         process.stdout.write(`chunk: ${chunk}`);
//     }
// });

