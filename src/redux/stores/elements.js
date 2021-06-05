import cloneDeep from 'lodash/cloneDeep';

import {
  getById,
  deleteById,
  getAllFolders,
} from 'src/helpers/recursiveMethods';
import * as c from 'src/constants';

const MODULE_PREFIX = 'elements/';

export const elementsTypes = {
  ADD_ELEMENT: MODULE_PREFIX + 'ADD_ELEMENT',
  EDIT_ELEMENT: MODULE_PREFIX + 'EDIT_ELEMENT',
  DELETE_ELEMENT: MODULE_PREFIX + 'DELETE_ELEMENT',
  SET_ALL_FOLDERS: MODULE_PREFIX + 'SET_ALL_FOLDERS',
};

export const elementsActions = {
  addElement: (info) => ({
    type: elementsTypes.ADD_ELEMENT,
    payload: { info },
  }),
  editElement: (info, isNewParent) => ({
    type: elementsTypes.EDIT_ELEMENT,
    payload: { info, isNewParent },
  }),
  deleteElement: (id) => ({
    type: elementsTypes.DELETE_ELEMENT,
    payload: { id },
  }),
  setAllFolders: () => ({
    type: elementsTypes.SET_ALL_FOLDERS,
  }),
};

export const elementsSelectors = {
  root: (state) => state.elements.root,
  allFolders: (state) => state.elements.allFolders,
};

/* 
  file structure 
  {
    id: string,
    name: string,
    type: string, // folder or file
    parentId: string | null, // if null, then direct child of root
    meta: {
      format: string
    }
  }

  ------------------

  folder structure 
  {
    id: string,
    name: string,
    type: string, // folder or file
    parentId: string | null, // if null, then direct child of root
    children: array
  }
*/

const initialRoot = [
  {
    isRoot: true,
    id: 'root-1',
    name: 'root',
    type: c.folder,
    children: [],
  },
];

const initialState = {
  root: initialRoot,
  allFolders: initialRoot,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case elementsTypes.ADD_ELEMENT: {
      let updatedRoot = cloneDeep(state.root);

      let parentFolder = getById(payload.info.parentId, updatedRoot);
      if (!parentFolder) {
        throw new Error(
          'Parent folder not found! From elementsTypes.ADD_ELEMENT reducer',
        );
      }
      parentFolder.children.push(payload.info);

      return {
        ...state,
        root: updatedRoot,
      };
    }
    case elementsTypes.EDIT_ELEMENT: {
      let updatedRoot = cloneDeep(state.root);
      if (payload.isNewParent) {
        let newParentFolder = getById(payload.info.parentId, updatedRoot);

        // to avoid moving parent folder inside its child folder
        const newParentAlreadyInside = !!getById(
          payload.info.parentId,
          payload.info.children,
        );
        if (newParentAlreadyInside) {
          return state;
        }

        if (!newParentFolder) {
          throw new Error(
            'New parent folder not found! From elementsTypes.EDIT_ELEMENT reducer',
          );
        }
        const clonedInfo = cloneDeep(payload.info);
        deleteById(clonedInfo.id, updatedRoot);
        newParentFolder.children.push(clonedInfo);
      } else {
        let updatedElement = getById(payload.info.id, updatedRoot);
        updatedElement = payload.info;
      }
      return {
        ...state,
        root: updatedRoot,
      };
    }
    case elementsTypes.DELETE_ELEMENT: {
      let updatedRoot = cloneDeep(state.root);

      deleteById(payload.id, updatedRoot);

      return {
        ...state,
        root: updatedRoot,
      };
    }
    case elementsTypes.SET_ALL_FOLDERS: {
      return {
        ...state,
        allFolders: cloneDeep(getAllFolders(state.root)),
      };
    }

    default:
      return state;
  }
};
