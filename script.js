const list = document.getElementById('list'); // 아이템이 표시되는 구역
const createBtn = document.getElementById('create-btn');

let todos = []; // 아이템들의 정보를 담는다.

createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
    // 새로운 아이템 객체 생성
    const item = {
        id : new Date().getTime(), // 고유 id로 사용 
        text: '', // 기본 공백
        complete: false // 기본 미완료(체크박스 해제)
    }

    // 배열 처음에 새로운 아이템 추기
    todos.unshift(item);

    // 요소 생성하기
    const {itemEl, inputEl, editBtnEl, removeBtnEl} = createTodoElement(item);

    // 리스트 요소 안에 방금 생성한 요소 추가
    list.prepend(itemEl); // 첫번째 노드에 삽입
    inputEl.removeAttribute('disabled'); // 생성 후 바로 입력할 수 있도록 수정 불가 속성 삭제
    inputEl.focus(); // 포커스 
    saveToLocalStorage(); // 로컬스토리지 저장
}

function createTodoElement(item) {
    const itemEl = document.createElement('div'); // item 생성
    itemEl.classList.add('item');

    const checkboxEl = document.createElement('input'); // checkbox 생성
    checkboxEl.type = 'checkbox';
    checkboxEl.checked = item.complete; // item의 complete 여부를 확인해 체크박스를 변경

    if (item.complete) {
        itemEl.classList.add('complete');
    }

    const inputEl = document.createElement('input'); // 입력 생성
    inputEl.type = 'text';
    inputEl.value = item.text;
    inputEl.setAttribute('disabled', ''); // 수정 불가 속성 추가

    const actionEl = document.createElement('div'); // 액션 버튼을 담을 div 생성
    actionEl.classList.add('actions');

    const editBtnEl = document.createElement('button'); // 수정 버튼
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerText = 'edit';

    const removeBtnEl = document.createElement('button'); // 삭제 버튼
    removeBtnEl.classList.add('material-icons', 'remove-btn');
    removeBtnEl.innerText = 'remove_circle';

    checkboxEl.addEventListener('change', () => {
        item.complete = checkboxEl.checked; // 체크 여부를 통해 complete 를 변경
        
        if (item.complete) {
            itemEl.classList.add('complete'); // complete 클래스 추가
        } else {
            itemEl.classList.remove('complete'); // complete 클래스 제거
        }
        saveToLocalStorage(); // 로컬스토리지 저장
    });

    inputEl.addEventListener('blur', () => { // input에 입력을 마치고 나오면
        inputEl.setAttribute('disabled', ''); // 수정 불가 속성 추가
        saveToLocalStorage(); // 로컬스토리지 저장
    });

    inputEl.addEventListener('input', () => { 
        item.text = inputEl.value; // input에 입력된 값을 item.text에 저장
    });

    editBtnEl.addEventListener('click', () => { // 수정 버튼 클릭시
        inputEl.removeAttribute('disabled'); // 수정 불가 속성 제거
        inputEl.focus(); // 포커스
    });

    removeBtnEl.addEventListener('click', () => {
        todos = todos.filter(todo => todo.id!== item.id); // 현재 아이템을 제외하고 새로운 todos 생성
        list.removeChild(itemEl); // 삭제된 아이템 요소 삭제
        saveToLocalStorage(); // 로컬스토리지 저장
    });

    actionEl.append(editBtnEl); // 액션버튼 구역에 수정 버튼 추가
    actionEl.append(removeBtnEl); // 액션버튼 구역에 삭제 버튼 추가

    itemEl.append(checkboxEl); // item에 checkbox 추가
    itemEl.append(inputEl); // item에 input 추가
    itemEl.append(actionEl); // item에 액션버튼 구역 추가

    return {itemEl, inputEl, editBtnEl, removeBtnEl};
}

function saveToLocalStorage() {
    const data = JSON.stringify(todos); // 저장을 위해 String 형태로 변환

    localStorage.setItem('my_todos', data); // window 객체(window 생략 가능)
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('my_todos');

    if (data) { // 가져온 데이터를 Object 형태로 변환
        todos = JSON.parse(data);
    }
}

function displayTodos() { 
    loadFromLocalStorage();

    for (let i = 0; i < todos.length; i++) { //가지고 온 todos를 순회
        const {itemEl} = createTodoElement(todos[i]);  // todos의 itemEl
        list.append(itemEl); // list에 itemEl 추가
    }
}

displayTodos(); // 변환한 데이터를 list에 추가