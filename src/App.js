import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, IconButton, Container, Typography } from '@material-ui/core';
import { TreeView, TreeItem } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon,
} from '@material-ui/icons';

import { getById } from 'src/helpers/recursiveMethods';
import * as c from 'src/constants';
import { modalActions } from 'src/redux/stores/modal';
import { elementsSelectors, elementsActions } from 'src/redux/stores/elements';
import { modalNames } from 'src/config';

const useStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(4, 0),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  extraButtons: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(1),
    },
  },
  fileList: {
    marginTop: theme.spacing(4),
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
  },
}));

const RecursiveTreeItem = ({ data, ...props }) => {
  const cls = useStyles();

  const LabelIcon = data.type === c.file ? DescriptionIcon : FolderIcon;

  return (
    <TreeItem
      key={data.id}
      nodeId={data.id}
      label={
        <div className={cls.labelRoot}>
          <LabelIcon color="inherit" className={cls.labelIcon} />
          <Typography variant="body2" className={cls.labelText}>
            {`${data.name}${
              data.type === c.file ? `.${data.meta.format}` : ''
            }`}
          </Typography>
        </div>
      }
    >
      {data.children?.length > 0
        ? data.children.map((el, index) => (
            <RecursiveTreeItem key={index} data={el} />
          ))
        : null}
    </TreeItem>
  );
};

const App = ({
  root,

  setModalInfo,
  resetModal,
  deleteElement,
  setAllFolders,
  ...props
}) => {
  const [selectedElementId, setSelectedElementId] = useState(null);
  const cls = useStyles();

  const onEditClick = () => {
    const foundEl = getById(selectedElementId, root);

    if (foundEl) {
      setModalInfo({
        type: modalNames.ELEMENT,
        isOpen: true,
        props: {
          title: 'Add new file / folder',
          onClose: resetModal,
          data: foundEl,
          isEdit: true,
        },
      });
    }
  };

  const onDelete = () => {
    const foundEl = getById(selectedElementId, root);

    if (foundEl) {
      deleteElement(foundEl.id);
      setAllFolders();
    }
  };

  return (
    <Container>
      <main className={cls.main}>
        <div className={cls.buttons}>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setModalInfo({
                  type: modalNames.ELEMENT,
                  isOpen: true,
                  props: {
                    title: 'Add new file / folder',
                    onClose: resetModal,
                  },
                });
              }}
              startIcon={<AddIcon />}
            >
              Add new file / folder
            </Button>
          </div>
          <div className={cls.extraButtons}>
            <IconButton onClick={onEditClick}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon color="error" />
            </IconButton>
          </div>
        </div>
        <div className={cls.fileList}>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={[root[0].id]}
            onNodeSelect={(e, id) => {
              if (id !== root[0].id) {
                setSelectedElementId(id);
              }
            }}
            selected={selectedElementId}
          >
            <RecursiveTreeItem data={root[0]} />
          </TreeView>
        </div>
      </main>
    </Container>
  );
};

const mapState = (state) => ({
  root: elementsSelectors.root(state),
});

const mapDispatch = {
  setModalInfo: modalActions.setInfo,
  resetModal: modalActions.reset,
  deleteElement: elementsActions.deleteElement,
  setAllFolders: elementsActions.setAllFolders,
};

export default connect(mapState, mapDispatch)(App);
