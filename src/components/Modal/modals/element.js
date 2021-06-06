import React, { useState, useMemo } from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import uniqueId from 'lodash/uniqueId';

import Modal from './_base';
import { Input, Radio, Select } from 'src/components/Fields';
import * as c from 'src/constants';
import { fileFormatsOptions } from 'src/config';
import { elementsSelectors, elementsActions } from 'src/redux/stores/elements';
import { validateElement, convertValidations } from 'src/helpers/validate';

const ElementModal = ({
  root,
  allFolders,

  addElement,
  editElement,
  setAllFolders,

  data,
  title,
  onClose,
  isEdit,
  ...props
}) => {
  const parentIdOptions = useMemo(() => {
    return allFolders.map((el) => ({
      title: `${el.name} (id: ${el.id})`,
      value: el.id,
    }));
  }, [allFolders]);

  const [values, setValues] = useState({
    name: data?.name || '',
    type: data?.type || c.file,
    parentId: data?.parentId
      ? parentIdOptions.find((el) => el.value === data?.parentId)
      : null,
    format: data?.meta?.format
      ? fileFormatsOptions.find((el) => el.value === data?.meta?.format)
      : fileFormatsOptions[0],
  });

  const [errors, setErrors] = useState({
    name: '',
    type: '',
    parentId: '',
    format: '',
  });

  const onValueChange = (field, value) => {
    setValues({
      ...values,
      [field]: value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const onConfirm = () => {
    const payload = {
      name: values.name,
      type: values.type,
      parentId: values.parentId ? values.parentId.value : null,
      format: values.format ? values.format.value : null,
    };

    const validations = validateElement(payload);
    if (validations) {
      setErrors({
        ...errors,
        ...convertValidations(validations),
      });
      return;
    }

    if (isEdit) {
      const isNewParent = data.parentId !== payload.parentId;

      let dataToSave = {
        ...data,
        name: payload.name,
        type: payload.type,
        parentId: payload.parentId,
      };
      if (isFile) {
        dataToSave.meta = { format: payload.format };
        delete dataToSave.children;
      } else {
        dataToSave.children = data.children || [];
        delete dataToSave.meta;
      }

      editElement(dataToSave, isNewParent);
    } else {
      let dataToSave = {
        id: uniqueId('elem-'),
        name: payload.name,
        type: payload.type,
        parentId: payload.parentId,
      };
      if (isFile) {
        dataToSave.meta = { format: payload.format };
      } else {
        dataToSave.children = [];
      }

      addElement(dataToSave, payload);
    }
    setAllFolders();
    onClose();
  };

  const isFile = values.type === c.file;

  return (
    <Modal
      onClose={onClose}
      title={title}
      onConfirm={onConfirm}
      confirmText={isEdit ? 'Save' : 'Add'}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Radio
            label="Choose a file or a folder"
            options={[
              { title: 'File', value: c.file },
              { title: 'Folder', value: c.folder },
            ]}
            value={values.type}
            onChange={(val) => onValueChange('type', val)}
            error={errors.type}
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            placeholder="Parent folder"
            options={parentIdOptions}
            value={values.parentId}
            onChange={(val) => onValueChange('parentId', val)}
            error={errors.parentId}
            getOptionSelected={(option) =>
              option.value ===
              parentIdOptions.find((el) => el.value === option.value)?.value
            }
          />
        </Grid>
        <Grid item xs={12} sm={isFile ? 7 : 12}>
          <Input
            placeholder={`Name of the ${isFile ? 'file' : 'folder'}`}
            value={values.name}
            onChange={(val) => onValueChange('name', val)}
            error={errors.name}
          />
        </Grid>
        {isFile && (
          <Grid item xs={12} sm={5}>
            <Select
              placeholder="File extension"
              options={fileFormatsOptions}
              value={values.format}
              onChange={(val) => onValueChange('format', val)}
              error={errors.format}
            />
          </Grid>
        )}
      </Grid>
    </Modal>
  );
};

const mapState = (state) => ({
  root: elementsSelectors.root(state),
  allFolders: elementsSelectors.allFolders(state),
});

const mapDispatch = {
  addElement: elementsActions.addElement,
  editElement: elementsActions.editElement,
  setAllFolders: elementsActions.setAllFolders,
};

export default connect(mapState, mapDispatch)(ElementModal);
