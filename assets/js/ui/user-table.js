import { GENDERS, COUNTRIES } from '../domain/user.js';

function makeCell(content) {
  const td = document.createElement('td');
  td.textContent = String(content);
  return td;
}

function makeInput(field, value) {
  const input = document.createElement('input');
  input.dataset.field = field;
  input.type = field === 'email' ? 'email' : field === 'nomorHP' ? 'tel' : 'text';
  input.value = value;
  input.required = true;
  if (field === 'nomorHP') {
    input.inputMode = 'numeric';
    input.maxLength = 16;
  } else if (field === 'nama') {
    input.maxLength = 60;
  } else {
    input.maxLength = 254;
  }
  input.setAttribute('aria-label', `Edit ${field}`);
  return input;
}

function makeSelect(field, value, options) {
  const select = document.createElement('select');
  select.dataset.field = field;
  select.setAttribute('aria-label', `Edit ${field}`);
  options.forEach((item) => select.add(new Option(item, item)));
  select.value = value;
  return select;
}

function actionButton(label, className, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.dataset.action = action;
  button.textContent = label;
  return button;
}

export function renderUserTable(tbody, users, editingId = null, draft = null) {
  const fragment = document.createDocumentFragment();
  users.forEach((user, index) => {
    const editing = editingId === user.id && draft;
    const tr = document.createElement('tr');
    tr.dataset.userId = user.id;
    tr.appendChild(makeCell(index + 1));
    for (const field of ['nama', 'email', 'nomorHP', 'gender', 'negara']) {
      const td = document.createElement('td');
      if (editing) {
        const control =
          field === 'gender'
            ? makeSelect(field, draft[field], GENDERS)
            : field === 'negara'
              ? makeSelect(field, draft[field], COUNTRIES)
              : makeInput(field, draft[field]);
        td.appendChild(control);
      } else {
        td.textContent = user[field];
      }
      tr.appendChild(td);
    }
    const actions = document.createElement('div');
    actions.className = 'action-buttons';
    if (editing) {
      actions.append(
        actionButton('Simpan', 'btn-save', 'save'),
        actionButton('Batal', 'btn-cancel', 'cancel'),
      );
    } else {
      actions.append(
        actionButton('Edit', 'btn-edit', 'edit'),
        actionButton('Hapus', 'btn-delete', 'delete'),
      );
    }
    const actionCell = document.createElement('td');
    actionCell.appendChild(actions);
    tr.appendChild(actionCell);
    fragment.appendChild(tr);
  });
  tbody.replaceChildren(fragment);
}
