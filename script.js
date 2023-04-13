// Wait for the DOM to finish loading
document.addEventListener('DOMContentLoaded', () => {
  // Get the table body element
  const tableBody = document.querySelector('tbody');

  // Function to add a new row to the table with the given task, description, deadline, priority, and isComplete
  const addRowToTable = (task, description, deadline, priority, isComplete) => {
    // Create a new table row element
    const row = document.createElement('tr');

    // Create the cells for the row
    const taskCell = document.createElement('td');
    taskCell.textContent = task;

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = description;

    
    const deadlineCell = document.createElement('td');
    const deadlineDate = new Date(deadline);
    deadlineCell.textContent = deadlineDate.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'});


    const priorityCell = document.createElement('td');
    priorityCell.textContent = priority;

    const isCompleteCell = document.createElement('td');
    const isCompleteCheckbox = document.createElement('input');
    isCompleteCheckbox.type = 'checkbox';
    isCompleteCheckbox.checked = isComplete;
    isCompleteCheckbox.addEventListener('change', () => {
      if (isCompleteCheckbox.checked) {
        updateButton.style.visibility = 'hidden';
      } else {
        updateButton.style.visibility = 'visible';
      }
    });
    isCompleteCell.appendChild(isCompleteCheckbox);

    const updateCell = document.createElement('td');
    const updateButton = document.createElement('button');
    updateButton.type = 'button';
    updateButton.classList.add('btn', 'btn-primary', 'me-2', 'btnUpdate');
    updateButton.innerHTML = '<i class="fas fa-edit"></i> UPDATE';
    updateButton.addEventListener('click', () => {
      // Get the table row that the button is in
      const row = updateButton.parentNode.parentNode;
      const rowIndex = row.rowIndex;
      globalRow = row;
      globalRowIndex = rowIndex;

      // Get the task and description cells
      const taskCell = row.querySelector('td:nth-child(1)');
      const descriptionCell = row.querySelector('td:nth-child(2)');

      // Get the values from the cells
      const task = taskCell.textContent;
      const description = descriptionCell.textContent;

      // Populate the input fields in the modal with the values
      taskInput.value = task;
      descriptionInput.value = description;

      // Remove the readonly attribute from the task input
      taskInput.removeAttribute('readonly');

      // Set the focus on the description input field
      descriptionInput.focus();

      // Remove the existing row from the table
      //row.remove();

      // Show the edit task modal
      makeEdit();
      addTaskModal.classList.add('show');
      addTaskModal.style.display = 'block';
    });

    updateCell.appendChild(updateButton);

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('btn', 'btn-danger', 'btnUpdate');
    deleteButton.innerHTML = '<i class="fas fa-times-circle"></i> DELETE';
    deleteButton.addEventListener('click', () => {
      // Code to delete the task goes here
      row.remove();
      toastr.success("The Task was Deleted Successfully");
    });
    updateCell.appendChild(deleteButton);

    // Add the cells to the row
    row.appendChild(taskCell);
    row.appendChild(descriptionCell);
    row.appendChild(deadlineCell);
    row.appendChild(priorityCell);
    row.appendChild(isCompleteCell);
    row.appendChild(updateCell);
    row.appendChild(deleteCell);

    // Add the row to the table body
    //tableBody.appendChild(row);

    
    if (globalRowIndex !== undefined && globalRowIndex >= 0 && globalRowIndex <= tableBody.rows.length) {
      tableBody.appendChild(row);
      tableBody.insertBefore(row, globalRow);
      const nextRow = row.nextSibling;
      nextRow.remove();
      toastr.success("The Task was Updated Successfully");
    } else {
      tableBody.appendChild(row);
      toastr.success("The Task was Added Successfully");
    }
    
  };

  // Get the add task button element
  const addTaskButton = document.querySelector('#add-task-button');

  // Get the add task modal elements
  const addTaskModal = document.querySelector('#add-task-modal');
  const taskInput = document.querySelector('#task-input');
  const descriptionInput = document.querySelector('#description-input');
  const deadlineInput = document.querySelector('#deadline-input');
  const priorityInput = document.querySelector('#priority-input');
  const addButton = document.querySelector('#add-button');
  const cancelButton = document.querySelector('#cancel-button');

  const editTaskModal = document.querySelector('#edit-task-modal');
  const editTaskInput = document.querySelector('#edit-task-input');
  const editDescriptionInput = document.querySelector(
    '#edit-description-input'
  );
  const editButton = document.querySelector('#edit-button');

  // Add event listener to the add task button to show the add task modal
  addTaskButton.addEventListener('click', () => {
    globalRowIndex=-1;
    globalRow=null;
    makeAdd();
    const form = addTaskModal.querySelector('form');
    form.reset();
    addTaskModal.classList.add('show');
    addTaskModal.style.display = 'block';
  });

  // Add event listener to the add button to add a new task to the table
  addButton.addEventListener('click', () => {
    const task = taskInput.value;
    var allClear = true;
    const description = descriptionInput.value;
    const deadline = deadlineInput.value;
    const priorityRadios = document.getElementsByName('priority');
    const titleError = document.getElementById('title-error');
    const descriptionError = document.getElementById('description-error');
    const deadlineError = document.getElementById('deadline-error');
    const priorityError = document.getElementById('priority-error');
    let priority = '';
    for (const radio of priorityRadios) {
      if (radio.checked) {
        priority = radio.value;
        break;
      }
    }
    //verify
    // Check if the title is empty
  if (task.trim() === '') {
    // Show an error message and add the error class to the input
    titleError.textContent = 'Title cannot be empty';
    taskInput.classList.add('error');
    allClear = false;
  } else {
    // Remove the error message and class
    titleError.textContent = '';
    taskInput.classList.remove('error');
  }
  
    const rows = tableBody.querySelectorAll('tr');
    for (const row of rows) {
      const taskCell = row.querySelector('td:first-child');
      if ((taskCell.textContent === task) && (!editMode)) {
        titleError.textContent = 'Title must be unique';
        taskInput.classList.add('error');
        allClear = false;
        return;
      }
    }



  if (deadline.trim() === '') {
    // Show an error message and add the error class to the input
    deadlineError.textContent = 'Deadline must be set';
    deadlineInput.classList.add('error');
    allClear = false;
  } else {
    // Remove the error message and class
    deadlineError.textContent = '';
    deadlineInput.classList.remove('error');
  }
  if (priority.trim() === '') {
    // Show an error message and add the error class to the input
    priorityError.textContent = 'Priority must be set';
    allClear = false;
  } else {
    // Remove the error message and class
    priorityError.textContent = '';
  }

  // Check if the description is empty
  if (description.trim() === '') {
    // Show an error message and add the error class to the input
    descriptionError.textContent = 'Description cannot be empty';
    descriptionInput.classList.add('error');
    allClear = false;
  } else {
    // Remove the error message and class
    descriptionError.textContent = '';
    descriptionInput.classList.remove('error');
  }

  if (allClear){
    const isComplete = false;
    addRowToTable(task, description, deadline, priority, isComplete);
    addTaskModal.classList.remove('show');
    addTaskModal.style.display = 'none';
  }
  });

  cancelButton.addEventListener('click', () => {
    const form = addTaskModal.querySelector('form');
    form.reset();
    addTaskModal.style.display = 'none';
  });

  function makeEdit() {
    editMode = true;
    const modalTitle = document.querySelector('.modal-title');
    modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Task';
    const taskInput = document.querySelector('#task-input');
    taskInput.style.display = 'none';
    const addButton = document.querySelector('#add-button');
    addButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
  }

  function makeAdd() {
    editMode = false;
    const modalTitle = document.querySelector('.modal-title');
    modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add Task';
    const taskInput = document.querySelector('#task-input');
    taskInput.style.display = 'block'
    const addButton = document.querySelector('#add-button');
    addButton.innerHTML = '<i class="fa fa-plus-circle"></i> Add';
  }
  

  // Example usage: add a row to the table
  addRowToTable('Task 1', 'Description 1', '2023-04-10', 'High', false);
});

// Create a new column for the buttons in the row
const buttonCell = document.createElement('td');


var editMode = false;
var globalRow;
var globalRowIndex = -1;
