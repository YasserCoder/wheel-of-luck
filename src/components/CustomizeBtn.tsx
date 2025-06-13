import Modal from "./Modal";
import MenuItem from "./MenuItem";
import ModalWrapper from "./ModalWrapper";

import { MdOutlineColorLens } from "react-icons/md";
// import styles from "./styles/customizeBtn.module.css";

export default function CustomizeBtn() {
    return (
        <Modal>
            <Modal.Open opens="customize-settings">
                <MenuItem value="Customize">
                    <MdOutlineColorLens />
                </MenuItem>
            </Modal.Open>
            <Modal.Window name="customize-settings">
                <Settings />
            </Modal.Window>
        </Modal>
    );
}

function Settings({ onClose }: { onClose?: () => void }) {
    function saveChanges() {}
    return (
        <ModalWrapper
            title="Apparance"
            confirmBtn="Save"
            confirmDisabled={false}
            handleConfirm={saveChanges}
            onClose={onClose}
        >
            <div className="">hey im yasser</div>
        </ModalWrapper>
    );
}
