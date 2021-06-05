import * as c from 'src/constants';

// not using forEach because it can't be stopped

// gives reference!
export const getById = (id, data) => {
  let foundEl = null;

  const _recursive = (children) => {
    for (let el of children) {
      if (foundEl) {
        break;
      }
      if (el.id === id) {
        foundEl = el;
        break;
      }
      if (el.children?.length > 0) {
        _recursive(el.children);
      }
    }
  };
  _recursive(data);

  return foundEl;
};

// mutates!
export const deleteById = (id, data) => {
  let deleted = false;

  const _recursive = (children) => {
    for (let i = 0; i < children.length; i++) {
      const el = children[i];

      if (deleted) {
        break;
      }
      if (el.id === id) {
        children.splice(i, 1);
        deleted = true;
        break;
      }
      if (el.children?.length > 0) {
        _recursive(el.children);
      }
    }
  };
  _recursive(data);

  return deleted;
};

// gives reference!
export const getAllFolders = (data) => {
  let folders = [];

  const _recursive = (children) => {
    for (let el of children) {
      if (el.type === c.folder) {
        folders.push(el);
      }
      if (el.children?.length > 0) {
        _recursive(el.children);
      }
    }
  };
  _recursive(data);

  return folders;
};
