import React, { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';

import Modal from 'src/components/Modal/modals/element';
import { getById } from 'src/helpers/recursiveMethods';
import * as c from 'src/constants';
import { modalSelectors, modalActions } from 'src/redux/stores/modal';
import { elementsSelectors } from 'src/redux/stores/elements';
import { modalNames } from 'src/config';

const App = ({ root, setModalInfo, resetModal, ...props }) => {
  return (
    <div className="App">
      <header className="App-header">
        <button
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
        >
          MODIFY!!!
        </button>
        <pre>{JSON.stringify(root, 0, 2)}</pre>
      </header>
    </div>
  );
};

const mapState = (state) => ({
  root: elementsSelectors.root(state),
});

const mapDispatch = {
  setModalInfo: modalActions.setInfo,
  resetModal: modalActions.reset,
};

export default connect(mapState, mapDispatch)(App);
