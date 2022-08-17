import React, { FC, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import '../modal.scss';

type ModalProps = {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const ConfirmModal: FC<ModalProps> = (props) => {
  const { isVisible, setVisible } = props;
  const navigate = useNavigate();

  const hiddenModal = () => {
    setVisible(false);
  };

  const leaveGame = () => {
    hiddenModal();
    navigate('/', { replace: true });
  };

  return (
    <Modal
      className="modal modal--confirm"
      visible={isVisible}
      onOk={leaveGame}
      onCancel={hiddenModal}
      title="вы уверены что хотите выйти?"
    />
  );
};

export default ConfirmModal;
