import cx from "clsx";
import {
  ActionIcon,
  Anchor,
  AppShell,
  Box,
  Button,
  Center,
  Container,
  Group,
  Image,
  InputBase,
  Kbd,
  Modal,
  Pill,
  RemoveScroll,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import classes from "./style.module.css";
import uef_logo_1 from "@/assets/uef_logo_1.png";
import {
  IconCheck,
  IconFileText,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconFileTypePpt,
  IconFileTypeXls,
  IconFileZip,
  IconMessageQuestion,
  IconPhoto,
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useRef, useState } from "react";
import axios from "axios";
import { ASSETS_KHCN_URL, SERVER_API_URL } from "@/utils/env";
import { UserLogin } from "@/models/UserLogin";

interface ShellProps {
  children: React.ReactNode;
}

const HelpLayout = ({ children }: ShellProps) => {
  const [isModalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const fileOpenRef = useRef<() => void>(null);

  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [attachment, setAttachment] = useState<any>(null);
  const [question, setQuestion] = useState<string>("");

  useHotkeys([["mod+alt+V", () => handlePaste()]]);

  const handleDrop = async (files: File[]) => {
    // console.log(files);

    const uploadFile = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const id = notifications.show({
        loading: true,
        title: "Hành động",
        message: `Tệp tin "${file.name}" đang được tải lên, vui lòng đợi...`,
        autoClose: false,
        withCloseButton: false,
      });

      try {
        const response = await axios.post(
          `${ASSETS_KHCN_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // console.log("File uploaded successfully:", response.data);
        notifications.update({
          id,
          color: "teal",
          title: "Hành động",
          message: `Tệp tin "${response.data.file.originalname}" đã được tải lên thành công.`,
          icon: <IconCheck size={18} />,
          loading: false,
          autoClose: 5000,
        });
        return response.data.file;
      } catch (error) {
        console.error("Error uploading file:", error);
        notifications.update({
          id,
          color: "red",
          title: "Lỗi",
          message: `Đã xảy ra lỗi khi tải lên tệp tin "${file.name}": ${error}`,
          icon: <IconCheck size={18} />,
          loading: false,
          autoClose: false,
          withCloseButton: true,
        });
        return null;
      }
    };

    // Đổi tên mỗi file và thêm vào danh sách
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        return await uploadFile(file);
      })
    );

    // Lọc ra các file upload thành công
    const successfulUploads = uploadedFiles.filter((file) => file !== null);

    // Thêm các file mới vào danh sách attachment
    const newAttachmentList = attachment
      ? [...attachment, ...successfulUploads]
      : successfulUploads;
    // console.log("New attachment list:", newAttachmentList);

    setAttachment(newAttachmentList);
  };

  const handlePaste = async () => {
    // console.log("Pasting from clipboard...");
    try {
      // TODO: cần cập nhật để xử lý dán file sao chép (ví dụ: từ Explorer)
      const items = await navigator.clipboard.read();

      if (items) {
        const pastedFiles: File[] = [];

        for (const item of items) {
          for (const type of item.types) {
            // console.log("Pasted item type:", type);
            if (type.startsWith("image/")) {
              const blob = await item.getType(type);
              pastedFiles.push(new File([blob], "pasted-image.png", { type }));
            }
          }
        }

        if (pastedFiles.length > 0) {
          await handleDrop(pastedFiles);
        }
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const FileIcon: React.FC<{
    fileName: string;
    size?: number;
    stroke?: number;
  }> = ({ fileName, size = 16, stroke = 1.5 }) => {
    let icon;
    const ext = fileName.split(".").pop();
    if (ext == "png" || ext == "jpg" || ext == "jpeg") {
      icon = IconPhoto;
    } else if (ext == "pdf") {
      icon = IconFileTypePdf;
    } else if (ext == "ppt" || ext == "pptx") {
      icon = IconFileTypePpt;
    } else if (ext == "xls" || ext == "xlsx" || ext == "csv") {
      icon = IconFileTypeXls;
    } else if (ext == "doc" || ext == "docx") {
      icon = IconFileTypeDoc;
    } else if (
      ext == "zip" ||
      ext == "rar" ||
      ext == "tar" ||
      ext == "gz" ||
      ext == "7z"
    ) {
      icon = IconFileZip;
    } else {
      icon = IconFileText;
    }

    const IconElm = icon;

    return <IconElm size={size} stroke={stroke} />;
  };

  const fileIsImage = (fileName: string) => {
    const ext = fileName.split(".").pop();
    if (ext == "png" || ext == "jpg" || ext == "jpeg") {
      // console.log("File is image:", fileName);
      return true;
    }
    // console.log("File is not image:", fileName);
    return false;
  };

  const handleDeleteAttachment = async (file: any, index: number) => {
    const id = notifications.show({
      loading: true,
      title: "Hành động",
      message: `Vui lòng đợi, đang xóa tệp tin "${file.originalname}"...`,
      autoClose: false,
      withCloseButton: false,
    });
    try {
      await axios.delete(`${ASSETS_KHCN_URL}/files/${file.filename}`);
      notifications.update({
        id,
        color: "teal",
        title: "Hành động",
        message: `Đã xóa tệp tin "${file.originalname}".`,
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 5000,
      });
      setAttachment(attachment.filter((_: any, i: any) => i !== index));
    } catch (error) {
      console.error("Error deleting file:", error);
      notifications.update({
        id,
        color: "red",
        title: "Lỗi",
        message: `Đã xảy ra lỗi khi xóa tệp tin "${file.originalname}": ${error}`,
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: false,
        withCloseButton: true,
      });
    }
  };

  const handleSendQuestion = async (e: any) => {
    e.preventDefault();

    const id = notifications.show({
      loading: true,
      title: "Hành động",
      message: "Quá trình gửi câu hỏi đang được thực hiện, vui lòng đợi...",
      autoClose: false,
      withCloseButton: false,
    });

    const q_by = JSON.stringify({
      HoTen: user.HoTen,
      Email: email,
      Phone: phoneNumber,
    });

    var currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() + 7);

    var date = currentDateTime.getDate();
    var month = currentDateTime.getMonth() + 1; // Tháng trong JavaScript đếm từ 0, nên cần +1
    var year = currentDateTime.getFullYear();

    var formattedDate =
      year +
      "-" +
      month.toString().padStart(2, "0") +
      "-" +
      date.toString().padStart(2, "0");

    const filesAttach = attachment?.map((file: any) => file.filename);

    try {
      const data = {
        moTa: question,
        danhSachDinhKem: filesAttach,
        q_by: q_by,
        q_dateSubmit: formattedDate,
        a_dateSubmit: formattedDate,
      };

      // console.log(data);

      const res = await axios.post(
        `${SERVER_API_URL}/CauHoi/Send`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status == 200) {
        notifications.update({
          id,
          color: "teal",
          title: "Hành động",
          message: "Câu hỏi của bạn đã được gửi thành công.",
          icon: <IconCheck size={18} />,
          loading: false,
          autoClose: 5000,
        });

        handleClosed();
      }
    } catch (error) {
      console.error("Error:", error);
      notifications.update({
        id,
        color: "red",
        title: "Lỗi",
        message: "Đã xảy ra lỗi khi gửi câu hỏi, vui lòng thử lại sau.",
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: false,
        withCloseButton: true,
      });
    }
  };

  const handleClosed = () => {
    setEmail("");
    setPhoneNumber("");
    setAttachment(null);
    setQuestion("");
    closeModal();
  };

  return (
    <>
      <Modal
        opened={isModalOpened}
        onClose={handleClosed}
        title="Gửi câu hỏi"
        scrollAreaComponent={ScrollArea.Autosize}
        size="55rem"
        closeOnClickOutside={false}
      >
        <Text c="blue">
          💡Mẹo: Sử dụng phím tắt <Kbd>Ctrl/⌘</Kbd> <Kbd>Alt</Kbd> <Kbd>V</Kbd>{" "}
          để dán ảnh chụp màn hình vừa chụp (nếu có).
        </Text>
        <form onSubmit={handleSendQuestion}>
          <Group grow mt="md">
            <TextInput
              label="Họ tên"
              value={user.HoTen}
              radius="md"
              disabled
              required
            />
            <TextInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              radius="md"
            />
          </Group>
          <Group grow mt="md">
            <TextInput
              label="SĐT / Zalo"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              radius="md"
            />
            <Dropzone
              openRef={fileOpenRef}
              onDrop={handleDrop}
              // activateOnClick={false}
            >
              <Group justify="center">
                <Text ta="center">Kéo thả,</Text>
                <Button
                  onClick={() => fileOpenRef.current?.()}
                  style={{ pointerEvents: "all" }}
                >
                  Chọn
                </Button>
                <Text ta="center">hoặc dán tệp tin</Text>
              </Group>
            </Dropzone>
          </Group>
          <InputBase component="div" multiline mt="md">
            <Pill.Group>
              {attachment != null &&
                attachment.map((attach: any, index: any) => (
                  <>
                    {fileIsImage(attach.filename) ? (
                      <Box key={index}>
                        <Image
                          src={`${ASSETS_KHCN_URL}/uploads/${attach.filename}`}
                          alt={attach.originalname}
                          h={150}
                        />
                        <Button
                          onClick={() => handleDeleteAttachment(attach, index)}
                          variant="light"
                          fullWidth
                        >
                          X
                        </Button>
                      </Box>
                    ) : (
                      <Pill
                        key={index}
                        withRemoveButton
                        onRemove={() => handleDeleteAttachment(attach, index)}
                        size="md"
                      >
                        <Anchor
                          href={`${ASSETS_KHCN_URL}/uploads/${attach.filename}`}
                          target="_blank"
                        >
                          <Center inline>
                            <FileIcon
                              fileName={attach.filename}
                              size={18}
                              stroke={1.5}
                            />
                            {attach.originalname}
                          </Center>
                        </Anchor>
                      </Pill>
                    )}
                  </>
                ))}
            </Pill.Group>
          </InputBase>
          <Textarea
            mt="md"
            label="Mô tả vấn đề"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            radius="md"
            required
          />

          <Button fullWidth mt="lg" type="submit">
            Gửi câu hỏi
          </Button>
        </form>
      </Modal>

      <AppShell header={{ height: 60 }} className={classes.root}>
        <AppShell.Header className={RemoveScroll.classNames.zeroRight}>
          <Container size="md" className={classes.inner}>
            <Anchor href="/" className={cx("mantine-focus-auto", classes.logo)}>
              <Image src={uef_logo_1} alt="UEF logo" h={50} />
            </Anchor>

            <Group visibleFrom="sm">
              <Button
                variant="default"
                leftSection={<IconMessageQuestion size={18} stroke={1.5} />}
                onClick={openModal}
              >
                Gửi câu hỏi
              </Button>
            </Group>
            <Group hiddenFrom="sm">
              <ActionIcon variant="default" size="lg" onClick={openModal}>
                <IconMessageQuestion size={22} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main className={classes.main}>
          <div className={classes.content}>{children}</div>
        </AppShell.Main>

        <footer className={classes.footer}>
          <Container size="md" h="100%">
            <Group justify="space-between" align="center" h="100%">
              <Text c="dimmed" fz="sm">
                © 2025 - Bản quyền bởi UEF
              </Text>

              <Text c="dimmed" fz="sm">
                <Anchor href="/" c="dimmed" fz="sm">
                  Về trang chủ
                </Anchor>
              </Text>
            </Group>
          </Container>
        </footer>
      </AppShell>
    </>
  );
};

export default HelpLayout;
