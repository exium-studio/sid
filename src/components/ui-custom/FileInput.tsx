import { Icon, useFieldContext } from "@chakra-ui/react";
import { IconUpload } from "@tabler/icons-react";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
  FileUploadRootProps,
  FileUploadTrigger,
} from "../ui/file-button";
import BButton from "./BButton";
import useLang from "@/context/useLang";
import { toaster } from "../ui/toaster";

interface Props extends FileUploadRootProps {
  name?: string;
  onChangeSetter?: (inputValue: File[] | undefined) => void;
  inputValue?: File[] | string | undefined;
  accept?: string;
  invalid?: boolean;
  placeholder?: string;
  initialFilepath?: string;
  label?: string;
  dropzone?: boolean;
  maxFileSize?: number;
  maxFiles?: number;
  description?: string;
  disabled?: boolean;
}
const FileInput = (props: Props) => {
  // Props
  const {
    name,
    onChangeSetter,
    inputValue,
    accept,
    invalid,
    placeholder,
    initialFilepath,
    label,
    dropzone,
    maxFileSize,
    maxFiles = 1,
    description = `up to ${props.maxFileSize || 10} MB, max ${
      props?.maxFiles || 1
    } file${props?.maxFiles!! > 1 ? "s" : ""}`,
    disabled,
    ...restProps
  } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const fc = useFieldContext();

  // Utils
  const handleFileChange = (details: any) => {
    let files = details.acceptedFiles || [];

    if (maxFiles && files.length > maxFiles) {
      files = files.slice(0, maxFiles);
    }

    if (onChangeSetter) {
      onChangeSetter(files.length > 0 ? files : undefined);
    }
  };

  return (
    <FileUploadRoot
      alignItems="stretch"
      onFileChange={handleFileChange}
      onFileReject={() => {
        toaster.error({
          title: l.error_file_input.title,
          description: l.error_file_input.description,
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
      }}
      maxFiles={maxFiles}
      gap={2}
      accept={accept}
      {...restProps}
    >
      <>
        {dropzone ? (
          <FileUploadDropzone
            description={`${description} ${accept ? `(${accept})` : ""}`}
            label={l.file_dropzone_label}
            borderColor={
              invalid ?? fc?.invalid ? "border.error" : "border.muted"
            }
            opacity={disabled ? 0.5 : 1}
            cursor={disabled ? "disabled" : "pointer"}
          />
        ) : (
          <FileUploadTrigger asChild borderColor={invalid ? "fg.error" : ""}>
            <BButton
              variant="outline"
              borderColor={
                invalid ?? fc?.invalid ? "border.error" : "border.muted"
              }
            >
              <Icon scale={0.8}>
                <IconUpload />
              </Icon>{" "}
              {label || "File upload"}
            </BButton>
          </FileUploadTrigger>
        )}

        <FileUploadList showSize clearable />
      </>
    </FileUploadRoot>
  );
};

export default FileInput;
