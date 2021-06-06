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
export const deleteOrModifyById = (id, data, newInfo) => {
  let success = false;

  const _recursive = (children) => {
    for (let i = 0; i < children.length; i++) {
      const el = children[i];

      if (success) {
        break;
      }
      if (el.id === id) {
        if (newInfo) {
          children.splice(i, 1, newInfo);
        } else {
          children.splice(i, 1);
        }
        success = true;
        break;
      }
      if (el.children?.length > 0) {
        _recursive(el.children);
      }
    }
  };
  _recursive(data);

  return success;
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
