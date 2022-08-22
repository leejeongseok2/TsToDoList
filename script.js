"use strict";
const todoInput = document.querySelector('.todo-input');
const todoInsertBtn = document.querySelector('.todo-insert-btn');
const todoList = document.querySelector('.todo-list');
const completeAllBtn = document.querySelector('.complete-all-btn');
const leftItems = document.querySelector('.left-items');
const showAllBtn = document.querySelector('.show-all-btn');
const showActiveBtn = document.querySelector('.show-active-btn');
const showCompletedBtn = document.querySelector('.show-completed-btn');
let todos = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items') || "") : [];
localStorage.setItem('items', JSON.stringify(todos));
const data = JSON.parse(localStorage.getItem('items') || "");
class todo {
    constructor(id, isCompleted, content) {
        this.id = id;
        this.isCompleted = isCompleted;
        this.content = content;
    }
}
let id = localStorage.items.length;
//let id = todos[todos.length-1].id;
const setId = (newId) => { id = newId; };
let isAllCompleted = false;
const setIsAllCompleted = (bool) => { isAllCompleted = bool; };
let currentShowType = 'all';
const setCurrentShowType = (newShowType) => currentShowType = newShowType;
const setTodos = (newTodos) => {
    todos = newTodos;
};
const getAllTodos = () => {
    return todos;
};
const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true);
};
const getActiveTodos = () => {
    return todos.filter((todo) => todo.isCompleted === false);
};
const setLeftItems = () => {
    const leftTodos = getActiveTodos();
    leftItems.innerHTML = `${leftTodos.length} 개의 일정이남았습니다.`;
};
const setCompleteItems = () => {
    const completeTodos = getCompletedTodos();
    leftItems.innerHTML = `${completeTodos.length} 개의 일정을 완료하셨습니다.`;
};
const completeAll = () => {
    completeAllBtn === null || completeAllBtn === void 0 ? void 0 : completeAllBtn.classList.add('checked');
    const newTodos = getAllTodos().map((todo) => (Object.assign(Object.assign({}, todo), { isCompleted: true })));
    setTodos(newTodos);
    localStorage.setItem('items', JSON.stringify(newTodos));
};
const incompleteAll = () => {
    completeAllBtn === null || completeAllBtn === void 0 ? void 0 : completeAllBtn.classList.remove('checked');
    const newTodos = getAllTodos().map((todo) => (Object.assign(Object.assign({}, todo), { isCompleted: false })));
    setTodos(newTodos);
    localStorage.setItem('items', JSON.stringify(newTodos));
};
const checkIsAllCompleted = () => {
    if (getAllTodos().length === getCompletedTodos().length) {
        setIsAllCompleted(true);
        completeAllBtn === null || completeAllBtn === void 0 ? void 0 : completeAllBtn.classList.add('checked');
    }
    else {
        setIsAllCompleted(false);
        completeAllBtn === null || completeAllBtn === void 0 ? void 0 : completeAllBtn.classList.remove('checked');
    }
};
const onClickCompleteAll = () => {
    if (!getAllTodos().length)
        return;
    if (isAllCompleted)
        incompleteAll();
    else
        completeAll();
    setIsAllCompleted(!isAllCompleted);
    paintTodos();
    setLeftItems();
};
const appendTodos = (text) => {
    const newId = id + 1;
    setId(newId);
    const newTodos = getAllTodos().concat({ id: newId, isCompleted: false, content: text });
    setTodos(newTodos);
    setLeftItems();
    checkIsAllCompleted();
    paintTodos();
};
const deleteTodo = (todoId) => {
    const newTodos = getAllTodos().filter((todo) => todo.id !== todoId);
    localStorage.setItem('items', JSON.stringify(newTodos));
    setTodos(newTodos);
    setLeftItems();
    paintTodos();
};
const completeTodo = (todoId) => {
    const newTodos = getAllTodos().map((todo) => todo.id === todoId ? Object.assign(Object.assign({}, todo), { isCompleted: !todo.isCompleted }) : todo);
    localStorage.setItem('items', JSON.stringify(newTodos));
    setTodos(newTodos);
    paintTodos();
    setLeftItems();
    checkIsAllCompleted();
};
const paintTodo = (todo) => {
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('todo-item');
    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id));
    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.innerText = todo.content;
    const todoinsertElem = document.createElement('div');
    todoinsertElem.classList.add('todo-result');
    todoinsertElem.innerText = '진행중';
    if (todo.isCompleted)
        todoinsertElem.innerText = '완료';
    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () => deleteTodo(todo.id));
    delBtnElem.innerHTML = 'X';
    if (todo.isCompleted) {
        todoItemElem.classList.add('checked');
        checkboxElem.innerText = 'V';
    }
    todoItemElem === null || todoItemElem === void 0 ? void 0 : todoItemElem.appendChild(checkboxElem);
    todoItemElem === null || todoItemElem === void 0 ? void 0 : todoItemElem.appendChild(todoElem);
    todoItemElem === null || todoItemElem === void 0 ? void 0 : todoItemElem.appendChild(todoinsertElem);
    todoItemElem === null || todoItemElem === void 0 ? void 0 : todoItemElem.appendChild(delBtnElem);
    todoList === null || todoList === void 0 ? void 0 : todoList.appendChild(todoItemElem);
};
const paintTodos = () => {
    todoList.innerHTML = "";
    switch (currentShowType) {
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach((todo) => { paintTodo(todo); });
            break;
        case 'active':
            const activeTodos = getActiveTodos();
            activeTodos.forEach((todo) => { paintTodo(todo); });
            break;
        case 'completed':
            const completedTodos = getCompletedTodos();
            completedTodos.forEach((todo) => { paintTodo(todo); });
            break;
        default:
            break;
    }
};
const onClickShowTodosType = (e) => {
    const currentBtnElem = e === null || e === void 0 ? void 0 : e.target;
    const newShowType = currentBtnElem.dataset.type;
    if (currentShowType === newShowType)
        return;
    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem === null || preBtnElem === void 0 ? void 0 : preBtnElem.classList.remove('selected');
    currentBtnElem.classList.add('selected');
    setCurrentShowType(newShowType);
    paintTodos();
};
const init = () => {
    data.forEach((item) => {
        paintTodo(item);
    });
    todoInput === null || todoInput === void 0 ? void 0 : todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            appendTodos(e.target.value);
            localStorage.setItem('items', JSON.stringify(todos));
            todoInput.value = '';
            
        }
    });
    todoInsertBtn === null || todoInsertBtn === void 0 ? void 0 : todoInsertBtn.addEventListener('click', () => {
        appendTodos(todoInput.value);
        localStorage.setItem('items', JSON.stringify(todos));
        todoInput.value = '';
    });
    completeAllBtn === null || completeAllBtn === void 0 ? void 0 : completeAllBtn.addEventListener('click', onClickCompleteAll);
    showAllBtn === null || showAllBtn === void 0 ? void 0 : showAllBtn.addEventListener('click', onClickShowTodosType);
    showActiveBtn === null || showActiveBtn === void 0 ? void 0 : showActiveBtn.addEventListener('click', onClickShowTodosType);
    showCompletedBtn === null || showCompletedBtn === void 0 ? void 0 : showCompletedBtn.addEventListener('click', onClickShowTodosType);
    setLeftItems();
};
init();
