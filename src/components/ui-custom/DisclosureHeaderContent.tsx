import useBackOnDefaultPage from "@/hooks/useBackOnDefaultPage";
import back from "@/utils/back";
import { HStack } from "@chakra-ui/react";
import { DialogCloseTrigger } from "../ui/dialog";
import { DrawerCloseTrigger } from "../ui/drawer";
import { DisclosureCloseTrigger } from "./Disclosure";
import P from "./P";

type Props = {
  title?: string;
  withCloseButton?: boolean;
  content?: any;
  prefix?: "drawer" | "dialog";
};
const DisclosureHeaderContent = ({
  title,
  withCloseButton = true,
  prefix,
  content,
}: Props) => {
  const handleBackOnDefaultPage = useBackOnDefaultPage();

  function handleBack() {
    back();
    handleBackOnDefaultPage();
  }

  return (
    <HStack justify={"space-between"} w={"full"} pr={7}>
      {content ? (
        content
      ) : (
        <P
          fontSize={"14px"}
          fontWeight={"semibold"}
          ml={!prefix ? [-1, null, 1] : ""}
        >
          {title}
        </P>
      )}

      {withCloseButton && (
        <>
          {prefix && (
            <>
              {prefix === "dialog" && (
                <DialogCloseTrigger
                  borderRadius={"full"}
                  top={"12px"}
                  right={"12px"}
                  onClick={handleBack}
                  mt={"-2px"}
                  mr={"-6px"}
                />
              )}

              {prefix === "drawer" && (
                <DrawerCloseTrigger
                  borderRadius={"full"}
                  top={3}
                  right={"14px"}
                  onClick={handleBack}
                />
              )}
            </>
          )}

          {!prefix && (
            <DisclosureCloseTrigger
              borderRadius={"full"}
              top={3}
              right={["14px", null, "12px"]}
              onClick={handleBack}
            />
          )}
        </>
      )}
    </HStack>
  );
};

export default DisclosureHeaderContent;
