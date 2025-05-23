const l = console.log;

const KEY = 'todos';

const objectToLocalStorage = (obj) => {
    localStorage.setItem(KEY, JSON.stringify(obj));
}

const objectFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(KEY));
}

function renderList(){
    
    container.innerHTML = '';
    const List = objectFromLocalStorage() || [];
    const template = document.querySelector('template');

    List.forEach((element, index) => {
        const content = template.content.cloneNode(true);
        const info = content.querySelector('[data-info]');
        info.textContent = element.info;
        const time = content.querySelector('.time');
        time.textContent = element.time;
        const checkbox = content.querySelector('[data-checkbox]');
        checkbox.checked = element.isDel;
        const btnClear = content.querySelector('[data-button-clear]');
        btnClear.disabled = true;
        container.append(content);

        if (checkbox.checked == true)
            {btnClear.disabled = false;}

        checkbox.addEventListener('click', ()=>{
             if (checkbox.checked == true)
                {btnClear.disabled = false; 
                List[index].isDel = true;}
            else 
            {List[index].isDel = false;
            btnClear.disabled = true;}
            
            objectToLocalStorage(List); 
            renderList();
        })

        btnClear.addEventListener('click', (e)=>{
                e.target.closest('[data-todo]').remove();
                List.splice(index, 1);
                objectToLocalStorage(List);
                renderList();
                restart();
        })

    });

}

const renderFilter = (List) => {
    container.innerHTML = '';
    const template = document.querySelector('template');

    List.forEach((element, index) => {
        const content = template.content.cloneNode(true);
        const info = content.querySelector('[data-info]');
        info.textContent = element.info;
        const time = content.querySelector('.time');
        time.textContent = element.time;
        const checkbox = content.querySelector('[data-checkbox]');
        checkbox.checked = element.isDel;
        const btnClear = content.querySelector('[data-button-clear]');
        btnClear.disabled = true;
        container.append(content);

        if (checkbox.checked == true)
            {btnClear.disabled = false;}

        checkbox.addEventListener('click', ()=>{
             if (checkbox.checked == true)
                {btnClear.disabled = false; 
                List[index].isDel = true;}
            else 
            {List[index].isDel = false;
            btnClear.disabled = true;}
            
            const isD = List[index].id;
            const isDel = List[index].isDel;

            const checkboxList = [];
            const checkboxList_1 = objectFromLocalStorage() || [];

            checkboxList_1.forEach((element, index)=>{
                if (element.id === isD) {
                    element.isDel = isDel;
                    checkboxList.push(element);
                } else {checkboxList.push(element);}
            })

            objectToLocalStorage(checkboxList);

        })

        btnClear.addEventListener('click', (e)=>{
                e.target.closest('[data-todo]').remove();
                const listDel = objectFromLocalStorage();
                const listDel_1 = listDel.filter (element => element.id !== List[index].id);
                objectToLocalStorage(listDel_1);
                // renderList();
                delFilter();
                restart();
        })

    });
}


const container = document.querySelector('.container_do');
const inputAdd = document.querySelector('[data-input-add]');
const btnAdd = document.querySelector('[data-button-add]');
const inputFilter = document.querySelector('[data-input-filter]');
const btnFilter = document.querySelector('[data-button-filter]');

const listDo = objectFromLocalStorage() || [];
renderList();
restart();

inputFilter.addEventListener('keyup', delFilter)

function delFilter (){
    if (inputFilter.value.trim()){
        const filter = inputFilter.value;
        const filterListDo = objectFromLocalStorage() || [];
        const filteredList = filterListDo.filter(element => element.info.toLowerCase().includes(filter.toLowerCase()));
        if (filteredList.length === 0){
            container.innerHTML = '';
            const NoFound_1 = document.createElement('div');
            NoFound_1.textContent = 'Не найдено';
            NoFound_1.classList.add('NoFound');
            container.append(NoFound_1);} 
            else
        {renderFilter(filteredList);}
    }
    else
    {renderList(); restart();}
}

function addfunc(event){
    if (event.type === 'keyup' && event.key === "Enter" || event.type === 'click' ){
    if (inputAdd.value.trim()){
    const listDo = objectFromLocalStorage() || [];
    const info = inputAdd.value;
    inputAdd.value = '';
    inputFilter.value = '';
    const id = Date.parse(new Date());
    const time = new Date().toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false // 24-часовой формат
    }).replace(/,/g, ''); // Убираем запятую

    const isDel = false;

    const doObject = {
        info, id, time, isDel,
    }

    listDo.push(doObject);
    objectToLocalStorage(listDo);
    renderList();} else 
    
    {
        alert('ПОШЕЛ НАХУЙ СЕРГЕЙ!')
    }

}

}

inputAdd.addEventListener('keyup', addfunc)
btnAdd.addEventListener('click', addfunc)

function restart (){
    const isS = objectFromLocalStorage();
    if (isS && !container.innerHTML) {renderList(); inputFilter.value = '';};
    l(1);
    if (!container.innerHTML){ 
    const NoFound = document.createElement('div');
    NoFound.textContent = 'Добавьте объекты';
    NoFound.classList.add('NoFound');
    container.append(NoFound);}
}
    
btnFilter.addEventListener('click', ()=>{
    inputFilter.value = '';
    renderList();
    restart();
})
