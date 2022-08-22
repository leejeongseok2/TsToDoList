const todoInput:HTMLInputElement |null= document.querySelector('.todo-input');
const todoInsertBtn:HTMLButtonElement |null = document.querySelector('.todo-insert-btn');
const todoList:HTMLElement | null= document.querySelector('.todo-list');
const completeAllBtn:HTMLButtonElement |null = document.querySelector('.complete-all-btn');
const leftItems:HTMLElement | null = document.querySelector('.left-items')
const showAllBtn:HTMLButtonElement |null = document.querySelector('.show-all-btn');
const showActiveBtn:HTMLButtonElement |null = document.querySelector('.show-active-btn');
const showCompletedBtn:HTMLButtonElement |null= document.querySelector('.show-completed-btn');

let todos: Array<todo> = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')||"") : [];
localStorage.setItem('items', JSON.stringify(todos));
const data: Array<todo>  = JSON.parse(localStorage.getItem('items')||"");

class todo{
    id : number ;
    isCompleted : boolean;
    content : string;
    constructor(id : number,
        isCompleted : boolean,
        content : string){
            this.id=id;
            this.isCompleted=isCompleted;
            this.content=content;
        }
}
let id:number = todos.length===0?0:todos[todos.length-1].id ;
//let id = todos[todos.length-1].id;
const setId = (newId: number) => {id = newId};

let isAllCompleted = false;
const setIsAllCompleted = (bool: boolean) => { isAllCompleted = bool};

let currentShowType = 'all'; 
const setCurrentShowType = (newShowType: string) => currentShowType = newShowType

const setTodos = (newTodos: Array<todo>) => {
    todos = newTodos;
}
const getAllTodos = () => {
    return todos;
}
const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true );
}
const getActiveTodos = () => {
    return todos.filter((todo: { isCompleted: boolean; }) => todo.isCompleted === false);
}
const setLeftItems = () => {
    const leftTodos= getActiveTodos();
    leftItems!.innerHTML = `${leftTodos.length} 개의 일정이남았습니다.`;
}
const setCompleteItems = () => {
    const completeTodos = getCompletedTodos();
    leftItems!.innerHTML = `${completeTodos.length} 개의 일정을 완료하셨습니다.`;
}
const completeAll = () => {
    completeAllBtn?.classList.add('checked');
    const newTodos = getAllTodos().map((todo: todo) => ({...todo, isCompleted: true }) );
    setTodos(newTodos);
    localStorage.setItem('items', JSON.stringify(newTodos));
}
const incompleteAll = () => {
    completeAllBtn?.classList.remove('checked');
    const newTodos =  getAllTodos().map((todo: todo) => ({...todo, isCompleted: false }) );
    setTodos(newTodos);
    localStorage.setItem('items', JSON.stringify(newTodos));
}
const checkIsAllCompleted = () => {
    if(getAllTodos().length === getCompletedTodos().length ){
        setIsAllCompleted(true);
        completeAllBtn?.classList.add('checked');
    }else {
        setIsAllCompleted(false);
        completeAllBtn?.classList.remove('checked');
    }
}
const onClickCompleteAll = () => {
    if(!getAllTodos().length) return; 

    if(isAllCompleted) incompleteAll();  
    else completeAll();
    setIsAllCompleted(!isAllCompleted); 
    paintTodos(); 
    setLeftItems();
}
const appendTodos = (text: string) => {
    const newId = id + 1; 
    setId(newId);
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text })
    setTodos(newTodos);
    setLeftItems();
    checkIsAllCompleted();
    paintTodos();
}
const deleteTodo = (todoId: number) => {
    const newTodos = getAllTodos().filter((todo: { id: number; }) => todo.id !== todoId );
    localStorage.setItem('items', JSON.stringify(newTodos));
    setTodos(newTodos);
    setLeftItems();
    paintTodos();
}
const completeTodo = (todoId: number) => {
    const newTodos = getAllTodos().map((todo: todo) => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
    localStorage.setItem('items', JSON.stringify(newTodos));
    setTodos(newTodos);
    paintTodos();
    setLeftItems();
    checkIsAllCompleted();
}


const paintTodo = (todo: { id: number; content: string; isCompleted: boolean; }) => {
    const todoItemElem : HTMLLIElement| null = document.createElement('li');
    todoItemElem.classList.add('todo-item');


    const checkboxElem: HTMLDivElement| null = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id))

    const todoElem: HTMLDivElement| null = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.innerText = todo.content;

    const todoinsertElem: HTMLDivElement| null = document.createElement('div');
    todoinsertElem.classList.add('todo-result');
    todoinsertElem.innerText = '진행중';
    if(todo.isCompleted) todoinsertElem.innerText = '완료';


    const delBtnElem: HTMLButtonElement| null = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () =>  deleteTodo(todo.id))
    delBtnElem.innerHTML = 'X';

    if(todo.isCompleted) {
        todoItemElem.classList.add('checked');
        checkboxElem.innerText = 'V';
    }

    todoItemElem?.appendChild(checkboxElem);
    todoItemElem?.appendChild(todoElem);
    todoItemElem?.appendChild(todoinsertElem);
    todoItemElem?.appendChild(delBtnElem);
    
    todoList?.appendChild(todoItemElem);
}

const paintTodos = () => {
    todoList!.innerHTML = "";

    switch (currentShowType) {
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach((todo: { id: number; content: string; isCompleted: boolean; }) => { paintTodo(todo);});
            break;
        case 'active': 
            const activeTodos = getActiveTodos();
            activeTodos.forEach((todo: { id: number; content: string; isCompleted: boolean; }) => { paintTodo(todo);});
            break;
        case 'completed': 
            const completedTodos = getCompletedTodos();
            completedTodos.forEach((todo: { id: number; content: string; isCompleted: boolean; }) => { paintTodo(todo);});
            break;
        default:
            break;
    }
}

const onClickShowTodosType = (e: MouseEvent|null) => {
    const currentBtnElem = <HTMLInputElement>e?.target;
    const newShowType = <string>currentBtnElem.dataset.type;

    if ( currentShowType === newShowType ) return;

    const preBtnElem:HTMLElement| null = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem?.classList.remove('selected');

    currentBtnElem.classList.add('selected');
    setCurrentShowType(newShowType);
    paintTodos();
}

const init = () => {
    data.forEach((item: { id: number; content: string; isCompleted: boolean; }) => {
        paintTodo(item);
      });
    todoInput?.addEventListener('keypress', (e: KeyboardEvent) =>{
        if( e.key === 'Enter' ){
            if((<HTMLInputElement>e.target).value == ""){
                todoInput.value ='';
                
            }else
            {
                appendTodos((<HTMLInputElement>e.target).value); 
                localStorage.setItem('items', JSON.stringify(todos));
                todoInput.value ='';
                }
            }
    })
    todoInsertBtn?.addEventListener('click', () =>{
        if(todoInput!.value== ""){
            todoInput!.value = '';
        }
        else{
            appendTodos(todoInput!.value); 
            localStorage.setItem('items', JSON.stringify(todos));
            todoInput!.value = '';
        }
    });
    completeAllBtn?.addEventListener('click',  onClickCompleteAll);
    showAllBtn?.addEventListener('click', onClickShowTodosType);
    showActiveBtn?.addEventListener('click',onClickShowTodosType);
    showCompletedBtn?.addEventListener('click',onClickShowTodosType);

    setLeftItems();
}



init();
