import { UserLogin } from "@/models/UserLogin";
import { Avatar, Button, Menu, Modal, Text, Tooltip } from "@mantine/core";
import { IconPhotoEdit, IconTrash } from "@tabler/icons-react";
import Cropper from "react-easy-crop";
import { useRef, useState } from "react";
import { getCroppedImg } from "@/utils/cropImage";
import axios from "axios";
import { modals } from "@mantine/modals";
import { ASSETS_KHCN_URL } from "@/utils/env";

const AvatarUploader = ({ u }: { u?: any }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const handleChooseImage = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels || !file) return;

    const croppedImage = await getCroppedImg(file, croppedAreaPixels);
    fileRef.current!.value = "";
    await handleUploadImage(croppedImage);
    setCropModalOpen(false);
  };

  const handleUploadImage = async (file: File) => {
    console.log(file);
    const formData = new FormData();
    formData.append("userId", user.IDUser!.toString());
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${ASSETS_KHCN_URL}/avatar-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        modals.open({
          title: "Thông báo",
          centered: true,
          children: (
            <Text>
              Ảnh đại diện của bạn đã được cập nhật. Có thể mất vài phút để cập
              nhật trên toàn bộ trang web.
            </Text>
          ),
        });
      }
    } catch (error) {
      modals.open({
        title: "Lỗi",
        centered: true,
        children: (
          <Text c="red">
            Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại sau
          </Text>
        ),
      });
      console.log(error);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await axios.delete(
        `${ASSETS_KHCN_URL}/avatars/` + user.IDUser + ".png"
      );
      if (res.status === 200) {
        modals.open({
          title: "Thông báo",
          centered: true,
          children: (
            <Text>
              Ảnh đại diện của bạn đã được xóa. Có thể mất vài phút để cập nhật
              trên toàn bộ trang web.
            </Text>
          ),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        opened={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        title="Crop your new profile picture"
        size="lg"
      >
        <div style={{ position: "relative", width: "100%", height: 400 }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={(croppedArea, croppedAreaPixels) => {
                console.log(croppedArea, croppedAreaPixels);
                setCroppedAreaPixels(croppedAreaPixels);
              }}
              onZoomChange={setZoom}
            />
          )}
        </div>
        <Button fullWidth mt="md" onClick={handleCropSave} color="green">
          Đặt làm ảnh đại diện
        </Button>
      </Modal>

      <input
        type="file"
        ref={fileRef}
        style={{ display: "none" }}
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
      />

      <Menu shadow="md" position="bottom" withArrow>
        <Menu.Target>
          <Tooltip label="Thay đổi ảnh đại diện" position="bottom">
            <Avatar
              src={`${ASSETS_KHCN_URL}/avatars/${
                user.IDUser
              }.png?t=${Date.now()}`} // sử dụng timestamp để tránh cache
              size={250}
              radius={250}
              mx="auto"
              style={{ cursor: "pointer" }}
              name={u?.hoTen || user.HoTen}
              color="initials"
            />
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconPhotoEdit size={20} stroke={1.5} />}
            onClick={handleChooseImage}
          >
            Đổi ảnh đại diện
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={20} stroke={1.5} />}
            onClick={handleDeleteImage}
          >
            Xóa ảnh đại diện
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default AvatarUploader;
