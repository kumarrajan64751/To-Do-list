window.addEventListener('load', () => {
    const taskForm = document.querySelector("#task");
    const taskInput = document.querySelector("#task-input");
    const taskList = document.querySelector("#tasks");

    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    savedTasks.forEach(savedTask => {
        const taskElement = createTaskElement(savedTask.text, savedTask.creationTime);
        taskElement.querySelector('.checkbox').checked = savedTask.checked;
        taskList.appendChild(taskElement);
    });

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskText = taskInput.value;

        const taskElement = createTaskElement(taskText);
        taskList.appendChild(taskElement);

        
        saveTasksToLocalStorage();

        taskInput.value = '';
    });

    function createTaskElement(taskText, creationTime) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        const contentElement = document.createElement('div');
        contentElement.classList.add('content');

        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox');
        contentElement.appendChild(checkbox);

        const taskInputElement = document.createElement('input');
        taskInputElement.classList.add('text');
        taskInputElement.type = 'text';
        taskInputElement.value = taskText;
        taskInputElement.setAttribute('readonly', 'readonly');
        contentElement.appendChild(taskInputElement);

        const datetimeParagraph = document.createElement('p');
        datetimeParagraph.classList.add('datetime');
        const creationTimeSpan = document.createElement('span');
        creationTimeSpan.classList.add('creation-time');
        contentElement.appendChild(datetimeParagraph);
        datetimeParagraph.appendChild(document.createTextNode('Created on: '));
        datetimeParagraph.appendChild(creationTimeSpan);

        
        const currentTime = new Date();
        creationTimeSpan.textContent = creationTime || formatDatetime(currentTime);

       
        const actionsElement = document.createElement('div');
        actionsElement.classList.add('actions');
        const editButton = createButton('edit', 'Edit');
        const deleteButton = createButton('delete', 'Delete');
        actionsElement.appendChild(editButton);
        actionsElement.appendChild(deleteButton);

        taskElement.appendChild(contentElement);
        taskElement.appendChild(actionsElement);

        editButton.addEventListener('click', () => {
            toggleEditMode(editButton, taskInputElement);

          
            saveTasksToLocalStorage();
        });

        deleteButton.addEventListener('click', () => {
            taskList.removeChild(taskElement);

            
            saveTasksToLocalStorage();
        });

        return taskElement;
    }

    function createButton(className, buttonText) {
        const button = document.createElement('button');
        button.classList.add(className);
        button.innerText = buttonText;
        return button;
    }

    function toggleEditMode(button, input) {
        if (button.innerText.toLowerCase() === "edit") {
            button.innerText = "Save";
            input.removeAttribute("readonly");
            input.focus();
        } else {
            button.innerText = "Edit";
            input.setAttribute("readonly", "readonly");
        }
    }

    function saveTasksToLocalStorage() {
       
        const tasks = Array.from(taskList.children).map(taskElement => {
            return {
                text: taskElement.querySelector('.text').value,
                checked: taskElement.querySelector('.checkbox').checked,
                creationTime: taskElement.querySelector('.creation-time').textContent
            };
        });

        
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function formatDatetime(datetime) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        return datetime.toLocaleDateString('en-US', options);
    }
});

