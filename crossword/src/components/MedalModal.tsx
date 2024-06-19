import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { FC, useEffect, useState } from "react";

interface MedalModalProps {
  metadataUri: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

const MedalModal: FC<MedalModalProps> = ({
  metadataUri,
  name,
  isOpen,
  onClose,
}) => {
  const [image, setImage] = useState<string>("");
  const getImageUri = async () => {
    try {
      const { data } = await axios(metadataUri);
      setImage(data.image);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getImageUri();
  }, []);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor="gray.800" color={"white"}>
          <ModalHeader>You earned this!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="crypto">You are PIONEER</Text>
            <Text mt={4}>
              🎉🎉 Congratulations! You've knocked on the door of WEB3.0 😎
              You've taken the first step into the world of blockchain!
            </Text>
            <Image mt={4} borderRadius={8} src={image} alt={name} />
          </ModalBody>

          <ModalFooter>
            <Button bgColor="purple" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MedalModal;
